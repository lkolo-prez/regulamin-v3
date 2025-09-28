#!/bin/bash
# =================================================
# AIRCLOUD LEGAL PLATFORM - APPLICATION DEPLOYMENT
# =================================================
# Author: Łukasz Kołodziej | Aircloud
# Deploy application to VPS

set -e

# Configuration
APP_NAME="aircloud-legal"
APP_USER="aircloud"
APP_DIR="/opt/aircloud-legal"
DOMAIN="legal.aircloud.pl"  # Change to your domain

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

echo "🚀 DEPLOYING AIRCLOUD LEGAL PLATFORM"
echo "===================================="

# 1. Install Python dependencies
print_status "Installing Python dependencies..."
sudo -u $APP_USER bash <<EOF
cd $APP_DIR
source venv/bin/activate
pip install -r requirements.txt
EOF

# 2. Setup environment variables
print_status "Creating environment configuration..."
sudo -u $APP_USER tee $APP_DIR/.env <<EOF
# Aircloud Legal Platform Configuration
FLASK_APP=aircloud_legal_platform.py
FLASK_ENV=production
SECRET_KEY=$(openssl rand -base64 32)

# Database Configuration
DATABASE_URL=postgresql://aircloud_user:aircloud_db_2025!@localhost/aircloud_legal

# Redis Configuration
REDIS_URL=redis://localhost:6379/0

# Email Configuration (Configure with your SMTP)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Aircloud Configuration
AIRCLOUD_VERSION=2.0.0
AIRCLOUD_AUTHOR=Łukasz Kołodziej
AIRCLOUD_COMPANY=Aircloud
AIRCLOUD_DOMAIN=$DOMAIN

# Commercial License
COMMERCIAL_PRICE=50 PLN + 23% VAT/miesiąc
COMMERCIAL_EMAIL=legal@aircloud.pl

# File Upload
MAX_CONTENT_LENGTH=33554432
UPLOAD_FOLDER=$APP_DIR/uploads

# Logging
LOG_LEVEL=INFO
LOG_FILE=$APP_DIR/logs/aircloud.log
EOF

# 3. Initialize database
print_status "Initializing database..."
sudo -u $APP_USER bash <<EOF
cd $APP_DIR
source venv/bin/activate
export FLASK_APP=aircloud_legal_platform.py
flask db init || true
flask db migrate -m "Initial migration" || true
flask db upgrade || true
python -c "
from aircloud_legal_platform import app, db, create_aircloud_sample_data
with app.app_context():
    db.create_all()
    create_aircloud_sample_data()
"
EOF

# 4. Setup log rotation
print_status "Setting up log rotation..."
sudo tee /etc/logrotate.d/aircloud-legal <<EOF
$APP_DIR/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 $APP_USER $APP_USER
    postrotate
        systemctl reload supervisor
    endscript
}
EOF

# 5. Create Gunicorn configuration
print_status "Creating Gunicorn configuration..."
sudo -u $APP_USER tee $APP_DIR/gunicorn_config.py <<EOF
# Aircloud Legal Platform - Gunicorn Configuration
import multiprocessing
import os

# Server socket
bind = "127.0.0.1:5000"
backlog = 2048

# Worker processes
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 5

# Restart workers after this many requests
max_requests = 1000
max_requests_jitter = 50

# Logging
accesslog = "$APP_DIR/logs/gunicorn-access.log"
errorlog = "$APP_DIR/logs/gunicorn-error.log"
loglevel = "info"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"'

# Process naming
proc_name = 'aircloud-legal'

# Daemon mode
daemon = False

# Server mechanics
pidfile = '$APP_DIR/gunicorn.pid'
user = '$APP_USER'
group = '$APP_USER'
tmp_upload_dir = None

# SSL (if needed)
# keyfile = '/path/to/keyfile'
# certfile = '/path/to/certfile'

# Environment variables
raw_env = [
    'FLASK_ENV=production',
]

# Preload application
preload_app = True

# Worker signal handling
def on_starting(server):
    server.log.info("Aircloud Legal Platform starting...")

def on_reload(server):
    server.log.info("Aircloud Legal Platform reloading...")

def worker_int(worker):
    worker.log.info("Worker received INT or QUIT signal")

def pre_fork(server, worker):
    server.log.info("Worker spawned (pid: %s)", worker.pid)

def post_fork(server, worker):
    server.log.info("Worker spawned (pid: %s)", worker.pid)

def worker_abort(worker):
    worker.log.info("Worker aborted (pid: %s)", worker.pid)
EOF

# 6. Create startup script
print_status "Creating startup script..."
sudo -u $APP_USER tee $APP_DIR/start.sh <<'EOF'
#!/bin/bash
# Aircloud Legal Platform Startup Script

cd /opt/aircloud-legal
source venv/bin/activate
source .env

# Create required directories
mkdir -p logs uploads static backups

# Start Gunicorn
exec gunicorn \
    --config gunicorn_config.py \
    --bind 127.0.0.1:5000 \
    --workers 4 \
    --timeout 30 \
    --log-level info \
    --access-logfile logs/gunicorn-access.log \
    --error-logfile logs/gunicorn-error.log \
    aircloud_legal_platform:app
EOF

chmod +x $APP_DIR/start.sh

# 7. Setup Supervisor
print_status "Setting up Supervisor..."
sudo tee /etc/supervisor/conf.d/aircloud-legal.conf <<EOF
[program:aircloud-legal]
command=$APP_DIR/start.sh
directory=$APP_DIR
user=$APP_USER
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=$APP_DIR/logs/supervisor.log
stdout_logfile_maxbytes=10MB
stdout_logfile_backups=5
environment=PATH="$APP_DIR/venv/bin"

[group:aircloud]
programs=aircloud-legal
priority=999
EOF

# 8. Setup Nginx
print_status "Setting up Nginx..."
sudo tee /etc/nginx/sites-available/aircloud-legal <<EOF
# Aircloud Legal Platform - Nginx Configuration
upstream aircloud_app {
    server 127.0.0.1:5000 fail_timeout=0;
}

server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    
    # Redirect to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;
    
    # SSL Configuration (will be configured by certbot)
    # ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
    
    # Client max body size
    client_max_body_size 32M;
    
    # Static files
    location /static/ {
        alias $APP_DIR/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Uploads
    location /uploads/ {
        alias $APP_DIR/uploads/;
        expires 30d;
        add_header Cache-Control "public";
    }
    
    # Favicon
    location = /favicon.ico {
        alias $APP_DIR/static/favicon.ico;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Main application
    location / {
        proxy_pass http://aircloud_app;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_redirect off;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Health check
    location /health {
        access_log off;
        proxy_pass http://aircloud_app;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/aircloud-legal /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# 9. Start services
print_status "Starting services..."
sudo systemctl reload supervisor
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start aircloud-legal
sudo systemctl restart nginx

print_success "Application deployed successfully!"

echo ""
echo "🎯 DEPLOYMENT COMPLETE!"
echo "======================"
echo "✅ Application: http://$DOMAIN"
echo "✅ Supervisor: sudo supervisorctl status"
echo "✅ Logs: $APP_DIR/logs/"
echo "✅ Database: PostgreSQL (aircloud_legal)"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Configure DNS to point $DOMAIN to this server"
echo "2. Generate SSL certificate: sudo certbot --nginx -d $DOMAIN"
echo "3. Configure SMTP settings in $APP_DIR/.env"
echo "4. Set up backups: ./setup_backups.sh"
echo ""
echo "🔐 DEFAULT LOGIN:"
echo "Username: lukasz.kolodziej"
echo "Password: aircloud2025"