# Platforma Zarządzania Regulaminem SSPO

System zarządzania dokumentami prawnymi z funkcjami współpracy i wersjonowania.

## 🎯 Cele Platformy

### 1. Zarządzanie Dokumentami
- Edycja dokumentów regulaminu online
- System wersjonowania zmian
- Historia modyfikacji z możliwością przywracania
- Porównywanie wersji (diff view)

### 2. Współpraca i Workflow
- Propozycje zmian (Pull Request style)
- System komentarzy i dyskusji
- Workflow zatwierdzania zmian
- Przypisywanie zadań i odpowiedzialności

### 3. Uprawnienia i Role
- System ról: Admin, Redaktor, Recenzent, Czytelnik
- Kontrola dostępu do edycji
- Audit log wszystkich działań

### 4. Integracje
- GitHub sync (automatyczne commitowanie)
- Webhook notifications
- Email notifications
- Slack/Discord integration (opcjonalne)

## 🏗️ Architektura

```
regulamin-v3/
├── frontend/              # Public facing docsify site
│   ├── docs/             # Markdown documents
│   └── index.html        # Docsify setup
│
├── admin/                 # Management dashboard
│   ├── src/              # Vue.js application
│   ├── components/       # UI components
│   └── views/            # Pages
│
├── api/                   # Backend API
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # Data models
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth, validation
│   │   └── services/     # Business logic
│   ├── config/           # Configuration
│   └── server.js         # Entry point
│
├── database/              # Database scripts
│   ├── migrations/       # Schema migrations
│   └── seeds/            # Initial data
│
└── docker/                # Docker configuration
    ├── Dockerfile.api    # API container
    ├── Dockerfile.admin  # Admin container
    └── docker-compose.yml
```

## 🚀 Fazy Rozwoju

### Faza 1: Podstawowa Infrastruktura (Tydzień 1-2)
- [ ] Setup projektu backend (Express.js)
- [ ] Setup projektu frontend admin (Vue.js)
- [ ] Konfiguracja bazy danych (PostgreSQL)
- [ ] System autentykacji (JWT)
- [ ] Podstawowe API endpoints

### Faza 2: Zarządzanie Dokumentami (Tydzień 3-4)
- [ ] CRUD dla dokumentów
- [ ] System wersjonowania
- [ ] Historia zmian
- [ ] Preview dokumentów
- [ ] Markdown editor

### Faza 3: Współpraca (Tydzień 5-6)
- [ ] System propozycji zmian
- [ ] Komentarze i dyskusje
- [ ] Workflow zatwierdzania
- [ ] Notifications

### Faza 4: Integracje (Tydzień 7-8)
- [ ] GitHub sync
- [ ] Automated deployments
- [ ] Email notifications
- [ ] Activity logs

### Faza 5: UI/UX i Testy (Tydzień 9-10)
- [ ] Responsive design
- [ ] User testing
- [ ] Bug fixes
- [ ] Documentation

## 🛠️ Stack Technologiczny

### Backend
- **Framework**: Express.js (Node.js)
- **Database**: PostgreSQL
- **ORM**: Sequelize / Prisma
- **Authentication**: JWT + bcrypt
- **Validation**: Joi / Yup
- **File Storage**: Local + Git integration

### Frontend Admin
- **Framework**: Vue.js 3 + Vite
- **UI Library**: Element Plus / Vuetify
- **State Management**: Pinia
- **Markdown Editor**: MarkdownIt + CodeMirror
- **Diff View**: diff2html

### Frontend Public
- **Current**: Docsify (utrzymane)
- **Enhancement**: Custom plugins

### DevOps
- **Containers**: Docker + Docker Compose
- **Reverse Proxy**: Nginx
- **CI/CD**: GitHub Actions
- **Monitoring**: PM2 / Winston logs

## 📋 API Endpoints (Planned)

### Authentication
```
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me
```

### Documents
```
GET    /api/documents
GET    /api/documents/:id
POST   /api/documents
PUT    /api/documents/:id
DELETE /api/documents/:id
GET    /api/documents/:id/versions
GET    /api/documents/:id/versions/:versionId
POST   /api/documents/:id/restore/:versionId
```

### Changes (Pull Request style)
```
GET    /api/changes
GET    /api/changes/:id
POST   /api/changes
PUT    /api/changes/:id
POST   /api/changes/:id/approve
POST   /api/changes/:id/reject
POST   /api/changes/:id/comments
```

### Users & Permissions
```
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
PUT    /api/users/:id/role
```

### Activity Log
```
GET    /api/activity
GET    /api/activity/document/:documentId
GET    /api/activity/user/:userId
```

## 🔐 System Uprawnień

### Role

| Rola | Uprawnienia |
|------|-------------|
| **Admin** | Pełny dostęp, zarządzanie użytkownikami |
| **Redaktor** | Tworzenie i edycja dokumentów, propozycje zmian |
| **Recenzent** | Zatwierdzanie zmian, komentarze |
| **Czytelnik** | Tylko odczyt |

### Workflow Zatwierdzania

1. **Redaktor** tworzy propozycję zmiany
2. System tworzy branch/draft
3. **Recenzent** otrzymuje powiadomienie
4. **Recenzent** może:
   - Zatwierdzić → merge do main
   - Odrzucić → powrót do redaktora
   - Komentować → dyskusja
5. Po zatwierdzeniu → automatyczny deploy

## 📊 Baza Danych (Wstępny Schema)

```sql
-- Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Documents
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  status VARCHAR(50) DEFAULT 'draft',
  author_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Document Versions
CREATE TABLE document_versions (
  id SERIAL PRIMARY KEY,
  document_id INTEGER REFERENCES documents(id),
  version INTEGER NOT NULL,
  content TEXT NOT NULL,
  changes_summary TEXT,
  author_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Change Requests
CREATE TABLE change_requests (
  id SERIAL PRIMARY KEY,
  document_id INTEGER REFERENCES documents(id),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  proposed_content TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  author_id INTEGER REFERENCES users(id),
  reviewer_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Comments
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  change_request_id INTEGER REFERENCES change_requests(id),
  author_id INTEGER REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Activity Log
CREATE TABLE activity_log (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id INTEGER,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🎨 UI Mockup (Conceptual)

### Dashboard
```
┌─────────────────────────────────────────────────────────┐
│  SSPO Regulamin - Panel Zarządzania        [User Menu]  │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  📊 Dashboard    📄 Dokumenty    🔄 Zmiany    👥 Users  │
│                                                           │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  📈 Statystyki                                           │
│  ├─ Dokumentów: 20                                       │
│  ├─ Oczekujących zmian: 3                               │
│  └─ Aktywnych użytkowników: 5                           │
│                                                           │
│  🔔 Ostatnia aktywność                                   │
│  ├─ Jan Kowalski zaproponował zmianę w "Regulamin..."  │
│  ├─ Admin zatwierdził zmianę w "Kodeks..."             │
│  └─ Maria Nowak dodała komentarz do "Ordynacja..."     │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Document Editor
```
┌─────────────────────────────────────────────────────────┐
│  ← Powrót    01-regulamin-sspo.md        [Zapisz] [...]│
├─────────────────────────────────────────────────────────┤
│  Editor  |  Preview  |  Historia  |  Komentarze        │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  # Regulamin SSPO                                        │
│                                                           │
│  ## Rozdział 1: Postanowienia ogólne                    │
│  ...                                                      │
│                                                           │
│  [Markdown Editor with syntax highlighting]              │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

## 🚦 Następne Kroki

1. **Review tego planu** z zespołem
2. **Przygotowanie środowiska** (Docker, PostgreSQL)
3. **Setup projektów** (backend + admin frontend)
4. **Implementacja Phase 1** (infrastruktura)

## 📝 Notatki

- Zachowaj kompatybilność z obecnym systemem Docsify
- Wszystkie zmiany powinny być traceable
- Priorytet: bezpieczeństwo i audytowalność
- UI powinien być intuicyjny dla non-tech users

## 🤝 Współpraca

System wspiera:
- **Async collaboration**: Propozycje zmian + komentarze
- **Conflict resolution**: Merge conflicts handling
- **Transparency**: Pełna historia zmian
- **Accountability**: Kto, kiedy, co zmienił

---

**Status**: 📋 Plan ready for implementation
**Następny krok**: Setup basic infrastructure
