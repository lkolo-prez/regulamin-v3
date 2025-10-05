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
- 01-regulamin-sspo: dodano §11a ust. 7 (wakat Marszałka), §18a ust. 4 (kworum/większość KRW), §40 ust. 7–8 (retencja i zakaz retroakcji), §45 (wybory personalne: druga tura/dogrywka/losowanie). Uporządkowano kolejność (dawne §40a–§40b scalone do kolejnych liczb całkowitych).
- 02-ordynacja-wyborcza: doprecyzowano tie-break i dodano odesłanie do §45 dla wyborów personalnych.
- 20-przewodnik-wdrozeniowy: ujednolicono nazewnictwo (Marszałek/Wicemarszałek/Sekretarz) i odesłania do Rejestru (§40).
 - 01-regulamin-sspo: doprecyzowano brak zdolności do działania KRW (tymczasowa komisja), standardy testów e‑głosowań i logów (§39 ust. 8–10), SLA dla errat (§40 ust. 9) oraz raportowanie Rzecznika (termin, zakres, publikacja).
 - 05-regulamin-wrs: publikacja w Rejestrze (§40) i wyraźna nadrzędność aktów centralnych + odesłanie do §51.
 - 04-regulamin-finansowy: ujednolicono publikację (Rejestr §40), doprecyzowano protokół inwentaryzacyjny (zakres minimalny) i obowiązek publikacji w 14 dni.
 - 01-regulamin-sspo: usunięto pozostałość o BIP – teraz publikacja sprawozdań finansowych wyłącznie w Rejestrze (§40).
 - Dodano załącznik: 23-kodeks-publikacyjny.md – operacyjna checklista publikacyjna dla wszystkich organów.
 - 06-regulamin-komisji-etyki: publikacja zanonimizowanych orzeczeń i raportu rocznego w Rejestrze (terminy, RODO), wejście w życie po publikacji.
 - 09-procedury-konsultacyjne: raport z konsultacji publikowany w Rejestrze (7 dni), wejście w życie po publikacji.
 - 03-kodeks-etyczny, 04-regulamin-finansowy, 05-regulamin-wrs, 01-regulamin-sspo: ujednolicone „Wejście w życie” – po publikacji w Rejestrze (§40) z zachowaniem vacatio legis.

### 📚 Dokumentacja
- 23-kodeks-publikacyjny: dodano tabelaryczny szablon metadanych do wpisów w Rejestrze (organ, identyfikator, daty, status, słowa kluczowe, anonimizacja, linki).
 - 21-procedury-wizualizacje: zaktualizowano „Proces Legislacyjny” i „Rejestr Uchwał” – teraz pokazują jawnie przepływ „Publikacja w Rejestrze → vacatio legis (7 dni) → wejście w życie”. Naprawiono link do finansów (M → § 8) i dodano stabilne kotwice HTML: `§-37b` (Regulamin SSPO), `§-3`, `§-6`, `§-8` (Regulamin Finansowy).
 - Globalnie: usunięto paragrafy z literami (np. 36a/37a/37b…) poprzez renumerację do kolejnych liczb całkowitych. Dodano kotwice zgodności wstecznej (legacy) w kluczowych miejscach, aby nie przerywać istniejących łączy.

### ✅ Spójność i transparentność
- Wzmocniono przejrzystość: obowiązkowa publikacja w Rejestrze, retencja materiałów i jasne reguły rozstrzygania remisów w wyborach personalnych.
 - Ujednolicone numerowanie: wszystkie listy literowe (a, b, c, …) w aktywnych dokumentach v3 zastąpiono listami liczbowymi (1, 2, 3, …), w tym wyliczenia inline. Plik archiwalny `100-stary-regulamin-sspo-2020.md` pozostawiono bez zmian.



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
