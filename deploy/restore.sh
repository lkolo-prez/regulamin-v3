#!/bin/bash
# =================================================
# AIRCLOUD LEGAL PLATFORM - RESTORE SYSTEM
# =================================================
# Author: Łukasz Kołodziej | Aircloud

set -e

# Configuration
APP_NAME="aircloud-legal"
APP_DIR="/opt/aircloud-legal"
BACKUP_DIR="/opt/aircloud-legal/backups"
DB_NAME="aircloud_legal"
DB_USER="aircloud_user"
DB_PASS="aircloud_db_2025!"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

show_help() {
    echo "Aircloud Legal Platform - Restore System"
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  -d DATE     Restore from specific date (format: YYYYMMDD_HHMMSS)"
    echo "  -t TYPE     Backup type: daily, weekly, monthly (default: daily)"
    echo "  -l          List available backups"
    echo "  -h          Show this help"
    echo ""
    echo "Examples:"
    echo "  $0 -l                          # List available backups"
    echo "  $0 -d 20250115_143000          # Restore from specific backup"
    echo "  $0 -d 20250115_143000 -t weekly  # Restore from weekly backup"
}

list_backups() {
    echo "Available backups:"
    echo "=================="
    
    for type in daily weekly monthly; do
        echo -e "\n${BLUE}$type backups:${NC}"
        if ls $BACKUP_DIR/$type/db_*.sql.gz 1> /dev/null 2>&1; then
            for backup in $BACKUP_DIR/$type/db_*.sql.gz; do
                filename=$(basename $backup)
                date_part=$(echo $filename | sed 's/db_\(.*\)\.sql\.gz/\1/')
                size=$(ls -lh $backup | awk '{print $5}')
                echo "  $date_part (size: $size)"
            done
        else
            echo "  No backups found"
        fi
    done
}

confirm_restore() {
    print_warning "This will overwrite current data!"
    print_warning "Current database and files will be replaced."
    echo -n "Are you sure you want to proceed? (yes/no): "
    read confirmation
    if [ "$confirmation" != "yes" ]; then
        echo "Restore cancelled."
        exit 0
    fi
}

restore_database() {
    local backup_file=$1
    
    print_status "Stopping application..."
    sudo supervisorctl stop aircloud-legal
    
    print_status "Restoring database from $backup_file..."
    
    # Drop and recreate database
    PGPASSWORD=$DB_PASS psql -h localhost -U $DB_USER -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"
    PGPASSWORD=$DB_PASS psql -h localhost -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME;"
    
    # Restore database
    gunzip -c $backup_file | PGPASSWORD=$DB_PASS psql -h localhost -U $DB_USER -d $DB_NAME
    
    print_success "Database restored successfully"
}

restore_files() {
    local backup_file=$1
    
    print_status "Restoring application files from $backup_file..."
    
    # Create temporary directory
    temp_dir=$(mktemp -d)
    
    # Extract backup
    tar -xzf $backup_file -C $temp_dir
    
    # Backup current .env file
    cp $APP_DIR/.env $temp_dir/.env.backup
    
    # Remove current files (except venv and backups)
    find $APP_DIR -mindepth 1 -maxdepth 1 \
        ! -name 'venv' \
        ! -name 'backups' \
        ! -name '.env' \
        -exec rm -rf {} +
    
    # Restore files
    cp -r $temp_dir/* $APP_DIR/
    
    # Restore .env if it was backed up
    if [ -f $temp_dir/.env.backup ]; then
        mv $temp_dir/.env.backup $APP_DIR/.env
    fi
    
    # Fix permissions
    chown -R aircloud:aircloud $APP_DIR
    chmod +x $APP_DIR/*.py
    
    # Cleanup
    rm -rf $temp_dir
    
    print_success "Files restored successfully"
}

restore_config() {
    local backup_file=$1
    
    print_status "Restoring configuration files from $backup_file..."
    
    # Create temporary directory
    temp_dir=$(mktemp -d)
    
    # Extract backup
    tar -xzf $backup_file -C $temp_dir
    
    # Restore configuration files
    if [ -f $temp_dir/etc/nginx/sites-available/aircloud-legal ]; then
        cp $temp_dir/etc/nginx/sites-available/aircloud-legal /etc/nginx/sites-available/
        nginx -t && systemctl reload nginx
    fi
    
    if [ -f $temp_dir/etc/supervisor/conf.d/aircloud-legal.conf ]; then
        cp $temp_dir/etc/supervisor/conf.d/aircloud-legal.conf /etc/supervisor/conf.d/
        supervisorctl reread && supervisorctl update
    fi
    
    # Cleanup
    rm -rf $temp_dir
    
    print_success "Configuration restored successfully"
}

# Parse command line options
BACKUP_TYPE="daily"
BACKUP_DATE=""
LIST_ONLY=false

while getopts "d:t:lh" opt; do
    case $opt in
        d)
            BACKUP_DATE="$OPTARG"
            ;;
        t)
            BACKUP_TYPE="$OPTARG"
            if [[ ! "$BACKUP_TYPE" =~ ^(daily|weekly|monthly)$ ]]; then
                print_error "Invalid backup type. Use: daily, weekly, or monthly"
                exit 1
            fi
            ;;
        l)
            LIST_ONLY=true
            ;;
        h)
            show_help
            exit 0
            ;;
        \?)
            print_error "Invalid option: -$OPTARG"
            show_help
            exit 1
            ;;
    esac
done

# List backups if requested
if [ "$LIST_ONLY" = true ]; then
    list_backups
    exit 0
fi

# Validate backup date
if [ -z "$BACKUP_DATE" ]; then
    print_error "Backup date is required. Use -l to list available backups."
    exit 1
fi

# Check if backups exist
DB_BACKUP="$BACKUP_DIR/$BACKUP_TYPE/db_${BACKUP_DATE}.sql.gz"
FILES_BACKUP="$BACKUP_DIR/$BACKUP_TYPE/files_${BACKUP_DATE}.tar.gz"
CONFIG_BACKUP="$BACKUP_DIR/$BACKUP_TYPE/config_${BACKUP_DATE}.tar.gz"

if [ ! -f "$DB_BACKUP" ]; then
    print_error "Database backup not found: $DB_BACKUP"
    exit 1
fi

if [ ! -f "$FILES_BACKUP" ]; then
    print_error "Files backup not found: $FILES_BACKUP"
    exit 1
fi

if [ ! -f "$CONFIG_BACKUP" ]; then
    print_error "Configuration backup not found: $CONFIG_BACKUP"
    exit 1
fi

# Confirm restore
confirm_restore

print_status "Starting restore process for Aircloud Legal Platform..."
print_status "Restore date: $BACKUP_DATE"
print_status "Backup type: $BACKUP_TYPE"

# Perform restore
restore_database "$DB_BACKUP"
restore_files "$FILES_BACKUP"
restore_config "$CONFIG_BACKUP"

# Start application
print_status "Starting application..."
sudo supervisorctl start aircloud-legal

# Wait for application to start
sleep 5

# Check if application is running
if sudo supervisorctl status aircloud-legal | grep -q "RUNNING"; then
    print_success "Aircloud Legal Platform restored and running successfully!"
else
    print_error "Application failed to start. Check logs:"
    print_error "sudo supervisorctl tail -f aircloud-legal"
fi

print_success "Restore completed!"
echo "=================="
echo "Restored from: $BACKUP_DATE ($BACKUP_TYPE)"
echo "Database: $(basename $DB_BACKUP)"
echo "Files: $(basename $FILES_BACKUP)"
echo "Config: $(basename $CONFIG_BACKUP)"
echo "Application status: $(sudo supervisorctl status aircloud-legal | awk '{print $2}')"