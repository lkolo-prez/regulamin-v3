/**
 * Functional Tests - Core Features
 * SSPO Regulamin Platform v3.0
 */

// Test AI Sidebar Functionality
function testAISidebarFunctionality() {
  console.log('🧪 Testing AI Sidebar Functionality...');
  
  const tests = [];
  
  // Test 1: Sidebar Toggle
  tests.push({
    name: 'AI Sidebar Toggle',
    test: () => {
      const sidebar = document.getElementById('ai-suggestions-sidebar');
      const toggleBtn = document.getElementById('ai-toggle-btn');
      
      if (!sidebar || !toggleBtn) {
        throw new Error('Required elements not found');
      }
      
      // Test initial state
      const initialState = sidebar.classList.contains('active');
      
      // Simulate toggle
      if (typeof toggleAISidebar === 'function') {
        toggleAISidebar();
        const newState = sidebar.classList.contains('active');
        
        if (initialState === newState) {
          throw new Error('Sidebar state did not change');
        }
        
        return { success: true, message: 'Sidebar toggles correctly' };
      } else {
        throw new Error('toggleAISidebar function not available');
      }
    }
  });
  
  // Test 2: Suggestion Generation
  tests.push({
    name: 'Suggestion Generation',
    test: () => {
      if (typeof generateDocumentSuggestions !== 'function') {
        throw new Error('generateDocumentSuggestions function not available');
      }
      
      const suggestions = generateDocumentSuggestions('01-regulamin-sspo.md');
      
      if (!Array.isArray(suggestions)) {
        throw new Error('Suggestions should be an array');
      }
      
      if (suggestions.length === 0) {
        throw new Error('No suggestions generated');
      }
      
      // Validate suggestion structure
      const firstSuggestion = suggestions[0];
      const requiredFields = ['id', 'reference', 'section', 'title', 'content', 'priority', 'icon'];
      
      for (const field of requiredFields) {
        if (!(field in firstSuggestion)) {
          throw new Error(`Missing required field: ${field}`);
        }
      }
      
      return { success: true, message: `Generated ${suggestions.length} suggestions` };
    }
  });
  
  // Test 3: Suggestion Update
  tests.push({
    name: 'Suggestion DOM Update',
    test: () => {
      if (typeof updateSuggestionsForDocument !== 'function') {
        throw new Error('updateSuggestionsForDocument function not available');
      }
      
      const result = updateSuggestionsForDocument('01-regulamin-sspo.md');
      
      if (!result || typeof result !== 'object') {
        throw new Error('Invalid result from updateSuggestionsForDocument');
      }
      
      const requiredFields = ['highCount', 'mediumCount', 'lowCount', 'totalSuggestions'];
      for (const field of requiredFields) {
        if (!(field in result)) {
          throw new Error(`Missing result field: ${field}`);
        }
      }
      
      // Check DOM update
      const content = document.getElementById('suggestions-content');
      if (!content || content.innerHTML.trim() === '') {
        throw new Error('Suggestions content not updated in DOM');
      }
      
      return { success: true, message: `Updated DOM with ${result.totalSuggestions} suggestions` };
    }
  });
  
  return runTestSuite('AI Sidebar', tests);
}

// Test Navigation Functionality
function testNavigationFunctionality() {
  console.log('🧪 Testing Navigation Functionality...');
  
  const tests = [];
  
  // Test 1: Docsify Configuration
  tests.push({
    name: 'Docsify Configuration',
    test: () => {
      if (typeof window.$docsify !== 'object') {
        throw new Error('Docsify configuration not found');
      }
      
      const config = window.$docsify;
      const requiredFields = ['name', 'loadSidebar', 'homepage'];
      
      for (const field of requiredFields) {
        if (!(field in config)) {
          throw new Error(`Missing Docsify config: ${field}`);
        }
      }
      
      if (config.homepage !== '01-regulamin-sspo.md') {
        throw new Error('Incorrect homepage configuration');
      }
      
      return { success: true, message: 'Docsify configured correctly' };
    }
  });
  
  // Test 2: Sidebar Elements
  tests.push({
    name: 'Sidebar Elements',
    test: () => {
      const sidebar = document.querySelector('.sidebar');
      if (!sidebar) {
        throw new Error('Sidebar not found');
      }
      
      const navItems = sidebar.querySelectorAll('ul li a');
      if (navItems.length === 0) {
        throw new Error('No navigation items found');
      }
      
      return { success: true, message: `Found ${navItems.length} navigation items` };
    }
  });
  
  return runTestSuite('Navigation', tests);
}

// Test AI Analysis Functions
function testAIAnalysisFunctions() {
  console.log('🧪 Testing AI Analysis Functions...');
  
  const tests = [];
  
  // Test 1: Scroll to Section
  tests.push({
    name: 'Scroll to Section',
    test: () => {
      if (typeof scrollToSection !== 'function') {
        throw new Error('scrollToSection function not available');
      }
      
      // Create a test element
      const testElement = document.createElement('div');
      testElement.id = 'test-section';
      document.body.appendChild(testElement);
      
      try {
        scrollToSection('test-section');
        // If no error thrown, function works
        document.body.removeChild(testElement);
        return { success: true, message: 'Scroll function works' };
      } catch (error) {
        document.body.removeChild(testElement);
        throw error;
      }
    }
  });
  
  // Test 2: Generate Current Document Analysis
  tests.push({
    name: 'Current Document Analysis',
    test: () => {
      if (typeof analyzeCurrentDocument !== 'function') {
        throw new Error('analyzeCurrentDocument function not available');
      }
      
      // Mock window.location.hash
      const originalHash = window.location.hash;
      window.location.hash = '#01-regulamin-sspo.md';
      
      try {
        analyzeCurrentDocument();
        window.location.hash = originalHash;
        return { success: true, message: 'Document analysis function works' };
      } catch (error) {
        window.location.hash = originalHash;
        throw error;
      }
    }
  });
  
  return runTestSuite('AI Analysis', tests);
}

// Test Performance
function testPerformance() {
  console.log('🧪 Testing Performance...');
  
  const tests = [];
  
  // Test 1: Suggestion Generation Speed
  tests.push({
    name: 'Suggestion Generation Speed',
    test: () => {
      if (typeof generateDocumentSuggestions !== 'function') {
        throw new Error('generateDocumentSuggestions function not available');
      }
      
      const iterations = 100;
      const startTime = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        generateDocumentSuggestions('01-regulamin-sspo.md');
      }
      
      const endTime = performance.now();
      const avgTime = (endTime - startTime) / iterations;
      
      if (avgTime > 10) {
        throw new Error(`Too slow: ${avgTime.toFixed(2)}ms per call (limit: 10ms)`);
      }
      
      return { success: true, message: `Average time: ${avgTime.toFixed(2)}ms per call` };
    }
  });
  
  // Test 2: DOM Update Speed
  tests.push({
    name: 'DOM Update Speed',
    test: () => {
      if (typeof updateSuggestionsForDocument !== 'function') {
        throw new Error('updateSuggestionsForDocument function not available');
      }
      
      const iterations = 50;
      const startTime = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        updateSuggestionsForDocument('01-regulamin-sspo.md');
      }
      
      const endTime = performance.now();
      const avgTime = (endTime - startTime) / iterations;
      
      if (avgTime > 50) {
        throw new Error(`Too slow: ${avgTime.toFixed(2)}ms per update (limit: 50ms)`);
      }
      
      return { success: true, message: `Average update time: ${avgTime.toFixed(2)}ms` };
    }
  });
  
  return runTestSuite('Performance', tests);
}

// Test Helper Functions
function runTestSuite(suiteName, tests) {
  console.log(`\n📋 Running ${suiteName} Test Suite`);
  
  const results = {
    suiteName,
    total: tests.length,
    passed: 0,
    failed: 0,
    errors: []
  };
  
  tests.forEach((testCase, index) => {
    try {
      console.log(`  ${index + 1}. ${testCase.name}...`);
      const result = testCase.test();
      
      if (result.success) {
        console.log(`    ✅ PASSED: ${result.message}`);
        results.passed++;
      } else {
        console.log(`    ❌ FAILED: ${result.message}`);
        results.failed++;
        results.errors.push(`${testCase.name}: ${result.message}`);
      }
    } catch (error) {
      console.log(`    ❌ ERROR: ${error.message}`);
      results.failed++;
      results.errors.push(`${testCase.name}: ${error.message}`);
    }
  });
  
  console.log(`\n📊 ${suiteName} Results: ${results.passed}/${results.total} passed`);
  
  return results;
}

// Main Test Runner
function runAllFunctionalTests() {
  console.log('🚀 Starting Functional Tests for SSPO Regulamin Platform v3.0');
  console.log('=' .repeat(60));
  
  const startTime = performance.now();
  const allResults = [];
  
  // Run all test suites
  try {
    allResults.push(testAISidebarFunctionality());
    allResults.push(testNavigationFunctionality());
    allResults.push(testAIAnalysisFunctions());
    allResults.push(testPerformance());
    
    // Generate summary
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    
    console.log('\n' + '=' .repeat(60));
    console.log('📊 FUNCTIONAL TESTS SUMMARY');
    console.log('=' .repeat(60));
    
    let totalTests = 0;
    let totalPassed = 0;
    let totalFailed = 0;
    
    allResults.forEach(result => {
      console.log(`${result.suiteName}: ${result.passed}/${result.total} passed`);
      totalTests += result.total;
      totalPassed += result.passed;
      totalFailed += result.failed;
      
      if (result.errors.length > 0) {
        console.log(`  Errors in ${result.suiteName}:`);
        result.errors.forEach(error => console.log(`    - ${error}`));
      }
    });
    
    console.log(`\n🎯 Overall: ${totalPassed}/${totalTests} tests passed`);
    console.log(`⚡ Total time: ${totalTime.toFixed(2)}ms`);
    console.log(`${totalFailed === 0 ? '✅' : '❌'} Status: ${totalFailed === 0 ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
    
    return {
      success: totalFailed === 0,
      totalTests,
      totalPassed,
      totalFailed,
      totalTime: totalTime.toFixed(2),
      results: allResults
    };
    
  } catch (error) {
    console.error('❌ Critical error during testing:', error);
    return { success: false, error: error.message };
  }
}

// Export for browser use
if (typeof window !== 'undefined') {
  window.runFunctionalTests = runAllFunctionalTests;
  window.testAISidebar = testAISidebarFunctionality;
  window.testNavigation = testNavigationFunctionality;
  window.testAIAnalysis = testAIAnalysisFunctions;
  window.testPerformance = testPerformance;
  
  console.log('✅ Functional tests loaded. Run with: runFunctionalTests()');
}

// Export for Node.js use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runAllFunctionalTests,
    testAISidebarFunctionality,
    testNavigationFunctionality,
    testAIAnalysisFunctions,
    testPerformance
  };
}