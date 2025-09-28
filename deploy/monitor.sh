#!/bin/bash
# =================================================
# AIRCLOUD LEGAL PLATFORM - MONITORING SYSTEM
# =================================================
# Author: Łukasz Kołodziej | Aircloud

set -e

# Configuration
APP_NAME="aircloud-legal"
APP_DIR="/opt/aircloud-legal"
LOG_DIR="/var/log/aircloud"

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

# Check system resources
check_system_resources() {
    echo "============================================"
    echo "           SYSTEM RESOURCES"
    echo "============================================"
    
    # CPU Usage
    cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
    echo "CPU Usage: ${cpu_usage}%"
    
    # Memory Usage
    memory_info=$(free -h | grep "Mem:")
    total_mem=$(echo $memory_info | awk '{print $2}')
    used_mem=$(echo $memory_info | awk '{print $3}')
    free_mem=$(echo $memory_info | awk '{print $4}')
    
    echo "Memory Total: $total_mem"
    echo "Memory Used: $used_mem"
    echo "Memory Free: $free_mem"
    
    # Disk Usage
    echo ""
    echo "Disk Usage:"
    df -h | grep -E '^/dev/' | while read line; do
        echo "  $line"
    done
    
    # Load Average
    load_avg=$(uptime | awk -F'load average:' '{print $2}')
    echo "Load Average:$load_avg"
    
    echo ""
}

# Check application status
check_application_status() {
    echo "============================================"
    echo "       AIRCLOUD APPLICATION STATUS"
    echo "============================================"
    
    # Supervisor status
    if command -v supervisorctl >/dev/null 2>&1; then
        echo "Supervisor Status:"
        supervisorctl status aircloud-legal
        echo ""
    fi
    
    # Process status
    if pgrep -f "gunicorn.*aircloud" >/dev/null; then
        print_success "Gunicorn processes running"
        echo "Active processes:"
        ps aux | grep -E "(gunicorn|aircloud)" | grep -v grep
    else
        print_error "Gunicorn processes not running"
    fi
    
    echo ""
    
    # Port status
    echo "Port Status:"
    if netstat -tlnp | grep ":5000" >/dev/null; then
        print_success "Application listening on port 5000"
    else
        print_error "Application not listening on port 5000"
    fi
    
    if netstat -tlnp | grep ":80\|:443" >/dev/null; then
        print_success "Nginx listening on ports 80/443"
    else
        print_error "Nginx not listening on ports 80/443"
    fi
    
    echo ""
}

# Check database status
check_database_status() {
    echo "============================================"
    echo "          DATABASE STATUS"
    echo "============================================"
    
    # PostgreSQL service
    if systemctl is-active --quiet postgresql; then
        print_success "PostgreSQL service is running"
    else
        print_error "PostgreSQL service is not running"
        return
    fi
    
    # Database connection
    if PGPASSWORD="aircloud_db_2025!" psql -h localhost -U aircloud_user -d aircloud_legal -c "SELECT version();" >/dev/null 2>&1; then
        print_success "Database connection successful"
        
        # Get database stats
        echo "Database Statistics:"
        PGPASSWORD="aircloud_db_2025!" psql -h localhost -U aircloud_user -d aircloud_legal -c "
        SELECT 
            schemaname,
            tablename,
            n_tup_ins as inserts,
            n_tup_upd as updates,
            n_tup_del as deletes,
            n_live_tup as live_rows
        FROM pg_stat_user_tables 
        ORDER BY n_live_tup DESC;
        " 2>/dev/null || echo "Could not retrieve database statistics"
    else
        print_error "Database connection failed"
    fi
    
    echo ""
}

# Check Redis status
check_redis_status() {
    echo "============================================"
    echo "           REDIS STATUS"
    echo "============================================"
    
    if systemctl is-active --quiet redis-server; then
        print_success "Redis service is running"
        
        # Redis info
        if command -v redis-cli >/dev/null 2>&1; then
            echo "Redis Info:"
            redis_info=$(redis-cli info server | grep "redis_version\|uptime_in_seconds")
            echo "$redis_info"
            
            # Memory usage
            redis_memory=$(redis-cli info memory | grep "used_memory_human")
            echo "$redis_memory"
        fi
    else
        print_error "Redis service is not running"
    fi
    
    echo ""
}

# Check logs
check_logs() {
    echo "============================================"
    echo "           LOG ANALYSIS"
    echo "============================================"
    
    # Application logs
    if [ -f "$LOG_DIR/app.log" ]; then
        echo "Recent Application Errors:"
        tail -n 20 "$LOG_DIR/app.log" | grep -i "error\|exception\|critical" || echo "No recent errors found"
        echo ""
        
        echo "Log file sizes:"
        ls -lh "$LOG_DIR"/*.log 2>/dev/null || echo "No log files found"
    else
        print_warning "Application log file not found: $LOG_DIR/app.log"
    fi
    
    # Nginx logs
    if [ -f "/var/log/nginx/access.log" ]; then
        echo ""
        echo "Recent Nginx Activity (last 10 requests):"
        tail -n 10 /var/log/nginx/access.log
    fi
    
    # System logs for our application
    echo ""
    echo "Recent System Logs (Aircloud related):"
    journalctl -u nginx -n 5 --no-pager 2>/dev/null || echo "No nginx logs"
    journalctl -u postgresql -n 5 --no-pager 2>/dev/null || echo "No postgresql logs"
    
    echo ""
}

# Check SSL certificate
check_ssl_certificate() {
    echo "============================================"
    echo "        SSL CERTIFICATE STATUS"
    echo "============================================"
    
    # Check if certificate files exist
    if [ -f "/etc/letsencrypt/live/*/fullchain.pem" ]; then
        cert_path=$(ls /etc/letsencrypt/live/*/fullchain.pem | head -1)
        domain=$(echo $cert_path | sed 's|/etc/letsencrypt/live/\([^/]*\)/.*|\1|')
        
        echo "Certificate found for domain: $domain"
        
        # Check certificate expiry
        if command -v openssl >/dev/null 2>&1; then
            expiry_date=$(openssl x509 -in $cert_path -noout -enddate | cut -d= -f2)
            echo "Certificate expires: $expiry_date"
            
            # Check if certificate expires in next 30 days
            if openssl x509 -in $cert_path -noout -checkend 2592000 >/dev/null; then
                print_success "Certificate is valid for more than 30 days"
            else
                print_warning "Certificate expires within 30 days!"
            fi
        fi
    else
        print_warning "No SSL certificate found"
    fi
    
    echo ""
}

# Performance test
performance_test() {
    echo "============================================"
    echo "         PERFORMANCE TEST"
    echo "============================================"
    
    # Simple HTTP response test
    if command -v curl >/dev/null 2>&1; then
        echo "Testing HTTP response time..."
        
        # Test localhost
        response_time=$(curl -o /dev/null -s -w "%{time_total}" http://localhost:5000/health || echo "failed")
        if [ "$response_time" != "failed" ]; then
            print_success "Local response time: ${response_time}s"
        else
            print_error "Local health check failed"
        fi
        
        # Test through Nginx
        response_time=$(curl -o /dev/null -s -w "%{time_total}" http://localhost/ || echo "failed")
        if [ "$response_time" != "failed" ]; then
            print_success "Nginx response time: ${response_time}s"
        else
            print_error "Nginx health check failed"
        fi
    else
        print_warning "curl not available for performance testing"
    fi
    
    echo ""
}

# Generate health report
generate_health_score() {
    echo "============================================"
    echo "           HEALTH SCORE"
    echo "============================================"
    
    score=0
    max_score=10
    
    # Check application (3 points)
    if pgrep -f "gunicorn.*aircloud" >/dev/null; then
        score=$((score + 3))
        echo "✓ Application Running (+3)"
    else
        echo "✗ Application Not Running (0)"
    fi
    
    # Check database (2 points)
    if PGPASSWORD="aircloud_db_2025!" psql -h localhost -U aircloud_user -d aircloud_legal -c "SELECT 1;" >/dev/null 2>&1; then
        score=$((score + 2))
        echo "✓ Database Connected (+2)"
    else
        echo "✗ Database Connection Failed (0)"
    fi
    
    # Check Redis (1 point)
    if systemctl is-active --quiet redis-server; then
        score=$((score + 1))
        echo "✓ Redis Running (+1)"
    else
        echo "✗ Redis Not Running (0)"
    fi
    
    # Check Nginx (2 points)
    if systemctl is-active --quiet nginx; then
        score=$((score + 2))
        echo "✓ Nginx Running (+2)"
    else
        echo "✗ Nginx Not Running (0)"
    fi
    
    # Check disk space (1 point)
    disk_usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    if [ $disk_usage -lt 90 ]; then
        score=$((score + 1))
        echo "✓ Disk Space OK (+1)"
    else
        echo "✗ Disk Space Critical (0)"
    fi
    
    # Check memory (1 point)
    memory_usage=$(free | grep Mem | awk '{printf("%.0f", $3/$2 * 100.0)}')
    if [ $memory_usage -lt 90 ]; then
        score=$((score + 1))
        echo "✓ Memory Usage OK (+1)"
    else
        echo "✗ Memory Usage High (0)"
    fi
    
    echo ""
    echo "Overall Health Score: $score/$max_score"
    
    if [ $score -ge 9 ]; then
        print_success "System health: EXCELLENT"
    elif [ $score -ge 7 ]; then
        print_success "System health: GOOD"
    elif [ $score -ge 5 ]; then
        print_warning "System health: FAIR"
    else
        print_error "System health: POOR - Immediate attention required"
    fi
    
    echo ""
}

# Main execution
echo "================================================="
echo "    AIRCLOUD LEGAL PLATFORM - HEALTH CHECK"
echo "    $(date)"
echo "================================================="
echo ""

check_system_resources
check_application_status
check_database_status
check_redis_status
check_logs
check_ssl_certificate
performance_test
generate_health_score

echo "================================================="
echo "Health check completed at $(date)"
echo "================================================="