#!/bin/bash
# =================================================
# AIRCLOUD LEGAL PLATFORM - UPDATE SYSTEM
# =================================================
# Author: Łukasz Kołodziej | Aircloud

set -e

# Configuration
APP_NAME="aircloud-legal"
APP_DIR="/opt/aircloud-legal"
BACKUP_DIR="/opt/aircloud-legal/backups"
TEMP_DIR="/tmp/aircloud-update"

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
    echo "Aircloud Legal Platform - Update System"
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  -f FILE     Update from local file (tar.gz)"
    echo "  -u URL      Update from remote URL"
    echo "  -b BRANCH   Update from git branch (default: main)"
    echo "  -s          Skip backup creation"
    echo "  -t          Test mode (don't apply changes)"
    echo "  -h          Show this help"
    echo ""
    echo "Examples:"
    echo "  $0 -f aircloud-update-v1.2.0.tar.gz    # Update from local file"
    echo "  $0 -u https://releases.com/latest.tar.gz  # Update from URL"
    echo "  $0 -b develop                           # Update from develop branch"
    echo "  $0 -t -f update.tar.gz                  # Test update without applying"
}

create_backup() {
    if [ "$SKIP_BACKUP" = true ]; then
        print_warning "Skipping backup creation"
        return
    fi
    
    print_status "Creating pre-update backup..."
    
    DATE=$(date +%Y%m%d_%H%M%S)
    BACKUP_NAME="pre-update-${DATE}"
    
    # Create backup directory
    mkdir -p "$BACKUP_DIR/updates"
    
    # Database backup
    print_status "Backing up database..."
    PGPASSWORD="aircloud_db_2025!" pg_dump -h localhost -U aircloud_user -d aircloud_legal | gzip > "$BACKUP_DIR/updates/${BACKUP_NAME}-db.sql.gz"
    
    # Application files backup
    print_status "Backing up application files..."
    tar -czf "$BACKUP_DIR/updates/${BACKUP_NAME}-files.tar.gz" \
        -C $APP_DIR \
        --exclude=venv \
        --exclude=__pycache__ \
        --exclude=*.pyc \
        --exclude=logs \
        --exclude=backups \
        .
    
    print_success "Backup created: $BACKUP_NAME"
    BACKUP_CREATED=$BACKUP_NAME
}

prepare_update() {
    print_status "Preparing update environment..."
    
    # Clean temp directory
    rm -rf $TEMP_DIR
    mkdir -p $TEMP_DIR
    
    if [ ! -z "$UPDATE_FILE" ]; then
        # Update from local file
        print_status "Extracting update from local file: $UPDATE_FILE"
        if [ ! -f "$UPDATE_FILE" ]; then
            print_error "Update file not found: $UPDATE_FILE"
            exit 1
        fi
        tar -xzf "$UPDATE_FILE" -C $TEMP_DIR
        
    elif [ ! -z "$UPDATE_URL" ]; then
        # Update from URL
        print_status "Downloading update from: $UPDATE_URL"
        wget -O "$TEMP_DIR/update.tar.gz" "$UPDATE_URL"
        tar -xzf "$TEMP_DIR/update.tar.gz" -C $TEMP_DIR
        
    elif [ ! -z "$GIT_BRANCH" ]; then
        # Update from git
        print_status "Updating from git branch: $GIT_BRANCH"
        cd $APP_DIR
        git fetch origin
        git checkout $GIT_BRANCH
        git pull origin $GIT_BRANCH
        return # Skip file operations for git update
    else
        print_error "No update source specified"
        exit 1
    fi
    
    print_success "Update files prepared"
}

validate_update() {
    print_status "Validating update..."
    
    if [ ! -z "$GIT_BRANCH" ]; then
        # For git updates, check if main application file exists
        if [ ! -f "$APP_DIR/aircloud_legal_platform.py" ]; then
            print_error "Main application file not found after git update"
            return 1
        fi
    else
        # For file/URL updates, check if update contains required files
        if [ ! -f "$TEMP_DIR/aircloud_legal_platform.py" ]; then
            print_error "Update does not contain main application file"
            return 1
        fi
        
        # Check for requirements.txt
        if [ ! -f "$TEMP_DIR/requirements.txt" ]; then
            print_warning "Update does not contain requirements.txt"
        fi
    fi
    
    print_success "Update validation passed"
    return 0
}

apply_update() {
    if [ "$TEST_MODE" = true ]; then
        print_warning "TEST MODE: Would apply update but not actually doing it"
        return
    fi
    
    print_status "Stopping application..."
    sudo supervisorctl stop aircloud-legal
    
    if [ ! -z "$GIT_BRANCH" ]; then
        # Git update already applied in prepare_update
        print_status "Git update completed"
    else
        print_status "Applying update files..."
        
        # Preserve important files
        cp "$APP_DIR/.env" "$TEMP_DIR/.env.backup"
        
        # Copy new files (exclude certain directories)
        rsync -av --exclude=venv --exclude=backups --exclude=logs --exclude=__pycache__ "$TEMP_DIR/" "$APP_DIR/"
        
        # Restore .env file
        mv "$TEMP_DIR/.env.backup" "$APP_DIR/.env"
    fi
    
    # Fix permissions
    chown -R aircloud:aircloud $APP_DIR
    chmod +x $APP_DIR/*.py
    
    print_success "Files updated"
}

update_dependencies() {
    if [ "$TEST_MODE" = true ]; then
        print_warning "TEST MODE: Would update dependencies"
        return
    fi
    
    print_status "Updating Python dependencies..."
    
    cd $APP_DIR
    source venv/bin/activate
    
    if [ -f "requirements.txt" ]; then
        pip install -r requirements.txt --upgrade
        print_success "Dependencies updated"
    else
        print_warning "No requirements.txt found, skipping dependency update"
    fi
}

run_migrations() {
    if [ "$TEST_MODE" = true ]; then
        print_warning "TEST MODE: Would run database migrations"
        return
    fi
    
    print_status "Running database migrations..."
    
    cd $APP_DIR
    source venv/bin/activate
    
    # Run any database migrations if they exist
    if [ -f "migrate.py" ]; then
        python migrate.py
        print_success "Database migrations completed"
    else
        print_warning "No migration script found"
    fi
}

start_application() {
    if [ "$TEST_MODE" = true ]; then
        print_warning "TEST MODE: Would start application"
        return
    fi
    
    print_status "Starting application..."
    sudo supervisorctl start aircloud-legal
    
    # Wait for application to start
    sleep 10
    
    # Check if application is running
    if sudo supervisorctl status aircloud-legal | grep -q "RUNNING"; then
        print_success "Application started successfully"
        
        # Test application response
        if curl -s http://localhost:5000/health >/dev/null; then
            print_success "Application health check passed"
        else
            print_warning "Application health check failed"
        fi
    else
        print_error "Application failed to start"
        print_error "Check logs: sudo supervisorctl tail -f aircloud-legal"
        return 1
    fi
}

rollback_update() {
    print_error "Update failed, initiating rollback..."
    
    if [ ! -z "$BACKUP_CREATED" ]; then
        print_status "Rolling back to backup: $BACKUP_CREATED"
        
        # Stop application
        sudo supervisorctl stop aircloud-legal
        
        # Restore files
        tar -xzf "$BACKUP_DIR/updates/${BACKUP_CREATED}-files.tar.gz" -C $APP_DIR
        
        # Restore database
        PGPASSWORD="aircloud_db_2025!" psql -h localhost -U aircloud_user -d postgres -c "DROP DATABASE IF EXISTS aircloud_legal;"
        PGPASSWORD="aircloud_db_2025!" psql -h localhost -U aircloud_user -d postgres -c "CREATE DATABASE aircloud_legal;"
        gunzip -c "$BACKUP_DIR/updates/${BACKUP_CREATED}-db.sql.gz" | PGPASSWORD="aircloud_db_2025!" psql -h localhost -U aircloud_user -d aircloud_legal
        
        # Fix permissions
        chown -R aircloud:aircloud $APP_DIR
        
        # Start application
        sudo supervisorctl start aircloud-legal
        
        print_success "Rollback completed"
    else
        print_error "No backup available for rollback"
    fi
}

cleanup() {
    print_status "Cleaning up..."
    rm -rf $TEMP_DIR
    print_success "Cleanup completed"
}

# Parse command line options
UPDATE_FILE=""
UPDATE_URL=""
GIT_BRANCH=""
SKIP_BACKUP=false
TEST_MODE=false
BACKUP_CREATED=""

while getopts "f:u:b:sth" opt; do
    case $opt in
        f)
            UPDATE_FILE="$OPTARG"
            ;;
        u)
            UPDATE_URL="$OPTARG"
            ;;
        b)
            GIT_BRANCH="$OPTARG"
            ;;
        s)
            SKIP_BACKUP=true
            ;;
        t)
            TEST_MODE=true
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

# Validate options
if [ -z "$UPDATE_FILE" ] && [ -z "$UPDATE_URL" ] && [ -z "$GIT_BRANCH" ]; then
    print_error "No update source specified"
    show_help
    exit 1
fi

# Set default git branch
if [ ! -z "$GIT_BRANCH" ] && [ "$GIT_BRANCH" = "true" ]; then
    GIT_BRANCH="main"
fi

# Main execution
echo "================================================="
echo "    AIRCLOUD LEGAL PLATFORM - UPDATE SYSTEM"
echo "    $(date)"
echo "================================================="

if [ "$TEST_MODE" = true ]; then
    print_warning "RUNNING IN TEST MODE - No changes will be applied"
fi

echo ""
print_status "Starting update process..."

# Create backup
create_backup

# Prepare update
if ! prepare_update; then
    print_error "Failed to prepare update"
    exit 1
fi

# Validate update
if ! validate_update; then
    print_error "Update validation failed"
    cleanup
    exit 1
fi

# Apply update
apply_update

# Update dependencies
update_dependencies

# Run migrations
run_migrations

# Start application
if ! start_application; then
    rollback_update
    cleanup
    exit 1
fi

# Cleanup
cleanup

print_success "Update completed successfully!"
echo "================================================="
echo "Update completed at $(date)"
if [ ! -z "$BACKUP_CREATED" ]; then
    echo "Backup available: $BACKUP_CREATED"
fi
echo "================================================="