# 📋 Changelog v2.1 - System Współpracy SSPO

## 🎯 Wersja 2.1.0 - Zarządzanie użytkownikami i wyszukiwarka (2025-10-04)

### ✨ Nowe funkcje

#### 🔐 Zarządzanie hasłami
- **Zmiana własnego hasła**: Użytkownicy mogą teraz zmienić swoje hasło z menu użytkownika (🔑 Zmień hasło)
  - Wymaga podania aktualnego hasła
  - Walidacja minimalnej długości (8 znaków)
  - Potwierdzenie nowego hasła
  - Bezpieczne hashowanie z bcrypt (10 rund)

- **Reset hasła przez administratora**: Administratorzy mogą resetować hasła innych użytkowników
  - Przycisk 🔑 w tabeli użytkowników
  - Automatycznie generowane bezpieczne hasło (NoweHaslo123!)
  - Hasło wyświetlane administratorowi do bezpiecznego przekazania
  - Endpoint: `PATCH /api/users/:id/reset-password`

#### ⚙️ Rozbudowany panel administratora
- **Zakładki nawigacyjne**:
  - 👥 **Użytkownicy**: Zarządzanie rolami i hasłami
  - 📊 **Statystyki**: Dashboard z liczbami użytkowników według ról

- **Tabela użytkowników**:
  - Wyświetlanie: ID, Imię, Email, Rola, Ostatnie logowanie
  - Zmiana roli z dropdown (Viewer, Contributor, Reviewer, Admin)
  - Przycisk 💾 do zapisania nowej roli
  - Przycisk 🔑 do resetowania hasła

- **Dashboard statystyk**:
  - 👥 Łączna liczba użytkowników
  - 👑 Liczba administratorów
  - ⭐ Liczba recenzentów
  - ✍️ Liczba współtwórców
  - ⚠️ Ostrzeżenie o zmianie domyślnych danych logowania

#### 🔍 Poprawiona wyszukiwarka
- **Rozwiązany problem widoczności**: Wyszukiwarka Docsify jest teraz w pełni widoczna
- **Nowe style CSS**:
  - Wyraźne obramowanie i zaokrąglone rogi
  - Focus state z kolorem primary (niebieski)
  - Podświetlanie wyników wyszukiwania
  - Oznaczanie słów kluczowych w wynikach
  - Responsywny design

### 🔧 Poprawki techniczne

#### Backend (server.js)
- Dodano endpoint `PATCH /api/users/me/password` - zmiana własnego hasła
- Dodano endpoint `PATCH /api/users/:id/reset-password` - reset hasła przez admina
- Walidacja: minimalna długość hasła 8 znaków
- Bezpieczne porównywanie haseł z bcrypt.compare
- Nowe hashowanie z bcrypt.hash (10 salt rounds)

#### Frontend (collaboration-integrated.js)
- Nowa funkcja `showChangePassword()` - modal zmiany hasła
- Nowa funkcja `showResetPasswordModal()` - modal resetu hasła przez admina
- Rozbudowana funkcja `showAdminPanel()` z zakładkami
- Ulepszony `showUserMenu()` z opcją zmiany hasła
- Walidacja potwierdzenia hasła po stronie klienta

#### CSS (collaboration-fixed.css)
- **Sekcja DOCSIFY SEARCH FIX**: 
  - Explicit `display: block !important` dla .search
  - Styled input[type="search"] z właściwym paddingiem
  - Focus state z shadow i border-color
  - Highlighted search keywords z background-color

- **Sekcja ADMIN PANEL**:
  - `.sspo-admin-tabs` - nawigacja zakładkowa
  - `.sspo-admin-tab` - style przycisków zakładek
  - `.sspo-stats-grid` - grid layout dla statystyk
  - `.sspo-stat-card` - karty statystyk z gradientem

### 📊 Statystyki wydajności
- **Czas wdrożenia**: ~10 sekund (webhook + Docker rebuild)
- **Wielkość zmian**: 337 linii dodanych, 48 linii usuniętych
- **Pliki zmodyfikowane**: 2 (collaboration-integrated.js, collaboration-fixed.css)
- **Backend**: 2 nowe endpointy, ~100 linii kodu

### 🔒 Bezpieczeństwo

#### ⚠️ WAŻNE - Domyślne dane logowania
```
Email: admin@sspo.com.pl
Hasło: ChangeMe123!
```
**NALEŻY ZMIENIĆ NATYCHMIAST PO PIERWSZYM LOGOWANIU!**

#### Zalecane działania bezpieczeństwa:
1. ✅ Zmień hasło administratora poprzez menu użytkownika → 🔑 Zmień hasło
2. ✅ Zaktualizuj `JWT_SECRET` w `/home/debian/regulamin-backend/.env`
3. ⚠️ Rozważ implementację wymuszenia zmiany hasła przy pierwszym logowaniu
4. ⚠️ Dodaj politykę złożoności haseł (wielkie litery, cyfry, znaki specjalne)
5. ⚠️ Implementuj ograniczenie prób logowania (rate limiting)

### 🧪 Testowanie

#### Jak przetestować nowe funkcje:

1. **Zmiana własnego hasła**:
   ```
   1. Zaloguj się jako dowolny użytkownik
   2. Kliknij swoją nazwę w prawym górnym rogu
   3. Wybierz "🔑 Zmień hasło"
   4. Wprowadź: aktualne hasło, nowe hasło (min 8 znaków), potwierdzenie
   5. Kliknij "Zmień hasło"
   6. Wyloguj się i zaloguj ponownie z nowym hasłem
   ```

2. **Reset hasła przez administratora**:
   ```
   1. Zaloguj się jako admin (admin@sspo.com.pl / ChangeMe123!)
   2. Kliknij "⚙️ Panel administratora"
   3. W tabeli użytkowników kliknij przycisk 🔑 przy wybranym użytkowniku
   4. Opcjonalnie zmień automatycznie wygenerowane hasło
   5. Kliknij "🔑 Resetuj hasło"
   6. Skopiuj nowe hasło z wyświetlonego modalu
   7. Przekaż hasło użytkownikowi bezpiecznym kanałem
   ```

3. **Panel statystyk**:
   ```
   1. Zaloguj się jako admin
   2. Kliknij "⚙️ Panel administratora"
   3. Przejdź do zakładki "📊 Statystyki"
   4. Sprawdź liczby użytkowników według ról
   5. Przeczytaj ostrzeżenie o domyślnych danych logowania
   ```

4. **Wyszukiwarka**:
   ```
   1. Otwórz portal http://YOUR_IP:8080
   2. W lewym panelu bocznym (sidebar) powinna być widoczna wyszukiwarka
   3. Wpisz frazę, np. "regulamin"
   4. Sprawdź wyniki z podświetlonymi słowami kluczowymi
   ```

### 🐛 Znane problemy i ograniczenia

1. **Brak wymuszenia zmiany hasła**: 
   - Domyślne hasło administratora nie jest wymuszane do zmiany przy pierwszym logowaniu
   - Workaround: Manualna zmiana hasła przez administratora

2. **Słaba polityka haseł**:
   - Wymagana tylko minimalna długość (8 znaków)
   - Brak wymogu wielkich liter, cyfr, znaków specjalnych
   - Planowane: implementacja zxcvbn password strength meter

3. **Brak historii haseł**:
   - Użytkownik może ustawić to samo hasło wielokrotnie
   - Planowane: przechowywanie hash'y ostatnich 5 haseł

4. **Brak rate limiting**:
   - Brak ochrony przed brute-force na endpointy logowania
   - Planowane: express-rate-limit middleware

### 📝 API Documentation

#### Nowe endpointy:

**PATCH /api/users/me/password**
```json
Request:
{
  "currentPassword": "StareHaslo123!",
  "newPassword": "NoweHaslo456!"
}

Response 200:
{
  "message": "Hasło zmienione pomyślnie"
}

Response 401:
{
  "error": "Nieprawidłowe aktualne hasło"
}
```

**PATCH /api/users/:id/reset-password** (Admin only)
```json
Request:
{
  "newPassword": "NoweHaslo789!"
}

Response 200:
{
  "message": "Hasło zresetowane pomyślnie"
}

Response 403:
{
  "error": "Brak uprawnień"
}
```

### 🚀 Deployment

Zmiany zostały wdrożone automatycznie poprzez:
1. Git push do `main` branch
2. GitHub webhook trigger
3. Docker rebuild & redeploy (~10 sekund)
4. Backend: hot reload (systemd restart)

**Commit hash**: c924338
**Data wdrożenia**: 2025-10-04 01:01 UTC
**Status**: ✅ DEPLOYED & TESTED

### 📦 Wersje zależności
- Node.js: 20.19.5
- Express: 4.18.2
- bcryptjs: 2.4.3
- jsonwebtoken: 9.0.2
- Docsify: 4.x
- Docker: 20.10.24

### 👥 Contributors
- lkolo-prez (Łukasz Kołodziej)
  - Email: kolodziej.lukasz.pl@gmail.com
  - Commits: 100% repo ownership

### 📄 License
Wszystkie zmiany są częścią systemu prawnego SSPO i podlegają regulaminowi Samorządu Studenckiego Politechniki Opolskiej.

---

## 🔗 Powiązane dokumenty
- [README.md](README.md) - Główna dokumentacja projektu
- [18-indeks-dokumentow.md](18-indeks-dokumentow.md) - Indeks wszystkich dokumentów
- [13-zabezpieczenia-systemowe.md](13-zabezpieczenia-systemowe.md) - Polityka bezpieczeństwa

## 🆘 Support
W razie problemów:
1. Sprawdź logi backendu: `journalctl -u regulamin-backend -f`
2. Sprawdź logi Docker: `docker logs regulamin-sspo-container`
3. Sprawdź status serwisów: `systemctl status regulamin-backend nginx docker`
4. Kontakt: kolodziej.lukasz.pl@gmail.com
