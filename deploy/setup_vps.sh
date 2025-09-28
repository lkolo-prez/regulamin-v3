#!/bin/bash
# =================================================
# AIRCLOUD LEGAL PLATFORM - VPS DEPLOYMENT SCRIPT
# =================================================
# Author: Łukasz Kołodziej | Aircloud
# Version: 2.0.0
# Target: Ubuntu/Debian VPS

set -e

echo "🏛️ AIRCLOUD LEGAL PLATFORM - VPS DEPLOYMENT"
echo "============================================="
echo "Author: Łukasz Kołodziej"
echo "Company: Aircloud"
echo "Version: 2.0.0"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="aircloud-legal"
APP_USER="aircloud"
APP_DIR="/opt/aircloud-legal"
DOMAIN="legal.aircloud.pl"  # Change this to your domain
PYTHON_VERSION="3.11"

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

# Check if running as root
if [[ $EUID -eq 0 ]]; then
    print_error "This script should not be run as root. Please run as a regular user with sudo privileges."
    exit 1
fi

print_status "Starting VPS deployment for Aircloud Legal Platform..."

# 1. Update system
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# 2. Install required packages
print_status "Installing required packages..."
sudo apt install -y \
    python3.11 \
    python3.11-venv \
    python3.11-dev \
    python3-pip \
    nginx \
    postgresql \
    postgresql-contrib \
    redis-server \
    git \
    curl \
    wget \
    unzip \
    supervisor \
    certbot \
    python3-certbot-nginx \
    ufw \
    htop \
    tmux \
    vim

# 3. Create application user
print_status "Creating application user..."
if ! id "$APP_USER" &>/dev/null; then
    sudo useradd -r -m -s /bin/bash $APP_USER
    sudo usermod -aG www-data $APP_USER
    print_success "User $APP_USER created"
else
    print_warning "User $APP_USER already exists"
fi

# 4. Create application directory
print_status "Setting up application directory..."
sudo mkdir -p $APP_DIR
sudo chown $APP_USER:$APP_USER $APP_DIR

# 5. Setup PostgreSQL
print_status "Setting up PostgreSQL database..."
sudo -u postgres psql <<EOF
CREATE DATABASE aircloud_legal;
CREATE USER aircloud_user WITH ENCRYPTED PASSWORD 'aircloud_db_2025!';
GRANT ALL PRIVILEGES ON DATABASE aircloud_legal TO aircloud_user;
ALTER USER aircloud_user CREATEDB;
\q
EOF

print_success "PostgreSQL database created"

# 6. Configure Redis
print_status "Configuring Redis..."
sudo systemctl enable redis-server
sudo systemctl start redis-server

# 7. Setup Python environment
print_status "Setting up Python environment..."
sudo -u $APP_USER bash <<EOF
cd $APP_DIR
python3.11 -m venv venv
source venv/bin/activate
pip install --upgrade pip
EOF

print_success "Python virtual environment created"

# 8. Create application structure
print_status "Creating application structure..."
sudo -u $APP_USER mkdir -p $APP_DIR/{logs,static,uploads,backups,config}

# 9. Setup firewall
print_status "Configuring firewall..."
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 80
sudo ufw allow 443

print_success "Firewall configured"

# 10. Generate SSL certificate (if domain is configured)
if [ "$DOMAIN" != "legal.aircloud.pl" ]; then
    print_status "Domain configured: $DOMAIN"
    print_warning "SSL certificate will be generated after domain DNS is properly configured"
else
    print_warning "Please configure your domain in this script before running"
fi

print_success "VPS basic setup completed!"

echo ""
echo "🎯 NEXT STEPS:"
echo "1. Upload your application files to: $APP_DIR"
echo "2. Install Python requirements"
echo "3. Configure environment variables"
echo "4. Setup Nginx configuration"
echo "5. Configure supervisor for process management"
echo "6. Generate SSL certificate"
echo ""
echo "Run: ./deploy_app.sh to continue with application deployment"