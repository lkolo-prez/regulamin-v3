# SSPO Legal Platform Enhanced - Installation Guide

## 📦 Przewodnik Instalacji

### Wymagania Wstępne

#### System Requirements
- **Operating System**: Windows 10/11, macOS 10.15+, Ubuntu 18.04+
- **Node.js**: 18.0.0 lub nowszy
- **NPM**: 8.0.0 lub nowszy
- **RAM**: 3GB rekomendowane (minimum 2GB)
- **CPU**: 2 cores rekomendowane
- **Disk Space**: 5GB dla aplikacji + logi
- **Docker**: Najnowsza wersja (opcjonalne ale rekomendowane)

#### Sprawdzenie Wymagań

**Windows:**
```cmd
node --version
npm --version
docker --version
```

**macOS/Linux:**
```bash
node --version
npm --version
docker --version
```

### 🚀 Instalacja Szybka (Rekomendowana)

#### 1. Klonowanie Projektu
```bash
git clone [repository-url]
cd regulamin-v3
```

#### 2. Instalacja Zależności
```bash
npm install
```

#### 3. Deploy Produkcyjny
```bash
npm run deploy
```

**To wszystko!** Aplikacja zostanie automatycznie:
- Skonfigurowana z bezpiecznymi settingami
- Zbudowana w kontenerze Docker
- Uruchomiona z wszystkimi usługami
- Sprawdzona pod kątem działania

### 🛠️ Instalacja Zaawansowana

#### 1. Przygotowanie Środowiska

**Klonowanie projektu:**
```bash
git clone [repository-url]
cd regulamin-v3
```

**Sprawdzenie struktury:**
```
regulamin-v3/
├── src/                    # Kod aplikacji
├── scripts/setup.js        # Deployment manager
├── docker/                 # Konfiguracja Docker
├── config/                 # Konfiguracje
├── docs/                   # Dokumentacja
└── package.json            # Dependencies
```

#### 2. Instalacja Dependencies

**Production Dependencies:**
```bash
npm ci --only=production
```

**Development Dependencies (dla development):**
```bash
npm install
```

#### 3. Konfiguracja Środowiska

**Automatyczna konfiguracja:**
```bash
npm run dev:setup
```

**Ręczna konfiguracja:**
```bash
# Skopiuj template
cp .env.example .env

# Edytuj konfigurację
nano .env  # lub używając preferowanego edytora
```

### 🐳 Instalacja Docker (Produkcja)

#### Docker Compose (Najprostsza)

```bash
# Budowanie i uruchamianie
npm run docker:compose:up

# Sprawdzenie statusu
docker-compose -f docker/docker-compose.yml ps

# Sprawdzenie logów
npm run logs
```

#### Docker Manual

```bash
# Budowanie obrazu
npm run docker:build

# Uruchamianie kontenera
npm run docker:run

# Sprawdzenie działania
npm run health
```

### 💻 Instalacja Development

#### Setup Development Environment

```bash
# Instalacja wszystkich dependencies
npm install

# Konfiguracja środowiska dev
npm run dev:setup

# Uruchomienie w trybie development
npm run dev
```

#### Development Tools

**Dodatkowe narzędzia development:**
```bash
# ESLint dla quality check
npx eslint src/

# Prettier dla formatowania
npx prettier --write src/

# Tests
npm test
```

### ⚙️ Konfiguracja Ręczna

#### Environment Variables (.env)

```bash
# Application Settings
NODE_ENV=production
PORT=3000
API_PORT=3001

# Resource Limits (2GB RAM constraint)
MEMORY_LIMIT=2048m
CPU_LIMIT=2.0
MAX_HEAP_SIZE=1800m

# AI and Legal Analysis
NATURAL_LANGUAGE=polish
LEGAL_ANALYSIS_ENABLED=true
LEGAL_KEYWORDS_CACHE_SIZE=1000

# Security (automatycznie generowane podczas deploy)
JWT_SECRET=your_secure_jwt_secret_here
SESSION_SECRET=your_secure_session_secret_here
ENCRYPTION_KEY=your_secure_encryption_key_here

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_MAX_FILES=5
LOG_MAX_SIZE=100m
```

#### Nginx Configuration

**Automatycznie konfigurowane w `config/nginx.conf`:**
- Reverse proxy
- Rate limiting
- Security headers
- SSL termination
- Static file serving

### 🔧 Troubleshooting Instalacji

#### Częste Problemy

**1. Node.js Version Error**
```bash
# Błąd: Node.js version too old
# Rozwiązanie: Zainstaluj Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**2. Permission Errors (Linux/macOS)**
```bash
# Błąd: EACCES permissions
# Rozwiązanie: Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

**3. Memory Errors**
```bash
# Błąd: JavaScript heap out of memory
# Rozwiązanie: Zwiększ heap size
export NODE_OPTIONS="--max-old-space-size=2048"
npm run deploy
```

**4. Docker Permission Issues (Linux)**
```bash
# Błąd: Permission denied connecting to Docker
# Rozwiązanie: Dodaj user do grupy docker
sudo usermod -aG docker $USER
newgrp docker
```

**5. Port Already in Use**
```bash
# Błąd: Port 3000 already in use
# Sprawdź co używa portu
netstat -tulpn | grep :3000

# Zatrzymaj konfliktujący proces lub zmień port w .env
PORT=3010
API_PORT=3011
```

#### Diagnostyka

**System Check:**
```bash
npm run health
```

**Detailed Logs:**
```bash
npm run logs
```

**Memory Check:**
```bash
free -h  # Linux
vm_stat  # macOS
```

### 📊 Weryfikacja Instalacji

#### Health Check

```bash
# Automatyczny health check
npm run health

# Ręczne sprawdzenie
curl http://localhost:3000/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": "00:05:23",
  "memory": {
    "used": "256MB",
    "total": "2GB",
    "percentage": "12%"
  },
  "services": {
    "api": "running",
    "legal-engine": "running",
    "nlp": "running"
  }
}
```

#### Performance Verification

**Load Test:**
```bash
# Podstawowy load test
curl -w "@curl-format.txt" -s -o /dev/null http://localhost:3000/

# Memory monitoring
npm run performance:monitor
```

#### Security Verification

```bash
# Security audit
npm run security:scan

# SSL check (jeśli używasz HTTPS)
openssl s_client -connect localhost:443
```

### 🚀 Post-Installation

#### Pierwsze Uruchomienie

1. **Sprawdź aplikację**: http://localhost:3000
2. **API Status**: http://localhost:3001/api/health
3. **View Logs**: `npm run logs`
4. **Monitor Performance**: Sprawdź użycie RAM < 2GB

#### Backup Configuration

```bash
# Automatyczny backup
npm run backup

# Ręczny backup konfiguracji
cp .env .env.backup
cp -r config/ config.backup/
```

#### Monitoring Setup

**Continuous Monitoring:**
```bash
# W osobnym terminalu
npm run performance:monitor

# Lub jako service
npm run logs
```

### 📚 Następne Kroki

Po instalacji przejdź do:

1. **[User Guide](USER_GUIDE.md)** - Jak używać aplikacji
2. **[API Documentation](API.md)** - Dokumentacja API
3. **[Security Guide](SECURITY.md)** - Konfiguracja bezpieczeństwa
4. **[Development Guide](DEVELOPMENT.md)** - Rozwój aplikacji

### 📞 Wsparcie Instalacji

**Jeśli napotkasz problemy:**

1. Sprawdź [Troubleshooting](#-troubleshooting-instalacji)
2. Przejrzyj logi: `npm run logs`
3. Sprawdź system requirements
4. Zgłoś issue w repozytorium

---

**Gratulacje!** 🎉 SSPO Legal Platform Enhanced jest teraz gotowa do użycia!