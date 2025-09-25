/**
 * SSPO Legal Platform Enhanced - Simplified Standalone Server
 * Demo version for Docker deployment testing
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

// Initialize Express app
const app = express();

// Basic middleware
app.use(helmet({
    contentSecurityPolicy: false // Disable for demo
}));
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static(path.join(__dirname, '../')));
app.use('/frontend', express.static(path.join(__dirname, 'frontend')));

// Demo data store
const demoData = {
    documents: [
        { id: 1, title: "Regulamin SSPO", content: "Główny regulamin", lastModified: new Date() },
        { id: 2, title: "Ordynacja Wyborcza", content: "Zasady wyborów", lastModified: new Date() },
        { id: 3, title: "Kodeks Etyczny", content: "Zasady etyczne", lastModified: new Date() }
    ],
    suggestions: [],
    analytics: {
        totalDocuments: 3,
        totalSuggestions: 0,
        activeUsers: 1
    }
};

// Health check endpoint
app.get('/api/health', (req, res) => {
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`,
        memory: {
            used: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
            heap: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
            external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
        },
        services: {
            api: 'running',
            legalEngine: 'demo-mode',
            nlp: 'basic'
        },
        environment: {
            nodeEnv: process.env.NODE_ENV,
            port: process.env.PORT,
            memoryLimit: process.env.MEMORY_LIMIT
        }
    });
});

// Documents API
app.get('/api/documents', (req, res) => {
    res.json({
        success: true,
        data: demoData.documents,
        count: demoData.documents.length
    });
});

app.get('/api/documents/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const document = demoData.documents.find(doc => doc.id === id);
    
    if (document) {
        res.json({ success: true, data: document });
    } else {
        res.status(404).json({ success: false, error: 'Document not found' });
    }
});

// Legal analysis demo endpoint
app.post('/api/analyze', (req, res) => {
    const { text } = req.body;
    
    if (!text) {
        return res.status(400).json({ success: false, error: 'Text is required' });
    }
    
    // Demo analysis
    const analysis = {
        wordCount: text.split(' ').length,
        characterCount: text.length,
        sentiment: 'neutral',
        legalTerms: ['regulamin', 'prawo', 'ustawa', 'artykuł'].filter(term => 
            text.toLowerCase().includes(term)
        ),
        suggestions: [
            'Rozważyć dodanie szczegółów prawnych',
            'Sprawdzić zgodność z aktualnymi przepisami',
            'Dodać odniesienia do źródeł prawnych'
        ],
        confidence: 0.85
    };
    
    res.json({
        success: true,
        data: analysis,
        processing_time: `${Math.random() * 100 + 50}ms`
    });
});

// Suggestions API
app.get('/api/suggestions', (req, res) => {
    res.json({
        success: true,
        data: demoData.suggestions,
        count: demoData.suggestions.length
    });
});

app.post('/api/suggestions', (req, res) => {
    const { documentId, text, author = 'anonymous' } = req.body;
    
    const suggestion = {
        id: demoData.suggestions.length + 1,
        documentId: documentId || 1,
        text,
        author,
        createdAt: new Date(),
        votes: { up: 0, down: 0 },
        status: 'pending'
    };
    
    demoData.suggestions.push(suggestion);
    
    res.json({
        success: true,
        data: suggestion,
        message: 'Suggestion created successfully'
    });
});

// Analytics API
app.get('/api/analytics', (req, res) => {
    const analytics = {
        ...demoData.analytics,
        documentsAnalyzed: Math.floor(Math.random() * 100) + 50,
        suggestionsAccepted: Math.floor(Math.random() * 20) + 10,
        conflictsDetected: Math.floor(Math.random() * 5),
        systemLoad: {
            cpu: Math.random() * 30 + 10,
            memory: Math.random() * 40 + 30,
            requests: Math.floor(Math.random() * 1000) + 500
        },
        recentActivity: [
            { action: 'Document analyzed', timestamp: new Date(), user: 'system' },
            { action: 'Suggestion created', timestamp: new Date(), user: 'demo-user' },
            { action: 'Health check', timestamp: new Date(), user: 'monitoring' }
        ]
    };
    
    res.json({
        success: true,
        data: analytics
    });
});

// Demo features endpoint
app.get('/api/features', (req, res) => {
    res.json({
        success: true,
        data: {
            aiAnalysis: true,
            nlpProcessing: true,
            conflictDetection: true,
            realTimeCollaboration: false, // Demo limitation
            memoryOptimization: true,
            enterpriseSecurity: true,
            multiLanguageSupport: 'Polish primary',
            version: '3.0.0-demo',
            features: [
                '🧠 AI-powered legal analysis',
                '⚡ Memory-optimized architecture (2GB RAM)',
                '🔍 Automatic conflict detection',  
                '🔐 Enterprise-grade security',
                '📊 Real-time analytics',
                '📱 Progressive Web App',
                '🚀 Docker containerization',
                '🌐 RESTful API'
            ]
        }
    });
});

// Serve main page
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🏛️ SSPO Legal Platform Enhanced - Docker Demo</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; color: white; margin-bottom: 40px; }
        .header h1 { font-size: 3em; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
        .header p { font-size: 1.2em; opacity: 0.9; }
        .demo-panel { 
            background: rgba(255,255,255,0.95); 
            padding: 30px; 
            border-radius: 15px; 
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .api-demo { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .api-card { 
            background: #f8f9fa; 
            padding: 20px; 
            border-radius: 10px; 
            border-left: 4px solid #28a745; 
        }
        .api-card h3 { color: #333; margin-bottom: 10px; }
        .api-card code { 
            background: #e9ecef; 
            padding: 2px 6px; 
            border-radius: 4px; 
            font-size: 0.9em;
        }
        .status-ok { color: #28a745; font-weight: bold; }
        .status-demo { color: #ffc107; font-weight: bold; }
        .btn { 
            display: inline-block; 
            background: #28a745; 
            color: white; 
            padding: 10px 20px; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 5px;
            transition: background 0.3s;
        }
        .btn:hover { background: #218838; }
        .feature-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
            gap: 15px; 
            margin-top: 20px; 
        }
        .feature { 
            background: #e8f5e8; 
            padding: 15px; 
            border-radius: 8px; 
            border-left: 3px solid #28a745; 
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏛️ SSPO Legal Platform Enhanced</h1>
            <p>Zaawansowana platforma prawna z analizą AI - <span class="status-demo">DEMO DOCKER</span></p>
        </div>
        
        <div class="demo-panel">
            <h2>🎯 Status Systemu</h2>
            <p><strong>Kontener:</strong> <span class="status-ok">✅ URUCHOMIONY</span></p>
            <p><strong>API:</strong> <span class="status-ok">✅ AKTYWNE</span></p>
            <p><strong>Memory:</strong> <span class="status-ok">✅ ZOPTYMALIZOWANE</span></p>
            <p><strong>Security:</strong> <span class="status-ok">✅ ZABEZPIECZONE</span></p>
            
            <div style="margin-top: 20px;">
                <a href="/api/health" class="btn">📊 Health Check</a>
                <a href="/api/features" class="btn">⚙️ Features</a>
                <a href="/api/analytics" class="btn">📈 Analytics</a>
            </div>
        </div>
        
        <div class="demo-panel">
            <h2>🔌 API Endpoints Demo</h2>
            <div class="api-demo">
                <div class="api-card">
                    <h3>📋 Documents API</h3>
                    <p><code>GET /api/documents</code> - Lista dokumentów</p>
                    <p><code>GET /api/documents/:id</code> - Szczegóły dokumentu</p>
                </div>
                <div class="api-card">
                    <h3>🧠 Legal Analysis</h3>
                    <p><code>POST /api/analyze</code> - Analiza tekstu prawnego</p>
                    <p>AI-powered NLP dla polskiego języka</p>
                </div>
                <div class="api-card">
                    <h3>💡 Suggestions</h3>
                    <p><code>GET /api/suggestions</code> - Lista sugestii</p>
                    <p><code>POST /api/suggestions</code> - Nowa sugestia</p>
                </div>
                <div class="api-card">
                    <h3>📊 Analytics</h3>
                    <p><code>GET /api/analytics</code> - Statystyki systemu</p>
                    <p>Real-time monitoring i metryki</p>
                </div>
            </div>
        </div>
        
        <div class="demo-panel">
            <h2>✨ Funkcje Enhanced</h2>
            <div class="feature-grid">
                <div class="feature">🧠 AI Legal Analysis</div>
                <div class="feature">⚡ Memory Optimized (2GB)</div>
                <div class="feature">🔍 Conflict Detection</div>
                <div class="feature">🔐 Enterprise Security</div>
                <div class="feature">📱 Progressive Web App</div>
                <div class="feature">🚀 Docker Ready</div>
                <div class="feature">🌐 RESTful API</div>
                <div class="feature">📊 Real-time Analytics</div>
            </div>
        </div>
        
        <div style="text-align: center; color: white; margin-top: 40px; opacity: 0.9;">
            <p>SSPO Legal Platform Enhanced v3.0.0 - Docker Demo</p>
            <p>🐳 Successfully running in containerized environment</p>
        </div>
    </div>
    
    <script>
        // Demo functionality
        console.log('🏛️ SSPO Legal Platform Enhanced - Docker Demo Active');
        console.log('API Base URL:', window.location.origin + '/api/');
        
        // Auto health check every 30 seconds
        setInterval(async () => {
            try {
                const response = await fetch('/api/health');
                const health = await response.json();
                console.log('Health Check:', health.status, '- Memory:', health.memory.used);
            } catch (error) {
                console.warn('Health check failed:', error.message);
            }
        }, 30000);
    </script>
</body>
</html>`);
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        availableEndpoints: [
            'GET /',
            'GET /api/health',
            'GET /api/features',
            'GET /api/documents',
            'GET /api/analytics',
            'POST /api/analyze'
        ]
    });
});

// Error handler
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

// Start server
const PORT = process.env.PORT || 3000;
const API_PORT = process.env.API_PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
    console.log('🏛️  SSPO Legal Platform Enhanced - Docker Demo');
    console.log('════════════════════════════════════════════════');
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    console.log(`📊 Health check: http://0.0.0.0:${PORT}/api/health`);
    console.log(`🔌 API endpoints: http://0.0.0.0:${PORT}/api/`);
    console.log('════════════════════════════════════════════════');
    console.log(`💾 Memory limit: ${process.env.MEMORY_LIMIT || '2GB'}`);
    console.log(`⚡ CPU limit: ${process.env.CPU_LIMIT || '2.0'}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🐳 Docker: Active`);
    console.log('════════════════════════════════════════════════');
});

module.exports = app;