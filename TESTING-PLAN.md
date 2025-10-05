# 🧪 Plan Testowania Systemu SSPO v2.1.1

## 📋 Spis treści
1. [Backend API Tests](#backend-api-tests)
2. [Frontend UI Tests](#frontend-ui-tests)
3. [Integration Tests](#integration-tests)
4. [Security Tests](#security-tests)
5. [Performance Tests](#performance-tests)
6. [Wyniki Testów](#wyniki-testów)

---

## 🔧 Backend API Tests

### 1. Authentication & Authorization

#### 1.1 POST /api/auth/register
**Test:** Rejestracja nowego użytkownika
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-user@sspo.com.pl",
    "password": "TestPassword123!",
    "name": "Test User"
  }'
```
**Oczekiwany wynik:** 
- Status: 201
- Response: `{ "message": "Użytkownik zarejestrowany", "userId": <id> }`

**Testy negatywne:**
- Krótkie hasło (< 8 znaków): `{ "error": "Hasło musi mieć min. 8 znaków" }`
- Duplikat email: `{ "error": "Email już istnieje" }`
- Brak wymaganych pól: `{ "error": "<pole> jest wymagane" }`

#### 1.2 POST /api/auth/login
**Test:** Logowanie użytkownika
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sspo.com.pl",
    "password": "ChangeMe123!"
  }'
```
**Oczekiwany wynik:**
- Status: 200
- Response: `{ "token": "<JWT>", "user": { "id": 1, "email": "...", "name": "...", "role": "admin" } }`

**Testy negatywne:**
- Błędne hasło: `{ "error": "Nieprawidłowe dane logowania" }`
- Nieistniejący email: `{ "error": "Nieprawidłowe dane logowania" }`

#### 1.3 GET /api/auth/me
**Test:** Pobranie aktualnego użytkownika
```bash
TOKEN="<JWT_TOKEN>"
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```
**Oczekiwany wynik:**
- Status: 200
- Response: `{ "id": 1, "email": "...", "name": "...", "role": "admin" }`

**Testy negatywne:**
- Brak tokenu: `{ "error": "Brak tokenu autoryzacji" }`
- Nieprawidłowy token: `{ "error": "Nieprawidłowy token" }`

---

### 2. User Management

#### 2.1 GET /api/users (Admin only)
**Test:** Lista wszystkich użytkowników
```bash
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```
**Oczekiwany wynik:**
- Status: 200
- Response: Array użytkowników z polami: id, email, name, role, created_at, last_login

**Testy negatywne:**
- Jako viewer/contributor: `{ "error": "Brak uprawnień" }`

#### 2.2 PATCH /api/users/:id/role (Admin only)
**Test:** Zmiana roli użytkownika
```bash
curl -X PATCH http://localhost:3000/api/users/2/role \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "role": "reviewer" }'
```
**Oczekiwany wynik:**
- Status: 200
- Response: `{ "message": "Rola zaktualizowana" }`

**Testy negatywne:**
- Nieprawidłowa rola: `{ "error": "Nieprawidłowa rola" }`
- Jako non-admin: `{ "error": "Brak uprawnień" }`

#### 2.3 PATCH /api/users/me/password
**Test:** Zmiana własnego hasła
```bash
curl -X PATCH http://localhost:3000/api/users/me/password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "OldPassword123!",
    "newPassword": "NewPassword456!"
  }'
```
**Oczekiwany wynik:**
- Status: 200
- Response: `{ "message": "Hasło zmienione pomyślnie" }`

**Testy negatywne:**
- Błędne aktualne hasło: `{ "error": "Nieprawidłowe aktualne hasło" }`
- Zbyt krótkie nowe hasło: `{ "error": "Hasło musi mieć min. 8 znaków" }`

#### 2.4 PATCH /api/users/:id/reset-password (Admin only)
**Test:** Reset hasła użytkownika
```bash
curl -X PATCH http://localhost:3000/api/users/2/reset-password \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "newPassword": "ResetPassword123!" }'
```
**Oczekiwany wynik:**
- Status: 200
- Response: `{ "message": "Hasło zresetowane pomyślnie" }`

---

### 3. Comments System

#### 3.1 GET /api/comments/:documentId
**Test:** Pobranie komentarzy do dokumentu
```bash
curl http://localhost:3000/api/comments/01-regulamin-sspo
```
**Oczekiwany wynik:**
- Status: 200
- Response: Array komentarzy z polami: id, document_id, paragraph_id, content, user_id, user_name, created_at, parent_id, replies

#### 3.2 POST /api/comments
**Test:** Dodanie nowego komentarza
```bash
curl -X POST http://localhost:3000/api/comments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "documentId": "01-regulamin-sspo",
    "paragraphId": "section-1",
    "content": "To jest testowy komentarz"
  }'
```
**Oczekiwany wynik:**
- Status: 201
- Response: `{ "message": "Komentarz dodany", "commentId": <id> }`

**Wymagane role:** contributor, reviewer, admin

#### 3.3 POST /api/comments/:id/reply
**Test:** Odpowiedź na komentarz
```bash
curl -X POST http://localhost:3000/api/comments/1/reply \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "content": "To jest odpowiedź na komentarz" }'
```
**Oczekiwany wynik:**
- Status: 201
- Response: `{ "message": "Odpowiedź dodana", "commentId": <id> }`

#### 3.4 PATCH /api/comments/:id
**Test:** Edycja komentarza (własnego)
```bash
curl -X PATCH http://localhost:3000/api/comments/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "content": "Zaktualizowana treść komentarza" }'
```
**Oczekiwany wynik:**
- Status: 200
- Response: `{ "message": "Komentarz zaktualizowany" }`

**Testy negatywne:**
- Edycja cudzego komentarza: `{ "error": "Brak uprawnień" }`

#### 3.5 DELETE /api/comments/:id
**Test:** Usunięcie komentarza
```bash
curl -X DELETE http://localhost:3000/api/comments/1 \
  -H "Authorization: Bearer $TOKEN"
```
**Oczekiwany wynik:**
- Status: 200
- Response: `{ "message": "Komentarz usunięty" }`

**Wymagania:** Tylko własne komentarze lub admin

---

### 4. Amendments (Poprawki)

#### 4.1 GET /api/amendments
**Test:** Lista wszystkich poprawek
```bash
curl http://localhost:3000/api/amendments?status=pending
```
**Oczekiwany wynik:**
- Status: 200
- Response: Array poprawek z polami: id, document_id, title, description, proposed_changes, status, created_by, created_at

**Filtry:**
- `?status=draft|pending|approved|rejected`
- `?userId=<id>`
- `?documentId=<id>`

#### 4.2 GET /api/amendments/:id
**Test:** Szczegóły pojedynczej poprawki
```bash
curl http://localhost:3000/api/amendments/1
```
**Oczekiwany wynik:**
- Status: 200
- Response: Pełne dane poprawki + votes (głosy)

#### 4.3 POST /api/amendments
**Test:** Utworzenie nowej poprawki
```bash
curl -X POST http://localhost:3000/api/amendments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "documentId": "01-regulamin-sspo",
    "title": "Poprawka paragraf 5",
    "description": "Zmiana treści paragrafu 5",
    "proposedChanges": "Nowa treść paragrafu...",
    "justification": "Uzasadnienie zmiany..."
  }'
```
**Oczekiwany wynik:**
- Status: 201
- Response: `{ "message": "Poprawka utworzona", "amendmentId": <id> }`

**Wymagane role:** contributor, reviewer, admin

#### 4.4 PATCH /api/amendments/:id
**Test:** Edycja poprawki (tylko draft)
```bash
curl -X PATCH http://localhost:3000/api/amendments/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Zaktualizowany tytuł",
    "description": "Zaktualizowany opis"
  }'
```
**Oczekiwany wynik:**
- Status: 200
- Response: `{ "message": "Poprawka zaktualizowana" }`

**Ograniczenia:**
- Tylko poprawki w statusie `draft`
- Tylko własne poprawki

#### 4.5 PATCH /api/amendments/:id/status
**Test:** Zmiana statusu poprawki (reviewer/admin)
```bash
curl -X PATCH http://localhost:3000/api/amendments/1/status \
  -H "Authorization: Bearer $REVIEWER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "status": "pending" }'
```
**Oczekiwany wynik:**
- Status: 200
- Response: `{ "message": "Status zaktualizowany" }`

**Możliwe statusy:**
- `draft` → `pending` (autor)
- `pending` → `approved` (reviewer/admin)
- `pending` → `rejected` (reviewer/admin)

#### 4.6 POST /api/amendments/:id/vote
**Test:** Głosowanie na poprawkę (reviewer/admin)
```bash
curl -X POST http://localhost:3000/api/amendments/1/vote \
  -H "Authorization: Bearer $REVIEWER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "vote": "for" }'
```
**Oczekiwany wynik:**
- Status: 201
- Response: `{ "message": "Głos zarejestrowany" }`

**Typy głosów:** `for`, `against`, `abstain`

---

### 5. Health & Status

#### 5.1 GET /health
**Test:** Health check
```bash
curl http://localhost:3000/health
```
**Oczekiwany wynik:**
- Status: 200
- Response: `{ "status": "healthy", "timestamp": "...", "uptime": 123.45 }`

---

## 🎨 Frontend UI Tests

### 1. Authentication UI

- [ ] **Login Form**
  - Wyświetla się poprawnie
  - Walidacja email (format)
  - Walidacja hasła (min. 8 znaków)
  - Pokazuje błędy z API
  - Przekierowuje po zalogowaniu
  - "Zapamiętaj mnie" działa

- [ ] **Register Form**
  - Wszystkie pola wymagane
  - Walidacja email
  - Walidacja hasła (min. 8 znaków)
  - Potwierdzenie hasła
  - Pokazuje błędy
  - Przekierowuje do logowania po rejestracji

### 2. Navigation & Layout

- [ ] **Toolbar**
  - Wyświetla się po zalogowaniu
  - Pokazuje nazwę użytkownika
  - Menu użytkownika działa (dropdown)
  - Przyciski nawigacji działają
  - Responsywny design (mobile)

- [ ] **Sidebar**
  - Lista dokumentów
  - Wyszukiwarka widoczna
  - Nawigacja działa
  - Aktywny dokument podświetlony

- [ ] **User Menu Dropdown**
  - 👤 Moje konto
  - 🔑 Zmień hasło
  - ⚙️ Panel administratora (tylko admin)
  - 📊 Moja aktywność
  - ℹ️ O systemie
  - 🚪 Wyloguj

### 3. Comments System UI

- [ ] **Comment Display**
  - Komentarze wyświetlają się przy paragrafach
  - Ikona 💬 pokazuje liczbę komentarzy
  - Komentarze są sortowane (najnowsze na górze)
  - Odpowiedzi są wcięte
  - Data i autor widoczne

- [ ] **Add Comment**
  - Formularz dodawania działa
  - Textarea rozszerza się
  - Przycisk "Dodaj komentarz" aktywny
  - Anulowanie działa
  - Komentarz pojawia się natychmiast

- [ ] **Reply to Comment**
  - Przycisk "Odpowiedz" działa
  - Formularz odpowiedzi wyświetla się
  - Odpowiedź jest wcięta
  - Threading działa (max 3 poziomy?)

- [ ] **Edit Comment**
  - Przycisk "Edytuj" tylko dla własnych
  - Textarea z aktualną treścią
  - Zapisanie aktualizuje komentarz
  - Anulowanie przywraca oryginalny

- [ ] **Delete Comment**
  - Przycisk "Usuń" tylko dla własnych/admin
  - Potwierdzenie usunięcia
  - Komentarz znika z widoku

### 4. Amendments System UI

- [ ] **Amendments List**
  - Lista poprawek wyświetla się
  - Filtry działają (status, dokument)
  - Kliknięcie otwiera szczegóły
  - Status kolorowo oznaczony

- [ ] **Create Amendment**
  - Formularz tworzenia działa
  - Wszystkie pola wymagane
  - Markdown preview (opcjonalnie)
  - Zapisanie jako draft
  - Submit do recenzji

- [ ] **Amendment Details**
  - Wyświetla tytuł, opis, zmiany
  - Pokazuje autora i datę
  - Głosy wyświetlone (for/against/abstain)
  - Przyciski akcji widoczne (według roli)

- [ ] **Voting**
  - Przyciski głosowania (reviewer/admin)
  - ✅ Za, ❌ Przeciw, ⚖️ Wstrzymuję się
  - Głos zapisuje się
  - Aktualizacja liczników

- [ ] **Review Actions** (reviewer/admin)
  - ✅ Akceptuj
  - ❌ Odrzuć
  - 📝 Zażądaj zmian
  - Zmiana statusu działa

### 5. Admin Panel UI

- [ ] **User Management Tab**
  - Tabela użytkowników wyświetla się
  - Wszystkie kolumny widoczne
  - Dropdown zmiany roli działa
  - Przycisk 💾 zapisuje rolę
  - Przycisk 🔑 otwiera reset hasła

- [ ] **Password Reset Modal**
  - Modal wyświetla się
  - Email użytkownika pokazany
  - Auto-generated hasło
  - Edycja hasła działa
  - Resetowanie zapisuje
  - Nowe hasło wyświetla się adminowi

- [ ] **Statistics Tab**
  - Karty statystyk wyświetlają się
  - Liczby poprawne
  - Gradientowe tło
  - Ostrzeżenie o domyślnych danych

### 6. Password Management UI

- [ ] **Change Password Modal**
  - Otwiera się z menu użytkownika
  - 3 pola: aktualne, nowe, potwierdzenie
  - Walidacja: min 8 znaków
  - Walidacja: nowe === potwierdzenie
  - Pokazuje błędy z API
  - Success notification
  - Zamyka się po sukcesie

### 7. Search UI

- [ ] **Search Input**
  - Widoczna w sidebar
  - Placeholder "🔍 Szukaj w dokumentach..."
  - Responsive width
  - Focus state działa

- [ ] **Search Results**
  - Wyniki wyświetlają się
  - Podświetlone słowa kluczowe
  - Kliknięcie przenosi do dokumentu
  - "Brak wyników" gdy pusto

---

## 🔗 Integration Tests

### 1. Login → Comments Flow
1. Zaloguj jako contributor
2. Otwórz dokument
3. Dodaj komentarz
4. Sprawdź czy pojawił się
5. Odśwież stronę → komentarz nadal widoczny

### 2. Amendment Creation → Review → Approval
1. Zaloguj jako contributor
2. Utwórz poprawkę (draft)
3. Submit do recenzji (pending)
4. Wyloguj, zaloguj jako reviewer
5. Zagłosuj na poprawkę
6. Zaakceptuj poprawkę
7. Sprawdź czy status = approved

### 3. Admin User Management
1. Zaloguj jako admin
2. Otwórz panel administratora
3. Zmień rolę użytkownika
4. Zresetuj hasło użytkownika
5. Wyloguj jako admin
6. Zaloguj jako użytkownik z nowym hasłem

### 4. Search → Navigation
1. Otwórz stronę
2. Wpisz frazę w wyszukiwarkę
3. Kliknij wynik
4. Sprawdź czy przenosi do dokumentu
5. Sprawdź czy scroll do sekcji działa

---

## 🔒 Security Tests

### 1. Authorization Tests
- [ ] Viewer nie może dodawać komentarzy
- [ ] Contributor nie może zmieniać ról
- [ ] Reviewer nie może resetować haseł
- [ ] Admin ma dostęp do wszystkiego

### 2. Token Tests
- [ ] Expired token → 401
- [ ] Invalid token → 401
- [ ] Missing token (protected route) → 401
- [ ] Token refresh działa (jeśli zaimplementowane)

### 3. SQL Injection Tests
- [ ] Komentarz z `'; DROP TABLE users; --`
- [ ] Email z SQL injection attempt
- [ ] Search query z SQL

### 4. XSS Tests
- [ ] Komentarz z `<script>alert('XSS')</script>`
- [ ] Nazwa użytkownika z HTML tags
- [ ] Amendment content z JavaScript

---

## ⚡ Performance Tests

### 1. Backend Performance
- [ ] Health check < 50ms
- [ ] Login < 500ms
- [ ] Get comments < 200ms
- [ ] Create comment < 300ms
- [ ] Admin users list < 500ms

### 2. Frontend Performance
- [ ] Initial load < 3s
- [ ] Docsify render < 1s
- [ ] Comment load < 500ms
- [ ] Search results < 500ms

### 3. Database Performance
- [ ] Query execution < 100ms
- [ ] Database size < 100MB (monitoring)
- [ ] Indexes poprawne

---

## 📊 Wyniki Testów

### ✅ PASSED (Do wypełnienia po testach)
- [ ] Backend API - wszystkie endpointy
- [ ] Frontend UI - wszystkie komponenty
- [ ] Integration - flow end-to-end
- [ ] Security - authorization & validation
- [ ] Performance - response times

### ❌ FAILED (Problemy do naprawy)
- Lista problemów...

### ⚠️ WARNINGS (Do uwagi)
- Lista ostrzeżeń...

---

## 🚀 Automated Test Script

```bash
#!/bin/bash
# test-all.sh - Automated testing script

echo "🧪 Starting SSPO System Tests..."

# Backend Health
echo "1. Testing Backend Health..."
curl -f http://localhost:3000/health || echo "❌ Backend not responding"

# Login Test
echo "2. Testing Login..."
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sspo.com.pl","password":"ChangeMe123!"}' \
  | jq -r '.token')

if [ "$TOKEN" != "null" ]; then
  echo "✅ Login successful"
else
  echo "❌ Login failed"
fi

# Get Users (Admin)
echo "3. Testing Get Users (Admin)..."
curl -s http://localhost:3000/api/users \
  -H "Authorization: Bearer $TOKEN" | jq '.[] | .email'

# More tests...

echo "🎉 Tests completed!"
```

---

**Ostatnia aktualizacja:** 2025-10-04  
**Autor:** lkolo-prez
