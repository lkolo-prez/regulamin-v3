# Aircloud Legal Platform - Deployment Management Scripts

Ten katalog zawiera kompletny zestaw skryptów do zarządzania platformą Aircloud Legal w środowisku produkcyjnym VPS.

## Struktura katalogów

```
deploy/
├── setup_vps.sh          # Konfiguracja infrastruktury VPS
├── deploy_app.sh          # Wdrożenie aplikacji
├── backup.sh              # System kopii zapasowych
├── restore.sh             # Przywracanie z kopii zapasowych
├── monitor.sh             # Monitorowanie systemu
├── update.sh              # Aktualizacja aplikacji
├── crontab               # Zadania cron
├── logrotate.conf        # Konfiguracja rotacji logów
└── README.md             # Ten plik
```

## Skrypty wdrożeniowe

### 1. setup_vps.sh
Kompletna konfiguracja serwera VPS:
- Instalacja PostgreSQL, Redis, Nginx, Python 3.11
- Konfiguracja firewall (UFW)
- Tworzenie użytkownika aplikacji
- Przygotowanie środowiska

```bash
sudo ./setup_vps.sh
```

### 2. deploy_app.sh
Wdrożenie aplikacji Aircloud Legal:
- Konfiguracja Gunicorn i Supervisor
- Setup reverse proxy Nginx
- Konfiguracja SSL (Let's Encrypt)
- Inicjalizacja bazy danych

```bash
sudo ./deploy_app.sh
```

## Skrypty administracyjne

### 3. backup.sh
Automatyczne kopie zapasowe:
- Dzienna/tygodniowa/miesięczna rotacja
- Backup bazy danych PostgreSQL
- Backup plików aplikacji i konfiguracji
- Automatyczne czyszczenie starych kopii

```bash
# Ręczne uruchomienie
sudo ./backup.sh

# Automatyczne via cron (2:00 AM codziennie)
0 2 * * * /opt/aircloud-legal/deploy/backup.sh
```

### 4. restore.sh
Przywracanie z kopii zapasowych:
- Listowanie dostępnych kopii
- Przywracanie bazy danych i plików
- Rollback do poprzedniej wersji

```bash
# Lista dostępnych kopii
./restore.sh -l

# Przywracanie z konkretnej daty
./restore.sh -d 20250115_140000

# Przywracanie z kopii tygodniowej
./restore.sh -d 20250115_140000 -t weekly
```

### 5. monitor.sh
Kompleksowe monitorowanie:
- Status aplikacji i usług
- Wykorzystanie zasobów systemowych
- Analiza logów
- Health check i ocena stanu systemu

```bash
# Jednorazowe sprawdzenie
./monitor.sh

# Regularne monitorowanie via cron
*/5 * * * * /opt/aircloud-legal/deploy/monitor.sh
```

### 6. update.sh
System aktualizacji aplikacji:
- Aktualizacja z lokalnych plików
- Aktualizacja z URL
- Aktualizacja z Git
- Automatyczny rollback w przypadku błędów

```bash
# Aktualizacja z pliku
./update.sh -f aircloud-update-v1.2.0.tar.gz

# Aktualizacja z URL
./update.sh -u https://releases.com/latest.tar.gz

# Aktualizacja z Git branch
./update.sh -b main

# Test mode (bez stosowania zmian)
./update.sh -t -f update.tar.gz
```

## Automatyzacja (cron)

### Instalacja zadań cron
```bash
# Instalacja wszystkich zadań cron
sudo crontab deploy/crontab

# Lub dodanie ręczne
sudo crontab -e
```

### Kluczowe zadania cron:
- **2:00 AM** - Dzienna kopia zapasowa
- **Co 5 min** - Health check
- **3:30 AM** - Odnowienie certyfikatów SSL
- **4:00 AM niedziela** - Konserwacja bazy danych
- **6:00 AM** - Aktualizacja pakietów systemu

## Rotacja logów

### Konfiguracja logrotate
```bash
# Instalacja konfiguracji
sudo cp deploy/logrotate.conf /etc/logrotate.d/aircloud-legal

# Test konfiguracji
sudo logrotate -d /etc/logrotate.d/aircloud-legal

# Wymuszenie rotacji
sudo logrotate -f /etc/logrotate.d/aircloud-legal
```

### Lokalizacje logów:
- `/var/log/aircloud/app.log` - Logi aplikacji
- `/var/log/aircloud/error.log` - Błędy aplikacji
- `/var/log/aircloud/gunicorn.log` - Logi serwera Gunicorn
- `/var/log/aircloud/backup.log` - Logi kopii zapasowych
- `/var/log/aircloud/health-*.log` - Logi monitorowania

## Procedury administracyjne

### Pierwsze wdrożenie
1. Przygotowanie VPS:
   ```bash
   sudo ./setup_vps.sh
   ```

2. Wdrożenie aplikacji:
   ```bash
   sudo ./deploy_app.sh
   ```

3. Konfiguracja DNS i SSL:
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

4. Instalacja zadań cron:
   ```bash
   sudo crontab deploy/crontab
   ```

### Codzienna administracja
- **Sprawdzenie stanu**: `./monitor.sh`
- **Przegląd logów**: `tail -f /var/log/aircloud/app.log`
- **Status usług**: `sudo supervisorctl status`

### Aktualizacja aplikacji
1. Utworzenie kopii zapasowej: `./backup.sh`
2. Test aktualizacji: `./update.sh -t -f update-file.tar.gz`
3. Aktualizacja: `./update.sh -f update-file.tar.gz`
4. Weryfikacja: `./monitor.sh`

### Przywracanie po awarii
1. Lista kopii: `./restore.sh -l`
2. Przywracanie: `./restore.sh -d DATE`
3. Weryfikacja: `./monitor.sh`

## Bezpieczeństwo

### Uprawnienia plików
```bash
# Skrypty administracyjne - tylko root
chmod 700 setup_vps.sh deploy_app.sh backup.sh restore.sh update.sh

# Skrypt monitorowania - dostępny dla wszystkich
chmod 755 monitor.sh

# Pliki konfiguracyjne
chmod 644 crontab logrotate.conf
```

### Backup security
- Kopie zapasowe chronione hasłem bazy danych
- Regularne testowanie procedur restore
- Kopie archiwalne poza serwerem (recommended)

## Rozwiązywanie problemów

### Aplikacja nie startuje
1. Sprawdź logi: `sudo supervisorctl tail -f aircloud-legal`
2. Status usług: `./monitor.sh`
3. Przywróć z kopii: `./restore.sh -l && ./restore.sh -d DATE`

### Problemy z bazą danych
1. Status PostgreSQL: `systemctl status postgresql`
2. Logi bazy: `sudo tail -f /var/log/postgresql/postgresql-*.log`
3. Przywróć bazę: `./restore.sh -d DATE`

### Problemy z certyfikatami SSL
1. Status certyfikatów: `sudo certbot certificates`
2. Odnowienie: `sudo certbot renew --force-renewal`
3. Restart Nginx: `sudo systemctl restart nginx`

## Kontakt i wsparcie

**Aircloud Legal Platform**  
Autor: Łukasz Kołodziej  
Email: contact@aircloud.com  

Licencja komercyjna: 50 PLN + 23% VAT/miesiąc  
Licencja społeczna/edukacyjna: Bezpłatna

---

*Ten system skryptów zapewnia kompletne środowisko produkcyjne dla platformy Aircloud Legal z automatyzacją, monitorowaniem i bezpieczeństwem na poziomie enterprise.*