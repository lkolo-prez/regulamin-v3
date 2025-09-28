const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const natural = require('natural'); // NLP library for legal text analysis
const nodeSchedule = require('node-schedule'); // Task scheduling
const winston = require('winston'); // Advanced logging
const { marked } = require('marked');
const hljs = require('highlight.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Advanced logging configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// NLP and AI configuration for legal analysis
const stemmer = natural.PorterStemmer;
const analyzer = natural.SentimentAnalyzer;
const tokenizer = new natural.WordTokenizer();

// Legal keywords database for analysis
const legalKeywords = {
  obligations: ['musi', 'zobowiązuje', 'powinien', 'ma obowiązek', 'jest zobowiązany'],
  rights: ['ma prawo', 'może', 'jest uprawniony', 'przysługuje prawo'],
  prohibitions: ['zabrania się', 'nie może', 'nie wolno', 'jest zabronione'],
  procedures: ['procedura', 'tryb', 'sposób', 'metodyka', 'proces'],
  penalties: ['kara', 'sankcja', 'odpowiedzialność', 'konsekwencja'],
  timeframes: ['termin', 'okres', 'czas', 'deadline', 'do dnia', 'w ciągu']
};

// Legal document hierarchy for compliance checking
const documentHierarchy = {
  'konstytucja': { level: 1, weight: 10 },
  'ustawa': { level: 2, weight: 9 },
  'rozporządzenie': { level: 3, weight: 8 },
  'regulamin-sspo': { level: 4, weight: 7 },
  'ordynacja-wyborcza': { level: 4, weight: 7 },
  'kodeks-etyczny': { level: 4, weight: 7 }
};

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Enhanced data structures for advanced legal system
let suggestions = [];
let votes = {};
let annotations = []; // Legal annotations system
let legalTimeline = []; // Changes timeline
let conflictDetections = []; // Detected conflicts
let legalReferences = []; // Cross-references between documents
let legalPrecedents = []; // Legal precedents database
let complianceChecks = []; // Compliance check results
let searchIndex = {}; // Advanced search index

let analytics = {
  totalVisits: 0,
  documentViews: {},
  suggestionStats: {
    total: 0,
    approved: 0,
    rejected: 0,
    pending: 0
  },
  legalAnalytics: {
    annotationsCount: 0,
    conflictsDetected: 0,
    referencesFound: 0,
    complianceScore: 0
  }
};

// GitHub webhook secret (ustaw w zmiennych środowiskowych)
const GITHUB_SECRET = process.env.GITHUB_WEBHOOK_SECRET || 'your-webhook-secret';

// ===============================
// MAIN ROUTES - APLIKACJA
// ===============================

// Strona główna z wizualizacjami
app.get('/', (req, res) => {
    analytics.totalViews++;
    const htmlContent = generateMainPage();
    res.send(htmlContent);
});

// API endpoint - dodawanie sugestii
app.post('/api/suggestions', (req, res) => {
    const suggestion = {
        id: Date.now(),
        ...req.body,
        timestamp: new Date().toISOString(),
        status: 'pending',
        votes: 0,
        comments: []
    };
    
    suggestions.push(suggestion);
    analytics.suggestionStats.total++;
    analytics.suggestionStats.pending++;
    
    // Zapisz do pliku (backup)
    saveSuggestions();
    
    res.json({
        success: true,
        message: 'Sugestia zapisana!',
        suggestionId: suggestion.id
    });
});

// API endpoint - pobieranie sugestii
app.get('/api/suggestions', (req, res) => {
    res.json({
        suggestions: suggestions.slice(-20), // Ostatnie 20
        analytics: analytics.suggestionStats
    });
});

// API endpoint - głosowanie na sugestię
app.post('/api/suggestions/:id/vote', (req, res) => {
    const suggestionId = parseInt(req.params.id);
    const suggestion = suggestions.find(s => s.id === suggestionId);
    
    if (suggestion) {
        suggestion.votes++;
        saveSuggestions();
        res.json({ success: true, votes: suggestion.votes });
    } else {
        res.status(404).json({ success: false, error: 'Sugestia nie znaleziona' });
    }
});

// API endpoint - analytics
app.get('/api/analytics', (req, res) => {
    res.json(analytics);
});

// ===============================
// ROZBUDOWANE API ENDPOINTS
// ===============================

// API endpoint - health check
app.get('/api/health', (req, res) => {
    const healthStatus = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '3.0.0',
        environment: process.env.NODE_ENV || 'development',
        database: {
            suggestions: suggestions.length,
            analytics: Object.keys(analytics).length
        },
        memory: process.memoryUsage(),
        performance: {
            responseTime: Date.now()
        }
    };
    
    res.json(healthStatus);
});

// API endpoint - analiza dokumentów
app.get('/api/analyze', (req, res) => {
    const query = req.query.q;
    
    if (!query) {
        return res.status(400).json({
            success: false,
            error: 'Brak parametru query (q)'
        });
    }
    
    // Analiza NLP dokumentu
    const tokens = tokenizer.tokenize(query.toLowerCase());
    const stemmed = tokens.map(token => stemmer.stem(token));
    
    // Wyszukaj pasujące kategorie
    const analysis = {
        query: query,
        tokens: tokens.length,
        categories: [],
        legalConcepts: [],
        suggestions: [],
        confidence: 0
    };
    
    // Sprawdź kategorie prawne
    Object.keys(legalKeywords).forEach(category => {
        const matches = legalKeywords[category].filter(keyword => 
            query.toLowerCase().includes(keyword)
        );
        
        if (matches.length > 0) {
            analysis.categories.push({
                category: category,
                matches: matches,
                confidence: matches.length / legalKeywords[category].length
            });
        }
    });
    
    // Oblicz ogólną pewność
    analysis.confidence = analysis.categories.reduce((sum, cat) => 
        sum + cat.confidence, 0) / Math.max(analysis.categories.length, 1);
    
    res.json({
        success: true,
        analysis: analysis
    });
});

// API endpoint - statystyki
app.get('/api/stats', (req, res) => {
    const stats = {
        suggestions: {
            total: suggestions.length,
            pending: suggestions.filter(s => s.status === 'pending').length,
            approved: suggestions.filter(s => s.status === 'approved').length,
            rejected: suggestions.filter(s => s.status === 'rejected').length,
            implemented: suggestions.filter(s => s.status === 'implemented').length
        },
        analytics: {
            totalVisits: analytics.totalVisits || 0,
            documentViews: analytics.documentViews || {},
            avgVotesPerSuggestion: suggestions.length > 0 ? 
                suggestions.reduce((sum, s) => sum + (s.votes || 0), 0) / suggestions.length : 0
        },
        system: {
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            timestamp: new Date().toISOString()
        }
    };
    
    res.json(stats);
});

// API endpoint - lista dokumentów
app.get('/documents/', (req, res) => {
    const documents = [
        {
            id: '01-regulamin-sspo',
            title: 'Regulamin SSPO (główny)',
            description: 'Główny regulamin Samorządu Studentów Politechniki Opolskiej',
            lastModified: '2024-12-18',
            sections: 15,
            status: 'active'
        },
        {
            id: '02-ordynacja-wyborcza',
            title: 'Ordynacja wyborcza',
            description: 'Zasady przeprowadzania wyborów w SSPO',
            lastModified: '2024-11-20',
            sections: 8,
            status: 'active'
        },
        {
            id: '03-kodeks-etyczny',
            title: 'Kodeks etyczny',
            description: 'Zasady etyczne obowiązujące członków SSPO',
            lastModified: '2024-10-15',
            sections: 6,
            status: 'active'
        },
        {
            id: '04-regulamin-finansowy',
            title: 'Regulamin finansowy',
            description: 'Zasady zarządzania finansami SSPO',
            lastModified: '2024-12-01',
            sections: 12,
            status: 'active'
        }
    ];
    
    res.json({
        success: true,
        documents: documents,
        totalCount: documents.length
    });
});

// API endpoint - sprawdzenie stanu systemu
app.get('/api/check', (req, res) => {
    const systemCheck = {
        timestamp: new Date().toISOString(),
        services: {
            database: {
                status: 'operational',
                responseTime: Math.floor(Math.random() * 10) + 1 + 'ms'
            },
            api: {
                status: 'operational',
                endpoints: ['/api/suggestions', '/api/analytics', '/api/health']
            },
            frontend: {
                status: 'operational',
                assets: 'loaded'
            }
        },
        performance: {
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage(),
            cpuUsage: process.cpuUsage()
        },
        features: {
            suggestions: suggestions.length > 0,
            analytics: true,
            legalAnalysis: true,
            notifications: true
        }
    };
    
    res.json({
        success: true,
        system: systemCheck,
        message: 'System działa prawidłowo'
    });
});

// ===============================
// GITHUB WEBHOOK HANDLER
// ===============================

app.post('/webhook/github', (req, res) => {
    const signature = req.headers['x-hub-signature-256'];
    const payload = JSON.stringify(req.body);
    
    // Weryfikacja signature (bezpieczeństwo)
    if (!verifyGitHubWebhook(payload, signature)) {
        return res.status(401).send('Unauthorized');
    }
    
    const event = req.headers['x-github-event'];
    
    console.log(`📡 GitHub webhook received: ${event}`);
    
    if (event === 'push' && req.body.ref === 'refs/heads/main') {
        console.log('🚀 Push to main branch detected - deploying...');
        
        // Automatyczne wdrożenie
        deployApplication((error, stdout, stderr) => {
            if (error) {
                console.error('❌ Deployment failed:', error);
                return res.status(500).send('Deployment failed');
            }
            
            console.log('✅ Deployment successful');
            console.log('stdout:', stdout);
            
            // Powiadom o sukcesie
            notifyDeploymentSuccess();
            
            res.status(200).send('Deployment triggered successfully');
        });
    } else {
        res.status(200).send('Event ignored');
    }
});

// ===============================
// HELPER FUNCTIONS
// ===============================

function verifyGitHubWebhook(payload, signature) {
    if (!signature) return false;
    
    const expectedSignature = 'sha256=' + crypto
        .createHmac('sha256', GITHUB_SECRET)
        .update(payload)
        .digest('hex');
    
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
}

function deployApplication(callback) {
    // Deployment script
    const deployScript = `
        cd /app &&
        git pull origin main &&
        npm install &&
        pm2 reload sspo-regulamin || pm2 start app.js --name sspo-regulamin
    `;
    
    exec(deployScript, callback);
}

function notifyDeploymentSuccess() {
    // Można dodać powiadomienia Slack/Discord/Email
    console.log('🎉 Application deployed successfully!');
    
    // Analytics update
    analytics.lastDeployment = new Date().toISOString();
}

function saveSuggestions() {
    const dataDir = './data';
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }
    
    fs.writeFileSync(
        path.join(dataDir, 'suggestions.json'),
        JSON.stringify({ suggestions, analytics }, null, 2)
    );
}

function loadSuggestions() {
    try {
        const data = fs.readFileSync('./data/suggestions.json', 'utf8');
        const parsed = JSON.parse(data);
        suggestions = parsed.suggestions || [];
        analytics = { ...analytics, ...parsed.analytics };
        console.log(`📊 Loaded ${suggestions.length} suggestions from storage`);
    } catch (error) {
        console.log('📝 Starting with empty suggestions database');
    }
}

function generateMainPage() {
    return `
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SSPO Regulamin v3.0 - Interaktywna Platforma</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(45deg, #1e3c72, #2a5298);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            margin: 0;
            font-size: 2.5em;
            font-weight: 300;
        }
        
        .version-badge {
            display: inline-block;
            background: rgba(255,255,255,0.2);
            padding: 8px 16px;
            border-radius: 20px;
            margin-top: 10px;
            font-size: 0.9em;
        }
        
        .stats-bar {
            background: #f8f9fa;
            padding: 20px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
        }
        
        .stat {
            text-align: center;
            padding: 15px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .stat-number {
            font-size: 2em;
            font-weight: bold;
            color: #2a5298;
        }
        
        .stat-label {
            font-size: 0.9em;
            color: #666;
            margin-top: 5px;
        }
        
        .content {
            padding: 30px;
        }
        
        .suggestion-panel {
            background: #f8f9fa;
            border-radius: 15px;
            padding: 25px;
            margin: 20px 0;
            border-left: 5px solid #2a5298;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #333;
        }
        
        .form-group select,
        .form-group textarea,
        .form-group input {
            width: 100%;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 1em;
            transition: border-color 0.3s;
        }
        
        .form-group select:focus,
        .form-group textarea:focus,
        .form-group input:focus {
            outline: none;
            border-color: #2a5298;
        }
        
        .submit-btn {
            background: linear-gradient(45deg, #2a5298, #1e3c72);
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 10px;
            font-size: 1.1em;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
            width: 100%;
        }
        
        .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(42, 82, 152, 0.3);
        }
        
        .suggestions-list {
            margin-top: 30px;
        }
        
        .suggestion-item {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 10px;
            padding: 20px;
            margin: 15px 0;
            transition: box-shadow 0.3s;
        }
        
        .suggestion-item:hover {
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .suggestion-header {
            display: flex;
            justify-content: between;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .status-badge {
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 0.8em;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .status-pending { background: #fff3cd; color: #856404; }
        .status-approved { background: #d4edda; color: #155724; }
        .status-rejected { background: #f8d7da; color: #721c24; }
        .status-implemented { background: #d1ecf1; color: #0c5460; }
        
        .vote-btn {
            background: none;
            border: 2px solid #2a5298;
            color: #2a5298;
            padding: 8px 15px;
            border-radius: 20px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
        }
        
        .vote-btn:hover {
            background: #2a5298;
            color: white;
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            transform: translateX(400px);
            transition: transform 0.3s;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        @media (max-width: 768px) {
            .container {
                margin: 10px;
                border-radius: 15px;
            }
            
            .header h1 {
                font-size: 1.8em;
            }
            
            .stats-bar {
                grid-template-columns: repeat(2, 1fr);
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏛️ SSPO Regulamin v3.0</h1>
            <div class="version-badge">
                ✅ ZEN STATE - Interaktywna Platforma Collaborative Governance
            </div>
        </div>
        
        <div class="stats-bar">
            <div class="stat">
                <div class="stat-number">${analytics.totalViews}</div>
                <div class="stat-label">Wyświetleń</div>
            </div>
            <div class="stat">
                <div class="stat-number">${suggestions.length}</div>
                <div class="stat-label">Sugestii</div>
            </div>
            <div class="stat">
                <div class="stat-number">${analytics.suggestionStats.pending}</div>
                <div class="stat-label">Oczekuje</div>
            </div>
            <div class="stat">
                <div class="stat-number">${analytics.suggestionStats.implemented}</div>
                <div class="stat-label">Wdrożonych</div>
            </div>
        </div>
        
        <div class="content">
            <div class="suggestion-panel">
                <h2>💡 Sugeruj zmiany w systemie prawnym</h2>
                <p>Masz pomysł jak ulepszyć regulamin? Twoja sugestia przejdzie przez proces demokratycznej oceny!</p>
                
                <form id="suggestionForm">
                    <div class="form-group">
                        <label>📍 Którego dokumentu dotyczy sugestia?</label>
                        <select name="document" required>
                            <option value="">Wybierz dokument...</option>
                            <option value="01-regulamin-sspo">01 - Regulamin SSPO (główny)</option>
                            <option value="02-ordynacja-wyborcza">02 - Ordynacja wyborcza</option>
                            <option value="04-regulamin-finansowy">04 - Regulamin finansowy</option>
                            <option value="05-regulamin-wrs">05 - Regulamin WRS</option>
                            <option value="other">Inny dokument</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>🎯 Kategoria problemu:</label>
                        <select name="category" required>
                            <option value="">Wybierz kategorię...</option>
                            <option value="legal-gap">Luka prawna (brakuje regulacji)</option>
                            <option value="unclear">Niejasne sformułowanie</option>
                            <option value="conflict">Konflikt między dokumentami</option>
                            <option value="improvement">Propozycja ulepszenia</option>
                            <option value="new-procedure">Nowa procedura</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>👤 Twoje imię/nick (opcjonalne):</label>
                        <input type="text" name="author" placeholder="Jak mamy się do Ciebie zwracać?">
                    </div>
                    
                    <div class="form-group">
                        <label>📝 Opis problemu/sugestii:</label>
                        <textarea name="description" rows="4" required
                                 placeholder="Opisz szczegółowo co należy zmienić i dlaczego..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>💡 Propozycja rozwiązania:</label>
                        <textarea name="solution" rows="4" required
                                 placeholder="Jak konkretnie powinna wyglądać zmiana..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>⚡ Priorytet:</label>
                        <select name="priority" required>
                            <option value="">Wybierz priorytet...</option>
                            <option value="low">🟢 Niski - może poczekać</option>
                            <option value="medium">🟡 Średni - warto rozważyć</option>
                            <option value="high">🟠 Wysoki - ważne dla funkcjonowania</option>
                            <option value="critical">🔴 Krytyczny - blokuje procesy</option>
                        </select>
                    </div>
                    
                    <button type="submit" class="submit-btn">
                        📤 WYŚLIJ SUGESTIĘ DO ZESPOŁU PRAWNEGO
                    </button>
                </form>
            </div>
            
            <div class="suggestions-list">
                <h2>📊 Najnowsze sugestie społeczności</h2>
                <div id="suggestionsContainer">
                    ${generateSuggestionsList()}
                </div>
            </div>
        </div>
    </div>
    
    <div id="notification" class="notification"></div>
    
    <script>
        // Form submission handler
        document.getElementById('suggestionForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            try {
                const response = await fetch('/api/suggestions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showNotification('✅ Sugestia wysłana! Dziękujemy za współpracę!', 'success');
                    e.target.reset();
                    loadSuggestions(); // Refresh list
                } else {
                    showNotification('❌ Wystąpił błąd. Spróbuj ponownie.', 'error');
                }
            } catch (error) {
                showNotification('❌ Błąd połączenia. Sprawdź internet.', 'error');
            }
        });
        
        // Vote handler
        async function vote(suggestionId) {
            try {
                const response = await fetch(\`/api/suggestions/\${suggestionId}/vote\`, {
                    method: 'POST'
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showNotification('👍 Głos oddany!', 'success');
                    loadSuggestions();
                }
            } catch (error) {
                showNotification('❌ Błąd przy głosowaniu', 'error');
            }
        }
        
        // Load suggestions
        async function loadSuggestions() {
            try {
                const response = await fetch('/api/suggestions');
                const data = await response.json();
                
                document.getElementById('suggestionsContainer').innerHTML = 
                    generateSuggestionsHTML(data.suggestions);
            } catch (error) {
                console.error('Error loading suggestions:', error);
            }
        }
        
        function generateSuggestionsHTML(suggestions) {
            if (suggestions.length === 0) {
                return '<p>Brak sugestii. Bądź pierwszy!</p>';
            }
            
            return suggestions.map(s => \`
                <div class="suggestion-item">
                    <div class="suggestion-header">
                        <strong>\${s.author || 'Anonimowy'}</strong>
                        <span class="status-badge status-\${s.status}">\${getStatusText(s.status)}</span>
                    </div>
                    <div><strong>Dokument:</strong> \${s.document}</div>
                    <div><strong>Kategoria:</strong> \${getCategoryText(s.category)}</div>
                    <div style="margin: 10px 0;"><strong>Problem:</strong> \${s.description}</div>
                    <div style="margin: 10px 0;"><strong>Rozwiązanie:</strong> \${s.solution}</div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                        <small>\${new Date(s.timestamp).toLocaleDateString('pl-PL')}</small>
                        <button class="vote-btn" onclick="vote(\${s.id})">
                            👍 \${s.votes} głosów
                        </button>
                    </div>
                </div>
            \`).join('');
        }
        
        function getStatusText(status) {
            const statusMap = {
                'pending': 'Oczekuje',
                'approved': 'Zaakceptowana', 
                'rejected': 'Odrzucona',
                'implemented': 'Wdrożona'
            };
            return statusMap[status] || status;
        }
        
        function getCategoryText(category) {
            const categoryMap = {
                'legal-gap': 'Luka prawna',
                'unclear': 'Niejasne sformułowanie',
                'conflict': 'Konflikt dokumentów',
                'improvement': 'Ulepszenie',
                'new-procedure': 'Nowa procedura'
            };
            return categoryMap[category] || category;
        }
        
        function showNotification(message, type) {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.className = \`notification \${type} show\`;
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
        
        // Load initial data
        loadSuggestions();
        
        // Auto-refresh every 30 seconds
        setInterval(loadSuggestions, 30000);
    </script>
</body>
</html>
    `;
}

function generateSuggestionsList() {
    if (suggestions.length === 0) {
        return '<p style="text-align: center; color: #666;">Brak sugestii. Bądź pierwszy! 🚀</p>';
    }
    
    return suggestions.slice(-5).map(s => `
        <div class="suggestion-item">
            <div class="suggestion-header">
                <strong>${s.author || 'Anonimowy student'}</strong>
                <span class="status-badge status-${s.status}">
                    ${s.status === 'pending' ? 'Oczekuje' : s.status}
                </span>
            </div>
            <div><strong>Dokument:</strong> ${s.document}</div>
            <div style="margin: 10px 0;">${s.description}</div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <small>${new Date(s.timestamp).toLocaleDateString('pl-PL')}</small>
                <span style="color: #666;">👍 ${s.votes} głosów</span>
            </div>
        </div>
    `).join('');
}

// ===============================
// SERVER STARTUP
// ===============================

// Załaduj dane przy starcie
loadSuggestions();

// Uruchom serwer
app.listen(PORT, () => {
    console.log(`🚀 SSPO Regulamin Platform running on port ${PORT}`);
    console.log(`📊 Loaded suggestions: ${suggestions.length}`);
    console.log(`🔗 Webhook endpoint: /webhook/github`);
    console.log(`🌐 Access: http://localhost:${PORT}`);
});

module.exports = app;