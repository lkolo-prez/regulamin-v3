# SSPO Platform - Przewodnik Wdrożenia na VPS

## 🚀 Szybkie Wdrożenie

### 1. Przygotowanie VPS

```bash
# Skopiuj i uruchom skrypt konfiguracji VPS
curl -fsSL https://raw.githubusercontent.com/your-username/regulamin-v3/main/setup-vps.sh -o setup-vps.sh
chmod +x setup-vps.sh
./setup-vps.sh
```

### 2. Restart sesji
```bash
# Po instalacji Docker wyloguj się i zaloguj ponownie
exit
# (zaloguj się ponownie przez SSH)
```

### 3. Konfiguracja SSL
```bash
sudo certbot --nginx -d regulamin.sspo.edu.pl
```

### 4. Uruchomienie platformy
```bash
cd ~/sspo-platform
./deploy-new.sh
```

### 5. Konfiguracja GitHub Webhook
- Przejdź do: `https://github.com/your-username/regulamin-v3/settings/hooks`
- Kliknij "Add webhook"
- Payload URL: `https://regulamin.sspo.edu.pl/webhook/github`
- Content type: `application/json`
- Secret: sprawdź w pliku `.env` wartość `WEBHOOK_SECRET`
- Events: wybierz "Just the push event"

## 📋 Szczegółowy Przewodnik

### Wymagania Systemowe

**Minimalne:**
- VPS z Ubuntu 20.04+ lub Debian 11+
- 2 GB RAM
- 20 GB przestrzeni dyskowej
- Połączenie internetowe

**Zalecane:**
- 4 GB RAM
- 40 GB SSD
- CPU 2 rdzenie

### Konfiguracja DNS

Przed rozpoczęciem upewnij się, że domena `regulamin.sspo.edu.pl` wskazuje na IP twojego VPS:

```bash
# Sprawdź czy DNS jest poprawnie skonfigurowany
nslookup regulamin.sspo.edu.pl
```

### Szczegóły Instalacji

#### 1. Co instaluje skrypt setup-vps.sh:

- **Docker & Docker Compose** - konteneryzacja aplikacji
- **Nginx** - reverse proxy i serwer HTTP
- **Certbot** - automatyczne certyfikaty SSL
- **Fail2ban** - ochrona przed atakami brute-force
- **UFW Firewall** - podstawowa ochrona sieci
- **Narzędzia monitorowania** - health checks i alerty

#### 2. Struktura katalogów:
```
/home/user/sspo-platform/
├── .env                    # Zmienne środowiskowe
├── docker-compose.yml      # Konfiguracja kontenerów
├── app.js                  # Główna aplikacja Node.js
├── deploy-new.sh          # Skrypt wdrożeniowy
├── setup-vps.sh           # Skrypt konfiguracji VPS
├── backups/               # Kopie zapasowe
├── logs/                  # Logi systemowe
├── data/                  # Dane aplikacji
└── ssl/                   # Certyfikaty SSL
```

#### 3. Usługi Docker:

**sspo-app** (Node.js):
- Port: 3000 (wewnętrzny)
- Funkcje: API, webhook handler, frontend
- Health check: `/health`

**redis**:
- Cache i session storage
- Persystentne dane w `./data/redis`

**nginx**:
- Reverse proxy
- SSL termination
- Rate limiting
- Kompresja gzip

### Konfiguracja Zmiennych Środowiskowych

Edytuj plik `.env`:

```bash
nano ~/sspo-platform/.env
```

Kluczowe zmienne:
```env
NODE_ENV=production
PORT=3000
WEBHOOK_SECRET=twoj-tajny-klucz-32-znaki
ADMIN_PASSWORD=bezpieczne-haslo-admin
DOMAIN=regulamin.sspo.edu.pl

# Opcjonalne powiadomienia
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

# Email (opcjonalne)
SMTP_HOST=
SMTP_USER=
SMTP_PASS=
```

### Zarządzanie Platformą

#### Podstawowe komendy:

```bash
cd ~/sspo-platform

# Uruchomienie
./deploy-new.sh

# Sprawdzenie statusu
docker-compose ps

# Logi
docker-compose logs -f sspo-app

# Restart pojedynczej usługi
docker-compose restart sspo-app

# Pełny restart
docker-compose down && docker-compose up -d

# Backup
./deploy-new.sh backup
```

#### Monitoring:

```bash
# Status kontenerów
docker-compose ps

# Wykorzystanie zasobów
docker stats

# Logi nginx
sudo tail -f /var/log/nginx/access.log

# Logi aplikacji
tail -f ~/sspo-platform/logs/app.log
```

### SSL i Bezpieczeństwo

#### Automatyczne odnowienie certyfikatów:
Certbot automatycznie odnawia certyfikaty. Sprawdzenie:

```bash
sudo certbot certificates
sudo certbot renew --dry-run
```

#### Bezpieczeństwo:
- Firewall UFW blokuje niepotrzebne porty
- Fail2ban chroni przed atakami brute-force
- Nginx ma skonfigurowane security headers
- Rate limiting dla API endpoints
- GitHub webhook używa HMAC SHA-256

### Kopie Zapasowe

Automatyczne kopie zapasowe uruchamiają się codziennie o północy:

```bash
# Manualna kopia zapasowa
./deploy-new.sh backup

# Lista kopii zapasowych
ls -la ~/sspo-platform/backups/

# Przywrócenie z kopii
./deploy-new.sh restore backup-2024-01-15-120000.tar.gz
```

### Rozwiązywanie Problemów

#### Aplikacja nie startuje:
```bash
# Sprawdź logi
docker-compose logs sspo-app

# Sprawdź zmienne środowiskowe
docker-compose exec sspo-app env

# Restart
docker-compose restart sspo-app
```

#### Problemy z SSL:
```bash
# Test konfiguracji nginx
sudo nginx -t

# Sprawdź certyfikaty
sudo certbot certificates

# Odnów certyfikat
sudo certbot renew --force-renewal
```

#### Wysokie użycie zasobów:
```bash
# Sprawdź stats
docker stats

# Wyczyść logi
sudo truncate -s 0 /var/log/nginx/access.log
sudo truncate -s 0 /var/log/nginx/error.log

# Wyczyść Docker
docker system prune -f
```

#### GitHub Webhook nie działa:
```bash
# Sprawdź logi webhook
docker-compose logs sspo-app | grep webhook

# Sprawdź secret
grep WEBHOOK_SECRET ~/sspo-platform/.env

# Test endpointu
curl -X POST https://regulamin.sspo.edu.pl/webhook/github \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

### Aktualizacje

Platforma automatycznie aktualizuje się po każdym push do repozytorium. Możesz też zaktualizować manualnie:

```bash
cd ~/sspo-platform
git pull origin main
./deploy-new.sh
```

### Metryki i Analytics

Platforma zbiera podstawowe metryki:
- Liczba wizyt
- Popularne regulaminy
- Sugestie i głosy
- Czas odpowiedzi API

Dostęp do dashboard: `https://regulamin.sspo.edu.pl/admin`

### Wsparcie

W przypadku problemów:
1. Sprawdź logi: `docker-compose logs`
2. Sprawdź status: `docker-compose ps`
3. Sprawdź monitoring: `~/sspo-platform/monitor.sh`
4. Sprawdź GitHub Actions w repozytorium

## 🎯 Checklist Wdrożenia

- [ ] VPS skonfigurowany (setup-vps.sh)
- [ ] DNS wskazuje na VPS
- [ ] SSL certyfikat zainstalowany
- [ ] Aplikacja uruchomiona
- [ ] GitHub webhook skonfigurowany
- [ ] Kopie zapasowe działają
- [ ] Monitoring aktywny
- [ ] Testy funkcjonalności przeprowadzone

Po wykonaniu wszystkich kroków platforma SSPO będzie dostępna pod adresem `https://regulamin.sspo.edu.pl` z pełną funkcjonalnością collaborative governance!