# 🚀 Plan Rozwoju Logicznego - System SSPO v3.0

## 📋 Spis treści
1. [Analiza obecnego stanu](#analiza-obecnego-stanu)
2. [Priorytetyzacja funkcjonalności](#priorytetyzacja-funkcjonalności)
3. [Roadmap](#roadmap)
4. [Szczegółowe propozycje](#szczegółowe-propozycje)

---

## 📊 Analiza obecnego stanu (v2.1.1)

### ✅ Co mamy (FUNKCJONUJE)
- [x] Backend API z JWT auth + bcrypt
- [x] System komentarzy (CRUD)
- [x] System poprawek/amendments (podstawowy CRUD)
- [x] Panel administratora (zarządzanie użytkownikami)
- [x] Zmiana hasła (własne + reset przez admina)
- [x] Wyszukiwarka Docsify
- [x] CI/CD Docker webhook
- [x] Responsywny UI

### ⚠️ Co wymaga poprawy (Z testów)
- [ ] Test user setup (brak test@test.com w bazie)
- [ ] Walidacja `documentId` i `paragraphId` (obecnie zwraca "Invalid value")
- [ ] Performance monitoring (brak bc command)
- [ ] Endpoint `/api/auth/me` może czasem failować

### 🆕 Co brakuje (LOGICZNE ROZSZERZENIA)

#### 1. **Workflow i proces legislacyjny**
- [ ] Przepływ statusów poprawek: draft → submitted → in_review → approved/rejected
- [ ] Wymagania do zatwierdzenia (np. 2/3 głosów recenzentów)
- [ ] Historia zmian statusu
- [ ] Powiadomienia o zmianach statusu

#### 2. **Powiadomienia i alerty**
- [ ] Email notifications
- [ ] In-app notifications  
- [ ] Powiadomienia o nowych komentarzach
- [ ] Powiadomienia o zmianach w poprawkach
- [ ] Powiadomienia o wymaganych działaniach (głosowanie)

#### 3. **Integracja z GitHub**
- [x] Podstawowa integracja (PR creation) - do weryfikacji
- [ ] Synchronizacja statusu PR
- [ ] Automatyczne mergowanie zaakceptowanych poprawek
- [ ] Webhook z GitHub do backend
- [ ] Status checks w UI

#### 4. **Wersjonowanie dokumentów**
- [ ] Historia wersji każdego dokumentu
- [ ] Porównanie wersji (diff)
- [ ] Rollback do poprzedniej wersji
- [ ] Oznaczanie wersji (v1.0, v1.1, etc.)
- [ ] Changelog automatyczny

#### 5. **Zaawansowane zarządzanie użytkownikami**
- [ ] Grupy użytkowników (komisje, zespoły)
- [ ] Delegowanie uprawnień czasowych
- [ ] Profil użytkownika z avatarem
- [ ] Aktywność użytkownika (dashboard)
- [ ] Leaderboard (gamifikacja?)

#### 6. **Analityka i raporty**
- [ ] Dashboard z statystykami
- [ ] Eksport raportów (PDF, CSV)
- [ ] Wykres aktywności w czasie
- [ ] Top contributors
- [ ] Czas przetwarzania poprawek

#### 7. **Ulepszona wyszukiwarka**
- [ ] Full-text search w komentarzach
- [ ] Filtrowanie po autorze, dacie
- [ ] Zaawansowane filtry (status, typ dokumentu)
- [ ] Zapisane wyszukiwania
- [ ] Search history

#### 8. **Bezpieczeństwo i audyt**
- [ ] Audit log (wszystkie akcje)
- [ ] IP tracking
- [ ] 2FA (Two-Factor Authentication)
- [ ] Session management (active sessions)
- [ ] Wymuszona zmiana hasła co X miesięcy
- [ ] Password history (nie można użyć ostatnich 5)

#### 9. **API i integracje**
- [ ] REST API documentation (Swagger/OpenAPI)
- [ ] Webhooks dla zewnętrznych systemów
- [ ] OAuth2 login (Google, GitHub)
- [ ] Export/Import API
- [ ] Rate limiting configuration

#### 10. **UX Improvements**
- [ ] Dark mode
- [ ] Keyboard shortcuts
- [ ] Markdown editor z preview
- [ ] Drag & drop dla załączników
- [ ] Rich text editor (opcjonalnie)
- [ ] Mobile app (PWA)

---

## 🎯 Priorytetyzacja funkcjonalności

### 🔴 HIGH PRIORITY (Must have - v3.0)

#### 1. **Workflow legislacyjny** ⭐⭐⭐⭐⭐
**Dlaczego:** To fundament systemu prawnego. Bez tego system jest tylko "notesem z komentarzami".

**Zakres:**
- Przepływ stanów poprawek
- Wymagania do zatwierdzenia (quorum, większość)
- Role w procesie (proponent, recenzent, zatwierdzający)
- Deadline do głosowania
- Auto-reject po timeout

**Szacowany czas:** 2-3 dni
**Impact:** Bardzo wysoki - kluczowa funkcjonalność

#### 2. **Powiadomienia (podstawowe)** ⭐⭐⭐⭐
**Dlaczego:** Użytkownicy muszą wiedzieć o zmianach i wymaganych działaniach.

**Zakres:**
- In-app notifications (dzwonek w toolbar)
- Powiadomienia o:
  - Nowych komentarzach w moich poprawkach
  - Wymaganych głosach
  - Zaakceptowaniu/odrzuceniu mojej poprawki
- Oznaczanie jako przeczytane

**Szacowany czas:** 1-2 dni
**Impact:** Wysoki - znacznie poprawia UX

#### 3. **Historia wersji dokumentów** ⭐⭐⭐⭐
**Dlaczego:** Kluczowe dla systemu prawnego - trzeba móc wrócić do poprzednich wersji.

**Zakres:**
- Snapshot dokumentu przy każdej zmianie
- Lista wersji z datami i autorami
- Podgląd różnic (diff)
- Przywracanie poprzedniej wersji

**Szacowany czas:** 2 dni
**Impact:** Wysoki - wymóg prawny

#### 4. **Audit log** ⭐⭐⭐⭐
**Dlaczego:** Bezpieczeństwo i transparentność - każda akcja musi być zapisana.

**Zakres:**
- Tabela audit_log w bazie
- Logowanie wszystkich zmian:
  - Login/logout
  - Zmiany ról
  - Utworzenie/edycja/usunięcie komentarzy
  - Utworzenie/edycja poprawek
  - Głosowania
- UI do przeglądania logów (admin only)

**Szacowany czas:** 1 dzień
**Impact:** Wysoki - wymóg compliance

### 🟡 MEDIUM PRIORITY (Should have - v3.1)

#### 5. **GitHub integracja (pełna)** ⭐⭐⭐
**Zakres:**
- Webhook z GitHub (status PR)
- Auto-merge zaakceptowanych PR
- Synchronizacja statusu
- Linki do PR w UI

**Szacowany czas:** 2 dni

#### 6. **Email notifications** ⭐⭐⭐
**Zakres:**
- SMTP configuration
- Email templates
- Daily digest opcjonalnie
- Unsubscribe link

**Szacowany czas:** 1-2 dni

#### 7. **Dashboard analityczny** ⭐⭐⭐
**Zakres:**
- Wykresy aktywności
- Top contributors
- Średni czas przetwarzania
- Statystyki per dokument

**Szacowany czas:** 2 dni

#### 8. **Grupy użytkowników** ⭐⭐⭐
**Zakres:**
- Tabela groups
- Członkostwo w grupach
- Permissions per group
- Workflow per group (np. komisja etyki)

**Szacowany czas:** 2 dni

### 🟢 LOW PRIORITY (Nice to have - v3.2+)

#### 9. **2FA** ⭐⭐
**Szacowany czas:** 1 dzień

#### 10. **OAuth2 login** ⭐⭐
**Szacowany czas:** 2 dni

#### 11. **Dark mode** ⭐⭐
**Szacowany czas:** 1 dzień

#### 12. **Mobile PWA** ⭐⭐
**Szacowany czas:** 3-4 dni

#### 13. **Markdown editor zaawansowany** ⭐
**Szacowany czas:** 1 dzień

---

## 🗓️ Roadmap

### **Phase 1: Core Workflow** (v3.0) - 2 tygodnie
**Cel:** Działający proces legislacyjny

- Week 1:
  - [ ] Workflow engine dla poprawek
  - [ ] Wymagania do zatwierdzenia (quorum)
  - [ ] Historia statusów
  - [ ] Audit log podstawowy
  
- Week 2:
  - [ ] In-app notifications
  - [ ] Dashboard dla użytkownika (moje zadania)
  - [ ] Historia wersji dokumentów
  - [ ] Testing & bugfixes

**Deliverables:**
- Pełny przepływ poprawki od draft do accepted/rejected
- Powiadomienia o akcjach
- Transparentność (audit log)
- Wersjonowanie dokumentów

### **Phase 2: Integrations** (v3.1) - 1 tydzień
**Cel:** Integracje zewnętrzne

- [ ] GitHub webhook + auto-merge
- [ ] Email notifications (SMTP)
- [ ] API documentation (Swagger)
- [ ] Rate limiting

**Deliverables:**
- Auto-deployment zaakceptowanych zmian
- Email alerts
- Publiczne API docs

### **Phase 3: Advanced Features** (v3.2) - 2 tygodnie
**Cel:** Zaawansowane funkcjonalności

- [ ] Dashboard analityczny
- [ ] Grupy użytkowników
- [ ] Zaawansowana wyszukiwarka
- [ ] Export/Import

**Deliverables:**
- Analityka i raporty
- Zarządzanie grupami
- Ulepszona wyszukiwarka

### **Phase 4: Security & UX** (v3.3) - 1 tydzień
**Cel:** Bezpieczeństwo i user experience

- [ ] 2FA
- [ ] OAuth2
- [ ] Dark mode
- [ ] Mobile optimization

**Deliverables:**
- Zwiększone bezpieczeństwo
- Lepszy UX

---

## 📝 Szczegółowe propozycje

### 1. Workflow Engine - Szczegóły implementacji

#### Database Schema
```sql
-- Nowa tabela: amendment_status_history
CREATE TABLE amendment_status_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amendment_id INTEGER NOT NULL,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by INTEGER NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comment TEXT,
    FOREIGN KEY (amendment_id) REFERENCES amendments(id),
    FOREIGN KEY (changed_by) REFERENCES users(id)
);

-- Rozszerzenie tabeli amendments
ALTER TABLE amendments ADD COLUMN workflow_state TEXT DEFAULT 'draft';
ALTER TABLE amendments ADD COLUMN quorum_required INTEGER DEFAULT 2;
ALTER TABLE amendments ADD COLUMN deadline TIMESTAMP;
ALTER TABLE amendments ADD COLUMN auto_reject_at TIMESTAMP;

-- Workflow states: 
-- draft -> submitted -> in_review -> approved / rejected / needs_changes
```

#### API Endpoints
```javascript
// Nowe endpointy
POST   /api/amendments/:id/submit          // draft -> submitted
POST   /api/amendments/:id/start-review    // submitted -> in_review (admin/reviewer)
POST   /api/amendments/:id/approve         // in_review -> approved (quorum reached)
POST   /api/amendments/:id/reject          // in_review -> rejected
POST   /api/amendments/:id/request-changes // in_review -> needs_changes
GET    /api/amendments/:id/history         // Historia statusów
GET    /api/amendments/pending-review      // Poprawki czekające na mój głos
```

#### Frontend UI
```
Nowy komponent: WorkflowTimeline
- Wizualizacja statusu poprawki (timeline)
- Ikony: 📝 Draft, 📤 Submitted, 🔍 In Review, ✅ Approved, ❌ Rejected
- Tooltips z datami i autorami zmian
- Progress bar (ile głosów / quorum)
```

### 2. Notifications System - Szczegóły

#### Database Schema
```sql
CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL, -- comment, vote_required, status_change, mention
    title TEXT NOT NULL,
    message TEXT,
    link TEXT, -- Link do zasobu (amendment, comment)
    is_read BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_notifications_user_unread 
ON notifications(user_id, is_read);
```

#### API Endpoints
```javascript
GET    /api/notifications              // Moje powiadomienia
GET    /api/notifications/unread/count // Liczba nieprzeczytanych
PATCH  /api/notifications/:id/read     // Oznacz jako przeczytane
PATCH  /api/notifications/read-all     // Oznacz wszystkie
DELETE /api/notifications/:id          // Usuń powiadomienie
```

#### Frontend UI
```
Nowy komponent: NotificationBell
- Ikona dzwonka w toolbar
- Badge z liczbą nieprzeczytanych
- Dropdown z ostatnimi 10 powiadomieniami
- "Zobacz wszystkie" -> pełna strona
- Auto-refresh co 30s (polling lub WebSocket)
```

#### Notification Types
```javascript
// Types of notifications
const NOTIFICATION_TYPES = {
    COMMENT_NEW: 'Nowy komentarz w Twojej poprawce',
    COMMENT_REPLY: 'Odpowiedź na Twój komentarz',
    AMENDMENT_STATUS: 'Status Twojej poprawki się zmienił',
    VOTE_REQUIRED: 'Wymagane głosowanie',
    MENTION: 'Ktoś Cię wspomniał',
    ROLE_CHANGED: 'Twoja rola została zmieniona'
};
```

### 3. Document Versioning - Szczegóły

#### Database Schema
```sql
CREATE TABLE document_versions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    document_id TEXT NOT NULL, -- '01-regulamin-sspo'
    version_number INTEGER NOT NULL,
    content TEXT NOT NULL, -- Full content snapshot
    changes_summary TEXT,
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    amendment_id INTEGER, -- Która poprawka spowodowała zmianę
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (amendment_id) REFERENCES amendments(id),
    UNIQUE(document_id, version_number)
);
```

#### API Endpoints
```javascript
GET    /api/documents/:id/versions         // Lista wersji
GET    /api/documents/:id/versions/:ver    // Konkretna wersja
GET    /api/documents/:id/diff/:v1/:v2     // Diff między wersjami
POST   /api/documents/:id/rollback/:ver    // Przywróć wersję (admin)
```

#### Frontend UI
```
Nowy przycisk: "📜 Historia wersji"
- Timeline z wersjami
- Kliknięcie → podgląd wersji
- Przycisk "Porównaj z aktualną"
- Diff viewer (removed lines red, added green)
- Przycisk "Przywróć tę wersję" (admin only)
```

### 4. Audit Log - Szczegóły

#### Database Schema
```sql
CREATE TABLE audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT NOT NULL, -- login, logout, create, update, delete, vote, etc.
    resource_type TEXT NOT NULL, -- user, comment, amendment, document
    resource_id INTEGER,
    old_value TEXT, -- JSON z starymi wartościami
    new_value TEXT, -- JSON z nowymi wartościami
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_action ON audit_log(action);
CREATE INDEX idx_audit_resource ON audit_log(resource_type, resource_id);
```

#### Funkcja pomocnicza
```javascript
// server.js
async function logAudit(userId, action, resourceType, resourceId, oldValue, newValue, req) {
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');
    
    db.run(
        `INSERT INTO audit_log 
        (user_id, action, resource_type, resource_id, old_value, new_value, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, action, resourceType, resourceId, 
         JSON.stringify(oldValue), JSON.stringify(newValue), ip, userAgent]
    );
}

// Użycie w endpointach
app.patch('/api/users/:id/role', async (req, res) => {
    const oldRole = await getUserRole(req.params.id);
    const newRole = req.body.role;
    
    // Update role...
    
    await logAudit(req.user.id, 'update_role', 'user', req.params.id, 
                   { role: oldRole }, { role: newRole }, req);
});
```

#### API Endpoints
```javascript
GET /api/audit                          // Lista logów (admin only)
GET /api/audit?userId=:id               // Logi użytkownika
GET /api/audit?resourceType=:type       // Logi typu zasobu
GET /api/audit?action=:action           // Logi akcji
GET /api/audit/export                   // Export CSV
```

#### Frontend UI
```
Panel admin → Nowa zakładka "📋 Audit Log"
- Tabela z kolumnami: Data, Użytkownik, Akcja, Zasób, Szczegóły, IP
- Filtry: data, użytkownik, akcja, typ zasobu
- Paginacja
- Export do CSV
- Kliknięcie w wiersz → szczegóły (old/new values)
```

---

## 🎨 Mockupy UI (Propozycje)

### Workflow Timeline
```
┌────────────────────────────────────────────────────────────┐
│  📝 Poprawka: "Zmiana § 5 Regulaminu SSPO"                │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ●───────●───────●───────○───────○                        │
│  📝      📤      🔍      ✅      🎉                         │
│  Draft  Submit Review Approve Merged                       │
│  21.10  22.10   23.10    ?        ?                        │
│                                                            │
│  Status: 🔍 In Review                                      │
│  Głosy: 2/3 (quorum: 3)                                   │
│  Deadline: 25.10.2025 18:00                               │
│                                                            │
│  ✅ Jan Kowalski (23.10 14:30) - Za                       │
│  ✅ Anna Nowak (23.10 15:45) - Za                         │
│  ⏳ Piotr Wiśniewski - Oczekuje na głos                   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Notifications Dropdown
```
┌────────────────────────────────────┐
│  🔔 Powiadomienia (3)             │
├────────────────────────────────────┤
│  • 🔍 Wymagany głos                │
│    Poprawka "§5" czeka na głos     │
│    2 godziny temu                  │
├────────────────────────────────────┤
│  • 💬 Nowy komentarz               │
│    Jan: "Zgadzam się z..."         │
│    5 godzin temu                   │
├────────────────────────────────────┤
│  • ✅ Poprawka zaakceptowana       │
│    Twoja poprawka "§3" została... │
│    wczoraj                         │
├────────────────────────────────────┤
│  📋 Zobacz wszystkie               │
└────────────────────────────────────┘
```

---

## ✅ Checklist Implementacji

### Phase 1: Core Workflow (v3.0)
- [ ] **Workflow Engine**
  - [ ] Database schema updates
  - [ ] State machine logic
  - [ ] Transition rules (draft->submitted etc.)
  - [ ] Quorum calculation
  - [ ] Deadline handling
  - [ ] API endpoints
  - [ ] Frontend timeline component
  - [ ] Tests

- [ ] **Notifications**
  - [ ] Database schema
  - [ ] Notification creation service
  - [ ] API endpoints
  - [ ] Frontend bell component
  - [ ] Polling mechanism
  - [ ] Tests

- [ ] **Document Versioning**
  - [ ] Database schema
  - [ ] Snapshot creation on amendment approval
  - [ ] API endpoints
  - [ ] Frontend history viewer
  - [ ] Diff algorithm
  - [ ] Tests

- [ ] **Audit Log**
  - [ ] Database schema
  - [ ] Logging helper function
  - [ ] Integration with all endpoints
  - [ ] API endpoints
  - [ ] Frontend admin panel
  - [ ] Tests

---

## 💡 Dodatkowe pomysły (brainstorming)

1. **AI Assistant** - ChatGPT integration do sugerowania poprawek
2. **Collaborative editing** - Real-time editing (WebSocket + CRDT)
3. **Calendar integration** - Kalendarz z deadlinami i spotkaniami
4. **Document templates** - Szablony dokumentów
5. **Tags/Labels** - Oznaczanie poprawek (bug, enhancement, etc.)
6. **Milestones** - Grupowanie poprawek w milestone'y
7. **Discussion threads** - Dedykowane wątki dyskusyjne per dokument
8. **Polls** - Szybkie ankiety (nie tylko głosowania za/przeciw)
9. **File attachments** - Załączniki do poprawek
10. **i18n** - Internacjonalizacja (polski/angielski)

---

**Ostatnia aktualizacja:** 2025-10-05  
**Autor:** lkolo-prez  
**Status:** DRAFT - Do dyskusji i priorytetyzacji
