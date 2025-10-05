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


## [2.2.0] - 2025-10-05

### 📜 Prawo i procedury
- 01-regulamin-sspo: dodano §11a ust. 7 (wakat Marszałka), §18a ust. 4 (kworum/większość KRW), §37b ust. 7–8 (retencja i zakaz retroakcji), §40b (wybory personalne: druga tura/dogrywka/losowanie). Uporządkowano kolejność §40a–§40b.
- 02-ordynacja-wyborcza: doprecyzowano tie-break i dodano odesłanie do §40b dla wyborów personalnych.
- 20-przewodnik-wdrozeniowy: ujednolicono nazewnictwo (Marszałek/Wicemarszałek/Sekretarz) i odesłania do Rejestru (§37b).
 - 01-regulamin-sspo: doprecyzowano brak zdolności do działania KRW (tymczasowa komisja), standardy testów e‑głosowań i logów (§37a ust. 8–10), SLA dla errat (§37b ust. 9) oraz raportowanie Rzecznika (termin, zakres, publikacja).
 - 05-regulamin-wrs: publikacja w Rejestrze (§37b) i wyraźna nadrzędność aktów centralnych + odesłanie do §45a.
 - 04-regulamin-finansowy: ujednolicono publikację (Rejestr §37b), doprecyzowano protokół inwentaryzacyjny (zakres minimalny) i obowiązek publikacji w 14 dni.
 - 01-regulamin-sspo: usunięto pozostałość o BIP – teraz publikacja sprawozdań finansowych wyłącznie w Rejestrze (§37b).
 - Dodano załącznik: 23-kodeks-publikacyjny.md – operacyjna checklista publikacyjna dla wszystkich organów.

### ✅ Spójność i transparentność
- Wzmocniono przejrzystość: obowiązkowa publikacja w Rejestrze, retencja materiałów i jasne reguły rozstrzygania remisów w wyborach personalnych.



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
