/**
 * Jest Setup Configuration
 * SSPO Regulamin Platform v3.0
 */

// Mock DOM APIs that might not be available in test environment
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

// Mock performance API
global.performance = {
  now: () => Date.now()
};

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock window.alert, confirm, prompt
global.alert = jest.fn();
global.confirm = jest.fn(() => true);
global.prompt = jest.fn();

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ success: true }),
    text: () => Promise.resolve(''),
    ok: true,
    status: 200,
  }),
);

console.log('✅ Jest setup configuration loaded');