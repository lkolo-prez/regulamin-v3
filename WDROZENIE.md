# Instrukcja Wdrożenia - System Prawny SSPO

## 🎯 Cel
Wdrożenie interaktywnej strony z regulaminami SSPO na serwerze `vps-5e1411da.vps.ovh.net` pod domeną `regulamin.sspo.com.pl`.

## 📋 Wymagania Wstępne

### 1. Konfiguracja DNS
W panelu zarządzania domeną `sspo.com.pl` dodaj rekord DNS:
```
Typ: A
Nazwa: regulamin  
Wartość: [IP TWOJEGO SERWERA vps-5e1411da.vps.ovh.net]
TTL: 3600 (1 godzina)
```

### 2. Dostęp do serwera
Upewnij się, że masz dostęp SSH do serwera:
```bash
ssh root@vps-5e1411da.vps.ovh.net
```

## 🚀 Kroki Wdrożenia

### Krok 1: Przygotowanie plików na serwerze
Skopiuj cały folder `regulamin-v3` na serwer:
```bash
# Z lokalnego komputera
scp -r "g:\Mój dysk\01_PO\SSPO\regulamin-v3" root@vps-5e1411da.vps.ovh.net:~/
```

### Krok 2: Zaloguj się na serwer i przejdź do folderu
```bash
ssh root@vps-5e1411da.vps.ovh.net
cd ~/regulamin-v3
```

### Krok 3: Nadaj uprawnienia i uruchom wdrożenie
```bash
chmod +x deploy.sh
./deploy.sh
```

### Krok 4: Konfiguracja SSL (opcjonalne, ale zalecane)
Jeśli chcesz mieć HTTPS (certyfikat SSL):
```bash
# Zainstaluj Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Zatrzymaj kontener na chwilę
sudo docker stop regulamin-sspo

# Wygeneruj certyfikat
sudo certbot certonly --standalone -d regulamin.sspo.com.pl

# Uruchom ponownie kontener
sudo docker start regulamin-sspo
```

## ✅ Weryfikacja Wdrożenia

Po wykonaniu powyższych kroków:

1. **Otwórz przeglądarkę** i przejdź na: `http://regulamin.sspo.com.pl`
2. **Sprawdź funkcjonalności:**
   - Nawigacja w menu bocznym
   - Wyszukiwanie w górnym pasku
   - Przejścia między dokumentami przez linki
   - Renderowanie diagramów Mermaid

## 🔧 Zarządzanie

### Podstawowe polecenia Docker:
```bash
# Zobacz status kontenera
sudo docker ps

# Zatrzymaj serwis
sudo docker stop regulamin-sspo

# Uruchom serwis
sudo docker start regulamin-sspo

# Zobacz logi
sudo docker logs regulamin-sspo

# Usuń kontener (jeśli chcesz przebudować od nowa)
sudo docker rm -f regulamin-sspo
```

### Aktualizacja treści:
1. Zaktualizuj pliki na lokalnym komputerze
2. Skopiuj je ponownie na serwer
3. Uruchom `./deploy.sh` ponownie

## 🆘 Rozwiązywanie Problemów

### Problem: Strona nie ładuje się
- Sprawdź czy kontener działa: `sudo docker ps`
- Sprawdź logi: `sudo docker logs regulamin-sspo`
- Sprawdź czy porty 80/443 są otwarte: `sudo netstat -tulpn | grep :80`

### Problem: Domena nie działa
- Sprawdź konfigurację DNS: `nslookup regulamin.sspo.com.pl`
- Upewnij się, że rekord A wskazuje na właściwy IP

### Problem: SSL nie działa
- Sprawdź czy certyfikat został wygenerowany: `sudo ls /etc/letsencrypt/live/regulamin.sspo.com.pl/`
- Odnów certyfikat: `sudo certbot renew`

## 📞 Kontakt
W razie problemów z wdrożeniem, skontaktuj się z administratorem systemu.

---
*Instrukcja przygotowana dla wdrożenia v3.0 - Wrzesień 2025*