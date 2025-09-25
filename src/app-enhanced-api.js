// Advanced API endpoints continuation

// Vote on suggestion
app.post('/api/suggestions/:id/vote', (req, res) => {
  try {
    const id = parseFloat(req.params.id);
    const { type, userId = 'anonymous' } = req.body;
    const suggestion = dataStore.suggestions.get(id);

    if (!suggestion) {
      return res.status(404).json({
        success: false,
        error: 'Suggestion not found'
      });
    }

    if (!['up', 'down'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid vote type',
        validTypes: ['up', 'down']
      });
    }

    suggestion.vote(type, userId);
    saveData();

    res.json({
      success: true,
      data: {
        votes: suggestion.votes,
        score: suggestion.getScore(),
        priorityScore: Math.round(suggestion.getPriorityScore() * 100) / 100
      }
    });

  } catch (error) {
    logger.error('Error voting on suggestion:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Add comment to suggestion
app.post('/api/suggestions/:id/comments', (req, res) => {
  try {
    const id = parseFloat(req.params.id);
    const { author, content } = req.body;
    const suggestion = dataStore.suggestions.get(id);

    if (!suggestion) {
      return res.status(404).json({
        success: false,
        error: 'Suggestion not found'
      });
    }

    if (!author || !content) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['author', 'content']
      });
    }

    const comment = suggestion.addComment(author, content);
    saveData();

    res.status(201).json({
      success: true,
      data: comment
    });

  } catch (error) {
    logger.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Update suggestion status (admin only in production)
app.put('/api/suggestions/:id/status', (req, res) => {
  try {
    const id = parseFloat(req.params.id);
    const { status, reason = '' } = req.body;
    const suggestion = dataStore.suggestions.get(id);

    if (!suggestion) {
      return res.status(404).json({
        success: false,
        error: 'Suggestion not found'
      });
    }

    const validStatuses = ['pending', 'review', 'approved', 'rejected', 'implemented'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status',
        validStatuses
      });
    }

    suggestion.updateStatus(status, reason);
    saveData();

    res.json({
      success: true,
      data: {
        id: suggestion.id,
        status: suggestion.status,
        updatedAt: suggestion.updatedAt
      }
    });

  } catch (error) {
    logger.error('Error updating suggestion status:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Advanced legal analysis endpoint
app.post('/api/legal/analyze', (req, res) => {
  try {
    const { text, context = {} } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Text is required for analysis'
      });
    }

    if (text.length > 10000) {
      return res.status(400).json({
        success: false,
        error: 'Text too long (max 10000 characters)'
      });
    }

    const analysis = legalEngine.analyzeLegalText(text, context);
    const precedents = legalEngine.findPrecedents(text, context);

    res.json({
      success: true,
      data: {
        analysis,
        precedents,
        recommendations: generateRecommendations(analysis),
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Error performing legal analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Conflict detection endpoint
app.get('/api/legal/conflicts', (req, res) => {
  try {
    const { document, severity = 'all' } = req.query;
    let conflicts = Array.from(dataStore.conflicts.values());

    if (document) {
      conflicts = conflicts.filter(c => c.documents.includes(document));
    }

    if (severity !== 'all') {
      conflicts = conflicts.filter(c => c.severity === severity);
    }

    const conflictAnalytics = {
      total: conflicts.length,
      bySeverity: {
        high: conflicts.filter(c => c.severity === 'high').length,
        medium: conflicts.filter(c => c.severity === 'medium').length,
        low: conflicts.filter(c => c.severity === 'low').length
      },
      byDocument: {}
    };

    // Count conflicts by document
    conflicts.forEach(conflict => {
      conflict.documents.forEach(doc => {
        conflictAnalytics.byDocument[doc] = (conflictAnalytics.byDocument[doc] || 0) + 1;
      });
    });

    res.json({
      success: true,
      data: conflicts,
      analytics: conflictAnalytics
    });

  } catch (error) {
    logger.error('Error fetching conflicts:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Legal timeline endpoint
app.get('/api/legal/timeline', (req, res) => {
  try {
    const { 
      document, 
      type, 
      limit = 50, 
      offset = 0,
      startDate,
      endDate 
    } = req.query;

    let timeline = [...dataStore.timeline];

    // Apply filters
    if (document) timeline = timeline.filter(t => t.document === document);
    if (type) timeline = timeline.filter(t => t.type === type);
    
    if (startDate) {
      timeline = timeline.filter(t => new Date(t.timestamp) >= new Date(startDate));
    }
    
    if (endDate) {
      timeline = timeline.filter(t => new Date(t.timestamp) <= new Date(endDate));
    }

    // Sort by timestamp (newest first)
    timeline.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Pagination
    const total = timeline.length;
    const paginatedTimeline = timeline.slice(offset, offset + parseInt(limit));

    // Analytics
    const timelineAnalytics = {
      total,
      byType: {},
      byDocument: {},
      recentActivity: timeline.slice(0, 10).length
    };

    timeline.forEach(event => {
      timelineAnalytics.byType[event.type] = (timelineAnalytics.byType[event.type] || 0) + 1;
      if (event.document) {
        timelineAnalytics.byDocument[event.document] = (timelineAnalytics.byDocument[event.document] || 0) + 1;
      }
    });

    res.json({
      success: true,
      data: paginatedTimeline,
      pagination: {
        total,
        offset: parseInt(offset),
        limit: parseInt(limit),
        hasMore: offset + parseInt(limit) < total
      },
      analytics: timelineAnalytics
    });

  } catch (error) {
    logger.error('Error fetching timeline:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Advanced search endpoint
app.get('/api/search', (req, res) => {
  try {
    const { 
      q: query, 
      type = 'all', 
      document, 
      limit = 20, 
      includeAnalysis = false 
    } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Query must be at least 2 characters long'
      });
    }

    const results = performAdvancedSearch(query, { type, document, limit: parseInt(limit) });

    // Add legal analysis if requested
    if (includeAnalysis === 'true') {
      results.items = results.items.map(item => ({
        ...item,
        legalAnalysis: item.content ? legalEngine.analyzeLegalText(item.content, { document: item.document }) : null
      }));
    }

    res.json({
      success: true,
      query,
      ...results
    });

  } catch (error) {
    logger.error('Error performing search:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Legal references endpoint
app.get('/api/legal/references', (req, res) => {
  try {
    const { document, type = 'all' } = req.query;
    let references = Array.from(dataStore.references.values());

    if (document) {
      references = references.filter(r => r.source === document || r.target === document);
    }

    if (type !== 'all') {
      references = references.filter(r => r.type === type);
    }

    const referenceAnalytics = {
      total: references.length,
      byType: {},
      networkDensity: calculateNetworkDensity(references),
      mostReferenced: getMostReferencedDocuments(references)
    };

    references.forEach(ref => {
      referenceAnalytics.byType[ref.type] = (referenceAnalytics.byType[ref.type] || 0) + 1;
    });

    res.json({
      success: true,
      data: references,
      analytics: referenceAnalytics
    });

  } catch (error) {
    logger.error('Error fetching references:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Analytics dashboard endpoint
app.get('/api/analytics', (req, res) => {
  try {
    const { timeframe = '30d' } = req.query;
    
    const suggestions = Array.from(dataStore.suggestions.values());
    const timeline = dataStore.timeline;
    
    // Calculate timeframe
    const timeframeDays = parseInt(timeframe.replace('d', ''));
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeframeDays);

    const recentSuggestions = suggestions.filter(s => 
      new Date(s.createdAt) >= cutoffDate
    );

    const recentActivity = timeline.filter(t => 
      new Date(t.timestamp) >= cutoffDate
    );

    const analytics = {
      overview: {
        totalSuggestions: suggestions.length,
        recentSuggestions: recentSuggestions.length,
        pendingSuggestions: suggestions.filter(s => s.status === 'pending').length,
        approvedSuggestions: suggestions.filter(s => s.status === 'approved').length,
        implementedSuggestions: suggestions.filter(s => s.status === 'implemented').length
      },
      engagement: {
        totalVotes: suggestions.reduce((sum, s) => sum + s.votes.up + s.votes.down, 0),
        totalComments: suggestions.reduce((sum, s) => sum + s.comments.length, 0),
        averageVotesPerSuggestion: suggestions.length > 0 
          ? Math.round((suggestions.reduce((sum, s) => sum + s.votes.up + s.votes.down, 0) / suggestions.length) * 100) / 100
          : 0
      },
      legal: {
        averageImpactScore: suggestions.length > 0
          ? Math.round(suggestions.reduce((sum, s) => sum + s.legalAnalysis.impact.score, 0) / suggestions.length)
          : 0,
        averageComplexityScore: suggestions.length > 0
          ? Math.round(suggestions.reduce((sum, s) => sum + s.legalAnalysis.complexity.complexityScore, 0) / suggestions.length)
          : 0,
        totalConflicts: dataStore.conflicts.size,
        complianceScore: calculateOverallComplianceScore(suggestions)
      },
      activity: {
        recentEvents: recentActivity.length,
        dailyActivity: calculateDailyActivity(recentActivity, timeframeDays),
        mostActiveDocuments: getMostActiveDocuments(recentSuggestions)
      },
      trends: {
        suggestionTrend: calculateSuggestionTrend(suggestions, timeframeDays),
        popularCategories: getPopularCategories(recentSuggestions),
        urgencyDistribution: getUrgencyDistribution(recentSuggestions)
      }
    };

    res.json({
      success: true,
      timeframe,
      data: analytics,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Error generating analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      limit: 2048 // 2GB limit
    },
    cache: {
      size: dataStore.cache.size,
      maxSize: dataStore.maxCacheSize
    },
    data: {
      suggestions: dataStore.suggestions.size,
      timeline: dataStore.timeline.length,
      conflicts: dataStore.conflicts.size,
      precedents: dataStore.precedents.size
    }
  };

  // Check if memory usage is too high
  if (healthCheck.memory.used > healthCheck.memory.limit * 0.9) {
    healthCheck.status = 'warning';
    healthCheck.warnings = ['High memory usage'];
  }

  const statusCode = healthCheck.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(healthCheck);
});

// Utility functions

function generateRecommendations(analysis) {
  const recommendations = [];

  if (analysis.complexity.complexityScore > 80) {
    recommendations.push({
      type: 'complexity',
      priority: 'medium',
      message: 'Tekst jest bardzo złożony. Rozważ podział na krótsze zdania.'
    });
  }

  if (analysis.readability.score < 40) {
    recommendations.push({
      type: 'readability',
      priority: 'high',
      message: 'Tekst jest trudny do zrozumienia. Uprop język i strukturę zdań.'
    });
  }

  if (analysis.compliance.score < 70) {
    recommendations.push({
      type: 'compliance',
      priority: 'high',
      message: 'Możliwe problemy z zgodnością prawną. Sprawdź podstawę prawną.'
    });
  }

  if (analysis.conflicts.length > 0) {
    recommendations.push({
      type: 'conflicts',
      priority: 'critical',
      message: `Wykryto ${analysis.conflicts.length} potencjalnych konfliktów prawnych.`
    });
  }

  return recommendations;
}

function performAdvancedSearch(query, options) {
  const { type, document, limit } = options;
  const queryLower = query.toLowerCase();
  const tokens = tokenizer.tokenize(queryLower);
  
  let results = [];

  // Search suggestions
  if (type === 'all' || type === 'suggestions') {
    dataStore.suggestions.forEach(suggestion => {
      let score = 0;
      const content = suggestion.content.toLowerCase();
      const reasoning = suggestion.reasoning.toLowerCase();

      // Exact phrase match
      if (content.includes(queryLower) || reasoning.includes(queryLower)) {
        score += 10;
      }

      // Token matches
      tokens.forEach(token => {
        if (content.includes(token)) score += 2;
        if (reasoning.includes(token)) score += 2;
        if (suggestion.author.toLowerCase().includes(token)) score += 1;
      });

      // Document filter
      if (document && suggestion.document !== document) score = 0;

      if (score > 0) {
        results.push({
          type: 'suggestion',
          id: suggestion.id,
          document: suggestion.document,
          title: `Sugestia od ${suggestion.author}`,
          content: suggestion.content.substring(0, 200) + '...',
          score,
          status: suggestion.status,
          createdAt: suggestion.createdAt
        });
      }
    });
  }

  // Sort by score and limit results
  results.sort((a, b) => b.score - a.score);
  
  return {
    items: results.slice(0, limit),
    total: results.length,
    hasMore: results.length > limit
  };
}

function calculateNetworkDensity(references) {
  const documents = new Set();
  references.forEach(ref => {
    documents.add(ref.source);
    documents.add(ref.target);
  });
  
  const maxPossibleReferences = documents.size * (documents.size - 1);
  return maxPossibleReferences > 0 ? references.length / maxPossibleReferences : 0;
}

function getMostReferencedDocuments(references) {
  const refCount = {};
  references.forEach(ref => {
    refCount[ref.target] = (refCount[ref.target] || 0) + 1;
  });
  
  return Object.entries(refCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([doc, count]) => ({ document: doc, references: count }));
}

function calculateOverallComplianceScore(suggestions) {
  if (suggestions.length === 0) return 100;
  
  const totalScore = suggestions.reduce((sum, s) => 
    sum + (s.legalAnalysis.compliance?.score || 85), 0
  );
  
  return Math.round(totalScore / suggestions.length);
}

function calculateDailyActivity(events, days) {
  const dailyCount = {};
  const now = new Date();
  
  // Initialize all days with 0
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    dailyCount[dateKey] = 0;
  }
  
  // Count events by day
  events.forEach(event => {
    const dateKey = new Date(event.timestamp).toISOString().split('T')[0];
    if (dailyCount.hasOwnProperty(dateKey)) {
      dailyCount[dateKey]++;
    }
  });
  
  return dailyCount;
}

function getMostActiveDocuments(suggestions) {
  const docCount = {};
  suggestions.forEach(s => {
    docCount[s.document] = (docCount[s.document] || 0) + 1;
  });
  
  return Object.entries(docCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([doc, count]) => ({ document: doc, suggestions: count }));
}

function calculateSuggestionTrend(suggestions, days) {
  const now = new Date();
  const currentPeriod = suggestions.filter(s => {
    const createdDate = new Date(s.createdAt);
    return (now - createdDate) <= (days * 24 * 60 * 60 * 1000);
  }).length;
  
  const previousPeriodStart = new Date(now.getTime() - (2 * days * 24 * 60 * 60 * 1000));
  const previousPeriodEnd = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
  
  const previousPeriod = suggestions.filter(s => {
    const createdDate = new Date(s.createdAt);
    return createdDate >= previousPeriodStart && createdDate <= previousPeriodEnd;
  }).length;
  
  const trend = previousPeriod > 0 
    ? ((currentPeriod - previousPeriod) / previousPeriod) * 100 
    : currentPeriod > 0 ? 100 : 0;
    
  return {
    current: currentPeriod,
    previous: previousPeriod,
    change: Math.round(trend * 100) / 100,
    direction: trend > 5 ? 'up' : trend < -5 ? 'down' : 'stable'
  };
}

function getPopularCategories(suggestions) {
  const categories = {};
  suggestions.forEach(s => {
    categories[s.category] = (categories[s.category] || 0) + 1;
  });
  
  return Object.entries(categories)
    .sort(([,a], [,b]) => b - a)
    .map(([category, count]) => ({ category, count }));
}

function getUrgencyDistribution(suggestions) {
  const urgency = { low: 0, medium: 0, high: 0, critical: 0 };
  suggestions.forEach(s => {
    urgency[s.urgency] = (urgency[s.urgency] || 0) + 1;
  });
  return urgency;
}