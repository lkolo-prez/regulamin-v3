# 📖 DOKUMENTACJA FUNKCJONALNA SSPO v3.0

## 🚀 **SPECYFIKACJA TECHNICZNA SYSTEMU AI**

### **Cel projektu:**
Stworzenie najnowocześniejszego systemu prawnego dla Samorządu Studenckiego z pełną integracją sztucznej inteligencji, umożliwiającego analizę dokumentów prawnych, wykrywanie konfliktów i współpracę w czasie rzeczywistym.

---

## 🌍 **STRUKTURA STRON I INTERFEJSU**

### **1. Strona Domyślna – Regulamin SSPO**

**🎯 Cel:** Centralne miejsce, gdzie użytkownik zaczyna pracę z systemem.

**📋 Zawartość:**
- Cały tekst Regulaminu SSPO, podzielony na **działy, artykuły i paragrafy**
- Każdy paragraf posiada przydzielone **ikony AI** (analiza, konflikt, precedens)
- Tekst responsywny, zoptymalizowany pod przeglądanie na telefonie i komputerze
- Automatyczne indeksowanie treści dla AI Engine

**🎨 Elementy UI:**
- **Sticky Toolbar (górny pasek AI)** z funkcjami:
  - 🔍 *Szybka Analiza* - analiza zaznaczonego tekstu
  - 🛡️ *Sprawdź Konflikty* - skanowanie całego dokumentu
  - ⚖️ *Znajdź Precedensy* - wyszukiwanie podobnych przypadków
  - 💡 *Rekomendacje AI* - sugestie ulepszeń
- **Status Indicator** - zielona kropka pokazująca aktywność AI
- **Kolorowe ikony przy paragrafach:**
  - 🧠 Niebieska – dostępna analiza AI
  - ⚠️ Czerwona – wykryty konflikt prawny
  - 📖 Fioletowa – znaleziony precedens

---

### **2. System Analizy Fragmentu**

**🚀 Wywołanie:** Użytkownik zaznacza tekst regulaminu i klika "Szybka Analiza".

**⚙️ Proces techniczny:**
1. JavaScript pobiera zaznaczony tekst
2. Wysyła POST request do `/api/analyze` z fragmentem
3. AI Engine (Natural.js + TF-IDF) przetwarza tekst
4. Zwraca JSON z wynikami analizy
5. Frontend renderuje results w Floating Panel

**🎨 UI Components:**
```javascript
// Floating Panel Structure
{
  title: "🧠 Analiza AI",
  sections: [
    "📝 Streszczenie fragmentu",
    "⚖️ Analiza konfliktów", 
    "💡 Sugestie ulepszeń",
    "📖 Powiązane precedensy"
  ]
}
```

---

### **3. System Wykrywania Konfliktów**

**🚀 Wywołanie:** Kliknięcie w toolbarze "Sprawdź Konflikty".

**⚙️ Proces techniczny:**
1. AI skanuje wszystkie 21 dokumentów systemu
2. Algorytm TF-IDF porównuje semantykę artykułów
3. Machine Learning wykrywa sprzeczności logiczne
4. Tworzy ranking konfliktów według ważności

**🎨 UI - Tabela Konfliktów:**
```html
<div class="conflict-table">
  <div class="conflict-row high-priority">
    <span class="conflict-icon">⚠️</span>
    <div class="conflict-details">
      <h4>Art. 15 vs Art. 23</h4>
      <p>Sprzeczność w procedurze odwoływania</p>
      <div class="conflict-actions">
        <button>Zobacz szczegóły</button>
        <button>Zaproponuj rozwiązanie</button>
      </div>
    </div>
    <span class="conflict-severity">Wysoki</span>
  </div>
</div>
```

---

### **4. System Precedensów**

**🚀 Wywołanie:** Kliknięcie "Znajdź Precedensy" lub ikony 📖.

**⚙️ Proces techniczny:**
1. AI analizuje aktualnie czytany artykuł
2. Wyszukuje w bazie 47 precedensów
3. Oblicza podobieństwo semantyczne (cosine similarity)
4. Rankuje wyniki według % dopasowania

**🎨 UI - Karty Precedensów:**
```html
<div class="precedent-card">
  <div class="precedent-header">
    <h4>📖 Regulamin WRS 2019</h4>
    <span class="match-score">89%</span>
  </div>
  <p class="precedent-summary">
    Podobny sposób regulacji procedur wyborczych...
  </p>
  <div class="precedent-actions">
    <button>Pełny opis</button>
    <button>Porównaj</button>
  </div>
</div>
```

---

### **5. System Rekomendacji AI**

**🚀 Wywołanie:** Kliknięcie "Rekomendacje AI".

**⚙️ Proces techniczny:**
1. AI ocenia cały dokument pod kątem:
   - Spójności językowej
   - Kompletności regulacji
   - Przejrzystości przepisów
   - Zgodności z prawem wyższego rzędu
2. Generuje ranking sugestii według priorytetu

**🎨 UI - Raport Rekomendacji:**
```html
<div class="recommendations-report">
  <div class="recommendation high-priority">
    <span class="priority-icon">🔥</span>
    <div class="recommendation-content">
      <h4>Ujednolicenie terminologii</h4>
      <p>Art. 15, 23, 45 używają różnych terminów...</p>
      <button onclick="highlightIssue('terminology')">
        Pokaż w dokumencie
      </button>
    </div>
  </div>
</div>
```

---

## ⚙️ **PROCESY SYSTEMOWE**

### **🔍 Proces 1: Szybka Analiza Fragmentu**

**Kroki wykonania:**
1. **User Input:** Zaznaczenie tekstu (JavaScript Selection API)
2. **Validation:** Sprawdzenie długości tekstu (min 10, max 5000 znaków)
3. **API Call:** POST `/api/analyze` z payload:
   ```json
   {
     "text": "zaznaczony fragment",
     "context": "regulamin-sspo",
     "analysisType": "quick"
   }
   ```
4. **AI Processing:** 
   - Natural.js tokenization
   - TF-IDF weighting  
   - Semantic analysis
   - Conflict detection
5. **Response Format:**
   ```json
   {
     "success": true,
     "data": {
       "summary": "Streszczenie AI",
       "conflicts": [...],
       "suggestions": [...],
       "precedents": [...]
     }
   }
   ```

---

### **🛡️ Proces 2: Wykrywanie Konfliktów**

**Algorytm wykrywania:**
```javascript
class ConflictDetector {
  async analyzeDocument(document) {
    const articles = this.extractArticles(document);
    const conflicts = [];
    
    for (let i = 0; i < articles.length; i++) {
      for (let j = i + 1; j < articles.length; j++) {
        const similarity = this.calculateSemantic(articles[i], articles[j]);
        const contradiction = this.detectLogicalConflict(articles[i], articles[j]);
        
        if (contradiction.score > 0.7) {
          conflicts.push({
            article1: articles[i],
            article2: articles[j],
            conflictType: contradiction.type,
            severity: this.calculateSeverity(contradiction)
          });
        }
      }
    }
    
    return this.rankConflicts(conflicts);
  }
}
```

---

### **⚖️ Proces 3: Dopasowywanie Precedensów**

**Machine Learning Pipeline:**
1. **Feature Extraction:** TF-IDF vectorization dokumentów
2. **Similarity Calculation:** Cosine similarity między wektorami
3. **Ranking Algorithm:** Weighted scoring based on:
   - Semantic similarity (60%)
   - Legal domain relevance (30%)
   - Recency factor (10%)

**Kod implementacji:**
```javascript
class PrecedentMatcher {
  async findSimilar(currentArticle) {
    const currentVector = this.tfIdf.vectorize(currentArticle);
    const similarities = [];
    
    for (const precedent of this.precedentsDB) {
      const precedentVector = this.tfIdf.vectorize(precedent.text);
      const similarity = this.cosineSimilarity(currentVector, precedentVector);
      
      if (similarity > 0.6) {
        similarities.push({
          precedent: precedent,
          score: similarity,
          relevance: this.calculateRelevance(precedent, currentArticle)
        });
      }
    }
    
    return similarities.sort((a, b) => b.score - a.score);
  }
}
```

---

## 🎯 **PRZYKŁADY UŻYCIA W PRAKTYCE**

### **Scenariusz 1: Student sprawdza procedury wyborcze**

1. **Wejście:** `http://localhost/` → automatycznie Regulamin SSPO
2. **Akcja:** Przewija do Art. 15 "Procedury wyborcze"
3. **Zauważenie:** Ikona ⚠️ przy artykule (konflikt wykryty)
4. **Kliknięcie:** Otwiera się Floating Panel z analizą:
   ```
   ⚠️ WYKRYTY KONFLIKT
   Art. 15 §2 mówi o "terminach 14 dni"
   Art. 23 §4 mówi o "terminach 21 dni"
   
   💡 REKOMENDACJA AI:
   Ujednolicić terminy lub dodać wyjaśnienie
   ```
5. **Dalsze akcje:** Student może zobaczyć precedensy, zgłosić uwagę do Zarządu

### **Scenariusz 2: Członek Zarządu przygotowuje nowelizację**

1. **Zaznaczenie:** Całego Art. 25 "Kompetencje Przewodniczącego"
2. **Szybka Analiza:** Toolbar → "🔍 Szybka Analiza"
3. **Wyniki AI:**
   ```
   📊 ANALIZA FRAGMENTU (Art. 25):
   • Długość: 347 słów
   • Złożoność: Wysoka (indeks 8.2/10)
   • Konfliktów: 0 wykrytych
   • Precedensy: 3 podobne przypadki
   
   💡 SUGESTIE:
   1. Uprościć język w §3
   2. Dodać przykłady praktyczne
   3. Ujednolicić numerację z Art. 20
   ```

### **Scenariusz 3: Sprawdzenie całego dokumentu przed publikacją**

1. **Globalne skanowanie:** Toolbar → "🛡️ Sprawdź Konflikty"
2. **Rezultat:** Tabela z 3 wykrytymi konfliktami:
   - **Konflikt 1:** Art. 15 vs Art. 23 (procedury czasowe)
   - **Konflikt 2:** Art. 30 vs Art. 8 (kompetencje organu)  
   - **Konflikt 3:** Załącznik 2 vs Art. 45 (definicje)
3. **Akcje naprawcze:** Każdy konflikt ma przycisk "Zaproponuj rozwiązanie"

---

## 🔧 **IMPLEMENTACJA TECHNICZNA**

### **Backend Architecture (Node.js + Express)**

**Główne endpointy API:**
```javascript
// Szybka analiza tekstu
POST /api/analyze
{
  "text": "fragment do analizy",
  "options": { "deep": true, "precedents": true }
}

// Wykrywanie konfliktów
POST /api/conflicts/scan
{
  "documentId": "regulamin-sspo",
  "scope": "full" // lub "section"
}

// Wyszukiwanie precedensów
GET /api/precedents/search?query=wybory&similarity=0.8

// Rekomendacje AI
GET /api/recommendations/document/regulamin-sspo
```

### **Frontend Architecture (Vanilla JS + CSS)**

**Główne komponenty UI:**
```javascript
class AIToolbar {
  constructor() {
    this.initializeButtons();
    this.bindEvents();
    this.startStatusMonitoring();
  }
  
  async quickAnalyze() {
    const selection = window.getSelection().toString();
    if (!selection) return this.showError("Zaznacz tekst");
    
    const analysis = await this.apiCall('/api/analyze', { text: selection });
    this.showFloatingPanel(analysis);
  }
}

class FloatingPanel {
  show(data) {
    this.panel.innerHTML = this.renderAnalysis(data);
    this.panel.classList.add('active');
    this.addInteractiveElements();
  }
}
```

---

## 📊 **METRYKI I MONITORING**

### **KPI Systemu:**
- **Dokładność AI:** > 85% poprawnych analiz
- **Czas odpowiedzi:** < 2 sekundów dla standardowej analizy  
- **Pokrycie konfliktów:** Wykrycie > 90% rzeczywistych sprzeczności
- **Satysfakcja użytkowników:** > 4.5/5 w ankietach

### **Metryki techniczne:**
```javascript
const metrics = {
  aiEngine: {
    totalAnalyses: 1247,
    avgProcessingTime: "1.34s",
    accuracyRate: 0.87,
    conflictsDetected: 23,
    precedentsMatched: 156
  },
  userEngagement: {
    dailyActiveUsers: 45,
    avgSessionTime: "12:34",
    mostAnalyzedSections: ["Art. 15", "Art. 23", "Art. 8"],
    feedbackScore: 4.6
  }
}
```

---

**🚀 System SSPO v3.0 to kompleksowe rozwiązanie łączące najnowsze technologie AI z praktycznymi potrzebami organizacji studenckiej. Każda funkcja została zaprojektowana z myślą o rzeczywistym użyciu i efektywności pracy z dokumentami prawnymi.**