# 🤝 System Współpracy i Poprawek Prawnych

> Interaktywny system do współtworzenia, komentowania i zarządzania wersjami regulaminu SSPO

## 📋 Funkcje Systemu

### 1. **Komentowanie Artykułów** 💬

Każdy artykuł regulaminu można teraz komentować:

- **Dodawanie komentarzy** - wyrażaj swoją opinię o każdym przepisie
- **Odpowiadanie na komentarze** - prowadź dyskusję z innymi użytkownikami
- **Lajkowanie komentarzy** - głosuj na najlepsze uwagi
- **Wątki dyskusyjne** - zagnieżdżone odpowiedzi dla lepszej organizacji

**Jak używać:**
1. Kliknij przycisk 💬 obok artykułu
2. Napisz swój komentarz
3. Kliknij "Dodaj Komentarz"

---

### 2. **Zgłaszanie Poprawek** ✏️

System umożliwia zgłaszanie propozycji zmian prawnych:

- **Proponuj zmiany** - zasugeruj nowe brzmienie przepisu
- **Uzasadniaj propozycje** - wyjaśnij dlaczego zmiana jest potrzebna
- **Głosowanie** - głosuj za/przeciw/wstrzymaj się
- **Statusy poprawek**:
  - ⏳ **Oczekuje** - propozycja czeka na głosowanie
  - ✅ **Zatwierdzona** - zmiana zaakceptowana
  - ❌ **Odrzucona** - propozycja nie przeszła

**Jak zgłosić poprawkę:**
1. Kliknij przycisk ✏️ **Poprawka** przy artykule
2. Wprowadź proponowaną zmianę
3. Uzasadnij swoją propozycję
4. Kliknij "Zgłoś Poprawkę"

---

### 3. **Wersjonowanie Dokumentów** 📚

Automatyczne zarządzanie wersjami:

- **Historia zmian** - każda wersja jest zapisywana
- **Śledzenie autorów** - kto wprowadził zmianę i kiedy
- **Porównywanie wersji** - zobacz różnice między wersjami
- **Przywracanie** - możliwość powrotu do poprzedniej wersji

**Dostęp do historii:**
- Kliknij "📚 Historia Wersji" w górnym pasku

---

### 4. **System Ról Użytkowników** 👤

Różne poziomy uprawnień:

- **Przeglądający** (Viewer)
  - Może przeglądać dokumenty
  - Może dodawać komentarze
  
- **Współtwórca** (Contributor)
  - Wszystkie uprawnienia przeglądającego
  - Może zgłaszać poprawki
  
- **Recenzent** (Reviewer)
  - Wszystkie uprawnienia współtwórcy
  - Może głosować nad poprawkami
  - Może zatwierdzać/odrzucać zmiany
  
- **Administrator** (Admin)
  - Pełne uprawnienia
  - Może zarządzać użytkownikami
  - Może tworzyć nowe wersje dokumentów

**Zmiana ustawień:**
1. Kliknij "👤 Ustawienia" w górnym pasku
2. Wprowadź swoje dane
3. Wybierz odpowiednią rolę
4. Zapisz zmiany

---

## 🎯 Jak to działa?

### Panel Współpracy

W górnej części strony znajduje się pasek narzędzi:

```
🤝 System Współpracy | Zalogowany jako: [Twoje Imię]

[📝 Moje Poprawki] [📋 Wszystkie Poprawki] [📚 Historia Wersji] [👤 Ustawienia]
```

### Przyciski przy artykułach

Każdy artykuł ma trzy przyciski:

- **💬 [liczba]** - Komentarze
- **✏️ Poprawka** - Zaproponuj zmianę
- **🔍 Zmiany** - Zobacz historię zmian

---

## 📊 Przykładowy Workflow

### Zgłoszenie i zatwierdzenie poprawki:

1. **Student** czyta artykuł i zauważa błąd
2. **Student** klika ✏️ i proponuje poprawkę
3. **Współtwórcy** komentują propozycję
4. **Recenzenci** głosują nad poprawką
5. **Administrator** zatwierdza zmianę
6. Zmiana jest wprowadzana w nowej wersji

### Dyskusja nad przepisem:

1. **Użytkownik** dodaje komentarz do artykułu
2. **Inni użytkownicy** odpowiadają
3. **Wszyscy** mogą lajkować najlepsze uwagi
4. Najważniejsze uwagi prowadzą do poprawek

---

## 💾 Przechowywanie Danych

Obecnie system używa **localStorage** przeglądarki:

- ✅ Szybki dostęp
- ✅ Działa offline
- ✅ Nie wymaga serwera

**Uwaga:** Dane są zapisywane lokalnie w przeglądarce. Jeśli używasz innej przeglądarki lub komputera, Twoje dane nie będą dostępne.

### Planowany rozwój:

W przyszłości system zostanie rozbudowany o:

- 🔄 Synchronizację z serwerem
- 👥 Współdzielenie danych między użytkownikami
- 📧 Powiadomienia email
- 🔒 Autentykację użytkowników
- 📊 Zaawansowane statystyki

---

## 🚀 Korzyści z Systemu

### Dla Studentów:
- 💡 Możliwość wpływu na przepisy
- 🗣️ Głos w demokratycznym procesie
- 📖 Lepsza przejrzystość przepisów

### Dla Zarządu:
- 📥 Zbieranie feedbacku od społeczności
- 🎯 Identyfikacja problematycznych przepisów
- 📈 Lepsza dokumentacja zmian

### Dla Organizacji:
- 🤝 Większe zaangażowanie członków
- ⚖️ Demokratyczny proces legislacyjny
- 📚 Kompletna historia zmian

---

## 🛠️ Technologia

System zbudowany jest w oparciu o:

- **Vanilla JavaScript** - bez zależności
- **CSS3** - nowoczesne style
- **HTML5 LocalStorage** - przechowywanie danych
- **Docsify** - generowanie dokumentacji

---

## 📖 Przykłady Użycia

### Przykład 1: Komentarz do artykułu

```
Artykuł: § 5. Struktura organizacyjna

Komentarz od Jan Kowalski:
"Uważam, że ten artykuł powinien precyzyjniej określać 
obowiązki poszczególnych komisji. Proponuję dodanie 
punktu 5a."

👍 5  💬 Odpowiedz  🗑️ Usuń
```

### Przykład 2: Propozycja poprawki

```
Artykuł: § 12. Kadencja władz

Oryginalny tekst:
"Kadencja trwa jeden rok akademicki."

Proponowana zmiana:
"Kadencja trwa dwa lata akademickie, licząc od 
1 października roku wyborczego."

Uzasadnienie:
"Dłuższa kadencja zapewni lepszą ciągłość działań 
i realizację długoterminowych projektów."

Status: ⏳ Oczekuje
Głosy: 👍 Za (12) | 👎 Przeciw (3) | 🤷 Wstrzymuję się (5)
```

---

## ❓ FAQ

**Q: Czy moje komentarze są widoczne dla innych?**
A: Tak, wszystkie komentarze są publiczne.

**Q: Kto może zgłaszać poprawki?**
A: Każdy użytkownik z rolą "Współtwórca" lub wyższą.

**Q: Ile czasu trwa zatwierdzenie poprawki?**
A: Zależy od liczby głosów i decyzji administratora.

**Q: Czy mogę cofnąć swoją poprawkę?**
A: Tak, jako autor możesz edytować lub usunąć swoją propozycję.

**Q: Co się stanie z moimi danymi po zamknięciu przeglądarki?**
A: Dane są zapisywane w localStorage i będą dostępne po ponownym otwarciu.

---

## 📞 Kontakt i Pomoc

Jeśli masz pytania lub sugestie dotyczące systemu:

- 📧 Email: [kontakt@sspo.com.pl]
- 💬 Dodaj komentarz w odpowiedniej sekcji
- 🐛 Zgłoś błąd w systemie

---

## 🎓 Dobre Praktyki

### Przy komentowaniu:
- ✅ Bądź konstruktywny
- ✅ Uzasadniaj swoje opinie
- ✅ Szanuj innych użytkowników
- ❌ Unikaj ataków osobistych

### Przy zgłaszaniu poprawek:
- ✅ Dokładnie uzasadnij zmianę
- ✅ Zaproponuj konkretne brzmienie
- ✅ Uwzględnij kontekst prawny
- ❌ Nie zgłaszaj zbyt wielu zmian naraz

### Przy głosowaniu:
- ✅ Przeczytaj całą propozycję
- ✅ Przeanalizuj uzasadnienie
- ✅ Weź pod uwagę komentarze innych
- ❌ Nie głosuj pochopnie

---

## 🎉 Dziękujemy za współpracę!

System współpracy to narzędzie stworzone **dla Was i przez Was**. 

Każdy komentarz, każda poprawka, każdy głos ma znaczenie i pomaga tworzyć lepsze przepisy dla całej społeczności!

**Wspólnie budujemy lepszy Samorząd Studencki! 🎓**
