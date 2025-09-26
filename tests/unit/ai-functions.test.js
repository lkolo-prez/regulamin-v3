/**
 * Unit Tests for AI Functions
 * SSPO Regulamin Platform v3.0
 */

const { JSDOM } = require('jsdom');

// Mock DOM environment
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<head><title>SSPO Test</title></head>
<body>
  <div id="ai-suggestions-sidebar" class="ai-suggestions-sidebar">
    <div id="suggestions-content"></div>
    <div id="high-count">0</div>
    <div id="medium-count">0</div>
    <div id="low-count">0</div>
  </div>
  <div class="content"></div>
</body>
</html>
`);

global.window = dom.window;
global.document = dom.window.document;
global.console = console;

// Mock functions from index.html
function generateDocumentSuggestions(docPath) {
  const baseSuggestions = {
    '01-regulamin-sspo.md': [
      {
        id: 'reg-1',
        reference: 'Art. 1 §1',
        section: 'art-1',
        title: 'Niejednoznaczność definicji',
        content: 'Termin "Samorząd Studencki" wymaga precyzyjniejszego zdefiniowania uprawnień.',
        priority: 'high',
        icon: '🔥'
      },
      {
        id: 'reg-2', 
        reference: 'Art. 5 §2',
        section: 'art-5',
        title: 'Brak przykładów procedur',
        content: 'Procedury wyborcze byłyby jaśniejsze z konkretnymi przykładami.',
        priority: 'medium',
        icon: '⚡'
      }
    ]
  };
  
  return baseSuggestions[docPath] || [];
}

function updateSuggestionsForDocument(docPath) {
  const suggestions = generateDocumentSuggestions(docPath);
  const content = document.getElementById('suggestions-content');
  
  if (content) {
    content.innerHTML = suggestions.map(suggestion => `
      <div class="suggestion-item priority-${suggestion.priority}" data-testid="suggestion-${suggestion.id}">
        <div class="suggestion-reference">${suggestion.reference}</div>
        <div class="suggestion-title">${suggestion.title}</div>
      </div>
    `).join('');
  }
  
  // Update counters
  const highCount = suggestions.filter(s => s.priority === 'high').length;
  const mediumCount = suggestions.filter(s => s.priority === 'medium').length;
  const lowCount = suggestions.filter(s => s.priority === 'low').length;
  
  const highEl = document.getElementById('high-count');
  const mediumEl = document.getElementById('medium-count');
  const lowEl = document.getElementById('low-count');
  
  if (highEl) highEl.textContent = highCount;
  if (mediumEl) mediumEl.textContent = mediumCount;
  if (lowEl) lowEl.textContent = lowCount;
  
  return { highCount, mediumCount, lowCount, totalSuggestions: suggestions.length };
}

// Test Suite
describe('AI Functions Tests', () => {
  
  describe('generateDocumentSuggestions', () => {
    
    test('should return suggestions for regulamin-sspo document', () => {
      const suggestions = generateDocumentSuggestions('01-regulamin-sspo.md');
      
      expect(suggestions).toBeDefined();
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions[0]).toHaveProperty('id');
      expect(suggestions[0]).toHaveProperty('reference');
      expect(suggestions[0]).toHaveProperty('priority');
    });
    
    test('should return empty array for unknown document', () => {
      const suggestions = generateDocumentSuggestions('unknown-document.md');
      
      expect(suggestions).toBeDefined();
      expect(suggestions.length).toBe(0);
    });
    
    test('should include required properties in suggestions', () => {
      const suggestions = generateDocumentSuggestions('01-regulamin-sspo.md');
      
      suggestions.forEach(suggestion => {
        expect(suggestion).toHaveProperty('id');
        expect(suggestion).toHaveProperty('reference');
        expect(suggestion).toHaveProperty('section');
        expect(suggestion).toHaveProperty('title');
        expect(suggestion).toHaveProperty('content');
        expect(suggestion).toHaveProperty('priority');
        expect(suggestion).toHaveProperty('icon');
        
        expect(['high', 'medium', 'low']).toContain(suggestion.priority);
      });
    });
    
  });
  
  describe('updateSuggestionsForDocument', () => {
    
    test('should update DOM with suggestions', () => {
      const result = updateSuggestionsForDocument('01-regulamin-sspo.md');
      
      expect(result).toBeDefined();
      expect(result.totalSuggestions).toBeGreaterThan(0);
      
      const content = document.getElementById('suggestions-content');
      expect(content.innerHTML).toContain('suggestion-item');
      expect(content.innerHTML).toContain('Art. 1 §1');
    });
    
    test('should update counters correctly', () => {
      const result = updateSuggestionsForDocument('01-regulamin-sspo.md');
      
      const highEl = document.getElementById('high-count');
      const mediumEl = document.getElementById('medium-count');
      const lowEl = document.getElementById('low-count');
      
      expect(parseInt(highEl.textContent)).toBe(result.highCount);
      expect(parseInt(mediumEl.textContent)).toBe(result.mediumCount);
      expect(parseInt(lowEl.textContent)).toBe(result.lowCount);
    });
    
    test('should handle empty document gracefully', () => {
      const result = updateSuggestionsForDocument('empty-document.md');
      
      expect(result.totalSuggestions).toBe(0);
      expect(result.highCount).toBe(0);
      expect(result.mediumCount).toBe(0);
      expect(result.lowCount).toBe(0);
    });
    
  });
  
  describe('AI Sidebar Integration', () => {
    
    test('should have required DOM elements', () => {
      const sidebar = document.getElementById('ai-suggestions-sidebar');
      const content = document.getElementById('suggestions-content');
      const highCount = document.getElementById('high-count');
      
      expect(sidebar).toBeTruthy();
      expect(content).toBeTruthy();
      expect(highCount).toBeTruthy();
    });
    
    test('should apply correct CSS classes', () => {
      updateSuggestionsForDocument('01-regulamin-sspo.md');
      
      const suggestions = document.querySelectorAll('.suggestion-item');
      expect(suggestions.length).toBeGreaterThan(0);
      
      suggestions.forEach(suggestion => {
        expect(suggestion.classList.contains('suggestion-item')).toBe(true);
        expect(
          suggestion.classList.contains('priority-high') ||
          suggestion.classList.contains('priority-medium') ||
          suggestion.classList.contains('priority-low')
        ).toBe(true);
      });
    });
    
  });
  
});

// Performance Tests
describe('AI Performance Tests', () => {
  
  test('should generate suggestions within acceptable time', () => {
    const startTime = performance.now();
    
    for (let i = 0; i < 100; i++) {
      generateDocumentSuggestions('01-regulamin-sspo.md');
    }
    
    const endTime = performance.now();
    const avgTime = (endTime - startTime) / 100;
    
    expect(avgTime).toBeLessThan(10); // Less than 10ms per call
  });
  
  test('should update DOM efficiently', () => {
    const startTime = performance.now();
    
    for (let i = 0; i < 50; i++) {
      updateSuggestionsForDocument('01-regulamin-sspo.md');
    }
    
    const endTime = performance.now();
    const avgTime = (endTime - startTime) / 50;
    
    expect(avgTime).toBeLessThan(50); // Less than 50ms per update
  });
  
});

console.log('✅ Unit tests for AI Functions loaded');