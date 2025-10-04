# 📋 Changelog - System Prawny SSPO

Wszystkie istotne zmiany w projekcie są dokumentowane w tym pliku.

## [2.1.0] - 2025-10-04

### ♻️ Refaktoryzacja
- **CSS Fix**: Naprawiono konflikty z Docsify poprzez namespace wszystkich styli z prefiksem `sspo-*`
- **Repository Cleanup**: Usunięto niepotrzebne pliki legacy
  - ❌ `css/collaboration-enhanced.css` (zastąpiony przez `collaboration-fixed.css`)
  - ❌ `css/collaboration-styles.css` (stara wersja)
  - ❌ `js/collaboration-api.js` (zintegrowane w `collaboration-integrated.js`)
  - ❌ `js/collaboration-system.js` (localStorage, deprecated)
  - ❌ `README.old.md`, `desktop.ini`, `Caddyfile`, `data/`
- **Reorganizacja**: `old.md` → `100-stary-regulamin-sspo-2020.md`

### ✨ Usprawnienia
- CSS nie koliduje z Docsify (search, navigation, content)
- Body padding aktywowany tylko gdy toolbar istnieje (klasa `sspo-has-toolbar`)
- Toolbar używa `position: fixed` z z-index 999
- Wszystkie komponenty UI namespace'owane

### 🔒 Bezpieczeństwo
- Przepisano historię commitów na autora `lkolo-prez <kolodziej.lukasz.pl@gmail.com>`
- Usunięto wrażliwe pliki z historii git

---

## [2.0.0] - 2025-10-04

### 🚀 Nowe funkcje
- **Backend API**: Pełny Node.js/Express backend z SQLite
- **Autentykacja**: JWT tokens + bcrypt password hashing
- **Role-based Access Control**: 4 role (viewer, contributor, reviewer, admin)
- **System komentarzy**: Komentarze z autentykacją
- **System poprawek**: Zgłaszanie i głosowanie nad poprawkami
- **Admin Panel**: Zarządzanie użytkownikami i poprawkami

### 🗄️ Baza danych
- SQLite database z 6 tabelami
- Automatyczne backupy (cron daily 2:00 AM)
- Retencja backupów: 7 dni

### 🔐 Bezpieczeństwo
- JWT authentication (7-day expiry)
- bcrypt password hashing (10 salt rounds)
- Helmet middleware (security headers)
- Rate limiting (100 req/15min)
- CORS protection

### 🎨 Frontend
- Enhanced UI z modern CSS
- Responsive design
- Notifications system
- Modal system
- Loading states

### 🐳 DevOps
- Systemd service dla backend
- Nginx reverse proxy `/api/` → `localhost:3000`
- Docker containerization
- GitHub webhook auto-deployment
- CI/CD pipeline (7-9 seconds deployment)

---

## [1.0.0] - 2025-10-03

### 🎉 Initial Release
- Docsify-based documentation system
- 22 dokumentów prawnych SSPO
- Mermaid diagram support
- Search functionality
- Responsive design
- CI/CD deployment system

---

## Legenda

- 🚀 Nowe funkcje
- ✨ Usprawnienia
- 🐛 Poprawki błędów
- ♻️ Refaktoryzacja
- 🔒 Bezpieczeństwo
- 📚 Dokumentacja
- 🎨 UI/UX
- ⚡ Performance
- 🗄️ Database
- 🐳 DevOps
