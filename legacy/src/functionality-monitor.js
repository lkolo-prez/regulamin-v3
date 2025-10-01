/**
 * Real-time Functionality Monitor
 * SSPO Regulamin Platform v3.0
 */

class FunctionalityMonitor {
  constructor() {
    this.metrics = {
      aiSidebar: {
        toggles: 0,
        suggestionsGenerated: 0,
        referencesClicked: 0,
        errors: 0,
        avgResponseTime: 0
      },
      navigation: {
        documentsLoaded: 0,
        sidebarClicks: 0,
        pageViews: 0,
        loadErrors: 0,
        avgLoadTime: 0
      },
      performance: {
        jsErrors: 0,
        slowOperations: 0,
        memoryUsage: 0,
        domUpdates: 0
      }
    };
    
    this.healthChecks = [];
    this.lastHealthCheck = Date.now();
    this.init();
  }

  init() {
    console.log('🔍 Functionality Monitor initialized');
    
    // Monitor errors
    this.setupErrorTracking();
    
    // Monitor performance
    this.setupPerformanceTracking();
    
    // Monitor user interactions
    this.setupInteractionTracking();
    
    // Start health checks
    this.startHealthChecks();
  }

  setupErrorTracking() {
    window.addEventListener('error', (event) => {
      this.metrics.performance.jsErrors++;
      console.error('🚨 JavaScript Error:', event.error);
      
      this.logEvent('error', {
        message: event.error.message,
        filename: event.filename,
        lineno: event.lineno,
        timestamp: new Date().toISOString()
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.metrics.performance.jsErrors++;
      console.error('🚨 Unhandled Promise Rejection:', event.reason);
      
      this.logEvent('promise_rejection', {
        reason: event.reason,
        timestamp: new Date().toISOString()
      });
    });
  }

  setupPerformanceTracking() {
    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) { // Tasks longer than 50ms
            this.metrics.performance.slowOperations++;
            console.warn(`⚠️ Slow operation detected: ${entry.duration.toFixed(2)}ms`);
          }
        }
      });
      
      observer.observe({ entryTypes: ['longtask'] });
    }

    // Monitor memory usage (if available)
    if (performance.memory) {
      setInterval(() => {
        this.metrics.performance.memoryUsage = performance.memory.usedJSHeapSize;
      }, 5000);
    }
  }

  setupInteractionTracking() {
    // Monitor AI Sidebar interactions
    document.addEventListener('click', (event) => {
      const target = event.target;
      
      if (target.matches('.ai-toggle-sidebar')) {
        this.trackAISidebarToggle();
      }
      
      if (target.matches('.suggestion-reference')) {
        this.trackReferenceClick();
      }
      
      if (target.matches('.sidebar a')) {
        this.trackNavigationClick();
      }
    });

    // Monitor DOM mutations for performance
    const domObserver = new MutationObserver((mutations) => {
      this.metrics.performance.domUpdates += mutations.length;
    });
    
    domObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });
  }

  trackAISidebarToggle() {
    const startTime = performance.now();
    this.metrics.aiSidebar.toggles++;
    
    // Measure toggle response time
    setTimeout(() => {
      const responseTime = performance.now() - startTime;
      this.updateAverageResponseTime(responseTime);
    }, 100);
    
    this.logEvent('ai_sidebar_toggle', {
      count: this.metrics.aiSidebar.toggles,
      timestamp: new Date().toISOString()
    });
  }

  trackReferenceClick() {
    this.metrics.aiSidebar.referencesClicked++;
    
    this.logEvent('reference_click', {
      count: this.metrics.aiSidebar.referencesClicked,
      timestamp: new Date().toISOString()
    });
  }

  trackNavigationClick() {
    const startTime = performance.now();
    this.metrics.navigation.sidebarClicks++;
    
    // Monitor page load time
    setTimeout(() => {
      const loadTime = performance.now() - startTime;
      this.updateAverageLoadTime(loadTime);
      this.metrics.navigation.documentsLoaded++;
    }, 500);
    
    this.logEvent('navigation_click', {
      count: this.metrics.navigation.sidebarClicks,
      timestamp: new Date().toISOString()
    });
  }

  trackSuggestionGeneration(count) {
    this.metrics.aiSidebar.suggestionsGenerated += count;
    
    this.logEvent('suggestions_generated', {
      count: count,
      total: this.metrics.aiSidebar.suggestionsGenerated,
      timestamp: new Date().toISOString()
    });
  }

  updateAverageResponseTime(newTime) {
    const currentAvg = this.metrics.aiSidebar.avgResponseTime;
    const count = this.metrics.aiSidebar.toggles;
    
    this.metrics.aiSidebar.avgResponseTime = 
      ((currentAvg * (count - 1)) + newTime) / count;
  }

  updateAverageLoadTime(newTime) {
    const currentAvg = this.metrics.navigation.avgLoadTime;
    const count = this.metrics.navigation.documentsLoaded;
    
    this.metrics.navigation.avgLoadTime = 
      ((currentAvg * (count - 1)) + newTime) / count;
  }

  startHealthChecks() {
    setInterval(() => {
      this.runHealthCheck();
    }, 30000); // Every 30 seconds
  }

  runHealthCheck() {
    const healthStatus = {
      timestamp: new Date().toISOString(),
      checks: {
        aiSidebar: this.checkAISidebar(),
        navigation: this.checkNavigation(),
        performance: this.checkPerformance(),
        domHealth: this.checkDOMHealth()
      }
    };

    this.healthChecks.push(healthStatus);
    
    // Keep only last 10 health checks
    if (this.healthChecks.length > 10) {
      this.healthChecks.shift();
    }

    const overallHealth = Object.values(healthStatus.checks).every(check => check.status === 'healthy');
    
    if (!overallHealth) {
      console.warn('⚠️ Health check issues detected:', healthStatus);
    }
    
    this.logEvent('health_check', healthStatus);
  }

  checkAISidebar() {
    const sidebar = document.getElementById('ai-suggestions-sidebar');
    const toggleBtn = document.getElementById('ai-toggle-btn');
    
    if (!sidebar || !toggleBtn) {
      return {
        status: 'error',
        message: 'Required AI sidebar elements not found'
      };
    }

    if (this.metrics.aiSidebar.errors > 5) {
      return {
        status: 'warning',
        message: `High error count: ${this.metrics.aiSidebar.errors}`
      };
    }

    return {
      status: 'healthy',
      metrics: this.metrics.aiSidebar
    };
  }

  checkNavigation() {
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    
    if (!sidebar || !content) {
      return {
        status: 'error',
        message: 'Navigation elements not found'
      };
    }

    if (this.metrics.navigation.loadErrors > 3) {
      return {
        status: 'warning',
        message: `High load error count: ${this.metrics.navigation.loadErrors}`
      };
    }

    return {
      status: 'healthy',
      metrics: this.metrics.navigation
    };
  }

  checkPerformance() {
    const issues = [];
    
    if (this.metrics.performance.jsErrors > 5) {
      issues.push(`High JS error count: ${this.metrics.performance.jsErrors}`);
    }
    
    if (this.metrics.performance.slowOperations > 10) {
      issues.push(`Many slow operations: ${this.metrics.performance.slowOperations}`);
    }
    
    if (performance.memory && performance.memory.usedJSHeapSize > 100 * 1024 * 1024) { // 100MB
      issues.push(`High memory usage: ${Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)}MB`);
    }

    return {
      status: issues.length === 0 ? 'healthy' : 'warning',
      issues: issues,
      metrics: this.metrics.performance
    };
  }

  checkDOMHealth() {
    const elementsCount = document.querySelectorAll('*').length;
    
    if (elementsCount > 5000) {
      return {
        status: 'warning',
        message: `High DOM element count: ${elementsCount}`
      };
    }

    return {
      status: 'healthy',
      domElements: elementsCount
    };
  }

  logEvent(eventType, data) {
    // In production, this would send to analytics service
    console.log(`📊 ${eventType}:`, data);
  }

  getMetrics() {
    return {
      ...this.metrics,
      healthChecks: this.healthChecks,
      lastUpdate: new Date().toISOString()
    };
  }

  generateReport() {
    const report = {
      summary: {
        totalInteractions: this.metrics.aiSidebar.toggles + this.metrics.navigation.sidebarClicks,
        avgResponseTime: this.metrics.aiSidebar.avgResponseTime,
        avgLoadTime: this.metrics.navigation.avgLoadTime,
        errorRate: (this.metrics.performance.jsErrors / Math.max(1, this.metrics.navigation.pageViews)) * 100,
        healthScore: this.calculateHealthScore()
      },
      details: this.metrics,
      recentHealthChecks: this.healthChecks.slice(-5)
    };

    console.table(report.summary);
    return report;
  }

  calculateHealthScore() {
    let score = 100;
    
    // Deduct points for errors
    score -= this.metrics.performance.jsErrors * 2;
    score -= this.metrics.aiSidebar.errors * 3;
    score -= this.metrics.navigation.loadErrors * 2;
    score -= this.metrics.performance.slowOperations * 0.5;
    
    return Math.max(0, Math.min(100, score));
  }
}

// Initialize monitor when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.functionalityMonitor = new FunctionalityMonitor();
  });
} else {
  window.functionalityMonitor = new FunctionalityMonitor();
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FunctionalityMonitor;
}

console.log('✅ Functionality Monitor loaded');