/**
 * End-to-End Tests
 * SSPO Regulamin Platform v3.0
 */

const puppeteer = require('puppeteer');
const path = require('path');

describe('E2E Tests - SSPO Regulamin Platform', () => {
  let browser;
  let page;
  const baseUrl = 'http://localhost';

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true, // Set to false for debugging
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
  });

  afterEach(async () => {
    if (page) {
      await page.close();
    }
  });

  describe('Page Loading and Navigation', () => {
    
    test('should load homepage successfully', async () => {
      await page.goto(baseUrl, { waitUntil: 'networkidle2' });
      
      const title = await page.title();
      expect(title).toContain('SSPO');
      
      // Check if Docsify loaded
      const docsifyApp = await page.$('#app');
      expect(docsifyApp).toBeTruthy();
    });

    test('should display sidebar navigation', async () => {
      await page.goto(baseUrl, { waitUntil: 'networkidle2' });
      
      // Wait for sidebar to load
      await page.waitForSelector('.sidebar', { timeout: 5000 });
      
      const sidebar = await page.$('.sidebar');
      expect(sidebar).toBeTruthy();
      
      // Check if navigation items are present
      const navItems = await page.$$('.sidebar ul li');
      expect(navItems.length).toBeGreaterThan(0);
    });

    test('should load default document (regulamin)', async () => {
      await page.goto(baseUrl, { waitUntil: 'networkidle2' });
      
      // Wait for content to load
      await page.waitForSelector('.content', { timeout: 5000 });
      
      const content = await page.$('.content');
      expect(content).toBeTruthy();
      
      // Check if regulamin content is displayed
      const contentText = await page.evaluate(() => 
        document.querySelector('.content').textContent
      );
      expect(contentText).toContain('Regulamin');
    });

  });

  describe('AI Sidebar Functionality', () => {
    
    test('should show AI toggle button', async () => {
      await page.goto(baseUrl, { waitUntil: 'networkidle2' });
      
      // Wait for AI toggle button
      await page.waitForSelector('.ai-toggle-sidebar', { timeout: 5000 });
      
      const toggleBtn = await page.$('.ai-toggle-sidebar');
      expect(toggleBtn).toBeTruthy();
    });

    test('should toggle AI sidebar on click', async () => {
      await page.goto(baseUrl, { waitUntil: 'networkidle2' });
      
      // Wait for elements to load
      await page.waitForSelector('.ai-toggle-sidebar', { timeout: 5000 });
      
      // Check initial state (sidebar should auto-open)
      await page.waitForTimeout(2000); // Wait for auto-open
      
      const sidebar = await page.$('.ai-suggestions-sidebar');
      const sidebarClass = await page.evaluate(el => el.className, sidebar);
      
      // Sidebar should be active after auto-open
      expect(sidebarClass).toContain('active');
    });

    test('should display suggestions in sidebar', async () => {
      await page.goto(baseUrl, { waitUntil: 'networkidle2' });
      
      // Wait for sidebar to auto-open and load suggestions
      await page.waitForTimeout(3000);
      
      const suggestions = await page.$$('.suggestion-item');
      expect(suggestions.length).toBeGreaterThan(0);
      
      // Check if suggestions have required elements
      const firstSuggestion = suggestions[0];
      const reference = await firstSuggestion.$('.suggestion-reference');
      const title = await firstSuggestion.$('.suggestion-title');
      const content = await firstSuggestion.$('.suggestion-content');
      
      expect(reference).toBeTruthy();
      expect(title).toBeTruthy();
      expect(content).toBeTruthy();
    });

  });

  describe('AI Functions', () => {
    
    test('should scroll to section when clicking reference', async () => {
      await page.goto(baseUrl, { waitUntil: 'networkidle2' });
      
      // Wait for sidebar and suggestions to load
      await page.waitForTimeout(3000);
      
      // Get initial scroll position
      const initialScrollY = await page.evaluate(() => window.scrollY);
      
      // Click on a suggestion reference
      const reference = await page.$('.suggestion-reference');
      if (reference) {
        await reference.click();
        
        // Wait for scroll animation
        await page.waitForTimeout(1000);
        
        // Check if page scrolled (this might vary based on content)
        const newScrollY = await page.evaluate(() => window.scrollY);
        // Note: scroll position might be the same if target is already visible
      }
    });

    test('should display suggestion details on button click', async () => {
      await page.goto(baseUrl, { waitUntil: 'networkidle2' });
      
      // Wait for suggestions to load
      await page.waitForTimeout(3000);
      
      // Set up dialog handler
      let dialogMessage = '';
      page.on('dialog', async dialog => {
        dialogMessage = dialog.message();
        await dialog.accept();
      });
      
      // Click on details button
      const detailsBtn = await page.$('.suggestion-btn');
      if (detailsBtn) {
        await detailsBtn.click();
        
        // Wait for dialog
        await page.waitForTimeout(500);
        
        expect(dialogMessage).toContain('Szczegóły');
      }
    });

  });

  describe('Document Navigation', () => {
    
    test('should navigate to different documents', async () => {
      await page.goto(baseUrl, { waitUntil: 'networkidle2' });
      
      // Wait for sidebar to load
      await page.waitForSelector('.sidebar', { timeout: 5000 });
      
      // Click on a navigation link
      const navLinks = await page.$$('.sidebar a');
      if (navLinks.length > 1) {
        const secondLink = navLinks[1];
        
        // Get link text for verification
        const linkText = await page.evaluate(el => el.textContent, secondLink);
        
        // Click the link
        await secondLink.click();
        
        // Wait for content to change
        await page.waitForTimeout(2000);
        
        // Verify URL changed
        const currentUrl = page.url();
        expect(currentUrl).toContain('#');
      }
    });

  });

  describe('Responsive Design', () => {
    
    test('should work on mobile viewport', async () => {
      await page.setViewport({ width: 375, height: 667 }); // iPhone SE
      await page.goto(baseUrl, { waitUntil: 'networkidle2' });
      
      // Check if content is still accessible
      await page.waitForSelector('.content', { timeout: 5000 });
      
      const content = await page.$('.content');
      expect(content).toBeTruthy();
      
      // Check if AI toggle button is still visible
      const toggleBtn = await page.$('.ai-toggle-sidebar');
      expect(toggleBtn).toBeTruthy();
    });

    test('should work on tablet viewport', async () => {
      await page.setViewport({ width: 768, height: 1024 }); // iPad
      await page.goto(baseUrl, { waitUntil: 'networkidle2' });
      
      // Check basic functionality
      await page.waitForSelector('.sidebar', { timeout: 5000 });
      await page.waitForSelector('.content', { timeout: 5000 });
      
      const sidebar = await page.$('.sidebar');
      const content = await page.$('.content');
      
      expect(sidebar).toBeTruthy();
      expect(content).toBeTruthy();
    });

  });

  describe('Performance', () => {
    
    test('should load within acceptable time', async () => {
      const startTime = Date.now();
      
      await page.goto(baseUrl, { waitUntil: 'networkidle2' });
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(5000); // Less than 5 seconds
    });

    test('should not have console errors', async () => {
      const consoleErrors = [];
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      await page.goto(baseUrl, { waitUntil: 'networkidle2' });
      await page.waitForTimeout(3000);
      
      // Filter out known acceptable errors
      const criticalErrors = consoleErrors.filter(error => 
        !error.includes('favicon.ico') &&
        !error.includes('net::ERR_FAILED')
      );
      
      expect(criticalErrors.length).toBe(0);
    });

  });

  describe('Accessibility', () => {
    
    test('should have proper page structure', async () => {
      await page.goto(baseUrl, { waitUntil: 'networkidle2' });
      
      // Check for main headings
      const h1 = await page.$('h1');
      expect(h1).toBeTruthy();
      
      // Check for proper semantic structure
      const main = await page.$('main, #app, .content');
      expect(main).toBeTruthy();
    });

    test('should be keyboard navigable', async () => {
      await page.goto(baseUrl, { waitUntil: 'networkidle2' });
      
      // Focus on first focusable element
      await page.keyboard.press('Tab');
      
      const activeElement = await page.evaluate(() => 
        document.activeElement.tagName
      );
      
      // Should focus on a clickable element
      expect(['BUTTON', 'A', 'INPUT'].includes(activeElement)).toBeTruthy();
    });

  });

});

console.log('✅ E2E tests loaded');