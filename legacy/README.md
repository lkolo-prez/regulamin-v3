# 🗄️ Legacy Code and Configurations

**Purpose:** Archive of previous versions, deprecated code, and old configurations

## 📁 Structure

### 🐍 **Python Applications** (Root Legacy Folder)
- `advanced_legal_system.py` - Previous version of legal system
- `advanced_legal_system_part2.py` - Extension modules  
- `legal_system_app.py` - Early Flask application
- `server-dev.py` - Development server scripts
- `server_full.py` - Production server setup
- `simple_legal_app.py` - Initial simple version

### 🐳 **Docker Configurations** (`docker-configs/`)
- `Dockerfile` - Original application Dockerfile
- `Dockerfile.testing` - Testing environment Docker
- `Caddyfile` - Caddy web server configuration  
- `nginx.conf` - Nginx configuration file
- `docker-old/` - Previous Docker setups and compositions

### 🌐 **Node.js/JavaScript** (`node-configs/`)
- `app.js` - Node.js application entry point
- `package.json` - Node.js dependencies and scripts
- `jest.config.json` - Jest testing framework configuration

### 🎨 **Web Assets** (`web-assets/`)
- `search.js` - Client-side search functionality

### 🔧 **Infrastructure** (Folders)
- `nginx/` - Nginx configurations and modules
- `src/` - Source code for previous versions
- `scripts/` - Build and deployment scripts  
- `docker/` - Additional Docker configurations
- `config/` - Application configuration files
- `preview/` - Preview builds and temporary files
- `tests/` - Old testing framework and test files
- `.github/` - GitHub Actions workflows and templates

## ⚠️ **Usage Notes**

### 🚫 **Deprecated - Do Not Use**
These files and configurations are **deprecated** and should not be used in current development. They are preserved for:
- Historical reference
- Recovery purposes  
- Understanding evolution of the codebase
- Learning from previous implementations

### ✅ **Current Active Versions**
For current development, use:
- **Python:** `../aircloud-platform/` - Current Flask application
- **Docker:** `../aircloud-platform/docker/` - Active Docker configs  
- **Deployment:** `../deploy/` - Production deployment scripts
- **Documentation:** `../docs/` - Current documentation

### 🔍 **Research & Reference**
You may refer to these files to:
- Understand previous implementation approaches
- Recover specific functionality if needed
- Compare performance between versions
- Extract useful code patterns

## 📊 **Legacy Timeline**

| Period | Component | Status |
|--------|-----------|--------|
| **v1.0** | `simple_legal_app.py` | ❌ Deprecated |
| **v1.5** | `legal_system_app.py` | ❌ Deprecated |  
| **v2.0** | `advanced_legal_system.py` | ❌ Deprecated |
| **v2.1** | `server_full.py` + Docker | ❌ Deprecated |
| **v3.0** | `aircloud_legal_platform.py` | ✅ **Current** |

## 🗑️ **Cleanup Policy**

### 📅 **Retention Schedule**
- **1 year:** Keep all legacy files for reference
- **2 years:** Review and potentially archive less important files
- **3 years:** Consider removal of very old implementations

### 🔒 **Backup Status**
All legacy files are:
- ✅ Backed up in Git history
- ✅ Available in previous commits  
- ✅ Documented in reorganization reports
- ✅ Safe to reference without risk of loss

---

**📝 Last Updated:** September 29, 2025  
**🔄 Reorganization:** Part of major workspace cleanup  
**📋 Reference:** See `../GIT_REORGANIZATION_FINAL_REPORT.md`

**⚠️ REMEMBER: Use `../aircloud-platform/` for current development!**