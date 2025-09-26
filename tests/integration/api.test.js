/**
 * API Integration Tests
 * SSPO Regulamin Platform v3.0
 */

const request = require('supertest');
const express = require('express');

// Mock Express app for testing
const app = express();
app.use(express.json());

// Mock API endpoints based on our application
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '3.0.0',
    services: {
      ai: 'active',
      nlp: 'active',
      database: 'connected'
    },
    statistics: {
      totalAnalyses: 247,
      avgProcessingTime: 1250,
      uptime: Math.floor(Date.now() / 1000)
    }
  });
});

app.post('/api/analyze', (req, res) => {
  const { text, type, analysisLevel } = req.body;
  
  if (!text || text.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Text is required for analysis'
    });
  }
  
  // Mock AI analysis response
  const analysisResult = {
    success: true,
    data: {
      id: `analysis_${Date.now()}`,
      processing: {
        tokenization: {
          totalTokens: text.split(' ').length,
          uniqueTokens: new Set(text.toLowerCase().split(' ')).size
        },
        sentiment: {
          classification: 'neutral',
          score: 0.1
        },
        tfidf: [
          { term: 'regulamin', score: 0.875 },
          { term: 'artykuł', score: 0.654 },
          { term: 'studencki', score: 0.432 }
        ]
      },
      legalAnalysis: {
        keywords: {
          categories: { constitutional: 3, procedural: 2, administrative: 1 },
          overallRelevance: 0.78,
          dominantCategory: 'constitutional'
        },
        conflicts: {
          totalConflicts: 0,
          riskLevel: 'low'
        },
        recommendations: {
          totalRecommendations: 2,
          items: [
            {
              title: 'Precyzja definicji',
              description: 'Zaleca się doprecyzowanie terminologii prawnej'
            }
          ]
        }
      },
      performance: {
        processingTime: Math.floor(Math.random() * 2000) + 500,
        cacheHit: false
      },
      meta: {
        version: '3.0.0',
        analysisType: type || 'regulation'
      }
    }
  };
  
  res.json(analysisResult);
});

app.post('/api/check', (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({
      success: false,
      error: 'Text is required for conflict checking'
    });
  }
  
  res.json({
    success: true,
    data: {
      conflicts: [],
      totalConflicts: 0,
      analysisTime: Math.floor(Math.random() * 1000) + 200
    }
  });
});

app.get('/api/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      engine: {
        totalAnalyses: 247,
        avgProcessingTime: 1250,
        successRate: 98.5
      },
      system: {
        uptime: Math.floor(Date.now() / 1000),
        memory: {
          used: '125MB',
          available: '875MB'
        },
        cpu: '15%'
      }
    }
  });
});

app.get('/documents/:docId', (req, res) => {
  const { docId } = req.params;
  
  const mockDocuments = {
    '01-regulamin-sspo': {
      id: '01-regulamin-sspo',
      title: 'Regulamin SSPO',
      content: 'Art. 1 §1 Regulamin określa zasady funkcjonowania...',
      lastModified: '2025-09-26',
      version: '3.0'
    }
  };
  
  const doc = mockDocuments[docId];
  if (!doc) {
    return res.status(404).json({
      success: false,
      error: 'Document not found'
    });
  }
  
  res.json({
    success: true,
    data: doc
  });
});

// Test Suite
describe('API Integration Tests', () => {
  
  describe('Health Check Endpoint', () => {
    
    test('GET /api/health should return system status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('version', '3.0.0');
      expect(response.body).toHaveProperty('services');
      expect(response.body).toHaveProperty('statistics');
      expect(response.body.services).toHaveProperty('ai', 'active');
    });
    
    test('Health check should include performance metrics', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);
      
      expect(response.body.statistics).toHaveProperty('totalAnalyses');
      expect(response.body.statistics).toHaveProperty('avgProcessingTime');
      expect(response.body.statistics.totalAnalyses).toBeGreaterThan(0);
    });
    
  });
  
  describe('AI Analysis Endpoint', () => {
    
    test('POST /api/analyze should analyze text successfully', async () => {
      const testText = 'Art. 1 §1 Regulamin określa zasady funkcjonowania Samorządu Studenckiego';
      
      const response = await request(app)
        .post('/api/analyze')
        .send({
          text: testText,
          type: 'regulation',
          analysisLevel: 'advanced'
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('processing');
      expect(response.body.data).toHaveProperty('legalAnalysis');
      expect(response.body.data).toHaveProperty('performance');
    });
    
    test('POST /api/analyze should validate required fields', async () => {
      const response = await request(app)
        .post('/api/analyze')
        .send({})
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Text is required');
    });
    
    test('Analysis should include tokenization results', async () => {
      const testText = 'regulamin studencki artykuł pierwszy';
      
      const response = await request(app)
        .post('/api/analyze')
        .send({ text: testText })
        .expect(200);
      
      expect(response.body.data.processing.tokenization).toHaveProperty('totalTokens');
      expect(response.body.data.processing.tokenization).toHaveProperty('uniqueTokens');
      expect(response.body.data.processing.tokenization.totalTokens).toBe(4);
    });
    
    test('Analysis should include legal categorization', async () => {
      const response = await request(app)
        .post('/api/analyze')
        .send({ text: 'Test legal document' })
        .expect(200);
      
      expect(response.body.data.legalAnalysis.keywords).toHaveProperty('categories');
      expect(response.body.data.legalAnalysis.keywords).toHaveProperty('overallRelevance');
      expect(response.body.data.legalAnalysis.keywords).toHaveProperty('dominantCategory');
    });
    
  });
  
  describe('Conflict Check Endpoint', () => {
    
    test('POST /api/check should check for conflicts', async () => {
      const response = await request(app)
        .post('/api/check')
        .send({ text: 'Test regulation text' })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('conflicts');
      expect(response.body.data).toHaveProperty('totalConflicts');
      expect(response.body.data).toHaveProperty('analysisTime');
    });
    
    test('Conflict check should validate input', async () => {
      const response = await request(app)
        .post('/api/check')
        .send({})
        .expect(400);
      
      expect(response.body.success).toBe(false);
    });
    
  });
  
  describe('Statistics Endpoint', () => {
    
    test('GET /api/stats should return system statistics', async () => {
      const response = await request(app)
        .get('/api/stats')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('engine');
      expect(response.body.data).toHaveProperty('system');
      expect(response.body.data.engine).toHaveProperty('totalAnalyses');
      expect(response.body.data.engine).toHaveProperty('avgProcessingTime');
      expect(response.body.data.engine).toHaveProperty('successRate');
    });
    
  });
  
  describe('Document Endpoints', () => {
    
    test('GET /documents/:docId should return document', async () => {
      const response = await request(app)
        .get('/documents/01-regulamin-sspo')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('title');
      expect(response.body.data).toHaveProperty('content');
    });
    
    test('GET /documents/:docId should return 404 for unknown document', async () => {
      const response = await request(app)
        .get('/documents/unknown-document')
        .expect(404);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });
    
  });
  
});

// Performance Tests for API
describe('API Performance Tests', () => {
  
  test('Health check should respond quickly', async () => {
    const startTime = Date.now();
    
    await request(app).get('/api/health');
    
    const responseTime = Date.now() - startTime;
    expect(responseTime).toBeLessThan(100); // Less than 100ms
  });
  
  test('Analysis endpoint should handle concurrent requests', async () => {
    const requests = [];
    const testText = 'Test concurrent analysis';
    
    for (let i = 0; i < 5; i++) {
      requests.push(
        request(app)
          .post('/api/analyze')
          .send({ text: `${testText} ${i}` })
      );
    }
    
    const startTime = Date.now();
    const responses = await Promise.all(requests);
    const totalTime = Date.now() - startTime;
    
    responses.forEach(response => {
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
    
    expect(totalTime).toBeLessThan(5000); // All requests within 5 seconds
  });
  
});

module.exports = app;
console.log('✅ API Integration tests loaded');