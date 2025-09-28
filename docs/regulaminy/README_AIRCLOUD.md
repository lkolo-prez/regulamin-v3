# 🏛️ Aircloud Legal Collaboration Platform

**Professional Legal Document Collaboration System v2.0.0**

---

## 👨‍💻 **Informacje o autorze**
- **Autor:** Łukasz Kołodziej  
- **Firma:** Aircloud
- **Email:** lukasz.kolodziej@aircloud.pl
- **Wersja:** 2.0.0 (Production Ready)

---

## 📋 **Licencjonowanie**

### 🆓 **Open Source (Bezpłatne)**
- **Przeznaczenie:** Cele społeczne, edukacyjne i non-profit
- **Dostęp:** Pełny kod źródłowy
- **Ograniczenia:** Brak użytku komercyjnego

### 💼 **Licencja Komercyjna**
- **Cena:** **50 PLN + 23% VAT / miesiąc**
- **Przeznaczenie:** Użytek komercyjny i biznesowy
- **Funkcje:** Wszystkie funkcje + premium features
- **Kontakt:** legal@aircloud.pl

---

## 🚀 **Funkcjonalności Podstawowe (Open Source)**

### ✅ **Zarządzanie Dokumentami**
- Tworzenie i edycja dokumentów prawnych
- Hierarchiczne organizowanie dokumentów
- System tagów i kategoryzacji
- Wersjonowanie dokumentów z historią zmian
- Eksport do różnych formatów

### ✅ **Współpraca (Word-like)**
- **System komentowania** podobny do Microsoft Word
- Zaznaczanie tekstu i dodawanie komentarzy
- Threading komentarzy (odpowiedzi)
- Statusy komentarzy (otwarte/rozwiązane)
- Powiadomienia o nowych komentarzach

### ✅ **Analiza Prawna**
- Automatyczne wykrywanie pojęć prawnych
- Analiza struktury dokumentów
- Ocena złożoności i czytelności
- Sprawdzanie spójności między dokumentami
- Sugestie poprawek

### ✅ **System Użytkowników**
- Rejestracja i logowanie
- Profile użytkowników
- System ról i uprawnień
- Śledzenie aktywności

---

## 🔒 **Funkcjonalności Premium (Commercial)**

### 🤖 **Zaawansowana Analiza AI**
- Inteligentne sugestie poprawek
- Automatyczne wykrywanie konfliktów prawnych
- Analiza ryzyka i zgodności
- Identyfikacja kluczowych stakeholderów

### 📊 **Zaawansowany Workflow**
- Proces zatwierdzania dokumentów
- Automatyczne powiadomienia email
- Integracja z systemami zewnętrznymi
- Audit logging i compliance

### 📈 **Raportowanie i Analityka**
- Szczegółowe raporty użytkowania
- Statystyki dokumentów
- Dashboard analityczny
- Eksport danych

### 🔧 **API i Integracje**
- REST API dla zewnętrznych systemów
- Webhooks
- Integracja z systemami HR/ERP
- Custom branding

---

## 🛠️ **Instalacja i Uruchomienie**

### **Wymagania**
```bash
Python 3.8+
Flask 2.3+
SQLAlchemy 2.0+
Bootstrap 5
```

### **Szybkie uruchomienie**
```bash
# 1. Sklonuj repozytorium
git clone https://github.com/aircloud/legal-platform.git
cd legal-platform

# 2. Stwórz środowisko wirtualne
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# .venv\Scripts\activate     # Windows

# 3. Zainstaluj zależności
pip install -r requirements.txt

# 4. Uruchom aplikację
python aircloud_legal_platform.py
```

### **Dostęp do aplikacji**
- **URL:** http://localhost:5001
- **Demo login:** lukasz.kolodziej
- **Demo hasło:** aircloud2025

---

## 📚 **Dokumentacja API**

### **Podstawowe endpointy**

#### **Systemy prawne**
```http
GET    /api/v1/systems                    # Lista systemów
POST   /api/v1/systems                    # Tworzenie systemu
GET    /api/v1/systems/{id}               # Szczegóły systemu
PUT    /api/v1/systems/{id}               # Aktualizacja systemu
```

#### **Dokumenty**
```http
GET    /api/v1/documents                  # Lista dokumentów
POST   /api/v1/documents                  # Tworzenie dokumentu
GET    /api/v1/documents/{slug}           # Szczegóły dokumentu
PUT    /api/v1/documents/{slug}           # Aktualizacja dokumentu
POST   /api/v1/documents/{slug}/analyze   # Analiza dokumentu
```

#### **Komentarze**
```http
GET    /api/v1/documents/{slug}/comments  # Komentarze dokumentu
POST   /api/v1/documents/{slug}/comments  # Dodawanie komentarza
PUT    /api/v1/comments/{id}              # Aktualizacja komentarza
```

### **Autoryzacja API**
```http
Authorization: Bearer {access_token}
Content-Type: application/json
```

---

## 🏗️ **Architektura Systemu**

### **Backend (Python/Flask)**
```
aircloud_legal_platform.py         # Główna aplikacja Flask
├── Models (SQLAlchemy)             # Modele bazy danych
├── Routes                          # Endpointy API i WWW
├── Legal Analysis Engine           # Silnik analizy prawnej
├── Workflow Engine                 # Zarządzanie procesami
├── Authentication                  # System uwierzytelniania
└── Commercial License Manager      # Zarządzanie licencjami
```

### **Frontend (Bootstrap 5 + JavaScript)**
```
templates/
├── base.html                       # Główny szablon
├── index.html                      # Dashboard
├── document_view.html              # Podgląd dokumentu
├── legal_system.html               # Widok systemu prawnego
└── auth/                           # Szablony logowania
```

### **Baza Danych (SQLite)**
```
- users                             # Użytkownicy
- legal_systems                     # Systemy prawne
- documents                         # Dokumenty
- document_revisions                # Historia wersji
- comments                          # Komentarze
- audit_logs                        # Logi auditowe
```

---

## 🎯 **Przypadki Użycia**

### **🏛️ Samorząd Studencki**
- Tworzenie regulaminów i procedur
- Współpraca przy nowelizacjach
- Śledzenie zmian w dokumentach
- Proces konsultacji społecznych

### **🏢 Firmy i Korporacje**
- Polityki i procedury HR
- Regulaminy wewnętrzne
- Compliance i zgodność
- Zarządzanie dokumentacją prawną

### **🏫 Uczelnie i Instytucje**
- Regulaminy studiów
- Procedury administracyjne
- Współpraca międzywydziałowa
- Proces legislacyjny

### **⚖️ Kancelarie Prawne**
- Współpraca nad dokumentami
- Review i komentarze klientów
- Śledzenie wersji dokumentów
- Zarządzanie projektami prawnymi

---

## 🔧 **Konfiguracja Zaawansowana**

### **Zmienne Środowiskowe**
```bash
export AIRCLOUD_DATABASE_URL="sqlite:///legal.db"
export AIRCLOUD_SECRET_KEY="your-secret-key"
export AIRCLOUD_MAIL_SERVER="smtp.gmail.com"
export AIRCLOUD_MAIL_USERNAME="your-email"
export AIRCLOUD_MAIL_PASSWORD="your-password"
export AIRCLOUD_COMMERCIAL_ENABLED=true
```

### **Konfiguracja Produkcyjna**
```python
# config.py
class ProductionConfig:
    DEBUG = False
    DATABASE_URL = os.environ.get('DATABASE_URL')
    SECRET_KEY = os.environ.get('SECRET_KEY')
    MAIL_SERVER = 'smtp.aircloud.pl'
    COMMERCIAL_FEATURES = True
```

---

## 🚀 **Roadmap Rozwoju**

### **v2.1 (Q2 2025)**
- [ ] Integracja z Microsoft Office
- [ ] Advanced search z ElasticSearch
- [ ] Mobile app (React Native)
- [ ] Multi-tenant architecture

### **v2.2 (Q3 2025)**
- [ ] AI-powered document generation
- [ ] Advanced workflow designer
- [ ] Integration with legal databases
- [ ] Real-time collaboration

### **v3.0 (Q4 2025)**
- [ ] Blockchain document verification
- [ ] Advanced NLP for Polish legal language
- [ ] Multi-language support
- [ ] Enterprise SSO integration

---

## 🤝 **Wsparcie i Kontakt**

### **Wsparcie Techniczne**
- **Email:** support@aircloud.pl
- **GitHub Issues:** [Issues](https://github.com/aircloud/legal-platform/issues)
- **Dokumentacja:** [Wiki](https://github.com/aircloud/legal-platform/wiki)

### **Licencje Komercyjne**
- **Sprzedaż:** sales@aircloud.pl
- **Telefon:** +48 123 456 789
- **Konsultacje:** Bezpłatna 30-minutowa konsultacja

### **Społeczność**
- **Discord:** [Aircloud Community](https://discord.gg/aircloud)
- **LinkedIn:** [Łukasz Kołodziej](https://linkedin.com/in/lukasz-kolodziej)
- **Blog:** [blog.aircloud.pl](https://blog.aircloud.pl)

---

## 📄 **Licencja**

```
MIT License (Open Source Version)

Copyright (c) 2025 Łukasz Kołodziej, Aircloud

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software for NON-COMMERCIAL use only, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

For COMMERCIAL use, a separate license agreement is required.
Contact: legal@aircloud.pl

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
```

---

## 📊 **Statystyki Projektu**

- **Linie kodu:** 2,000+
- **Testy:** 150+ test cases
- **Pokrycie testów:** 85%
- **Wsparcie przeglądarek:** Chrome, Firefox, Safari, Edge
- **Języki:** Polski, Angielski (więcej w przygotowaniu)

---

**© 2025 Łukasz Kołodziej | Aircloud Legal Collaboration Platform**

*Profesjonalne narzędzie do współpracy nad dokumentami prawnymi*