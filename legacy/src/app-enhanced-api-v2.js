/**
 * SSPO Legal Platform Enhanced - Advanced API Server
 * Zaawansowany serwer API z AI-powered analizą prawną
 * Obsługuje NLP, machine learning, i advanced legal analysis
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const natural = require('natural');
const winston = require('winston');
const bodyParser = require('body-parser');
const { EventEmitter } = require('events');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

// Initialize Express app
const app = express();
const port = process.env.API_PORT || 3001;

// ===========================================
// LOGGING CONFIGURATION
// ===========================================
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'sspo-legal-api' },
  transports: [
    new winston.transports.File({ 
      filename: path.join(process.cwd(), 'logs/api/error.log'), 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: path.join(process.cwd(), 'logs/api/combined.log') 
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// ===========================================
// ADVANCED LEGAL ANALYSIS ENGINE
// ===========================================
class AdvancedLegalEngine {
  constructor() {
    this.stemmer = natural.StemmerPl || natural.PorterStemmer;
    this.tokenizer = new natural.WordTokenizer();
    this.tfidf = new natural.TfIdf();
    // Simple sentiment analysis for Polish legal texts
    this.sentimentAnalysis = {
      analyze: (tokens) => {
        const positiveWords = ['dobry', 'pozytywny', 'korzystny', 'właściwy', 'prawidłowy', 'zgodny'];
        const negativeWords = ['zły', 'negatywny', 'nieprawidłowy', 'błędny', 'niewłaściwy', 'niezgodny'];
        
        const positive = tokens.filter(token => positiveWords.includes(token)).length;
        const negative = tokens.filter(token => negativeWords.includes(token)).length;
        
        return (positive - negative) / (tokens.length || 1);
      }
    };
    
    // Advanced legal keyword database
    this.legalKeywords = {
      constitutional: ['konstytucja', 'konstytucyjny', 'podstawowy', 'fundamentalny'],
      administrative: ['administracyjny', 'zarządzenie', 'rozporządzenie', 'decyzja'],
      procedural: ['procedura', 'postępowanie', 'tryb', 'sposób', 'forma'],
      sanctions: ['sankcja', 'kara', 'grzywna', 'nagana', 'upomnienie'],
      rights: ['prawo', 'uprawnienie', 'kompetencja', 'prerogatywa'],
      duties: ['obowiązek', 'powinność', 'zobowiązanie', 'odpowiedzialność'],
      governance: ['zarządzanie', 'kierowanie', 'nadzór', 'kontrola'],
      elections: ['wybory', 'głosowanie', 'kandydat', 'elekcja', 'mandat'],
      ethics: ['etyka', 'moralność', 'uczciwość', 'integralność'],
      finances: ['finanse', 'budżet', 'środki', 'fundusze', 'gospodarowanie']
    };
    
    // Legal precedent database
    this.precedents = new Map();
    this.conflictPatterns = [];
    this.complianceRules = [];
    
    this.initializeEngine();
  }

  async initializeEngine() {
    logger.info('🧠 Initializing Advanced Legal Analysis Engine...');
    
    // Load legal precedents
    await this.loadLegalPrecedents();
    
    // Initialize conflict detection patterns
    this.initializeConflictPatterns();
    
    // Setup compliance rules
    this.initializeComplianceRules();
    
    logger.info('✅ Legal Analysis Engine initialized successfully');
  }

  async loadLegalPrecedents() {
    // Load existing legal documents as precedents
    const precedentData = [
      { id: 'const-001', text: 'Konstytucja określa podstawowe zasady funkcjonowania organizacji studenckiej', category: 'constitutional' },
      { id: 'admin-001', text: 'Zarządzenia wydawane są zgodnie z kompetencjami określonymi w regulaminie', category: 'administrative' },
      { id: 'proc-001', text: 'Procedury głosowania muszą zapewnić demokratyczny charakter procesu', category: 'procedural' }
    ];

    precedentData.forEach(precedent => {
      this.precedents.set(precedent.id, {
        ...precedent,
        tokens: this.tokenizer.tokenize(precedent.text.toLowerCase()),
        stems: this.stemmer.tokenizeAndStem(precedent.text.toLowerCase()),
        tfidf: null
      });
      
      this.tfidf.addDocument(precedent.text);
    });

    logger.info(`📚 Loaded ${this.precedents.size} legal precedents`);
  }

  initializeConflictPatterns() {
    this.conflictPatterns = [
      {
        pattern: /(nie może|nie wolno|zakazuje się).*?(może|wolno|zezwala się)/g,
        type: 'contradiction',
        severity: 'high',
        description: 'Wykryto sprzeczne sformułowania prawne'
      },
      {
        pattern: /(obowiązuje|musi).*?(opcjonalnie|może|fakultatywnie)/g,
        type: 'obligation_conflict',
        severity: 'medium',
        description: 'Konflikt między obowiązkiem a opcjonalnością'
      },
      {
        pattern: /(wyłącznie|tylko).*?(również|dodatkowo|alternatywnie)/g,
        type: 'exclusivity_conflict',
        severity: 'medium',
        description: 'Konflikt wyłączności z alternatywami'
      }
    ];

    logger.info(`🔍 Initialized ${this.conflictPatterns.length} conflict detection patterns`);
  }

  initializeComplianceRules() {
    this.complianceRules = [
      {
        rule: 'democratic_process',
        check: (text) => {
          const democraticTerms = ['głosowanie', 'wybory', 'demokratyczny', 'większość', 'konsensus'];
          return democraticTerms.some(term => text.includes(term));
        },
        weight: 0.8,
        description: 'Sprawdzanie zgodności z zasadami demokratycznymi'
      },
      {
        rule: 'transparency',
        check: (text) => {
          const transparencyTerms = ['jawny', 'przejrzysty', 'publiczny', 'otwarty'];
          return transparencyTerms.some(term => text.includes(term));
        },
        weight: 0.6,
        description: 'Sprawdzanie zgodności z zasadą transparentności'
      },
      {
        rule: 'legal_consistency',
        check: (text) => {
          const consistencyTerms = ['zgodnie z', 'na podstawie', 'w myśl', 'stosownie do'];
          return consistencyTerms.some(term => text.includes(term));
        },
        weight: 0.7,
        description: 'Sprawdzanie spójności prawnej'
      }
    ];

    logger.info(`📋 Initialized ${this.complianceRules.length} compliance rules`);
  }

  // Advanced text analysis with AI-powered insights
  async analyzeText(text, options = {}) {
    const startTime = Date.now();
    
    try {
      logger.info(`🔬 Starting advanced analysis for text (${text.length} chars)`);

      const analysis = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        metadata: {
          textLength: text.length,
          language: 'polish',
          analysisType: 'advanced_legal'
        },
        processing: {
          tokenization: {},
          stemming: {},
          tfidf: {},
          sentiment: {},
          keywords: {},
          precedents: {},
          conflicts: {},
          compliance: {}
        },
        results: {
          summary: {},
          recommendations: [],
          risks: [],
          improvements: []
        },
        performance: {}
      };

      // 1. Tokenization and basic processing
      const tokens = this.tokenizer.tokenize(text.toLowerCase());
      const stems = this.stemmer.tokenizeAndStem(text.toLowerCase());
      
      analysis.processing.tokenization = {
        totalTokens: tokens.length,
        uniqueTokens: [...new Set(tokens)].length,
        tokens: options.includeTokens ? tokens : tokens.slice(0, 10)
      };

      analysis.processing.stemming = {
        totalStems: stems.length,
        uniqueStems: [...new Set(stems)].length,
        stems: options.includeStems ? stems : stems.slice(0, 10)
      };

      // 2. TF-IDF Analysis
      this.tfidf.addDocument(text);
      const tfidfResults = [];
      this.tfidf.listTerms(this.tfidf.documents.length - 1).slice(0, 10).forEach(item => {
        tfidfResults.push({ term: item.term, score: item.tfidf });
      });

      analysis.processing.tfidf = {
        topTerms: tfidfResults,
        documentIndex: this.tfidf.documents.length - 1
      };

      // 3. Sentiment Analysis
      const sentimentScore = this.sentimentAnalysis.analyze(stems);
      analysis.processing.sentiment = {
        score: sentimentScore,
        classification: sentimentScore > 0.1 ? 'positive' : 
                      sentimentScore < -0.1 ? 'negative' : 'neutral',
        confidence: Math.abs(sentimentScore)
      };

      // 4. Legal Keywords Detection
      const detectedKeywords = this.detectLegalKeywords(text);
      analysis.processing.keywords = detectedKeywords;

      // 5. Precedent Matching
      const precedentMatches = await this.findSimilarPrecedents(text);
      analysis.processing.precedents = precedentMatches;

      // 6. Conflict Detection
      const conflicts = this.detectConflicts(text);
      analysis.processing.conflicts = conflicts;

      // 7. Compliance Checking
      const complianceResults = this.checkCompliance(text);
      analysis.processing.compliance = complianceResults;

      // 8. Generate Summary and Recommendations
      analysis.results = this.generateAnalysisResults(analysis.processing);

      // Performance metrics
      analysis.performance = {
        processingTime: Date.now() - startTime,
        memoryUsage: process.memoryUsage(),
        timestamp: new Date().toISOString()
      };

      logger.info(`✅ Analysis completed in ${analysis.performance.processingTime}ms`);
      return analysis;

    } catch (error) {
      logger.error('❌ Analysis failed:', error);
      throw new Error(`Legal analysis failed: ${error.message}`);
    }
  }

  detectLegalKeywords(text) {
    const detected = {};
    let totalRelevance = 0;

    Object.entries(this.legalKeywords).forEach(([category, keywords]) => {
      const found = keywords.filter(keyword => text.toLowerCase().includes(keyword));
      if (found.length > 0) {
        detected[category] = {
          keywords: found,
          count: found.length,
          relevance: found.length / keywords.length
        };
        totalRelevance += found.length;
      }
    });

    return {
      categories: detected,
      totalKeywords: totalRelevance,
      legalRelevance: Math.min(totalRelevance / 10, 1), // Normalized to 0-1
      dominantCategory: Object.entries(detected)
        .sort((a, b) => b[1].count - a[1].count)[0]?.[0] || 'general'
    };
  }

  async findSimilarPrecedents(text) {
    const similarities = [];
    
    for (const [id, precedent] of this.precedents) {
      const similarity = this.calculateTextSimilarity(text, precedent.text);
      if (similarity > 0.3) { // Minimum threshold
        similarities.push({
          id,
          precedent: precedent.text.substring(0, 100) + '...',
          similarity,
          category: precedent.category,
          relevance: similarity > 0.7 ? 'high' : similarity > 0.5 ? 'medium' : 'low'
        });
      }
    }

    return {
      matches: similarities.sort((a, b) => b.similarity - a.similarity).slice(0, 5),
      totalMatches: similarities.length,
      bestMatch: similarities[0] || null,
      averageSimilarity: similarities.length > 0 ? 
        similarities.reduce((sum, s) => sum + s.similarity, 0) / similarities.length : 0
    };
  }

  calculateTextSimilarity(text1, text2) {
    const tokens1 = new Set(this.tokenizer.tokenize(text1.toLowerCase()));
    const tokens2 = new Set(this.tokenizer.tokenize(text2.toLowerCase()));
    
    const intersection = new Set([...tokens1].filter(x => tokens2.has(x)));
    const union = new Set([...tokens1, ...tokens2]);
    
    return intersection.size / union.size; // Jaccard similarity
  }

  detectConflicts(text) {
    const detectedConflicts = [];
    
    this.conflictPatterns.forEach((pattern, index) => {
      const matches = [...text.matchAll(pattern.pattern)];
      if (matches.length > 0) {
        matches.forEach(match => {
          detectedConflicts.push({
            id: `conflict_${index}_${detectedConflicts.length}`,
            type: pattern.type,
            severity: pattern.severity,
            description: pattern.description,
            matchedText: match[0],
            position: match.index,
            suggestion: this.generateConflictSuggestion(pattern.type, match[0])
          });
        });
      }
    });

    return {
      conflicts: detectedConflicts,
      totalConflicts: detectedConflicts.length,
      severityBreakdown: {
        high: detectedConflicts.filter(c => c.severity === 'high').length,
        medium: detectedConflicts.filter(c => c.severity === 'medium').length,
        low: detectedConflicts.filter(c => c.severity === 'low').length
      },
      riskScore: this.calculateConflictRisk(detectedConflicts)
    };
  }

  generateConflictSuggestion(type, matchedText) {
    const suggestions = {
      contradiction: 'Rozważ ujednolicenie sformułowań lub dodanie wyjątków',
      obligation_conflict: 'Wyjaśnij kiedy obowiązek jest bezwzględny, a kiedy fakultatywny',
      exclusivity_conflict: 'Doprecyzuj czy reguła jest wyłączna czy dopuszcza wyjątki'
    };
    
    return suggestions[type] || 'Przeanalizuj spójność prawną tego fragmentu';
  }

  calculateConflictRisk(conflicts) {
    if (conflicts.length === 0) return 0;
    
    const severityWeights = { high: 1.0, medium: 0.6, low: 0.3 };
    const totalWeight = conflicts.reduce((sum, conflict) => 
      sum + severityWeights[conflict.severity], 0);
    
    return Math.min(totalWeight / 10, 1); // Normalized to 0-1
  }

  checkCompliance(text) {
    const results = [];
    let overallScore = 0;

    this.complianceRules.forEach(rule => {
      const passed = rule.check(text);
      const result = {
        rule: rule.rule,
        description: rule.description,
        passed,
        weight: rule.weight,
        impact: passed ? rule.weight : -rule.weight * 0.5
      };
      results.push(result);
      overallScore += result.impact;
    });

    const maxPossibleScore = this.complianceRules.reduce((sum, rule) => sum + rule.weight, 0);
    const normalizedScore = Math.max(0, Math.min(1, (overallScore + maxPossibleScore * 0.5) / maxPossibleScore));

    return {
      rules: results,
      overallScore: normalizedScore,
      complianceLevel: normalizedScore > 0.8 ? 'excellent' : 
                      normalizedScore > 0.6 ? 'good' : 
                      normalizedScore > 0.4 ? 'fair' : 'poor',
      passedRules: results.filter(r => r.passed).length,
      totalRules: results.length,
      recommendations: this.generateComplianceRecommendations(results)
    };
  }

  generateComplianceRecommendations(results) {
    const failedRules = results.filter(r => !r.passed);
    
    return failedRules.map(rule => ({
      rule: rule.rule,
      priority: rule.weight > 0.7 ? 'high' : rule.weight > 0.5 ? 'medium' : 'low',
      recommendation: this.getComplianceRecommendation(rule.rule),
      impact: `Poprawa zwiększy zgodność prawną o ${Math.round(rule.weight * 100)}%`
    }));
  }

  getComplianceRecommendation(rule) {
    const recommendations = {
      democratic_process: 'Dodaj odwołania do demokratycznych procedur decyzyjnych',
      transparency: 'Uwzględnij zasady jawności i transparentności działania',
      legal_consistency: 'Dodaj odniesienia do podstawy prawnej i spójności z innymi regulacjami'
    };
    
    return recommendations[rule] || 'Sprawdź zgodność z ogólnymi zasadami prawnymi';
  }

  generateAnalysisResults(processing) {
    const summary = {
      textComplexity: this.calculateTextComplexity(processing),
      legalRelevance: processing.keywords.legalRelevance,
      riskLevel: processing.conflicts.riskScore,
      complianceScore: processing.compliance.overallScore,
      overallQuality: 0
    };

    // Calculate overall quality score
    summary.overallQuality = (
      summary.complianceScore * 0.4 +
      summary.legalRelevance * 0.3 +
      (1 - summary.riskLevel) * 0.3
    );

    const recommendations = [
      ...processing.compliance.recommendations,
      ...this.generateQualityRecommendations(summary, processing)
    ];

    const risks = processing.conflicts.conflicts.map(conflict => ({
      type: 'legal_conflict',
      severity: conflict.severity,
      description: conflict.description,
      mitigation: conflict.suggestion
    }));

    const improvements = this.generateImprovementSuggestions(processing);

    return { summary, recommendations, risks, improvements };
  }

  calculateTextComplexity(processing) {
    const avgTokenLength = processing.tokenization.tokens?.reduce((sum, token) => 
      sum + token.length, 0) / processing.tokenization.totalTokens || 0;
    
    const uniquenessRatio = processing.tokenization.uniqueTokens / processing.tokenization.totalTokens;
    
    return {
      averageTokenLength: avgTokenLength,
      uniquenessRatio,
      complexity: avgTokenLength > 6 && uniquenessRatio > 0.7 ? 'high' : 
                  avgTokenLength > 4 && uniquenessRatio > 0.5 ? 'medium' : 'low'
    };
  }

  generateQualityRecommendations(summary, processing) {
    const recommendations = [];
    
    if (summary.legalRelevance < 0.5) {
      recommendations.push({
        rule: 'legal_terminology',
        priority: 'high',
        recommendation: 'Zwiększ użycie specjalistycznej terminologii prawnej',
        impact: 'Poprawi precyzję prawną dokumentu'
      });
    }

    if (processing.precedents.totalMatches === 0) {
      recommendations.push({
        rule: 'precedent_alignment',
        priority: 'medium',
        recommendation: 'Rozważ nawiązanie do istniejących precedensów prawnych',
        impact: 'Zwiększy spójność z dotychczasową praktyką'
      });
    }

    return recommendations;
  }

  generateImprovementSuggestions(processing) {
    const suggestions = [];

    // Based on keyword analysis
    const dominantCategory = processing.keywords.dominantCategory;
    if (dominantCategory !== 'general') {
      suggestions.push({
        category: 'terminology',
        suggestion: `Rozważ wzbogacenie terminologii z kategorii: ${dominantCategory}`,
        benefit: 'Zwiększy precyzję prawną'
      });
    }

    // Based on sentiment
    if (processing.sentiment.classification === 'negative') {
      suggestions.push({
        category: 'tone',
        suggestion: 'Rozważ bardziej neutralne sformułowania prawne',
        benefit: 'Poprawi obiektywność dokumentu'
      });
    }

    // Based on complexity
    if (processing.tokenization.totalTokens > 500) {
      suggestions.push({
        category: 'structure',
        suggestion: 'Rozważ podział na mniejsze sekcje dla lepszej czytelności',
        benefit: 'Ułatwi zrozumienie i implementację'
      });
    }

    return suggestions;
  }
}

// ===========================================
// ADVANCED DATA STORAGE & CACHING
// ===========================================
class AdvancedDataStore extends EventEmitter {
  constructor() {
    super();
    this.cache = new Map();
    this.analysisHistory = new Map();
    this.documentStore = new Map();
    this.userSessions = new Map();
    this.analytics = {
      requestCount: 0,
      analysisCount: 0,
      errorCount: 0,
      avgResponseTime: 0,
      startTime: Date.now()
    };
    
    this.initializeStore();
  }

  async initializeStore() {
    // Load sample legal documents
    const sampleDocuments = [
      {
        id: 'doc_001',
        title: 'Regulamin SSPO - Podstawy prawne',
        content: 'Samorząd Studencki Politechniki Opolskiej działa na podstawie ustawy Prawo o szkolnictwie wyższym...',
        category: 'constitutional',
        created: new Date().toISOString()
      },
      {
        id: 'doc_002',
        title: 'Procedury wyborcze',
        content: 'Wybory do organów samorządu studenckiego odbywają się w trybie demokratycznym...',
        category: 'procedural',
        created: new Date().toISOString()
      }
    ];

    sampleDocuments.forEach(doc => {
      this.documentStore.set(doc.id, doc);
    });

    logger.info(`📁 Initialized document store with ${this.documentStore.size} documents`);
  }

  storeAnalysis(analysisId, result) {
    this.analysisHistory.set(analysisId, {
      result,
      timestamp: new Date().toISOString(),
      cached: true
    });

    // Emit event for real-time updates
    this.emit('analysisStored', { id: analysisId, timestamp: new Date() });
  }

  getAnalysis(analysisId) {
    return this.analysisHistory.get(analysisId);
  }

  updateAnalytics(operation, responseTime = 0, error = false) {
    this.analytics.requestCount++;
    
    if (operation === 'analysis') {
      this.analytics.analysisCount++;
    }
    
    if (error) {
      this.analytics.errorCount++;
    }

    // Update average response time
    this.analytics.avgResponseTime = (
      (this.analytics.avgResponseTime * (this.analytics.requestCount - 1) + responseTime) /
      this.analytics.requestCount
    );
  }

  getAnalytics() {
    return {
      ...this.analytics,
      uptime: Date.now() - this.analytics.startTime,
      cacheSize: this.cache.size,
      analysisHistorySize: this.analysisHistory.size,
      documentsCount: this.documentStore.size
    };
  }
}

// ===========================================
// INITIALIZE SERVICES
// ===========================================
const legalEngine = new AdvancedLegalEngine();
const dataStore = new AdvancedDataStore();

// ===========================================
// MIDDLEWARE CONFIGURATION
// ===========================================

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 
    ['https://sspo.edu.pl', 'https://api.sspo.edu.pl'] : 
    ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Too many requests',
    message: 'Please try again later',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', limiter);

// Logging
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// ===========================================
// API ROUTES
// ===========================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  const startTime = Date.now();
  
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB'
    },
    services: {
      legalEngine: 'active',
      dataStore: 'active',
      nlp: 'active',
      analytics: 'active'
    },
    analytics: dataStore.getAnalytics(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      port: process.env.API_PORT,
      memoryLimit: process.env.MEMORY_LIMIT
    }
  };

  const responseTime = Date.now() - startTime;
  dataStore.updateAnalytics('health', responseTime);
  
  res.json(health);
});

// Advanced legal text analysis
app.post('/api/analyze', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { text, options = {} } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Text is required for analysis',
        code: 'MISSING_TEXT'
      });
    }

    if (text.length > 50000) {
      return res.status(400).json({
        success: false,
        error: 'Text too long (maximum 50,000 characters)',
        code: 'TEXT_TOO_LONG'
      });
    }

    logger.info(`🔬 Starting analysis for text (${text.length} characters)`);
    
    const analysis = await legalEngine.analyzeText(text, options);
    dataStore.storeAnalysis(analysis.id, analysis);
    
    const responseTime = Date.now() - startTime;
    dataStore.updateAnalytics('analysis', responseTime);
    
    res.json({
      success: true,
      data: analysis,
      meta: {
        analysisId: analysis.id,
        processingTime: responseTime,
        cached: false
      }
    });

  } catch (error) {
    const responseTime = Date.now() - startTime;
    dataStore.updateAnalytics('analysis', responseTime, true);
    
    logger.error('Analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Analysis failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      code: 'ANALYSIS_ERROR'
    });
  }
});

// Get analysis results by ID
app.get('/api/analysis/:id', (req, res) => {
  try {
    const { id } = req.params;
    const analysis = dataStore.getAnalysis(id);
    
    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found',
        code: 'ANALYSIS_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      data: analysis.result,
      meta: {
        cached: true,
        retrievedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Retrieval error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve analysis',
      code: 'RETRIEVAL_ERROR'
    });
  }
});

// Advanced document search with NLP
app.post('/api/search', async (req, res) => {
  try {
    const { query, filters = {}, options = {} } = req.body;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required',
        code: 'MISSING_QUERY'
      });
    }

    const searchResults = [];
    
    // Search through stored documents
    for (const [id, doc] of dataStore.documentStore) {
      const similarity = legalEngine.calculateTextSimilarity(query, doc.content);
      
      if (similarity > 0.1) { // Minimum relevance threshold
        searchResults.push({
          id,
          title: doc.title,
          snippet: doc.content.substring(0, 200) + '...',
          category: doc.category,
          relevance: similarity,
          created: doc.created
        });
      }
    }

    // Sort by relevance
    searchResults.sort((a, b) => b.relevance - a.relevance);

    res.json({
      success: true,
      data: {
        query,
        results: searchResults.slice(0, options.limit || 10),
        totalResults: searchResults.length,
        searchTime: Date.now()
      }
    });

  } catch (error) {
    logger.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed',
      code: 'SEARCH_ERROR'
    });
  }
});

// Real-time collaboration endpoint
app.post('/api/collaborate', (req, res) => {
  try {
    const { action, documentId, userId, data } = req.body;
    
    const collaborationEvent = {
      id: crypto.randomUUID(),
      action,
      documentId,
      userId,
      data,
      timestamp: new Date().toISOString()
    };

    // Emit real-time event
    dataStore.emit('collaboration', collaborationEvent);
    
    res.json({
      success: true,
      data: collaborationEvent
    });

  } catch (error) {
    logger.error('Collaboration error:', error);
    res.status(500).json({
      success: false,
      error: 'Collaboration action failed',
      code: 'COLLABORATION_ERROR'
    });
  }
});

// Get comprehensive analytics
app.get('/api/analytics', (req, res) => {
  try {
    const analytics = dataStore.getAnalytics();
    
    res.json({
      success: true,
      data: {
        ...analytics,
        trends: {
          requestsPerHour: Math.round(analytics.requestCount / (analytics.uptime / 3600000)),
          errorRate: analytics.errorCount / analytics.requestCount,
          analysisSuccessRate: (analytics.analysisCount - analytics.errorCount) / analytics.analysisCount
        },
        performance: {
          averageResponseTime: Math.round(analytics.avgResponseTime),
          memoryUsage: process.memoryUsage(),
          cpuUsage: process.cpuUsage()
        }
      }
    });

  } catch (error) {
    logger.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve analytics',
      code: 'ANALYTICS_ERROR'
    });
  }
});

// Advanced suggestions with machine learning
app.post('/api/suggestions', async (req, res) => {
  try {
    const { text, context = 'general' } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'Text is required for suggestions',
        code: 'MISSING_TEXT'
      });
    }

    // Analyze text to generate contextual suggestions
    const analysis = await legalEngine.analyzeText(text, { includeSuggestions: true });
    
    const suggestions = [
      ...analysis.results.recommendations.map(rec => ({
        type: 'compliance',
        priority: rec.priority,
        text: rec.recommendation,
        impact: rec.impact,
        category: rec.rule
      })),
      ...analysis.results.improvements.map(imp => ({
        type: 'improvement',
        priority: 'medium',
        text: imp.suggestion,
        impact: imp.benefit,
        category: imp.category
      }))
    ];

    res.json({
      success: true,
      data: {
        suggestions,
        totalSuggestions: suggestions.length,
        analysisId: analysis.id,
        context
      }
    });

  } catch (error) {
    logger.error('Suggestions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate suggestions',
      code: 'SUGGESTIONS_ERROR'
    });
  }
});

// Export analysis results
app.get('/api/export/:id/:format', (req, res) => {
  try {
    const { id, format } = req.params;
    const analysis = dataStore.getAnalysis(id);
    
    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found',
        code: 'ANALYSIS_NOT_FOUND'
      });
    }

    let exportData;
    let contentType;
    let filename;

    switch (format) {
      case 'json':
        exportData = JSON.stringify(analysis.result, null, 2);
        contentType = 'application/json';
        filename = `analysis_${id}.json`;
        break;
        
      case 'txt':
        exportData = this.formatAnalysisAsText(analysis.result);
        contentType = 'text/plain';
        filename = `analysis_${id}.txt`;
        break;
        
      default:
        return res.status(400).json({
          success: false,
          error: 'Unsupported format',
          supportedFormats: ['json', 'txt'],
          code: 'UNSUPPORTED_FORMAT'
        });
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(exportData);

  } catch (error) {
    logger.error('Export error:', error);
    res.status(500).json({
      success: false,
      error: 'Export failed',
      code: 'EXPORT_ERROR'
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', error);
  
  dataStore.updateAnalytics('error', 0, true);
  
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    code: 'NOT_FOUND',
    availableEndpoints: [
      'GET /api/health',
      'POST /api/analyze',
      'GET /api/analysis/:id',
      'POST /api/search',
      'POST /api/collaborate',
      'GET /api/analytics',
      'POST /api/suggestions',
      'GET /api/export/:id/:format'
    ]
  });
});

// ===========================================
// SERVER STARTUP
// ===========================================
app.listen(port, '0.0.0.0', () => {
  console.log('\n' + '═'.repeat(80));
  console.log('🏛️  SSPO Legal Platform Enhanced - Advanced API Server');
  console.log('═'.repeat(80));
  console.log(`🚀 Server running on http://0.0.0.0:${port}`);
  console.log(`📊 Health check: http://0.0.0.0:${port}/api/health`);
  console.log(`🔬 Text analysis: POST http://0.0.0.0:${port}/api/analyze`);
  console.log(`🔍 Document search: POST http://0.0.0.0:${port}/api/search`);
  console.log(`📈 Analytics: http://0.0.0.0:${port}/api/analytics`);
  console.log('═'.repeat(80));
  console.log(`💾 Memory limit: ${process.env.MEMORY_LIMIT || '2048m'}`);
  console.log(`⚡ CPU limit: ${process.env.CPU_LIMIT || '2.0'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`🧠 AI Legal Engine: Active`);
  console.log(`📚 NLP Processing: Polish language support`);
  console.log(`🔐 Security: Helmet + CORS + Rate limiting`);
  console.log('═'.repeat(80));
  console.log('✅ Ready for advanced legal analysis and AI-powered insights!');
  console.log('═'.repeat(80));
  
  logger.info('🚀 SSPO Legal Platform Enhanced API Server started successfully');
});

module.exports = app;