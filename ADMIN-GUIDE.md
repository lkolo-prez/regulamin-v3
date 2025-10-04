# 👑 Przewodnik Administratora - System Współpracy SSPO

## 🚀 Pierwsze kroki

### 1️⃣ Pierwsze logowanie
```
URL: http://YOUR_SERVER_IP:8080
Email: admin@sspo.com.pl
Hasło: ChangeMe123!
```

⚠️ **KRYTYCZNE**: Zmień hasło natychmiast po pierwszym logowaniu!

### 2️⃣ Zmiana domyślnego hasła administratora
1. Po zalogowaniu kliknij swoją nazwę w prawym górnym rogu
2. Wybierz **🔑 Zmień hasło**
3. Wprowadź:
   - Aktualne hasło: `ChangeMe123!`
   - Nowe hasło: (min. 8 znaków, zalecane: wielkie litery, cyfry, znaki specjalne)
   - Potwierdzenie nowego hasła
4. Kliknij **Zmień hasło**
5. Wyloguj się i zaloguj ponownie z nowym hasłem

### 3️⃣ Zmiana JWT Secret (Backend)
```bash
ssh your-server
cd /home/debian/regulamin-backend
nano .env
```

Zmień linię:
```env
JWT_SECRET=sspo_super_secret_key_change_me_in_production_2024
```

Na losowy ciąg znaków (min. 32 znaki):
```env
JWT_SECRET=twoj_bardzo_silny_losowy_klucz_min_32_znaki_abc123XYZ!@#
```

Zrestartuj backend:
```bash
sudo systemctl restart regulamin-backend
```

---

## 👥 Zarządzanie użytkownikami

### Dostęp do panelu administratora
1. Kliknij **⚙️ Panel administratora** w toolbar
2. Zobaczysz 2 zakładki:
   - **👥 Użytkownicy** - zarządzanie kontami
   - **📊 Statystyki** - dashboard

### Zmiana roli użytkownika
1. W zakładce **👥 Użytkownicy** znajdź użytkownika w tabeli
2. Wybierz nową rolę z dropdown:
   - 👁️ **Viewer** - może tylko czytać
   - ✍️ **Contributor** - może dodawać komentarze i poprawki
   - ⭐ **Reviewer** - może recenzować i głosować
   - 👑 **Admin** - pełen dostęp
3. Kliknij przycisk **💾** aby zapisać

### Reset hasła użytkownika
1. W tabeli użytkowników kliknij przycisk **🔑** przy wybranym użytkowniku
2. W oknie modalnym:
   - Domyślnie: automatycznie wygenerowane hasło `NoweHaslo123!`
   - Możesz zmienić na dowolne (min. 8 znaków)
3. Kliknij **🔑 Resetuj hasło**
4. **WAŻNE**: Skopiuj wyświetlone hasło i przekaż je użytkownikowi bezpiecznym kanałem
   - Nie wysyłaj hasła przez niezabezpieczony email!
   - Użyj: SMS, Signal, WhatsApp, lub przekaż osobiście

### Tworzenie nowego użytkownika
⚠️ Obecnie brak interfejsu - wymagane bezpośrednie zapytanie do API:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nowy@sspo.com.pl",
    "password": "TymczasoweHaslo123!",
    "name": "Jan Kowalski"
  }'
```

Następnie zresetuj hasło przez panel administratora i przekaż użytkownikowi.

---

## 📊 Dashboard statystyk

### Dostępne metryki
- 👥 **Łączna liczba użytkowników**
- 👑 **Administratorzy** - użytkownicy z pełnym dostępem
- ⭐ **Recenzenci** - mogą głosować i recenzować
- ✍️ **Współtwórcy** - mogą dodawać komentarze i poprawki

### Interpretacja statystyk
- **Niski % administratorów** (1-2 osoby) = ✅ Dobra praktyka bezpieczeństwa
- **Wysoki % recenzentów** = ✅ Aktywna społeczność
- **Dużo viewerów** = ℹ️ Rozważ kampanię zachęcającą do aktywności

---

## 🔐 Bezpieczeństwo

### Checklist bezpieczeństwa dla administratora

- [ ] Zmieniłem domyślne hasło administratora
- [ ] Zaktualizowałem JWT_SECRET w .env
- [ ] Zrestartowałem backend po zmianie .env
- [ ] Użytkownicy mają silne hasła (min. 8 znaków)
- [ ] Regularnie sprawdzam dashboard statystyk
- [ ] Nie udostępniam haseł przez niezabezpieczone kanały
- [ ] Tworzę backupy bazy danych regularnie

### Tworzenie backupu bazy danych
```bash
cd /home/debian/regulamin-backend/data
cp regulamin.db regulamin.db.backup-$(date +%Y%m%d-%H%M%S)
```

Automatyczny backup codziennie o 3:00:
```bash
crontab -e
```

Dodaj linię:
```cron
0 3 * * * cp /home/debian/regulamin-backend/data/regulamin.db /home/debian/regulamin-backend/data/regulamin.db.backup-$(date +\%Y\%m\%d) && find /home/debian/regulamin-backend/data -name "*.backup-*" -mtime +30 -delete
```

---

## 🔍 Wyszukiwarka

### Zarządzanie wyszukiwarką
- **Lokalizacja**: Lewy panel boczny (sidebar)
- **Cache**: 24 godziny
- **Głębokość**: 3 poziomy nagłówków

### Odświeżenie cache wyszukiwarki
Wyszukiwarka automatycznie odświeża cache co 24h. Aby wymusić odświeżenie:
```bash
# Restart kontenera Docker
docker restart regulamin-sspo-container
```

---

## 💬 Moderacja komentarzy i poprawek

### Wyświetlanie wszystkich komentarzy
1. Kliknij dowolny dokument w sidebar
2. Scroll w dół do komentarzy
3. Filtry:
   - **Wszystkie** - wszystkie komentarze
   - **Moje** - tylko twoje komentarze
   - **Odpowiedzi** - komentarze z odpowiedziami

### Usuwanie niewłaściwych komentarzy
⚠️ Obecnie brak interfejsu - bezpośrednio w bazie:
```bash
sqlite3 /home/debian/regulamin-backend/data/regulamin.db
DELETE FROM comments WHERE id = 123;
.quit
```

**Alternatywnie**: Edytuj `server.js` i dodaj endpoint DELETE.

### Zarządzanie poprawkami (Amendments)
1. **Status poprawek**:
   - `draft` - szkic (edytowalny)
   - `pending` - czeka na recenzję
   - `approved` - zaakceptowana (automatyczne PR do GitHub)
   - `rejected` - odrzucona

2. **Akceptacja poprawki**:
   - Przejdź do dokumentu
   - Kliknij **📝 Poprawki**
   - Wybierz poprawkę do przeglądu
   - Kliknij **✅ Akceptuj** lub **❌ Odrzuć**

3. **Automatyczne Pull Requesty**:
   - Po akceptacji poprawka automatycznie tworzy PR na GitHub
   - Musisz mieć skonfigurowany GITHUB_TOKEN w .env
   - PR zawiera: tytuł, opis, uzasadnienie, zmiany

---

## 🔧 Rozwiązywanie problemów

### Problem: Użytkownik nie może się zalogować
**Diagnoza**:
```bash
sqlite3 /home/debian/regulamin-backend/data/regulamin.db "SELECT id, email, name, role FROM users WHERE email='user@example.com';"
```

**Rozwiązanie**: Reset hasła przez panel administratora

### Problem: Backend nie odpowiada
**Diagnoza**:
```bash
sudo systemctl status regulamin-backend
journalctl -u regulamin-backend -n 50
```

**Rozwiązanie**:
```bash
sudo systemctl restart regulamin-backend
```

### Problem: Frontend nie ładuje się
**Diagnoza**:
```bash
docker ps -a
docker logs regulamin-sspo-container
```

**Rozwiązanie**:
```bash
docker restart regulamin-sspo-container
```

### Problem: Wyszukiwarka nie działa
**Diagnoza**: Sprawdź w przeglądarce (F12 → Console) czy są błędy JavaScript

**Rozwiązanie**:
```bash
# Sprawdź czy CSS został wdrożony
curl -s http://localhost:8080/css/collaboration-fixed.css | grep "DOCSIFY SEARCH FIX"

# Jeśli nie ma - redeploy
cd /home/debian/regulamin-v3
git pull origin main
docker restart regulamin-sspo-container
```

---

## 📈 Monitoring i logi

### Sprawdzenie logów backendu (ostatnie 50 linii)
```bash
journalctl -u regulamin-backend -n 50
```

### Monitorowanie na żywo
```bash
journalctl -u regulamin-backend -f
```

### Sprawdzenie użycia zasobów
```bash
systemctl status regulamin-backend docker nginx
docker stats regulamin-sspo-container --no-stream
```

### Sprawdzenie miejsca na dysku
```bash
df -h
du -sh /home/debian/regulamin-backend/data/
```

---

## 🎯 Best Practices

### 1. Zasada najmniejszych uprawnień
- Przyznawaj role **admin** tylko zaufanym osobom (1-2 osoby)
- Większość użytkowników: **reviewer** lub **contributor**
- Nowi użytkownicy: **viewer** do czasu weryfikacji

### 2. Regularne audyty
- Co miesiąc sprawdzaj listę administratorów
- Usuwaj nieaktywne konta (brak logowania > 6 miesięcy)
- Sprawdzaj logi pod kątem podejrzanych aktywności

### 3. Komunikacja zmian
- Powiadamiaj użytkowników o ważnych zmianach
- Dokumentuj wszystkie zmiany w regulaminach
- Przechowuj historię wersji dokumentów

### 4. Backupy
- Codzienne backupy bazy danych (cron)
- Tygodniowe backupy pełnego systemu
- Testuj przywracanie backupów co kwartał

### 5. Aktualizacje
- Sprawdzaj aktualizacje zależności co miesiąc
- Testuj zmiany na środowisku testowym
- Dokumentuj wszystkie wdrożenia

---

## 📞 Kontakt i wsparcie

**Administrator systemu**: Łukasz Kołodziej  
**Email**: kolodziej.lukasz.pl@gmail.com  
**GitHub**: https://github.com/lkolo-prez/regulamin-v3  

**W razie pilnego problemu**:
1. Sprawdź sekcję "Rozwiązywanie problemów" powyżej
2. Przejrzyj logi systemowe
3. Skontaktuj się z administratorem z:
   - Opisem problemu
   - Logami błędów
   - Krokami do reprodukcji

---

## 📚 Dodatkowe zasoby

- [CHANGELOG-v2.1.md](CHANGELOG-v2.1.md) - Lista wszystkich zmian
- [README.md](README.md) - Główna dokumentacja projektu
- [13-zabezpieczenia-systemowe.md](13-zabezpieczenia-systemowe.md) - Polityka bezpieczeństwa

---

**Ostatnia aktualizacja**: 2025-10-04  
**Wersja dokumentu**: 2.1.0
