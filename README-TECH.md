# 📚 System Prawny SSPO v2.0

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-production-green.svg)

## 🎯 O projekcie

Interaktywny system prawny Samorządu Studenckiego Politechniki Opolskiej z funkcjami współpracy, komentowania i proponowania poprawek prawnych.

## 🌟 Funkcje

- ✅ **Dokumentacja prawna** - Wszystkie regulaminy i procedury SSPO
- 🔐 **System autentykacji JWT** - Bezpieczne logowanie
- 👥 **Role i uprawnienia** - Viewer, Contributor, Reviewer, Admin
- 💬 **Komentarze** - Dyskusja nad dokumentami
- 📝 **Poprawki** - Propozycje zmian z głosowaniem
- ⚙️ **Panel admina** - Zarządzanie użytkownikami
- 🚀 **Auto-deployment** - CI/CD przez GitHub webhooks

## 🏗️ Stack technologiczny

**Frontend:** Docsify + Vanilla JS + Enhanced CSS
**Backend:** Node.js + Express + SQLite
**DevOps:** Docker + Nginx + Python webhooks

## 🚀 Quick Start

### Frontend
```bash
docker run -d -p 8080:80 regulamin-sspo-image
```

### Backend
```bash
cd regulamin-backend
npm install
npm start
```

## 📖 Dokumentacja

- [Implementation Summary](../regulamin-backend/IMPLEMENTATION_SUMMARY.md)
- [Backend API Docs](../regulamin-backend/BACKEND_API_DOCUMENTATION.md)
- [Quick Reference](../QUICK_REFERENCE.md)

## 🔐 Domyślne konto

```
Email: admin@sspo.com.pl
Hasło: ChangeMe123!
⚠️ ZMIEŃ HASŁO!
```

## 👥 Role

| Rola | Uprawnienia |
|------|-------------|
| 👁️ **Viewer** | Przeglądanie + komentarze |
| ✍️ **Contributor** | + dodawanie poprawek |
| ⭐ **Reviewer** | + głosowanie |
| 👑 **Admin** | + zarządzanie użytkownikami |

## 📞 Kontakt

- **Website:** http://regulamin.sspo.com.pl
- **API:** http://api.regulamin.sspo.com.pl
- **Email:** lukasz@kolodziej.pro

---

**Made with ❤️ by SSPO** | **v2.0.0** | **2025**
