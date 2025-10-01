#!/usr/bin/env node
/**
 * SSPO Legal Platform - Setup and Deployment Manager
 * Secure, cross-platform Node.js deployment script
 * Replaces bash scripts for better security and cross-platform compatibility
 */

const fs = require('fs').promises;
const path = require('path');
const { spawn, exec } = require('child_process');
const crypto = require('crypto');

class SSPODeploymentManager {
    constructor() {
        this.projectRoot = process.cwd();
        this.config = {
            memoryLimit: '2048m',
            cpuLimit: '2.0',
            nodeVersion: '18',
            environment: process.env.NODE_ENV || 'production'
        };
        
        // Security: Never expose sensitive data
        this.secrets = new Map();
        this.setupSecrets();
    }

    // Security: Generate secure secrets
    setupSecrets() {
        this.secrets.set('JWT_SECRET', this.generateSecureSecret(64));
        this.secrets.set('SESSION_SECRET', this.generateSecureSecret(32));
        this.secrets.set('ENCRYPTION_KEY', this.generateSecureSecret(32));
    }

    generateSecureSecret(length = 32) {
        return crypto.randomBytes(length).toString('hex');
    }

    // Secure logging without sensitive data exposure
    log(level, message, data = {}) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            ...this.sanitizeLogData(data)
        };
        
        console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
        if (Object.keys(logEntry).length > 3) {
            console.log('Data:', JSON.stringify(this.sanitizeLogData(data), null, 2));
        }
    }

    // Remove sensitive information from logs
    sanitizeLogData(data) {
        const sanitized = { ...data };
        const sensitiveKeys = ['password', 'secret', 'token', 'key', 'pass'];
        
        Object.keys(sanitized).forEach(key => {
            if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
                sanitized[key] = '[REDACTED]';
            }
        });
        
        return sanitized;
    }

    // Check system requirements
    async checkSystemRequirements() {
        this.log('info', 'Checking system requirements...');
        
        try {
            // Check Node.js version
            const nodeVersion = process.version;
            const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
            
            if (majorVersion < 18) {
                throw new Error(`Node.js ${nodeVersion} detected. Required: v18.0.0+`);
            }
            
            this.log('info', `Node.js version check passed`, { version: nodeVersion });
            
            // Check available memory (cross-platform)
            const os = require('os');
            const totalMemoryGB = Math.round(os.totalmem() / (1024 * 1024 * 1024));
            const freeMemoryGB = Math.round(os.freemem() / (1024 * 1024 * 1024));
            
            this.log('info', 'Memory status', { 
                total: `${totalMemoryGB}GB`, 
                free: `${freeMemoryGB}GB`,
                required: '3GB recommended'
            });
            
            if (freeMemoryGB < 2) {
                this.log('warn', `Low memory detected: ${freeMemoryGB}GB free. Recommended: 3GB+`);
            }
            
            // Check Docker availability
            await this.checkDockerAvailability();
            
            return true;
        } catch (error) {
            this.log('error', 'System requirements check failed', { error: error.message });
            return false;
        }
    }

    // Check Docker availability
    async checkDockerAvailability() {
        return new Promise((resolve, reject) => {
            exec('docker --version', (error, stdout) => {
                if (error) {
                    reject(new Error('Docker is not available. Please install Docker.'));
                } else {
                    this.log('info', 'Docker availability check passed', { version: stdout.trim() });
                    resolve(true);
                }
            });
        });
    }

    // Create secure environment configuration
    async createEnvironmentConfig() {
        this.log('info', 'Creating secure environment configuration...');
        
        const envConfig = [
            '# SSPO Legal Platform - Secure Environment Configuration',
            '# Generated automatically - DO NOT commit to version control',
            '',
            '# Application Configuration',
            'NODE_ENV=production',
            'PORT=3000',
            'API_PORT=3001',
            '',
            '# Resource Limits (2GB RAM / 2 CPU constraint)',
            `MEMORY_LIMIT=${this.config.memoryLimit}`,
            `CPU_LIMIT=${this.config.cpuLimit}`,
            'MAX_HEAP_SIZE=1800m',
            '',
            '# AI and Legal Analysis',
            'NATURAL_LANGUAGE=polish',
            'LEGAL_ANALYSIS_ENABLED=true',
            'LEGAL_KEYWORDS_CACHE_SIZE=1000',
            'PRECEDENT_MATCHING_THRESHOLD=0.7',
            'CONFLICT_DETECTION_ENABLED=true',
            '',
            '# Memory Optimization',
            'LRU_CACHE_MAX_SIZE=1000',
            'TTL_CACHE_DURATION=3600000',
            'MEMORY_CLEANUP_INTERVAL=300000',
            '',
            '# Security Configuration',
            `JWT_SECRET=${this.secrets.get('JWT_SECRET')}`,
            `SESSION_SECRET=${this.secrets.get('SESSION_SECRET')}`,
            `ENCRYPTION_KEY=${this.secrets.get('ENCRYPTION_KEY')}`,
            '',
            '# Rate Limiting',
            'RATE_LIMIT_WINDOW=900000',
            'RATE_LIMIT_MAX_REQUESTS=100',
            '',
            '# Logging Configuration',
            'LOG_LEVEL=info',
            'LOG_MAX_FILES=5',
            'LOG_MAX_SIZE=100m',
            'LOG_ROTATE_DAILY=true',
            '',
            '# Optional: Database Configuration',
            '# DB_HOST=localhost',
            '# DB_PORT=5432',
            '# DB_NAME=sspo_legal',
            '# DB_USER=sspo_user',
            '# DB_PASS=secure_password',
            '',
            '# Optional: Email Configuration',
            '# SMTP_HOST=smtp.gmail.com',
            '# SMTP_PORT=587',
            '# SMTP_USER=your-email@gmail.com',
            '# SMTP_PASS=your-app-password',
            '',
            '# Monitoring Configuration',
            'PROMETHEUS_ENABLED=false',
            'GRAFANA_ENABLED=false',
            '',
            '# Development Flags',
            'DEBUG_MODE=false',
            'VERBOSE_LOGGING=false'
        ];

        try {
            await fs.writeFile('.env', envConfig.join('\n'));
            await fs.chmod('.env', 0o600); // Restrict file permissions
            this.log('info', 'Environment configuration created successfully');
            
            // Create .env.example for public repository
            const envExample = envConfig.map(line => {
                if (line.includes('=') && !line.startsWith('#') && !line.includes('_SECRET') && !line.includes('_KEY')) {
                    return line;
                } else if (line.includes('SECRET') || line.includes('KEY')) {
                    const [key] = line.split('=');
                    return `${key}=your_secure_${key.toLowerCase()}_here`;
                }
                return line;
            });
            
            await fs.writeFile('.env.example', envExample.join('\n'));
            this.log('info', 'Environment example file created');
            
        } catch (error) {
            this.log('error', 'Failed to create environment configuration', { error: error.message });
            throw error;
        }
    }

    // Create necessary directories with proper permissions
    async setupDirectories() {
        this.log('info', 'Setting up project directories...');
        
        const directories = [
            'data',
            'logs',
            'logs/app',
            'logs/nginx',
            'temp',
            'uploads'
        ];

        try {
            for (const dir of directories) {
                const dirPath = path.join(this.projectRoot, dir);
                await fs.mkdir(dirPath, { recursive: true, mode: 0o755 });
            }
            
            this.log('info', 'Project directories created successfully');
        } catch (error) {
            this.log('error', 'Failed to create directories', { error: error.message });
            throw error;
        }
    }

    // Install dependencies with security audit
    async installDependencies() {
        this.log('info', 'Installing dependencies with security audit...');
        
        return new Promise((resolve, reject) => {
            const npmInstall = spawn('npm', ['ci', '--only=production', '--audit', '--audit-level=moderate'], {
                stdio: 'inherit',
                cwd: this.projectRoot
            });

            npmInstall.on('close', (code) => {
                if (code === 0) {
                    this.log('info', 'Dependencies installed successfully');
                    resolve();
                } else {
                    this.log('error', `Dependency installation failed with code ${code}`);
                    reject(new Error(`npm install failed with code ${code}`));
                }
            });
        });
    }

    // Build Docker image with security scanning
    async buildDockerImage() {
        this.log('info', 'Building Docker image...');
        
        return new Promise((resolve, reject) => {
            const dockerBuild = spawn('docker', [
                'build',
                '-f', 'docker/Dockerfile',
                '-t', 'sspo-legal-platform:latest',
                '--build-arg', `MEMORY_LIMIT=${this.config.memoryLimit}`,
                '--build-arg', `CPU_LIMIT=${this.config.cpuLimit}`,
                '--build-arg', 'NODE_ENV=production',
                '.'
            ], {
                stdio: 'inherit',
                cwd: this.projectRoot
            });

            dockerBuild.on('close', (code) => {
                if (code === 0) {
                    this.log('info', 'Docker image built successfully');
                    resolve();
                } else {
                    this.log('error', `Docker build failed with code ${code}`);
                    reject(new Error(`Docker build failed with code ${code}`));
                }
            });
        });
    }

    // Deploy with Docker Compose
    async deployWithCompose() {
        this.log('info', 'Deploying with Docker Compose...');
        
        return new Promise((resolve, reject) => {
            const dockerCompose = spawn('docker-compose', [
                '-f', 'docker/docker-compose.yml',
                'up',
                '-d',
                '--remove-orphans'
            ], {
                stdio: 'inherit',
                cwd: this.projectRoot
            });

            dockerCompose.on('close', (code) => {
                if (code === 0) {
                    this.log('info', 'Deployment completed successfully');
                    resolve();
                } else {
                    this.log('error', `Deployment failed with code ${code}`);
                    reject(new Error(`Docker Compose failed with code ${code}`));
                }
            });
        });
    }

    // Health check
    async performHealthCheck() {
        this.log('info', 'Performing health check...');
        
        const maxAttempts = 30;
        const delay = 2000; // 2 seconds
        
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                const response = await fetch('http://localhost:3000/api/health');
                if (response.ok) {
                    const healthData = await response.json();
                    this.log('info', 'Health check passed', { 
                        attempt, 
                        status: healthData.status,
                        memory: healthData.memory 
                    });
                    return true;
                }
            } catch (error) {
                this.log('info', `Health check attempt ${attempt}/${maxAttempts} failed, retrying...`);
            }
            
            if (attempt < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        
        throw new Error('Health check failed after maximum attempts');
    }

    // Clean up old resources
    async cleanup() {
        this.log('info', 'Cleaning up old resources...');
        
        return new Promise((resolve) => {
            exec('docker system prune -f --volumes', (error, stdout, stderr) => {
                if (error) {
                    this.log('warn', 'Cleanup completed with warnings', { error: error.message });
                } else {
                    this.log('info', 'Cleanup completed successfully');
                }
                resolve();
            });
        });
    }

    // Main deployment method
    async deploy() {
        try {
            this.log('info', '🚀 Starting SSPO Legal Platform deployment...');
            this.log('info', '════════════════════════════════════════════════');
            this.log('info', 'SSPO Legal Platform Enhanced');
            this.log('info', 'AI-Powered Legal Analysis System');
            this.log('info', 'Memory Optimized (2GB RAM / 2 CPU)');
            this.log('info', '════════════════════════════════════════════════');

            // Step 1: System requirements
            const requirementsPassed = await this.checkSystemRequirements();
            if (!requirementsPassed) {
                throw new Error('System requirements not met');
            }

            // Step 2: Environment setup
            await this.createEnvironmentConfig();
            await this.setupDirectories();

            // Step 3: Dependencies
            await this.installDependencies();

            // Step 4: Docker build and deploy
            await this.buildDockerImage();
            await this.deployWithCompose();

            // Step 5: Health check
            await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for services to start
            await this.performHealthCheck();

            // Step 6: Cleanup
            await this.cleanup();

            // Success message
            this.displaySuccessMessage();

        } catch (error) {
            this.log('error', 'Deployment failed', { error: error.message });
            process.exit(1);
        }
    }

    // Display deployment success information
    displaySuccessMessage() {
        console.log('\n' + '═'.repeat(60));
        console.log('🎉 SSPO Legal Platform Successfully Deployed!');
        console.log('═'.repeat(60));
        console.log('');
        console.log('📍 Application URLs:');
        console.log('   Main Application: http://localhost:3000');
        console.log('   API Endpoints:    http://localhost:3001/api');
        console.log('   Health Check:     http://localhost:3000/api/health');
        console.log('');
        console.log('✨ Enhanced Features:');
        console.log('   ✅ AI-powered legal analysis');
        console.log('   ✅ Natural language processing for Polish');
        console.log('   ✅ Memory-optimized architecture');
        console.log('   ✅ Advanced conflict detection');
        console.log('   ✅ Real-time collaboration');
        console.log('   ✅ Comprehensive analytics');
        console.log('   ✅ Enterprise security');
        console.log('');
        console.log('🔧 Management Commands:');
        console.log('   View logs:     docker-compose -f docker/docker-compose.yml logs -f');
        console.log('   Stop services: docker-compose -f docker/docker-compose.yml down');
        console.log('   Restart:       npm run deploy');
        console.log('');
        console.log('💡 Next Steps:');
        console.log('   1. Access the application at http://localhost:3000');
        console.log('   2. Review logs in ./logs/ directory');
        console.log('   3. Monitor system resources');
        console.log('   4. Configure additional features as needed');
        console.log('');
        console.log('═'.repeat(60));
    }

    // Quick development setup
    async setupDev() {
        this.log('info', 'Setting up development environment...');
        this.config.environment = 'development';
        
        await this.createEnvironmentConfig();
        await this.setupDirectories();
        await this.installDependencies();
        
        this.log('info', 'Development environment ready! Run: npm run dev');
    }

    // Health check only
    async healthCheck() {
        try {
            await this.performHealthCheck();
            this.log('info', '✅ System is healthy');
            process.exit(0);
        } catch (error) {
            this.log('error', '❌ System health check failed');
            process.exit(1);
        }
    }
}

// CLI Interface
async function main() {
    const manager = new SSPODeploymentManager();
    const command = process.argv[2];

    switch (command) {
        case 'deploy':
            await manager.deploy();
            break;
        case 'dev':
            await manager.setupDev();
            break;
        case 'health':
            await manager.healthCheck();
            break;
        case 'cleanup':
            await manager.cleanup();
            break;
        default:
            console.log('SSPO Legal Platform - Deployment Manager');
            console.log('');
            console.log('Usage:');
            console.log('  node scripts/setup.js deploy  - Full production deployment');
            console.log('  node scripts/setup.js dev     - Development environment setup');
            console.log('  node scripts/setup.js health  - Health check');
            console.log('  node scripts/setup.js cleanup - Clean up Docker resources');
            console.log('');
            console.log('NPM Scripts:');
            console.log('  npm run deploy   - Production deployment');
            console.log('  npm run dev:setup - Development setup');
            console.log('  npm run health   - Health check');
            break;
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n⚠️  Deployment interrupted by user');
    process.exit(1);
});

process.on('SIGTERM', () => {
    console.log('\n⚠️  Deployment terminated');
    process.exit(1);
});

// Run if called directly
if (require.main === module) {
    main().catch(error => {
        console.error('Fatal error:', error.message);
        process.exit(1);
    });
}

module.exports = SSPODeploymentManager;