# 🤝 AIRCLOUD COLLABORATION FEATURES
## Zaawansowane funkcjonalności kolaboracyjne dla SSPO

---

## 📋 Spis treści
1. [Edytor współdzielony](#edytor-współdzielony)
2. [System szablonów](#system-szablonów)
3. [Workflow i zatwierdzanie](#workflow-i-zatwierdzanie)
4. [System komentowania](#system-komentowania)
5. [Powiązania dokumentów](#powiązania-dokumentów)
6. [Notyfikacje](#notyfikacje)
7. [Instalacja](#instalacja)
8. [Użycie](#użycie)

---

## 🎯 Główne funkcjonalności

### 1. ✨ Edytor współdzielony (Real-time Collaboration)

**Adres:** `/collaboration/editor/<document_id>`

#### Możliwości:
- 👥 **Wieloużytkownikowa edycja w czasie rzeczywistym**
  - Live tracking aktywnych użytkowników
  - Unikalne kolory dla każdego użytkownika
  - Wskaźnik obecności online
  
- 🖱️ **Live cursor tracking**
  - Widoczne kursory innych użytkowników
  - Zaznaczenia tekstu w czasie rzeczywistym
  - Blokowanie akapitów podczas edycji

- 🔄 **Operational Transformation**
  - Automatyczne rozwiązywanie konfliktów
  - Synchronizacja zmian między użytkownikami
  - Historia edycji z możliwością przywracania

- 💾 **Auto-save**
  - Automatyczny zapis co 3 sekundy
  - Wersjonowanie dokumentów
  - Odzyskiwanie po awarii

#### Technologia:
- **Flask-SocketIO** - komunikacja WebSocket
- **EasyMDE** - edytor Markdown
- **Bootstrap 5** - interfejs użytkownika

#### Przykład użycia:
```python
# Dołączanie do sesji edycyjnej
socket.emit('join_document', {
    'document_id': 123,
    'user_id': 1,
    'username': 'Jan Kowalski'
})

# Aktualizacja treści
socket.emit('content_change', {
    'document_id': 123,
    'content': 'Nowa treść...',
    'change': {...}
})
```

---

### 2. 📄 System szablonów dokumentów

**Adres:** `/collaboration/templates`

#### Dostępne kategorie:

##### 📜 Regulaminy (`regulations`)
- **Podstawowy szablon regulaminu** - Standardowy format SSPO
- **Regulamin komisji** - Dla komisji tematycznych

##### ⚖️ Uchwały (`resolutions`)
- **Uchwała standardowa** - Typowa uchwała zarządu
- **Uchwała budżetowa** - Dokumenty finansowe

##### 📋 Formularze (`forms`)
- **Wniosek o dofinansowanie** - Aplikacja o środki
- **Skarga/wniosek** - Procedury odwoławcze

##### ✉️ Pisma oficjalne (`letters`)
- **Pismo urzędowe** - Oficjalna korespondencja
- **Zaproszenie** - Na wydarzenia i posiedzenia

#### Tworzenie dokumentu z szablonu:

```python
from aircloud_collaboration_engine import DocumentTemplate

# Pobierz dostępne szablony
templates = DocumentTemplate.get_templates()

# Utwórz dokument z szablonu
content = DocumentTemplate.create_from_template('reg_basic', {
    'title': 'Regulamin Komisji Rewizyjnej',
    'preamble': 'Na podstawie §10 Regulaminu SSPO...',
    'article_1': 'Zakres działania...'
})
```

#### Struktura szablonu:
```python
{
    'id': 'reg_basic',
    'name': 'Podstawowy szablon regulaminu',
    'description': 'Standardowy szablon dla regulaminów SSPO',
    'fields': ['title', 'preamble', 'chapters', 'articles'],
    'structure': 'hierarchical'  # lub 'linear', 'form', 'letter'
}
```

---

### 3. 🔄 Workflow i system zatwierdzania

**Adres:** `/collaboration/workflow/<document_id>`

#### Stany dokumentu:
- `draft` - Projekt (autor pracuje)
- `review` - W recenzji (recenzenci sprawdzają)
- `consultation` - Konsultacje (otwarte dla wszystkich)
- `approval` - Oczekuje na zatwierdzenie (zarząd)
- `approved` - Zatwierdzony (gotowy do publikacji)
- `rejected` - Odrzucony (wymaga poprawek)
- `archived` - Zarchiwizowany

#### Dostępne akcje:
```python
WORKFLOW_ACTIONS = {
    'submit_for_review': 'Przekaż do recenzji',
    'request_changes': 'Wymagane poprawki',
    'approve': 'Zatwierdź',
    'reject': 'Odrzuć',
    'publish': 'Opublikuj',
    'archive': 'Zarchiwizuj'
}
```

#### Role i uprawnienia:

| Rola | Draft | Review | Consultation | Approval |
|------|-------|--------|--------------|----------|
| **Author** | submit_for_review | - | comment | - |
| **Reviewer** | - | approve/request_changes | comment | - |
| **Member** | - | - | comment | - |
| **Approver** | - | - | - | approve/reject |
| **Admin** | ALL | ALL | ALL | ALL |

#### Przykład wykonania akcji:
```python
from aircloud_collaboration_engine import WorkflowEngine

# Wykonaj akcję workflow
success = WorkflowEngine.execute_action(
    document_id=123,
    action='submit_for_review',
    user_id=1,
    comment='Dokument gotowy do recenzji'
)
```

---

### 4. 💬 System komentowania kontekstowego

**Adres:** API `/collaboration/comments/<document_id>/add`

#### Typy komentarzy:
- `general` - Ogólny komentarz do dokumentu
- `suggestion` - Sugestia zmiany
- `question` - Pytanie wymagające odpowiedzi
- `issue` - Zgłoszenie problemu

#### Dodawanie komentarza:
```python
from aircloud_collaboration_engine import CommentingSystem

comment = CommentingSystem.add_contextual_comment(
    document_id=123,
    user_id=1,
    content='To zdanie jest niejasne',
    context={
        'paragraph_id': 'para_5',
        'selection_start': 10,
        'selection_end': 45,
        'selected_text': 'tekst który komentujemy',
        'type': 'suggestion'
    }
)
```

#### Struktura komentarza:
```json
{
    "id": 456,
    "document_id": 123,
    "user_id": 1,
    "content": "To zdanie jest niejasne",
    "context": {
        "paragraph_id": "para_5",
        "selection_start": 10,
        "selection_end": 45,
        "selected_text": "tekst który komentujemy",
        "type": "suggestion"
    },
    "created_at": "2025-01-15T10:30:00",
    "resolved": false,
    "replies": []
}
```

---

### 5. 🔗 System powiązań dokumentów

**Adres:** `/collaboration/relationships/<document_id>`

#### Typy relacji:
```python
RELATIONSHIP_TYPES = {
    'references': 'Powołuje się na',      # Dokument A cytuje dokument B
    'amends': 'Zmienia',                  # Dokument A zmienia dokument B
    'replaces': 'Zastępuje',              # Dokument A zastępuje dokument B
    'implements': 'Implementuje',         # Dokument A wdraża dokument B
    'related': 'Powiązany z'              # Ogólne powiązanie
}
```

#### Dodawanie powiązania:
```python
from aircloud_collaboration_engine import DocumentRelationships

# Dokument 124 zmienia dokument 100
DocumentRelationships.add_relationship(
    source_doc_id=124,
    target_doc_id=100,
    relationship_type='amends',
    description='Nowelizacja Regulaminu SSPO - §5 ust. 2'
)
```

#### Pobieranie powiązanych dokumentów:
```python
relationships = DocumentRelationships.get_related_documents(123)

# Zwraca:
{
    'references': [...],      # Dokumenty, na które się powołuje
    'referenced_by': [...],   # Dokumenty, które się powołują
    'amends': [...],          # Dokumenty, które zmienia
    'amended_by': [...],      # Dokumenty, które go zmieniają
    'replaces': [...],        # Dokumenty, które zastępuje
    'replaced_by': [...]      # Dokumenty, które go zastępują
}
```

---

### 6. 🔔 System notyfikacji

**Adres:** `/collaboration/notifications`

#### Typy notyfikacji:
```python
NOTIFICATION_TYPES = {
    'comment': 'Nowy komentarz',
    'mention': 'Wzmianka o Tobie',
    'state_change': 'Zmiana statusu dokumentu',
    'approval_request': 'Prośba o zatwierdzenie',
    'deadline': 'Zbliżający się termin',
    'new_version': 'Nowa wersja dokumentu'
}
```

#### Wysyłanie notyfikacji:
```python
from aircloud_collaboration_engine import NotificationSystem

NotificationSystem.send_notification(
    user_id=1,
    notification_type='approval_request',
    title='Prośba o zatwierdzenie',
    message='Dokument "Regulamin XYZ" oczekuje na Twoje zatwierdzenie',
    link='/collaboration/workflow/123',
    priority='high'  # low, normal, high, urgent
)
```

#### Pobieranie notyfikacji (AJAX):
```javascript
fetch('/collaboration/notifications/unread')
    .then(response => response.json())
    .then(data => {
        console.log(`Masz ${data.count} nieprzeczytanych notyfikacji`);
        displayNotifications(data.notifications);
    });
```

---

## 🚀 Instalacja

### 1. Zainstaluj zależności:
```bash
cd aircloud-platform
pip install -r requirements.txt
```

### 2. Zainicjalizuj bazę danych:
```bash
flask db init
flask db migrate -m "Add collaboration features"
flask db upgrade
```

### 3. Uruchom serwer:
```bash
python aircloud_legal_platform.py
```

### 4. Dodatkowa konfiguracja dla produkcji:

#### **Eventlet** dla SocketIO (produkcja):
```bash
pip install eventlet
```

#### **Redis** dla skalowania (opcjonalnie):
```python
# W aircloud_legal_platform.py
socketio = SocketIO(app, 
    message_queue='redis://localhost:6379',
    cors_allowed_origins="*"
)
```

---

## 📖 Użycie

### Podstawowy workflow:

1. **Wybierz szablon**
   ```
   → /collaboration/templates
   → Wybierz kategorię (np. "Regulaminy")
   → Kliknij "Użyj szablonu"
   ```

2. **Wypełnij formularz**
   ```
   → Wprowadź dane wymagane przez szablon
   → Podgląd dokumentu
   → Utwórz dokument
   ```

3. **Edytuj współdzielenie**
   ```
   → /collaboration/editor/<id>
   → Edytuj dokument z innymi użytkownikami
   → Dodawaj komentarze kontekstowe
   → Auto-save zapisze zmiany
   ```

4. **Workflow zatwierdzania**
   ```
   → /collaboration/workflow/<id>
   → Przekaż do recenzji
   → Recenzenci dodają komentarze
   → Zatwierdź lub odrzuć
   ```

5. **Eksport**
   ```
   → /collaboration/export/<id>/pdf
   → /collaboration/export/<id>/docx
   ```

---

## 🎨 Interfejs użytkownika

### Kolory użytkowników w edytorze:
```css
--user-color-1: #FF6B6B  /* Czerwony */
--user-color-2: #4ECDC4  /* Turkusowy */
--user-color-3: #45B7D1  /* Niebieski */
--user-color-4: #FFA07A  /* Łososiowy */
--user-color-5: #98D8C8  /* Miętowy */
--user-color-6: #F7DC6F  /* Żółty */
--user-color-7: #BB8FCE  /* Fioletowy */
--user-color-8: #85C1E2  /* Jasnoniebieski */
```

### Ikony kategorii szablonów:
- 📜 Regulaminy: `fa-balance-scale`
- ⚖️ Uchwały: `fa-gavel`
- 📋 Formularze: `fa-file-alt`
- ✉️ Pisma: `fa-envelope`
- 📊 Raporty: `fa-chart-bar`
- 🔧 Procedury: `fa-tasks`

---

## 🔧 Konfiguracja zaawansowana

### SocketIO Events:

```python
# Własny handler dla custom event
@socketio.on('custom_event')
def handle_custom_event(data):
    # Twoja logika
    emit('response', {'status': 'ok'})
```

### Rozszerzanie szablonów:

```python
# W aircloud_collaboration_engine.py
class DocumentTemplate:
    @staticmethod
    def get_templates():
        templates = {
            'custom_category': [
                {
                    'id': 'custom_template',
                    'name': 'Mój szablon',
                    'description': 'Opis',
                    'fields': ['field1', 'field2'],
                    'structure': 'custom'
                }
            ]
        }
        return templates
```

---

## 📊 Architektura

```
aircloud-platform/
├── aircloud_collaboration_engine.py    # Logika biznesowa
│   ├── CollaborativeSession           # Zarządzanie sesjami
│   ├── DocumentTemplate               # System szablonów
│   ├── WorkflowEngine                 # Workflow management
│   ├── CommentingSystem               # Komentarze
│   ├── DocumentRelationships          # Powiązania
│   └── NotificationSystem             # Notyfikacje
│
├── aircloud_collaboration_routes.py   # Endpointy Flask
│   ├── /collaboration/editor          # Edytor
│   ├── /collaboration/templates       # Galeria
│   ├── /collaboration/workflow        # Workflow
│   ├── /collaboration/comments        # API komentarzy
│   └── /collaboration/relationships   # Powiązania
│
├── templates/collaboration/
│   ├── editor.html                    # Edytor real-time
│   ├── templates.html                 # Galeria szablonów
│   ├── create_from_template.html      # Formularz tworzenia
│   ├── workflow.html                  # Widok workflow
│   ├── relationships.html             # Powiązania
│   └── notifications.html             # Notyfikacje
│
└── aircloud_legal_platform.py         # Główna aplikacja
    └── SocketIO event handlers         # WebSocket events
```

---

## 🧪 Testowanie

### Test edytora współdzielonego:
1. Otwórz dokument w dwóch przeglądarkach
2. Edytuj w jednej przeglądarce
3. Sprawdź synchronizację w drugiej

### Test workflow:
```python
# W pytest
def test_workflow_transition():
    result = WorkflowEngine.execute_action(
        document_id=1,
        action='submit_for_review',
        user_id=1
    )
    assert result == True
```

---

## 🐛 Troubleshooting

### Problem: SocketIO nie działa
**Rozwiązanie:**
```bash
pip install flask-socketio python-socketio eventlet
```

### Problem: Komentarze nie są zapisywane
**Rozwiązanie:** Sprawdź czy tabela `comments` istnieje w bazie danych:
```bash
flask db upgrade
```

### Problem: Szablony nie są widoczne
**Rozwiązanie:** Sprawdź czy `COLLABORATION_FEATURES_AVAILABLE = True`:
```python
# W konsoli Python
from aircloud_legal_platform import COLLABORATION_FEATURES_AVAILABLE
print(COLLABORATION_FEATURES_AVAILABLE)
```

---

## 📝 Changelog

### v3.0.0 (2025-01-15)
✨ **Nowe funkcjonalności:**
- Real-time collaborative editing z SocketIO
- System szablonów dokumentów (7 kategorii)
- Zaawansowany workflow management
- Komentarze kontekstowe z zaznaczeniami
- System powiązań między dokumentami
- Smart notifications system
- Export do PDF/DOCX z szablonów

🔧 **Ulepszenia:**
- Live cursor tracking
- Auto-save co 3 sekundy
- Operational transformation
- Multi-user presence indicators

---

## 👨‍💻 Autor

**Łukasz Kołodziej**
- 🏢 Firma: Aircloud
- 📧 Email: legal@aircloud.pl
- 🌐 Web: aircloud.pl

---

## 📜 Licencja

- 🆓 **Open Source:** Bezpłatne do celów społecznych/edukacyjnych/non-profit
- 💼 **Komercyjne:** 50 PLN + 23% VAT/miesiąc
- 📧 **Kontakt:** legal@aircloud.pl

---

## 🎯 Roadmap

### Zaplanowane funkcjonalności:
- [ ] Video chat podczas edycji
- [ ] AI-powered suggestions
- [ ] Mobile app (React Native)
- [ ] Desktop app (Electron)
- [ ] Integracja z Office 365
- [ ] E-podpis dokumentów
- [ ] Blockchain dla audit trail
- [ ] Multi-language support

---

**© 2025 Łukasz Kołodziej | Aircloud Professional**

*Dokument kolaboracyjny stworzony dla Studenckiego Samorządu Politechniki Opolskiej*
