# 🏛️ Aircloud Legal Platform

**Professional Legal Document Collaboration System v2.0.0**

[![Status](https://img.shields.io/badge/status-Production%20Ready-brightgreen.svg)]()
[![Python](https://img.shields.io/badge/python-3.11%2B-blue.svg)]()
[![Flask](https://img.shields.io/badge/framework-Flask-orange.svg)]()
[![License](https://img.shields.io/badge/license-Open%20Source%20%2F%20Commercial-blue.svg)]()

## 🎯 Przegląd

Aircloud Legal Platform to nowoczesna aplikacja Flask do zarządzania dokumentami prawnymi z zaawansowanymi funkcjami współpracy, komentowania i kontroli wersji.

## 🚀 Funkcjonalności

### ✅ Core Features (Gotowe)
- 📝 **Zarządzanie dokumentami** - Tworzenie, edycja, organizacja
- 👤 **System użytkowników** - Rejestracja, logowanie, role
- 🏛️ **Systemy prawne** - Hierarchiczna organizacja dokumentów  
- 🔍 **Wyszukiwanie** - Pełnotekstowe wyszukiwanie dokumentów
- 📊 **Dashboard** - Przegląd aktywności i statystyk

### 🚀 Extended Features (Aktywne)
- 📤 **Export PDF/DOCX** - Profesjonalne eksportowanie dokumentów
- 📋 **Galeria szablonów** - Gotowe szablony prawne
- 📈 **Analityka** - Szczegółowe raporty i metryki
- 🔄 **Workflow** - Zarządzanie procesami zatwierdzania
- 💼 **Dashboard rozszerzony** - Zaawansowane widoki zarządzania

### 💬 Comment System (W testach)
- 💬 **Komentarze do paragrafów** - Kontekstowe komentowanie
- 🔄 **Real-time updates** - Aktualizacje na żywo
- 👥 **Threading** - Wątki komentarzy i odpowiedzi
- 🔔 **Powiadomienia** - Automatyczne powiadomienia

## 📋 Wymagania

- **Python:** 3.11+
- **Framework:** Flask 3.0+
- **Database:** SQLite (development) / PostgreSQL (production)
- **Dependencies:** Zobacz `requirements.txt`

## ⚡ Szybki Start

### 1. Instalacja dependencji
```bash
pip install -r requirements.txt
```

### 2. Uruchomienie aplikacji
```bash
python aircloud_legal_platform.py
```
**Aplikacja dostępna na:** http://localhost:5001

### 3. Demo Login
```
Username: lukasz.kolodziej
Password: aircloud2025
```

## 🐳 Docker

### Zbudowanie obrazu
```bash
cd docker/
docker-compose build
```

### Uruchomienie
```bash
docker-compose up -d
```

## 🧪 Testowanie

### Testy kompleksowe
```bash
cd tests/
python test_comprehensive.py
```

### Testy systemu komentowania
```bash
python test_comment_system.py
```

### Szybkie testy
```bash
python quick_test.py
```

## 📁 Struktura Projektu

```
aircloud-platform/
├── 🐍 aircloud_legal_platform.py     # Główna aplikacja
├── 🚀 aircloud_advanced_features.py  # Zaawansowane funkcje  
├── 🔧 aircloud_extended_routes.py    # Dodatkowe endpointy
├── 📋 requirements.txt               # Dependencje
├── 📂 templates/                     # Szablony HTML/Jinja2
│   ├── 🏠 index.html                 # Strona główna
│   ├── 👤 login.html                 # Logowanie
│   ├── 📄 document_view.html         # Widok dokumentu
│   ├── ⚖️ legal_system.html         # System prawny
│   └── 📂 extended/                  # Rozszerzone widoki
├── 📂 static/                        # Pliki statyczne
│   ├── 📂 css/                       # Stylesheets
│   ├── 📂 js/                        # JavaScript
│   └── 📂 exports/                   # Eksportowane pliki
├── 📂 instance/                      # Dane aplikacji
│   └── 💾 aircloud_legal_platform.db # Baza SQLite
├── 📂 uploads/                       # Przesłane pliki
├── 📂 docker/                        # Konfiguracja Docker
│   ├── 🐳 Dockerfile.flask           # Dockerfile
│   └── 📝 docker-compose.yml         # Docker Compose
└── 📂 tests/                         # Testy
    ├── 🧪 test_comprehensive.py      # Wszystkie testy
    ├── 💬 test_comment_system.py     # Testy komentowania
    └── ⚡ quick_test.py              # Szybkie testy
```

## 🔧 Konfiguracja

### Zmienne środowiskowe
```bash
FLASK_APP=aircloud_legal_platform.py
FLASK_ENV=development  # lub production
FLASK_RUN_HOST=0.0.0.0
FLASK_RUN_PORT=5001
```

### Baza danych
Aplikacja domyślnie używa SQLite. Dla produkcji skonfiguruj PostgreSQL:
```python
SQLALCHEMY_DATABASE_URI = 'postgresql://user:pass@localhost/dbname'
```

## 🎛️ API Endpoints

### Core API
- `GET /` - Dashboard główny
- `GET /login` - Strona logowania  
- `POST /login` - Uwierzytelnianie
- `GET /legal_system/<id>` - Widok systemu prawnego
- `GET /document/<slug>` - Widok dokumentu

### Extended API
- `GET /extended/dashboard` - Rozszerzony dashboard
- `GET /extended/analytics` - Analityka
- `GET /extended/templates` - Galeria szablonów
- `GET /extended/workflow` - Zarządzanie workflow
- `GET /api/export/pdf/<id>` - Export PDF
- `GET /api/export/docx/<id>` - Export DOCX

### Comment API (W budowie)
- `GET /api/comments` - Lista komentarzy
- `POST /api/comments` - Dodaj komentarz
- `PUT /api/comments/<id>` - Edytuj komentarz  
- `DELETE /api/comments/<id>` - Usuń komentarz

## 📊 Status Rozwoju

| Moduł | Status | Uwagi |
|-------|--------|-------|
| 🏗️ Core Platform | ✅ **Gotowe** | Flask + SQLAlchemy |
| 👤 Authentication | ✅ **Gotowe** | Login/logout + session |
| 📄 Document Management | ✅ **Gotowe** | CRUD + hierarchia |
| 🔍 Search | ✅ **Gotowe** | Pełnotekstowe |  
| 📤 PDF/DOCX Export | ✅ **Gotowe** | ReportLab + python-docx |
| 📊 Analytics | ✅ **Gotowe** | Metryki + wykresy |
| 💬 Comment System | 🟡 **W testach** | API gotowe, UI w testach |
| 🔄 Real-time collab | ⏳ **Planowane** | WebSockets |

## 🔐 Licencja

**Open Source License:** Bezpłatne dla:
- ✅ Użytku edukacyjnego
- ✅ Organizacji non-profit
- ✅ Projektów społecznych

**Commercial License:** 
- 💼 **Cena:** 50 PLN + 23% VAT/miesiąc
- 📧 **Kontakt:** legal@aircloud.pl

## 👨‍💻 Autor

**Łukasz Kołodziej**  
🏢 Aircloud Professional  
📧 legal@aircloud.pl  
🌐 https://aircloud.pl

## 🆘 Wsparcie

1. **Issues:** Użyj GitHub Issues
2. **Email:** legal@aircloud.pl  
3. **Documentation:** Zobacz `/docs`
4. **Testing:** Uruchom `test_comprehensive.py`

---

**© 2025 Łukasz Kołodziej | Aircloud Professional** 🚀