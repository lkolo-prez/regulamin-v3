# 🏛️ SSPO Regulamin v3 - Zaawansowany System Kolaboracyjny

[![Wersja](https://img.shields.io/badge/wersja-3.0.0-blue.svg)](https://github.com/lkolo-prez/regulamin-v3)
[![Status](https://img.shields.io/badge/status-Production%20Ready-green.svg)]()
[![Licencja](https://img.shields.io/badge/licencja-Open%20Source%20%2F%20Commercial-blue.svg)]()

## 🚀 **AIRCLOUD COLLABORATION PLATFORM v3.0**

### ✨ **NAJNOWSZE FUNKCJE:**

- 🤝 **Real-time Collaborative Editing** - Współdzielona edycja dokumentów w czasie rzeczywistym
- 📄 **Smart Document Templates** - System inteligentnych szablonów dla regulaminów, uchwał i pism
- 🔄 **Advanced Workflow Engine** - Kompleksowy system zatwierdzania dokumentów
- 💬 **Context-aware Comments** - Komentarze kontekstowe z zaznaczeniami
- 🔗 **Document Relationships** - System powiązań między dokumentami
- 🔔 **Smart Notifications** - Inteligentny system powiadomień
- 📊 **Live Analytics** - Analityka w czasie rzeczywistym
- � **Multi-user Presence** - Śledzenie aktywnych użytkowników

---

## 🎯 **DLA KOGO JEST TEN SYSTEM?**

### 👨‍🎓 **Studenci SSPO:**
- Łatwe tworzenie dokumentów z gotowych szablonów
- Współpraca nad regulaminami w czasie rzeczywistym
- Komentowanie i sugerowanie zmian
- Śledzenie statusu dokumentów

### ⚖️ **Zarząd i Komisje:**
- Zaawansowany workflow zatwierdzania
- Pełna kontrola wersji dokumentów
- System powiązań między regulaminami
- Export do PDF/DOCX

### 👨‍💼 **Administratorzy:**
- Zarządzanie uprawnieniami
- Monitoring aktywności
- Analityka użytkowania
- Automatyczne backupy

---

## 🏛️ Przegląd Projektu

Ten projekt zawiera kompleksowy system zarządzania dokumentami prawnymi składający się z:

### 1. 📋 System Regulaminów SSPO
Statyczny system regulaminów i procedur Studenckiego Samorządu Politechniki Opolskiej

### 2. 🚀 Aircloud Legal Platform
Nowoczesna platforma współpracy nad dokumentami prawnymi z funkcjami:
- ✏️ Edycja dokumentów Markdown w czasie rzeczywistym
- 💬 Zaawansowany system komentowania
- 🔄 Kontrola wersji z wizualizacją zmian
- 📄 Export do PDF/DOCX
- 👥 Zarządzanie użytkownikami i uprawnieniami
- 📊 Analityka i raporty

### 3. 🤝 Aircloud Collaboration Features (NOWOŚĆ v3.0)
Zaawansowane funkcjonalności kolaboracyjne:
- 🌐 **Real-time collaborative editing** z WebSocket
- 📑 **7 kategorii szablonów** dokumentów (regulaminy, uchwały, formularze, pisma...)
- 🔁 **Workflow management** z wielopoziomowym zatwierdzaniem
- � **Contextual comments** z zaznaczeniami tekstu
- 🔗 **Document relationships** (references, amends, replaces...)
- 🔔 **Smart notifications** system
- 👥 **Live user presence** tracking

---

## 📁 Struktura Projektu

```
regulamin-v3/
├── 📂 aircloud-platform/          # Główna aplikacja Aircloud Legal Platform
│   ├── 🐍 aircloud_legal_platform.py           # Główna aplikacja Flask
│   ├── 🚀 aircloud_advanced_features.py        # Zaawansowane funkcje
│   ├── 🔧 aircloud_extended_routes.py          # Dodatkowe endpointy
│   ├── 🤝 aircloud_collaboration_engine.py     # ✨ NOWY: Silnik kolaboracji
│   ├── 🌐 aircloud_collaboration_routes.py     # ✨ NOWY: Routing kolaboracji
│   ├── 📋 requirements.txt                     # Dependencje Python
│   ├── 📂 templates/                           # Szablony HTML/Jinja2
│   │   ├── 📂 collaboration/                   # ✨ NOWY: Szablony kolaboracji
│   │   │   ├── editor.html                    # Edytor real-time
│   │   │   ├── templates.html                 # Galeria szablonów
│   │   │   ├── create_from_template.html      # Tworzenie z szablonu
│   │   │   ├── workflow.html                  # Workflow management
│   │   │   └── relationships.html             # Powiązania dokumentów
│   ├── 📂 static/                              # Pliki statyczne (CSS, JS)
│   ├── 📂 instance/                            # Dane aplikacji (SQLite DB)
│   ├── 📂 uploads/                             # Przesłane pliki
│   ├── 📂 docker/                              # Konfiguracja Docker
│   │   ├── 🐳 Dockerfile.flask                # Docker dla Flask app
│   │   └── 🐳 docker-compose.yml              # Docker Compose
│   └── 📂 tests/                               # Testy aplikacji
│       ├── 🧪 test_comprehensive.py           # Kompleksowe testy
│       ├── 💬 test_comment_system.py          # Testy systemu komentowania
│       ├── 🤝 test_collaboration.py           # ✨ NOWY: Testy kolaboracji
│       └── ⚡ quick_test.py                   # Szybkie testy
├── 📂 docs/                                    # Dokumentacja
│   └── 📂 regulaminy/                          # Wszystkie pliki regulaminów MD
├── 📂 legacy/                                  # Stare wersje i kod legacy
├── 📂 temp/                                    # Pliki tymczasowe
├── 📄 README.md                                # Ten plik
├── 📄 COLLABORATION_FEATURES.md                # ✨ NOWY: Dokumentacja kolaboracji
├── 🔧 setup_collaboration.bat                  # ✨ NOWY: Instalacja funkcji kolaboracji
└── 🚀 start_collaboration.bat                  # ✨ NOWY: Szybkie uruchomienie
```

---

## 🚀 Szybki Start - Aircloud Legal Platform

### 1. 📋 Wymagania
- Python 3.11+
- Flask i dependencje (patrz requirements.txt)
- Opcjonalnie: Docker i Docker Compose

### 2. ⚡ Uruchomienie Podstawowe (Lokalne)

```bash
cd aircloud-platform
pip install -r requirements.txt
python aircloud_legal_platform.py
```

Aplikacja dostępna na: **http://localhost:5001**

**Demo Login:**
- Użytkownik: `lukasz.kolodziej`
- Hasło: `aircloud2025`

### 3. 🤝 Uruchomienie z Funkcjami Kolaboracyjnymi (NOWOŚĆ v3.0)

#### Krok 1: Instalacja
```bash
# W głównym katalogu projektu (regulamin-v3)
setup_collaboration.bat
```

Ten skrypt:
- ✅ Sprawdzi instalację Python
- ✅ Utworzy środowisko wirtualne
- ✅ Zainstaluje wszystkie zależności (Flask-SocketIO, Eventlet, etc.)
- ✅ Zainicjalizuje bazę danych
- ✅ Zweryfikuje moduły kolaboracyjne

#### Krok 2: Uruchomienie
```bash
start_collaboration.bat
```

Lub ręcznie:
```bash
cd aircloud-platform
.venv\Scripts\activate
python aircloud_legal_platform.py
```

#### Krok 3: Dostęp do Funkcji Kolaboracyjnych
Po uruchomieniu dostępne są:
- 🌐 **Edytor współdzielony:** http://localhost:5001/collaboration/editor/<document_id>
- � **Galeria szablonów:** http://localhost:5001/collaboration/templates
- 🔄 **Workflow:** http://localhost:5001/collaboration/workflow/<document_id>
- 🔗 **Powiązania:** http://localhost:5001/collaboration/relationships/<document_id>

### 4. 🐳 Uruchomienie (Docker)

```bash
cd aircloud-platform/docker
docker-compose up -d
```

### 5. 🧪 Uruchomienie Testów

```bash
cd aircloud-platform

# Testy podstawowe
python tests/test_comprehensive.py

# Testy systemu komentowania  
python tests/test_comment_system.py

# ✨ NOWY: Testy funkcji kolaboracyjnych
python tests/test_collaboration.py
```

---

## 🔧 Główne Funkcjonalności

### 📝 System Zarządzania Dokumentami
- ✅ Tworzenie i edycja dokumentów Markdown
- ✅ Podgląd na żywo z renderowaniem
- ✅ Hierarchiczna organizacja (systemy prawne)
- ✅ Wyszukiwanie pełnotekstowe

### 🤝 Kolaboracja Real-time (NOWOŚĆ v3.0)
- ✅ **Współdzielona edycja** - wielu użytkowników edytuje dokument jednocześnie
- ✅ **Live cursor tracking** - widzisz kursory innych użytkowników
- ✅ **Auto-save** - automatyczny zapis co 3 sekundy
- ✅ **Presence indicators** - lista aktywnych użytkowników
- ✅ **Paragraph locking** - blokowanie akapitów podczas edycji

### � System Szablonów (NOWOŚĆ v3.0)
- ✅ **7 kategorii szablonów:**
  - 📜 Regulaminy (2 szablony)
  - ⚖️ Uchwały (2 szablony)
  - 📋 Formularze (2 szablony)
  - ✉️ Pisma oficjalne (2 szablony)
  - 📊 Raporty
  - 🔧 Procedury
  - 📣 Ogłoszenia
- ✅ **Smart forms** - inteligentne formularze z walidacją
- ✅ **Template preview** - podgląd przed utworzeniem

### 💬 System Komentowania
- ✅ Komentarze do konkretnych paragrafów
- ✅ **Contextual comments** (NOWOŚĆ) - komentarze z zaznaczeniem tekstu
- ✅ Threading i odpowiedzi
- ✅ **Comment types** - sugestie, pytania, zgłoszenia problemów
- ✅ **Resolve comments** - oznaczanie jako rozwiązane

### � Workflow i Zatwierdzanie (NOWOŚĆ v3.0)
- ✅ **Multi-stage approval** - wielopoziomowe zatwierdzanie
- ✅ **7 stanów dokumentu:**
  - 📝 Draft (Projekt)
  - 👀 Review (W recenzji)
  - 💬 Consultation (Konsultacje)
  - ⏳ Approval (Oczekuje na zatwierdzenie)
  - ✅ Approved (Zatwierdzony)
  - ❌ Rejected (Odrzucony)
  - 📦 Archived (Zarchiwizowany)
- ✅ **Role-based permissions** - uprawnienia według ról
- ✅ **Action history** - pełna historia akcji workflow

### 🔗 Powiązania Dokumentów (NOWOŚĆ v3.0)
- ✅ **5 typów relacji:**
  - 📖 References (Powołuje się na)
  - ✏️ Amends (Zmienia)
  - 🔄 Replaces (Zastępuje)
  - 🎯 Implements (Implementuje)
  - 🔗 Related (Powiązany z)
- ✅ **Bidirectional relationships** - powiązania dwukierunkowe
- ✅ **Relationship graph** - wizualizacja powiązań

### � System Notyfikacji (NOWOŚĆ v3.0)
- ✅ **6 typów powiadomień:**
  - 💬 Nowy komentarz
  - @️⃣ Wzmianka o Tobie
  - 🔄 Zmiana statusu dokumentu
  - ✅ Prośba o zatwierdzenie
  - ⏰ Zbliżający się termin
  - 📄 Nowa wersja dokumentu
- ✅ **Priority levels** - poziomy ważności (low, normal, high, urgent)
- ✅ **Real-time delivery** - dostarczanie w czasie rzeczywistym

- ✅ Historia i auditowanie- **Real-time NLP Processing**: Analiza tekstu w czasie rzeczywistym

- **Conflict Detection Engine**: Automatyczne wykrywanie sprzeczności

### 🔄 Kontrola Wersji- **Precedent Matching**: AI-powered wyszukiwanie podobnych przypadków

- ✅ Automatyczne snapshoty zmian- **Interactive Dashboard**: Live metrics i wizualne rezultaty analizy

- ✅ Diff visualization

- ✅ Przywracanie poprzednich wersji## 🎯 **JAK KORZYSTAĆ Z AI SYSTEMU**

- ✅ Historia zmian z autorami

### 1. **📊 Dashboard AI** 

### 📤 Export i IntegracjeOtwórz `http://localhost/` aby zobaczyć interaktywny dashboard z:

- ✅ Export PDF z profesjonalnym formatowaniem- Live system metrics i status AI engine

- ✅ Export DOCX kompatybilny z MS Word- Narzędzia do analizy tekstów prawnych

- ✅ REST API dla integracji zewnętrznych- Wizualne rezultaty analiz NLP

- ✅ Webhooks dla powiadomień- Wykrywanie konfliktów w czasie rzeczywistym



### 👥 Zarządzanie Użytkownikami### 2. **🧠 Analiza AI**

- ✅ System ról i uprawnieńWklej dowolny tekst prawny i użyj przycisków:

- ✅ Uwierzytelnianie sesyjne- **"Analizuj AI"** - Pełna analiza NLP

- ✅ Audit log wszystkich operacji- **"Sprawdź Konflikty"** - Wykrywanie niespójności  

- ✅ Zarządzanie projektami/zespołami- **"Znajdź Precedensy"** - Matching podobnych przypadków

- **"Rekomendacje"** - AI sugestie ulepszeń

## 📊 Status Rozwoju

### 3. **📈 Live Analytics**

| Funkcjonalność | Status | Uwagi |System pokazuje w czasie rzeczywistym:

|---|---|---|- Ilość przetworzonych dokumentów

| 🏗️ Podstawowa architektura | ✅ Gotowe | Flask + SQLAlchemy |- Wykryte konflikty prawne

| 👤 System użytkowników | ✅ Gotowe | Login, role, uprawnienia |- Performance metrics AI engine

| 📝 Edycja dokumentów | ✅ Gotowe | Markdown + live preview |- Statystyki użytkowania systemu

| 💬 System komentowania | 🟡 W trakcie | API gotowe, UI wymaga testów |

| 🔄 Kontrola wersji | ✅ Gotowe | Snapshoty i diff |## 🛠️ **ROZBUDOWA SYSTEMU**

| 📤 Export PDF/DOCX | ✅ Gotowe | ReportLab + python-docx |

| 🚀 Real-time współpraca | 🟡 Planowane | WebSockets |System jest w pełni modułowy i gotowy do rozbudowy o nowe funkcje AI:

| 📱 Mobile UI | ⏳ Planowane | Responsive design |

- **🔍 Advanced Search Engine** - Semantyczne wyszukiwanie w dokumentach

## 🧪 Ostatnie Testy (28.09.2025)- **📝 Auto-generation** - AI generowanie projektów dokumentów

- **🤝 Collaboration Tools** - Wieloużytkownikowa praca nad dokumentami  

**Status:** ✅ **WSZYSTKIE KLUCZOWE FUNKCJE DZIAŁAJĄ**- **📊 Advanced Analytics** - Głębsze analizy trendów prawnych

- **🌍 Multi-language Support** - Rozszerzenie na inne języki

- ✅ Platforma uruchamia się poprawnie

- ✅ System logowania działa## Kluczowe Technologie

- ✅ Baza danych inicjalizuje się automatycznie- **Markdown:** Język znaczników użyty do napisania wszystkich dokumentów.

- ✅ Rozszerzone funkcje są aktywne- **Docsify:** Generator stron z dokumentacją, który dynamicznie renderuje pliki Markdown w estetyczną i funkcjonalną stronę internetową.

- ✅ Templates renderują się bez błędów- **Mermaid.js:** Biblioteka do tworzenia diagramów i schematów blokowych z tekstu, zintegrowana z Docsify.

- ✅ Export PDF/DOCX funkcjonalny

- ⚠️ System komentowania wymaga dalszych testów---

- ⚠️ Docker setup wymaga poprawek uprawnień DB*Projekt zrealizowany w ramach reformy systemowej Samorządu Studenckiego Politechniki Opolskiej 2025.*

## 🤝 Jak Kontrybuować

1. Fork tego repo
2. Utwórz branch dla swojej funkcjonalności (`git checkout -b feature/AmazingFeature`)
3. Commit zmiany (`git commit -m 'Add some AmazingFeature'`)
4. Push do branch (`git push origin feature/AmazingFeature`)
5. Otwórz Pull Request

## 📄 Licencja

**Aircloud Legal Platform:**
- 🆓 **Open Source:** Bezpłatne dla użytku społecznego, edukacyjnego, non-profit
- 💼 **Komercyjne:** 50 PLN + 23% VAT/miesiąc
- 📧 **Kontakt:** legal@aircloud.pl

**Regulaminy SSPO:** Publiczne

## 👨‍💻 Autor

**Łukasz Kołodziej** - *Aircloud Professional*
- 📧 Email: legal@aircloud.pl
- 🌐 Website: [aircloud.pl](https://aircloud.pl)

## 🎯 Przyszłe Plany

### v3.1.0 - Q4 2025
- 🚀 Real-time collaborative editing
- 📱 Mobile-first responsive UI
- 🔍 AI-powered legal analysis
- 🌐 Multi-language support

### v3.2.0 - Q1 2026
- ⚖️ Legal compliance checking
- 📊 Advanced analytics dashboard
- 🔗 Integration with legal databases
- 📋 Workflow automation

---

**⚡ Aktualizacja:** Przestrzeń robocza uporządkowana 28.09.2025 🧹✨