#!/bin/bash
# =================================================
# AIRCLOUD LEGAL PLATFORM - BACKUP SYSTEM
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

# Retention policy (days)
DAILY_RETENTION=7
WEEKLY_RETENTION=30
MONTHLY_RETENTION=365

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Create backup directories
mkdir -p $BACKUP_DIR/{daily,weekly,monthly}

# Get current date
DATE=$(date +%Y%m%d_%H%M%S)
DAY_OF_WEEK=$(date +%u)
DAY_OF_MONTH=$(date +%d)

print_status "Starting backup for Aircloud Legal Platform..."

# 1. Database backup
print_status "Backing up PostgreSQL database..."
PGPASSWORD=$DB_PASS pg_dump -h localhost -U $DB_USER -d $DB_NAME | gzip > $BACKUP_DIR/daily/db_${DATE}.sql.gz

# 2. Application files backup
print_status "Backing up application files..."
tar -czf $BACKUP_DIR/daily/files_${DATE}.tar.gz \
    -C $APP_DIR \
    --exclude=venv \
    --exclude=__pycache__ \
    --exclude=*.pyc \
    --exclude=logs \
    --exclude=backups \
    .

# 3. Configuration backup
print_status "Backing up configuration files..."
tar -czf $BACKUP_DIR/daily/config_${DATE}.tar.gz \
    /etc/nginx/sites-available/aircloud-legal \
    /etc/supervisor/conf.d/aircloud-legal.conf \
    $APP_DIR/.env

# 4. Weekly backup (on Sunday)
if [ $DAY_OF_WEEK -eq 7 ]; then
    print_status "Creating weekly backup..."
    cp $BACKUP_DIR/daily/db_${DATE}.sql.gz $BACKUP_DIR/weekly/
    cp $BACKUP_DIR/daily/files_${DATE}.tar.gz $BACKUP_DIR/weekly/
    cp $BACKUP_DIR/daily/config_${DATE}.tar.gz $BACKUP_DIR/weekly/
fi

# 5. Monthly backup (on 1st day)
if [ $DAY_OF_MONTH -eq 01 ]; then
    print_status "Creating monthly backup..."
    cp $BACKUP_DIR/daily/db_${DATE}.sql.gz $BACKUP_DIR/monthly/
    cp $BACKUP_DIR/daily/files_${DATE}.tar.gz $BACKUP_DIR/monthly/
    cp $BACKUP_DIR/daily/config_${DATE}.tar.gz $BACKUP_DIR/monthly/
fi

# 6. Cleanup old backups
print_status "Cleaning up old backups..."

# Daily backups
find $BACKUP_DIR/daily -name "*.sql.gz" -mtime +$DAILY_RETENTION -delete
find $BACKUP_DIR/daily -name "*.tar.gz" -mtime +$DAILY_RETENTION -delete

# Weekly backups
find $BACKUP_DIR/weekly -name "*.sql.gz" -mtime +$WEEKLY_RETENTION -delete
find $BACKUP_DIR/weekly -name "*.tar.gz" -mtime +$WEEKLY_RETENTION -delete

# Monthly backups
find $BACKUP_DIR/monthly -name "*.sql.gz" -mtime +$MONTHLY_RETENTION -delete
find $BACKUP_DIR/monthly -name "*.tar.gz" -mtime +$MONTHLY_RETENTION -delete

# 7. Generate backup report
BACKUP_SIZE=$(du -sh $BACKUP_DIR | cut -f1)
DB_BACKUP_SIZE=$(ls -lh $BACKUP_DIR/daily/db_${DATE}.sql.gz | awk '{print $5}')
FILES_BACKUP_SIZE=$(ls -lh $BACKUP_DIR/daily/files_${DATE}.tar.gz | awk '{print $5}')

print_success "Backup completed!"
echo "=================="
echo "Date: $(date)"
echo "Database backup: $DB_BACKUP_SIZE"
echo "Files backup: $FILES_BACKUP_SIZE"
echo "Total backup size: $BACKUP_SIZE"
echo "Backup location: $BACKUP_DIR"

# Optional: Send backup status via email (configure SMTP first)
# echo "Aircloud Legal Platform backup completed successfully on $(date)" | \
# mail -s "Backup Report - Aircloud Legal" admin@yourcompany.com