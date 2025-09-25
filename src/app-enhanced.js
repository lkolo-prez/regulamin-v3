const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const natural = require('natural');
const nodeSchedule = require('node-schedule');
const winston = require('winston');
const { marked } = require('marked');
const hljs = require('highlight.js');
const EventEmitter = require('events');

const app = express();
const PORT = process.env.PORT || 3000;

// Event system for real-time updates
const legalSystemEvents = new EventEmitter();

// Advanced logging configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error', maxsize: 5242880 }),
    new winston.transports.File({ filename: 'logs/legal-analysis.log', level: 'info', maxsize: 5242880 }),
    new winston.transports.Console({
      format: winston.format.simple(),
      silent: process.env.NODE_ENV === 'production'
    })
  ]
});

// Memory-optimized data structures
class MemoryOptimizedStore {
  constructor() {
    this.suggestions = new Map();
    this.annotations = new Map();
    this.timeline = [];
    this.conflicts = new Map();
    this.references = new Map();
    this.precedents = new Map();
    this.searchIndex = {};
    this.cache = new Map();
    this.maxCacheSize = 1000; // Limit cache size for 2GB RAM
  }

  // LRU Cache implementation
  setCache(key, value) {
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, { value, timestamp: Date.now() });
  }

  getCache(key) {
    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.timestamp < 300000)) { // 5 min TTL
      return cached.value;
    }
    this.cache.delete(key);
    return null;
  }

  clearOldCache() {
    const now = Date.now();
    for (let [key, value] of this.cache.entries()) {
      if (now - value.timestamp > 300000) {
        this.cache.delete(key);
      }
    }
  }
}

const dataStore = new MemoryOptimizedStore();

// NLP and AI configuration for legal analysis
const stemmer = natural.PorterStemmer;
const analyzer = natural.SentimentAnalyzer;
const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;
const tfidf = new TfIdf();

// Enhanced legal keywords database
const legalKeywords = {
  obligations: {
    patterns: ['musi', 'zobowiązuje', 'powinien', 'ma obowiązek', 'jest zobowiązany', 'nakłada obowiązek'],
    weight: 0.9,
    category: 'mandatory'
  },
  rights: {
    patterns: ['ma prawo', 'może', 'jest uprawniony', 'przysługuje prawo', 'uprawnia do'],
    weight: 0.8,
    category: 'permissive'
  },
  prohibitions: {
    patterns: ['zabrania się', 'nie może', 'nie wolno', 'jest zabronione', 'wyklucza się'],
    weight: 0.95,
    category: 'prohibitive'
  },
  procedures: {
    patterns: ['procedura', 'tryb', 'sposób', 'metodyka', 'proces', 'algorytm', 'sekwencja'],
    weight: 0.7,
    category: 'procedural'
  },
  penalties: {
    patterns: ['kara', 'sankcja', 'odpowiedzialność', 'konsekwencja', 'penalizacja'],
    weight: 0.85,
    category: 'punitive'
  },
  timeframes: {
    patterns: ['termin', 'okres', 'czas', 'deadline', 'do dnia', 'w ciągu', 'przed upływem'],
    weight: 0.75,
    category: 'temporal'
  },
  conditions: {
    patterns: ['jeśli', 'jeżeli', 'gdy', 'w przypadku', 'pod warunkiem', 'o ile'],
    weight: 0.6,
    category: 'conditional'
  },
  exceptions: {
    patterns: ['z wyjątkiem', 'oprócz', 'poza', 'nie dotyczy', 'wyłącza się'],
    weight: 0.8,
    category: 'exceptional'
  }
};

// Document hierarchy for compliance checking
const documentHierarchy = {
  'konstytucja': { level: 1, weight: 100, scope: 'constitutional' },
  'ustawa': { level: 2, weight: 90, scope: 'statutory' },
  'rozporządzenie': { level: 3, weight: 80, scope: 'regulatory' },
  'regulamin-sspo': { level: 4, weight: 70, scope: 'organizational' },
  'ordynacja-wyborcza': { level: 4, weight: 70, scope: 'procedural' },
  'kodeks-etyczny': { level: 4, weight: 65, scope: 'ethical' },
  'regulamin-finansowy': { level: 4, weight: 68, scope: 'financial' },
  'regulamin-wrs': { level: 4, weight: 66, scope: 'representative' }
};

// Advanced legal analysis engine
class LegalAnalysisEngine {
  constructor() {
    this.conflictPatterns = new Map();
    this.precedentDatabase = new Map();
    this.initializeEngine();
  }

  initializeEngine() {
    // Initialize common conflict patterns
    this.conflictPatterns.set('contradictory_obligations', {
      pattern: /(?:musi|zobowiązany).*(?:nie może|zabrania się)/gi,
      severity: 'high',
      description: 'Sprzeczne zobowiązania w tym samym kontekście'
    });

    this.conflictPatterns.set('temporal_conflicts', {
      pattern: /termin.*(\d+).*dni.*termin.*(\d+).*dni/gi,
      severity: 'medium',
      description: 'Możliwe konflikty terminów'
    });

    this.conflictPatterns.set('authority_overlap', {
      pattern: /(?:decyduje|ustala|określa).*(?:decyduje|ustala|określa)/gi,
      severity: 'medium',
      description: 'Nakładanie się kompetencji'
    });

    logger.info('Legal analysis engine initialized');
  }

  // Comprehensive legal text analysis
  analyzeLegalText(text, context = {}) {
    const cacheKey = `analysis_${crypto.createHash('md5').update(text).digest('hex')}`;
    const cached = dataStore.getCache(cacheKey);
    if (cached) return cached;

    const analysis = {
      textLength: text.length,
      complexity: this.calculateComplexity(text),
      legalElements: this.extractLegalElements(text),
      sentiment: this.analyzeSentiment(text),
      conflicts: this.detectConflicts(text),
      references: this.extractReferences(text),
      impact: this.assessImpact(text, context),
      compliance: this.checkCompliance(text, context),
      readability: this.assessReadability(text),
      timestamp: Date.now()
    };

    dataStore.setCache(cacheKey, analysis);
    return analysis;
  }

  calculateComplexity(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = tokenizer.tokenize(text.toLowerCase());
    const avgSentenceLength = words.length / sentences.length;
    const legalTermCount = this.countLegalTerms(text);
    
    return {
      sentences: sentences.length,
      words: words.length,
      avgSentenceLength: Math.round(avgSentenceLength * 100) / 100,
      legalTermDensity: Math.round((legalTermCount / words.length) * 10000) / 100,
      complexityScore: Math.min(100, Math.round(
        (avgSentenceLength * 0.4) + 
        (legalTermCount * 0.6) + 
        (sentences.length * 0.1)
      ))
    };
  }

  extractLegalElements(text) {
    const elements = {};
    const lowerText = text.toLowerCase();

    for (const [category, config] of Object.entries(legalKeywords)) {
      elements[category] = {
        count: 0,
        matches: [],
        weight: config.weight
      };

      config.patterns.forEach(pattern => {
        const regex = new RegExp(pattern, 'gi');
        const matches = text.match(regex) || [];
        elements[category].count += matches.length;
        elements[category].matches.push(...matches);
      });
    }

    return elements;
  }

  analyzeSentiment(text) {
    const tokens = tokenizer.tokenize(text.toLowerCase());
    const stems = tokens.map(token => stemmer.stem(token));
    
    // Simple legal sentiment analysis (positive/negative/neutral legal language)
    const positiveTerms = ['prawo', 'uprawnienie', 'może', 'dozwolone', 'zgodne'];
    const negativeTerms = ['zakaz', 'zabronione', 'kara', 'sankcja', 'naruszenie'];
    
    let positiveCount = 0;
    let negativeCount = 0;

    stems.forEach(stem => {
      if (positiveTerms.some(term => stem.includes(term))) positiveCount++;
      if (negativeTerms.some(term => stem.includes(term))) negativeCount++;
    });

    const total = positiveCount + negativeCount;
    return {
      positive: positiveCount,
      negative: negativeCount,
      neutral: tokens.length - total,
      score: total > 0 ? (positiveCount - negativeCount) / total : 0,
      tendency: total > 0 ? (positiveCount > negativeCount ? 'permissive' : 'restrictive') : 'neutral'
    };
  }

  detectConflicts(text) {
    const conflicts = [];
    
    for (const [type, config] of this.conflictPatterns.entries()) {
      const matches = text.match(config.pattern);
      if (matches) {
        conflicts.push({
          type,
          severity: config.severity,
          description: config.description,
          matches: matches.length,
          evidence: matches.slice(0, 3) // Limit evidence for memory
        });
      }
    }

    return conflicts;
  }

  extractReferences(text) {
    const references = {
      internal: [],
      external: [],
      articles: [],
      paragraphs: []
    };

    // Extract article references
    const articlePattern = /art\.\s*(\d+)/gi;
    let match;
    while ((match = articlePattern.exec(text)) !== null) {
      references.articles.push(match[1]);
    }

    // Extract paragraph references  
    const paragraphPattern = /§\s*(\d+)/gi;
    while ((match = paragraphPattern.exec(text)) !== null) {
      references.paragraphs.push(match[1]);
    }

    // Extract document references
    const docPattern = /(regulamin|ustawa|rozporządzenie|kodeks)[\s\w-]*/gi;
    while ((match = docPattern.exec(text)) !== null) {
      references.internal.push(match[0].trim());
    }

    return references;
  }

  assessImpact(text, context) {
    const elements = this.extractLegalElements(text);
    let impactScore = 0;

    // Calculate impact based on legal elements
    Object.entries(elements).forEach(([category, data]) => {
      impactScore += data.count * data.weight * 10;
    });

    // Adjust based on document hierarchy
    const docType = context.document || 'unknown';
    const hierarchy = documentHierarchy[docType] || { weight: 50 };
    impactScore = impactScore * (hierarchy.weight / 100);

    return {
      score: Math.min(100, Math.round(impactScore)),
      level: impactScore > 80 ? 'high' : impactScore > 40 ? 'medium' : 'low',
      factors: {
        legalDensity: Object.values(elements).reduce((sum, el) => sum + el.count, 0),
        documentWeight: hierarchy.weight,
        textLength: text.length > 1000 ? 'high' : text.length > 500 ? 'medium' : 'low'
      }
    };
  }

  checkCompliance(text, context) {
    // Simplified compliance check
    const compliance = {
      score: 85, // Base compliance score
      issues: [],
      recommendations: []
    };

    // Check for common compliance issues
    if (!text.includes('zgodnie z') && !text.includes('w oparciu o')) {
      compliance.issues.push('Brak odniesienia do podstawy prawnej');
      compliance.score -= 10;
    }

    if (text.length > 2000 && !text.includes('.') && !text.includes(';')) {
      compliance.issues.push('Zbyt długi tekst bez podziału na zdania');
      compliance.score -= 5;
    }

    return compliance;
  }

  assessReadability(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = tokenizer.tokenize(text);
    const avgWordsPerSentence = words.length / sentences.length;
    
    // Simplified readability index for Polish legal texts
    let readabilityScore = 100 - (avgWordsPerSentence * 1.5);
    readabilityScore = Math.max(0, Math.min(100, readabilityScore));

    return {
      score: Math.round(readabilityScore),
      level: readabilityScore > 70 ? 'easy' : readabilityScore > 40 ? 'medium' : 'difficult',
      avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
      totalWords: words.length,
      totalSentences: sentences.length
    };
  }

  countLegalTerms(text) {
    let count = 0;
    const lowerText = text.toLowerCase();
    
    Object.values(legalKeywords).forEach(category => {
      category.patterns.forEach(pattern => {
        const matches = lowerText.match(new RegExp(pattern, 'g')) || [];
        count += matches.length;
      });
    });

    return count;
  }

  // Generate legal precedent matching
  findPrecedents(text, context) {
    const cacheKey = `precedents_${crypto.createHash('md5').update(text).digest('hex')}`;
    const cached = dataStore.getCache(cacheKey);
    if (cached) return cached;

    const precedents = [];
    const textTokens = tokenizer.tokenize(text.toLowerCase());
    
    // Search through precedent database (simplified)
    for (const [id, precedent] of dataStore.precedents.entries()) {
      const similarity = this.calculateSimilarity(textTokens, precedent.tokens);
      if (similarity > 0.3) {
        precedents.push({
          id,
          similarity: Math.round(similarity * 100),
          title: precedent.title,
          summary: precedent.summary,
          relevance: similarity > 0.7 ? 'high' : similarity > 0.5 ? 'medium' : 'low'
        });
      }
    }

    precedents.sort((a, b) => b.similarity - a.similarity);
    const result = precedents.slice(0, 5); // Top 5 precedents
    
    dataStore.setCache(cacheKey, result);
    return result;
  }

  calculateSimilarity(tokens1, tokens2) {
    const set1 = new Set(tokens1);
    const set2 = new Set(tokens2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return intersection.size / union.size;
  }
}

// Initialize legal analysis engine
const legalEngine = new LegalAnalysisEngine();

// Enhanced suggestion class
class LegalSuggestion {
  constructor(data) {
    this.id = data.id || Date.now() + Math.random();
    this.author = data.author || 'Anonymous';
    this.email = data.email || '';
    this.document = data.document;
    this.section = data.section || '';
    this.content = data.content;
    this.reasoning = data.reasoning || '';
    this.urgency = data.urgency || 'medium';
    this.category = data.category || 'general';
    this.status = 'pending';
    this.votes = { up: 0, down: 0 };
    this.comments = [];
    this.createdAt = new Date().toISOString();
    this.updatedAt = this.createdAt;
    
    // Enhanced legal analysis
    this.legalAnalysis = legalEngine.analyzeLegalText(data.content, { document: data.document });
    this.precedents = legalEngine.findPrecedents(data.content, { document: data.document });
    
    // Track changes for timeline
    this.changeHistory = [{
      action: 'created',
      timestamp: this.createdAt,
      details: { status: 'pending' }
    }];
  }

  updateStatus(newStatus, reason = '') {
    const oldStatus = this.status;
    this.status = newStatus;
    this.updatedAt = new Date().toISOString();
    
    this.changeHistory.push({
      action: 'status_changed',
      timestamp: this.updatedAt,
      details: { from: oldStatus, to: newStatus, reason }
    });

    // Update timeline
    dataStore.timeline.push({
      type: 'suggestion_status_change',
      suggestionId: this.id,
      document: this.document,
      oldStatus,
      newStatus,
      timestamp: this.updatedAt
    });

    legalSystemEvents.emit('suggestionStatusChanged', {
      id: this.id,
      oldStatus,
      newStatus,
      document: this.document
    });

    logger.info(`Suggestion ${this.id} status changed from ${oldStatus} to ${newStatus}`, {
      suggestionId: this.id,
      document: this.document,
      reason
    });
  }

  addComment(author, content) {
    const comment = {
      id: Date.now() + Math.random(),
      author,
      content,
      timestamp: new Date().toISOString(),
      legalAnalysis: legalEngine.analyzeLegalText(content, { document: this.document })
    };

    this.comments.push(comment);
    this.updatedAt = new Date().toISOString();

    legalSystemEvents.emit('commentAdded', {
      suggestionId: this.id,
      comment
    });

    return comment;
  }

  vote(type, userId = 'anonymous') {
    if (type === 'up') {
      this.votes.up++;
    } else if (type === 'down') {
      this.votes.down++;
    }

    this.updatedAt = new Date().toISOString();
    
    legalSystemEvents.emit('votecast', {
      suggestionId: this.id,
      voteType: type,
      userId,
      totalVotes: this.votes.up + this.votes.down
    });
  }

  getScore() {
    return this.votes.up - this.votes.down;
  }

  getPriorityScore() {
    const urgencyWeights = { low: 1, medium: 2, high: 3, critical: 4 };
    const impactScore = this.legalAnalysis.impact.score / 100;
    const voteScore = Math.min(this.getScore() / 10, 1);
    const timeDecay = Math.max(0, 1 - ((Date.now() - new Date(this.createdAt).getTime()) / (7 * 24 * 60 * 60 * 1000))); // Week decay
    
    return (urgencyWeights[this.urgency] * 0.3) + 
           (impactScore * 0.4) + 
           (voteScore * 0.2) + 
           (timeDecay * 0.1);
  }
}

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Static files with caching
app.use(express.static('public', {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : '0',
  etag: true
}));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  next();
});

// Memory cleanup job (every 5 minutes)
nodeSchedule.scheduleJob('*/5 * * * *', () => {
  dataStore.clearOldCache();
  logger.info('Memory cleanup completed', {
    cacheSize: dataStore.cache.size,
    suggestionsCount: dataStore.suggestions.size
  });
});

// Load existing data
function loadData() {
  try {
    if (fs.existsSync('data/suggestions.json')) {
      const data = JSON.parse(fs.readFileSync('data/suggestions.json', 'utf8'));
      data.forEach(suggestionData => {
        const suggestion = new LegalSuggestion(suggestionData);
        dataStore.suggestions.set(suggestion.id, suggestion);
      });
      logger.info(`Loaded ${dataStore.suggestions.size} suggestions`);
    }

    if (fs.existsSync('data/precedents.json')) {
      const precedents = JSON.parse(fs.readFileSync('data/precedents.json', 'utf8'));
      precedents.forEach(precedent => {
        precedent.tokens = tokenizer.tokenize(precedent.content.toLowerCase());
        dataStore.precedents.set(precedent.id, precedent);
      });
      logger.info(`Loaded ${dataStore.precedents.size} legal precedents`);
    }

  } catch (error) {
    logger.error('Error loading data:', error);
  }
}

// Save data
function saveData() {
  try {
    if (!fs.existsSync('data')) {
      fs.mkdirSync('data', { recursive: true });
    }

    const suggestionData = Array.from(dataStore.suggestions.values())
      .map(s => ({
        id: s.id,
        author: s.author,
        email: s.email,
        document: s.document,
        section: s.section,
        content: s.content,
        reasoning: s.reasoning,
        urgency: s.urgency,
        category: s.category,
        status: s.status,
        votes: s.votes,
        comments: s.comments,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
        changeHistory: s.changeHistory
      }));

    fs.writeFileSync('data/suggestions.json', JSON.stringify(suggestionData, null, 2));
    logger.info('Data saved successfully');
  } catch (error) {
    logger.error('Error saving data:', error);
  }
}

// Enhanced API Routes

// Get suggestions with advanced filtering and sorting
app.get('/api/suggestions', (req, res) => {
  try {
    const {
      document,
      status,
      category,
      urgency,
      sortBy = 'priority',
      order = 'desc',
      limit = 20,
      offset = 0,
      search
    } = req.query;

    let suggestions = Array.from(dataStore.suggestions.values());

    // Apply filters
    if (document) suggestions = suggestions.filter(s => s.document === document);
    if (status) suggestions = suggestions.filter(s => s.status === status);
    if (category) suggestions = suggestions.filter(s => s.category === category);
    if (urgency) suggestions = suggestions.filter(s => s.urgency === urgency);
    
    // Search functionality
    if (search) {
      const searchLower = search.toLowerCase();
      suggestions = suggestions.filter(s => 
        s.content.toLowerCase().includes(searchLower) ||
        s.reasoning.toLowerCase().includes(searchLower) ||
        s.author.toLowerCase().includes(searchLower)
      );
    }

    // Sort suggestions
    suggestions.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'votes':
          comparison = b.getScore() - a.getScore();
          break;
        case 'priority':
          comparison = b.getPriorityScore() - a.getPriorityScore();
          break;
        case 'impact':
          comparison = b.legalAnalysis.impact.score - a.legalAnalysis.impact.score;
          break;
        case 'complexity':
          comparison = b.legalAnalysis.complexity.complexityScore - a.legalAnalysis.complexity.complexityScore;
          break;
        case 'date':
        default:
          comparison = new Date(b.createdAt) - new Date(a.createdAt);
      }
      return order === 'asc' ? -comparison : comparison;
    });

    // Pagination
    const total = suggestions.length;
    const paginatedSuggestions = suggestions.slice(offset, offset + parseInt(limit));

    // Analytics
    const analytics = {
      total,
      byStatus: {
        pending: suggestions.filter(s => s.status === 'pending').length,
        approved: suggestions.filter(s => s.status === 'approved').length,
        rejected: suggestions.filter(s => s.status === 'rejected').length,
        review: suggestions.filter(s => s.status === 'review').length
      },
      byUrgency: {
        low: suggestions.filter(s => s.urgency === 'low').length,
        medium: suggestions.filter(s => s.urgency === 'medium').length,
        high: suggestions.filter(s => s.urgency === 'high').length,
        critical: suggestions.filter(s => s.urgency === 'critical').length
      },
      averageImpact: suggestions.length > 0 
        ? Math.round(suggestions.reduce((sum, s) => sum + s.legalAnalysis.impact.score, 0) / suggestions.length)
        : 0,
      averageComplexity: suggestions.length > 0
        ? Math.round(suggestions.reduce((sum, s) => sum + s.legalAnalysis.complexity.complexityScore, 0) / suggestions.length)
        : 0
    };

    res.json({
      success: true,
      data: paginatedSuggestions,
      pagination: {
        total,
        offset: parseInt(offset),
        limit: parseInt(limit),
        hasMore: offset + parseInt(limit) < total
      },
      analytics
    });

  } catch (error) {
    logger.error('Error fetching suggestions:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Error fetching suggestions'
    });
  }
});

// Create new suggestion with enhanced legal analysis
app.post('/api/suggestions', (req, res) => {
  try {
    const {
      author,
      email,
      document,
      section,
      content,
      reasoning,
      urgency = 'medium',
      category = 'general'
    } = req.body;

    // Validation
    if (!author || !document || !content) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['author', 'document', 'content']
      });
    }

    // Create new suggestion with legal analysis
    const suggestion = new LegalSuggestion({
      author,
      email,
      document,
      section,
      content,
      reasoning,
      urgency,
      category
    });

    dataStore.suggestions.set(suggestion.id, suggestion);
    saveData();

    logger.info(`New suggestion created: ${suggestion.id}`, {
      author,
      document,
      impactScore: suggestion.legalAnalysis.impact.score,
      complexityScore: suggestion.legalAnalysis.complexity.complexityScore
    });

    res.status(201).json({
      success: true,
      data: suggestion,
      message: 'Suggestion created successfully'
    });

  } catch (error) {
    logger.error('Error creating suggestion:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Error creating suggestion'
    });
  }
});

// Get specific suggestion with full details
app.get('/api/suggestions/:id', (req, res) => {
  try {
    const id = parseFloat(req.params.id);
    const suggestion = dataStore.suggestions.get(id);

    if (!suggestion) {
      return res.status(404).json({
        success: false,
        error: 'Suggestion not found'
      });
    }

    res.json({
      success: true,
      data: suggestion
    });

  } catch (error) {
    logger.error('Error fetching suggestion:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = { app, PORT, dataStore, legalEngine, logger };