// Enhanced Frontend Generation System

// Enhanced frontend with advanced legal features
function generateInteractivePlatform() {
  return `
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SSPO Legal Platform - Interaktywny System Prawny</title>
    <meta name="description" content="Zaawansowana platforma collaborative governance dla SSPO z AI-powered analizą prawną">
    
    <!-- Progressive Web App -->
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#667eea">
    
    <!-- Advanced CSS with legal-specific styling -->
    <style>
        /* Enhanced CSS Variables for Legal System */
        :root {
            --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --success-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            --warning-gradient: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
            --danger-gradient: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
            --legal-blue: #2c5282;
            --legal-gold: #d69e2e;
            --legal-green: #38a169;
            --legal-red: #e53e3e;
            --neutral-bg: #f7fafc;
            --card-shadow: 0 10px 30px rgba(0,0,0,0.1);
            --text-primary: #2d3748;
            --text-secondary: #718096;
            --border-color: #e2e8f0;
            --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            color: var(--text-primary);
            background: var(--neutral-bg);
        }

        /* Enhanced Navigation */
        .navbar {
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem 0;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 20px rgba(0,0,0,0.1);
        }

        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 2rem;
        }

        .logo {
            font-size: 1.5rem;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .logo::before {
            content: "⚖️";
            font-size: 1.8rem;
        }

        .nav-links {
            display: flex;
            list-style: none;
            gap: 2rem;
        }

        .nav-links a {
            color: white;
            text-decoration: none;
            font-weight: 500;
            transition: var(--transition);
            position: relative;
        }

        .nav-links a:hover::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            right: 0;
            height: 2px;
            background: rgba(255,255,255,0.8);
        }

        /* Enhanced Dashboard */
        .dashboard {
            max-width: 1400px;
            margin: 2rem auto;
            padding: 0 2rem;
            display: grid;
            grid-template-columns: 1fr 350px;
            gap: 2rem;
        }

        .main-content {
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }

        .sidebar {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        /* Enhanced Cards */
        .card {
            background: white;
            border-radius: 12px;
            box-shadow: var(--card-shadow);
            border: 1px solid var(--border-color);
            transition: var(--transition);
        }

        .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.15);
        }

        .card-header {
            padding: 1.5rem;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .card-header h2 {
            font-size: 1.25rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .card-body {
            padding: 1.5rem;
        }

        /* Legal Analysis Components */
        .legal-analysis-panel {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border: 1px solid var(--legal-blue);
            border-radius: 8px;
            padding: 1rem;
            margin: 1rem 0;
        }

        .analysis-metric {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 0;
            border-bottom: 1px solid rgba(44, 82, 130, 0.1);
        }

        .analysis-metric:last-child {
            border-bottom: none;
        }

        .metric-label {
            font-weight: 500;
            color: var(--legal-blue);
        }

        .metric-value {
            font-weight: 600;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.875rem;
        }

        .metric-high { background: var(--danger-gradient); color: white; }
        .metric-medium { background: var(--warning-gradient); color: white; }
        .metric-low { background: var(--success-gradient); color: white; }

        /* Enhanced Suggestion Cards */
        .suggestion-card {
            background: white;
            border-radius: 12px;
            box-shadow: var(--card-shadow);
            margin-bottom: 1.5rem;
            overflow: hidden;
            border-left: 4px solid transparent;
            transition: var(--transition);
        }

        .suggestion-card.high-impact {
            border-left-color: var(--legal-red);
        }

        .suggestion-card.medium-impact {
            border-left-color: var(--legal-gold);
        }

        .suggestion-card.low-impact {
            border-left-color: var(--legal-green);
        }

        .suggestion-header {
            padding: 1.5rem;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }

        .suggestion-meta {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .suggestion-author {
            font-weight: 600;
            color: var(--legal-blue);
        }

        .suggestion-date {
            font-size: 0.875rem;
            color: var(--text-secondary);
        }

        .suggestion-badges {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
        }

        .badge {
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
        }

        .badge-pending { background: #fef5e7; color: #d69e2e; }
        .badge-approved { background: #f0fff4; color: #38a169; }
        .badge-rejected { background: #fed7d7; color: #e53e3e; }
        .badge-critical { background: #fed7d7; color: #e53e3e; }
        .badge-high { background: #fef5e7; color: #d69e2e; }
        .badge-medium { background: #e6fffa; color: #319795; }
        .badge-low { background: #f0fff4; color: #38a169; }

        .suggestion-content {
            padding: 1.5rem;
        }

        .suggestion-text {
            margin-bottom: 1rem;
            line-height: 1.7;
        }

        .suggestion-reasoning {
            background: #f8fafc;
            border-radius: 6px;
            padding: 1rem;
            border-left: 3px solid var(--legal-blue);
            margin: 1rem 0;
            font-size: 0.9rem;
            color: var(--text-secondary);
        }

        .suggestion-actions {
            padding: 1rem 1.5rem;
            border-top: 1px solid var(--border-color);
            background: #f8fafc;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .vote-buttons {
            display: flex;
            gap: 0.5rem;
        }

        .vote-btn {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            transition: var(--transition);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .vote-up {
            background: var(--legal-green);
            color: white;
        }

        .vote-down {
            background: var(--legal-red);
            color: white;
        }

        .vote-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .vote-count {
            font-weight: 600;
            color: var(--text-primary);
            background: white;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            border: 1px solid var(--border-color);
        }

        /* Advanced Search */
        .search-section {
            background: white;
            border-radius: 12px;
            box-shadow: var(--card-shadow);
            padding: 2rem;
            margin-bottom: 2rem;
        }

        .search-container {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
        }

        .search-input {
            flex: 1;
            padding: 0.75rem 1rem;
            border: 2px solid var(--border-color);
            border-radius: 8px;
            font-size: 1rem;
            transition: var(--transition);
        }

        .search-input:focus {
            outline: none;
            border-color: var(--legal-blue);
            box-shadow: 0 0 0 3px rgba(44, 82, 130, 0.1);
        }

        .search-filters {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            margin-top: 1rem;
        }

        .filter-select {
            padding: 0.5rem 1rem;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            background: white;
            cursor: pointer;
        }

        /* Analytics Dashboard */
        .analytics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .metric-card {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            text-align: center;
            box-shadow: var(--card-shadow);
            border: 1px solid var(--border-color);
        }

        .metric-icon {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
        }

        .metric-number {
            font-size: 2rem;
            font-weight: bold;
            color: var(--legal-blue);
            margin-bottom: 0.25rem;
        }

        .metric-description {
            color: var(--text-secondary);
            font-size: 0.875rem;
        }

        /* Timeline Component */
        .timeline {
            position: relative;
            padding-left: 2rem;
        }

        .timeline::before {
            content: '';
            position: absolute;
            left: 0.75rem;
            top: 0;
            bottom: 0;
            width: 2px;
            background: var(--border-color);
        }

        .timeline-item {
            position: relative;
            margin-bottom: 1.5rem;
            background: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .timeline-item::before {
            content: '';
            position: absolute;
            left: -1.4rem;
            top: 1rem;
            width: 12px;
            height: 12px;
            background: var(--legal-blue);
            border-radius: 50%;
            border: 3px solid white;
        }

        .timeline-date {
            font-size: 0.75rem;
            color: var(--text-secondary);
            margin-bottom: 0.5rem;
        }

        .timeline-content {
            font-size: 0.875rem;
        }

        /* Enhanced Forms */
        .form-section {
            background: white;
            border-radius: 12px;
            box-shadow: var(--card-shadow);
            overflow: hidden;
        }

        .form-header {
            background: var(--primary-gradient);
            color: white;
            padding: 1.5rem;
            text-align: center;
        }

        .form-body {
            padding: 2rem;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: var(--text-primary);
        }

        .form-input, .form-textarea, .form-select {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 2px solid var(--border-color);
            border-radius: 8px;
            font-size: 1rem;
            transition: var(--transition);
        }

        .form-input:focus, .form-textarea:focus, .form-select:focus {
            outline: none;
            border-color: var(--legal-blue);
            box-shadow: 0 0 0 3px rgba(44, 82, 130, 0.1);
        }

        .form-textarea {
            resize: vertical;
            min-height: 120px;
        }

        .btn {
            padding: 0.75rem 2rem;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: var(--transition);
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }

        .btn-primary {
            background: var(--primary-gradient);
            color: white;
        }

        .btn-success {
            background: var(--success-gradient);
            color: white;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        /* Loading States */
        .loading {
            text-align: center;
            padding: 2rem;
        }

        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid var(--border-color);
            border-top: 4px solid var(--legal-blue);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .dashboard {
                grid-template-columns: 1fr;
                padding: 0 1rem;
            }
            
            .analytics-grid {
                grid-template-columns: 1fr;
            }
            
            .nav-links {
                display: none;
            }
            
            .search-container {
                flex-direction: column;
            }
            
            .suggestion-header {
                flex-direction: column;
                gap: 1rem;
                align-items: flex-start;
            }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            :root {
                --neutral-bg: #1a202c;
                --text-primary: #e2e8f0;
                --text-secondary: #a0aec0;
                --border-color: #2d3748;
            }
            
            .card, .suggestion-card, .metric-card {
                background: #2d3748;
                color: var(--text-primary);
            }
        }
    </style>
</head>
<body>
    <!-- Enhanced Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="logo">SSPO Legal Platform</div>
            <ul class="nav-links">
                <li><a href="#dashboard">Dashboard</a></li>
                <li><a href="#suggestions">Sugestie</a></li>
                <li><a href="#analytics">Analityka</a></li>
                <li><a href="#timeline">Timeline</a></li>
                <li><a href="#search">Wyszukiwarka</a></li>
                <li><a href="#admin">Admin</a></li>
            </ul>
        </div>
    </nav>

    <!-- Main Dashboard -->
    <div class="dashboard">
        <main class="main-content">
            <!-- Analytics Overview -->
            <section id="analytics" class="card">
                <div class="card-header">
                    <h2>📊 Analityka Systemu Prawnego</h2>
                    <button class="btn btn-primary" onclick="refreshAnalytics()">
                        🔄 Odśwież
                    </button>
                </div>
                <div class="card-body">
                    <div class="analytics-grid" id="analytics-grid">
                        <div class="loading">
                            <div class="spinner"></div>
                            <p>Ładowanie danych analitycznych...</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Advanced Search -->
            <section id="search" class="search-section">
                <h2>🔍 Zaawansowana Wyszukiwarka Prawna</h2>
                <div class="search-container">
                    <input type="text" class="search-input" id="searchQuery" 
                           placeholder="Wpisz frazę prawną, artykuł lub słowo kluczowe...">
                    <button class="btn btn-primary" onclick="performSearch()">
                        Wyszukaj
                    </button>
                </div>
                <div class="search-filters">
                    <select class="filter-select" id="searchType">
                        <option value="all">Wszystkie typy</option>
                        <option value="suggestions">Sugestie</option>
                        <option value="documents">Dokumenty</option>
                        <option value="comments">Komentarze</option>
                    </select>
                    <select class="filter-select" id="searchDocument">
                        <option value="">Wszystkie dokumenty</option>
                        <option value="01-regulamin-sspo">Regulamin SSPO</option>
                        <option value="02-ordynacja-wyborcza">Ordynacja wyborcza</option>
                        <option value="03-kodeks-etyczny">Kodeks etyczny</option>
                    </select>
                    <label class="filter-select">
                        <input type="checkbox" id="includeLegalAnalysis"> Z analizą prawną
                    </label>
                </div>
                <div id="search-results"></div>
            </section>

            <!-- Suggestions Management -->
            <section id="suggestions" class="card">
                <div class="card-header">
                    <h2>📝 System Sugestii Prawnych</h2>
                    <div style="display: flex; gap: 1rem;">
                        <select id="suggestionSort" onchange="loadSuggestions()">
                            <option value="priority">Priorytet</option>
                            <option value="date">Data</option>
                            <option value="votes">Głosy</option>
                            <option value="impact">Wpływ prawny</option>
                        </select>
                        <button class="btn btn-success" onclick="showSuggestionForm()">
                            ➕ Nowa sugestia
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div id="suggestions-list">
                        <div class="loading">
                            <div class="spinner"></div>
                            <p>Ładowanie sugestii...</p>
                        </div>
                    </div>
                    <button class="btn btn-primary" id="load-more-btn" onclick="loadMoreSuggestions()" style="display: none;">
                        Załaduj więcej
                    </button>
                </div>
            </section>

            <!-- Legal Timeline -->
            <section id="timeline" class="card">
                <div class="card-header">
                    <h2>⏱️ Timeline Zmian Prawnych</h2>
                    <select id="timelineFilter" onchange="loadTimeline()">
                        <option value="7d">Ostatnie 7 dni</option>
                        <option value="30d">Ostatnie 30 dni</option>
                        <option value="90d">Ostatnie 90 dni</option>
                    </select>
                </div>
                <div class="card-body">
                    <div id="timeline-content">
                        <div class="loading">
                            <div class="spinner"></div>
                            <p>Ładowanie timeline...</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <aside class="sidebar">
            <!-- Quick Stats -->
            <div class="card">
                <div class="card-header">
                    <h3>⚡ Szybkie Statystyki</h3>
                </div>
                <div class="card-body">
                    <div id="quick-stats">
                        <div class="loading">
                            <div class="spinner"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Legal Conflicts -->
            <div class="card">
                <div class="card-header">
                    <h3>⚠️ Wykryte Konflikty</h3>
                </div>
                <div class="card-body">
                    <div id="legal-conflicts">
                        <div class="loading">
                            <div class="spinner"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Activity -->
            <div class="card">
                <div class="card-header">
                    <h3>🔄 Ostatnia Aktywność</h3>
                </div>
                <div class="card-body">
                    <div id="recent-activity">
                        <div class="timeline">
                            <div class="loading">
                                <div class="spinner"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    </div>

    <!-- Enhanced Modals -->
    <div id="modal-overlay" class="modal-overlay" onclick="closeModal()"></div>
    
    <!-- Suggestion Form Modal -->
    <div id="suggestion-modal" class="modal">
        <div class="form-section">
            <div class="form-header">
                <h2>📝 Nowa Sugestia Prawna</h2>
            </div>
            <div class="form-body">
                <form id="suggestion-form">
                    <div class="form-group">
                        <label class="form-label">Autor *</label>
                        <input type="text" class="form-input" name="author" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email (opcjonalne)</label>
                        <input type="email" class="form-input" name="email">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Dokument *</label>
                        <select class="form-select" name="document" required>
                            <option value="">Wybierz dokument</option>
                            <option value="01-regulamin-sspo">Regulamin SSPO</option>
                            <option value="02-ordynacja-wyborcza">Ordynacja wyborcza</option>
                            <option value="03-kodeks-etyczny">Kodeks etyczny</option>
                            <option value="04-regulamin-finansowy">Regulamin finansowy</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Sekcja/Artykuł</label>
                        <input type="text" class="form-input" name="section" placeholder="np. Art. 15, §3">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Kategoria</label>
                        <select class="form-select" name="category">
                            <option value="general">Ogólne</option>
                            <option value="procedural">Proceduralne</option>
                            <option value="financial">Finansowe</option>
                            <option value="ethical">Etyczne</option>
                            <option value="organizational">Organizacyjne</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Pilność</label>
                        <select class="form-select" name="urgency">
                            <option value="low">Niska</option>
                            <option value="medium">Średnia</option>
                            <option value="high">Wysoka</option>
                            <option value="critical">Krytyczna</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Treść sugestii *</label>
                        <textarea class="form-textarea" name="content" required 
                                placeholder="Opisz swoją sugestię prawną..."></textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Uzasadnienie</label>
                        <textarea class="form-textarea" name="reasoning" 
                                placeholder="Wyjaśnij dlaczego ta zmiana jest potrzebna..."></textarea>
                    </div>
                    <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                        <button type="button" class="btn" onclick="closeModal()">Anuluj</button>
                        <button type="submit" class="btn btn-primary">📊 Stwórz z Analizą Prawną</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <style>
        /* Modal Styles */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            backdrop-filter: blur(4px);
            z-index: 2000;
            display: none;
        }

        .modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 2001;
            max-width: 600px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            display: none;
        }

        .modal-overlay.active, .modal.active {
            display: block;
        }
    </style>

    <!-- Enhanced JavaScript with AI-powered features -->
    <script>
        // Global state management
        const state = {
            suggestions: [],
            analytics: {},
            timeline: [],
            conflicts: [],
            currentPage: 0,
            pageSize: 10,
            sortBy: 'priority',
            filters: {}
        };

        // API helper functions
        async function apiCall(endpoint, options = {}) {
            try {
                const response = await fetch(endpoint, {
                    headers: {
                        'Content-Type': 'application/json',
                        ...options.headers
                    },
                    ...options
                });
                
                if (!response.ok) {
                    throw new Error(\`HTTP error! status: \${response.status}\`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('API call failed:', error);
                showNotification('Błąd połączenia z serwerem', 'error');
                throw error;
            }
        }

        // Initialize application
        document.addEventListener('DOMContentLoaded', function() {
            loadDashboard();
            setupEventListeners();
            initializeRealTimeUpdates();
        });

        async function loadDashboard() {
            await Promise.all([
                refreshAnalytics(),
                loadSuggestions(),
                loadTimeline(),
                loadQuickStats(),
                loadLegalConflicts(),
                loadRecentActivity()
            ]);
        }

        // Enhanced analytics loading
        async function refreshAnalytics() {
            try {
                showLoading('analytics-grid');
                const result = await apiCall('/api/analytics?timeframe=30d');
                
                if (result.success) {
                    state.analytics = result.data;
                    renderAnalytics(result.data);
                }
            } catch (error) {
                showError('analytics-grid', 'Nie można załadować analityki');
            }
        }

        function renderAnalytics(analytics) {
            const container = document.getElementById('analytics-grid');
            container.innerHTML = \`
                <div class="metric-card">
                    <div class="metric-icon">📊</div>
                    <div class="metric-number">\${analytics.overview.totalSuggestions}</div>
                    <div class="metric-description">Sugestie prawne</div>
                </div>
                <div class="metric-card">
                    <div class="metric-icon">⏳</div>
                    <div class="metric-number">\${analytics.overview.pendingSuggestions}</div>
                    <div class="metric-description">Oczekujące</div>
                </div>
                <div class="metric-card">
                    <div class="metric-icon">✅</div>
                    <div class="metric-number">\${analytics.overview.approvedSuggestions}</div>
                    <div class="metric-description">Zatwierdzone</div>
                </div>
                <div class="metric-card">
                    <div class="metric-icon">🗳️</div>
                    <div class="metric-number">\${analytics.engagement.totalVotes}</div>
                    <div class="metric-description">Głosy oddane</div>
                </div>
                <div class="metric-card">
                    <div class="metric-icon">💬</div>
                    <div class="metric-number">\${analytics.engagement.totalComments}</div>
                    <div class="metric-description">Komentarze</div>
                </div>
                <div class="metric-card">
                    <div class="metric-icon">⚖️</div>
                    <div class="metric-number">\${analytics.legal.averageImpactScore}</div>
                    <div class="metric-description">Avg wpływ prawny</div>
                </div>
                <div class="metric-card">
                    <div class="metric-icon">🧠</div>
                    <div class="metric-number">\${analytics.legal.averageComplexityScore}</div>
                    <div class="metric-description">Avg złożoność</div>
                </div>
                <div class="metric-card">
                    <div class="metric-icon">⚠️</div>
                    <div class="metric-number">\${analytics.legal.totalConflicts}</div>
                    <div class="metric-description">Konflikty prawne</div>
                </div>
            \`;
        }

        // Enhanced suggestion loading with legal analysis
        async function loadSuggestions(reset = false) {
            try {
                if (reset) {
                    state.currentPage = 0;
                    state.suggestions = [];
                }

                showLoading('suggestions-list');
                
                const params = new URLSearchParams({
                    limit: state.pageSize,
                    offset: state.currentPage * state.pageSize,
                    sortBy: state.sortBy,
                    ...state.filters
                });

                const result = await apiCall(\`/api/suggestions?\${params}\`);
                
                if (result.success) {
                    if (reset) {
                        state.suggestions = result.data;
                    } else {
                        state.suggestions.push(...result.data);
                    }
                    
                    renderSuggestions(state.suggestions);
                    
                    // Update load more button
                    const loadMoreBtn = document.getElementById('load-more-btn');
                    loadMoreBtn.style.display = result.pagination.hasMore ? 'block' : 'none';
                }
            } catch (error) {
                showError('suggestions-list', 'Nie można załadować sugestii');
            }
        }

        function renderSuggestions(suggestions) {
            const container = document.getElementById('suggestions-list');
            
            if (suggestions.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #666;">Brak sugestii do wyświetlenia</p>';
                return;
            }

            container.innerHTML = suggestions.map(suggestion => \`
                <div class="suggestion-card \${getImpactClass(suggestion.legalAnalysis.impact.score)}">
                    <div class="suggestion-header">
                        <div class="suggestion-meta">
                            <div class="suggestion-author">\${suggestion.author}</div>
                            <div class="suggestion-date">\${new Date(suggestion.createdAt).toLocaleDateString('pl-PL')}</div>
                            <div class="suggestion-badges">
                                <span class="badge badge-\${suggestion.status}">\${suggestion.status}</span>
                                <span class="badge badge-\${suggestion.urgency}">\${suggestion.urgency}</span>
                                <span class="badge badge-\${suggestion.legalAnalysis.impact.level}">
                                    Impact: \${suggestion.legalAnalysis.impact.score}
                                </span>
                            </div>
                        </div>
                        <div style="text-align: right; font-size: 0.875rem; color: #666;">
                            <div><strong>\${suggestion.document}</strong></div>
                            \${suggestion.section ? \`<div>\${suggestion.section}</div>\` : ''}
                        </div>
                    </div>
                    
                    <div class="suggestion-content">
                        <div class="suggestion-text">\${suggestion.content}</div>
                        
                        \${suggestion.reasoning ? \`
                            <div class="suggestion-reasoning">
                                <strong>Uzasadnienie:</strong> \${suggestion.reasoning}
                            </div>
                        \` : ''}
                        
                        <div class="legal-analysis-panel">
                            <div class="analysis-metric">
                                <span class="metric-label">Wpływ prawny:</span>
                                <span class="metric-value metric-\${suggestion.legalAnalysis.impact.level}">
                                    \${suggestion.legalAnalysis.impact.score}/100
                                </span>
                            </div>
                            <div class="analysis-metric">
                                <span class="metric-label">Złożoność:</span>
                                <span class="metric-value metric-\${getComplexityLevel(suggestion.legalAnalysis.complexity.complexityScore)}">
                                    \${suggestion.legalAnalysis.complexity.complexityScore}/100
                                </span>
                            </div>
                            <div class="analysis-metric">
                                <span class="metric-label">Czytelność:</span>
                                <span class="metric-value metric-\${suggestion.legalAnalysis.readability.level}">
                                    \${suggestion.legalAnalysis.readability.score}/100
                                </span>
                            </div>
                            \${suggestion.legalAnalysis.conflicts.length > 0 ? \`
                                <div class="analysis-metric">
                                    <span class="metric-label">Konflikty:</span>
                                    <span class="metric-value metric-high">
                                        \${suggestion.legalAnalysis.conflicts.length} wykrytych
                                    </span>
                                </div>
                            \` : ''}
                        </div>
                        
                        \${suggestion.precedents && suggestion.precedents.length > 0 ? \`
                            <div style="margin-top: 1rem;">
                                <strong>Podobne precedensy:</strong>
                                <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
                                    \${suggestion.precedents.slice(0, 3).map(p => 
                                        \`<li>\${p.title} (podobieństwo: \${p.similarity}%)</li>\`
                                    ).join('')}
                                </ul>
                            </div>
                        \` : ''}

                        \${suggestion.comments && suggestion.comments.length > 0 ? \`
                            <div style="margin-top: 1rem;">
                                <strong>Komentarze (\${suggestion.comments.length}):</strong>
                                <div style="max-height: 150px; overflow-y: auto; margin-top: 0.5rem;">
                                    \${suggestion.comments.map(comment => \`
                                        <div style="padding: 0.5rem; background: #f8fafc; margin: 0.25rem 0; border-radius: 4px;">
                                            <div style="font-weight: 600; font-size: 0.875rem;">\${comment.author}</div>
                                            <div style="font-size: 0.875rem;">\${comment.content}</div>
                                        </div>
                                    \`).join('')}
                                </div>
                            </div>
                        \` : ''}
                    </div>
                    
                    <div class="suggestion-actions">
                        <div class="vote-buttons">
                            <button class="vote-btn vote-up" onclick="vote(\${suggestion.id}, 'up')">
                                👍 \${suggestion.votes.up}
                            </button>
                            <button class="vote-btn vote-down" onclick="vote(\${suggestion.id}, 'down')">
                                👎 \${suggestion.votes.down}
                            </button>
                        </div>
                        <div class="vote-count">
                            Score: \${suggestion.votes.up - suggestion.votes.down}
                        </div>
                        <button class="btn btn-primary" onclick="addComment(\${suggestion.id})">
                            💬 Komentuj
                        </button>
                    </div>
                </div>
            \`).join('');
        }

        // Enhanced search functionality
        async function performSearch() {
            const query = document.getElementById('searchQuery').value.trim();
            const type = document.getElementById('searchType').value;
            const document = document.getElementById('searchDocument').value;
            const includeAnalysis = document.getElementById('includeLegalAnalysis').checked;
            
            if (query.length < 2) {
                showNotification('Zapytanie musi mieć przynajmniej 2 znaki', 'warning');
                return;
            }

            try {
                showLoading('search-results');
                
                const params = new URLSearchParams({
                    q: query,
                    type,
                    includeAnalysis: includeAnalysis.toString()
                });
                
                if (document) params.set('document', document);

                const result = await apiCall(\`/api/search?\${params}\`);
                
                if (result.success) {
                    renderSearchResults(result);
                }
            } catch (error) {
                showError('search-results', 'Błąd wyszukiwania');
            }
        }

        function renderSearchResults(result) {
            const container = document.getElementById('search-results');
            
            if (result.items.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Nie znaleziono wyników</p>';
                return;
            }

            container.innerHTML = \`
                <h3 style="margin: 1.5rem 0 1rem;">Wyniki wyszukiwania (\${result.total})</h3>
                \${result.items.map(item => \`
                    <div class="card" style="margin-bottom: 1rem;">
                        <div class="card-body">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                                <h4 style="margin: 0;">\${item.title}</h4>
                                <span class="badge badge-\${item.status || 'general'}">\${item.document}</span>
                            </div>
                            <p style="color: #666; margin-bottom: 0.5rem;">\${item.content}</p>
                            <div style="font-size: 0.875rem; color: #888;">
                                Dopasowanie: \${item.score} | 
                                \${item.createdAt ? new Date(item.createdAt).toLocaleDateString('pl-PL') : 'Data nieznana'}
                            </div>
                            \${item.legalAnalysis ? \`
                                <div class="legal-analysis-panel" style="margin-top: 1rem;">
                                    <div class="analysis-metric">
                                        <span class="metric-label">Wpływ:</span>
                                        <span class="metric-value metric-\${item.legalAnalysis.impact.level}">
                                            \${item.legalAnalysis.impact.score}/100
                                        </span>
                                    </div>
                                </div>
                            \` : ''}
                        </div>
                    </div>
                \`).join('')}
            \`;
        }

        // Timeline functionality
        async function loadTimeline() {
            try {
                showLoading('timeline-content');
                const filter = document.getElementById('timelineFilter').value;
                const result = await apiCall(\`/api/legal/timeline?limit=20&timeframe=\${filter}\`);
                
                if (result.success) {
                    renderTimeline(result.data);
                }
            } catch (error) {
                showError('timeline-content', 'Nie można załadować timeline');
            }
        }

        function renderTimeline(events) {
            const container = document.getElementById('timeline-content');
            
            if (events.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #666;">Brak aktywności w wybranym okresie</p>';
                return;
            }

            container.innerHTML = \`
                <div class="timeline">
                    \${events.map(event => \`
                        <div class="timeline-item">
                            <div class="timeline-date">
                                \${new Date(event.timestamp).toLocaleString('pl-PL')}
                            </div>
                            <div class="timeline-content">
                                <strong>\${getEventTitle(event.type)}</strong>
                                <div>\${getEventDescription(event)}</div>
                            </div>
                        </div>
                    \`).join('')}
                </div>
            \`;
        }

        // Modal management
        function showSuggestionForm() {
            document.getElementById('modal-overlay').classList.add('active');
            document.getElementById('suggestion-modal').classList.add('active');
        }

        function closeModal() {
            document.querySelectorAll('.modal-overlay, .modal').forEach(el => {
                el.classList.remove('active');
            });
        }

        // Form submission with legal analysis
        async function handleSuggestionSubmit(event) {
            event.preventDefault();
            
            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData.entries());
            
            try {
                showNotification('Tworzenie sugestii z analizą prawną...', 'info');
                const result = await apiCall('/api/suggestions', {
                    method: 'POST',
                    body: JSON.stringify(data)
                });
                
                if (result.success) {
                    showNotification('Sugestia została utworzona pomyślnie!', 'success');
                    closeModal();
                    event.target.reset();
                    await loadSuggestions(true);
                }
            } catch (error) {
                showNotification('Błąd podczas tworzenia sugestii', 'error');
            }
        }

        // Voting functionality
        async function vote(suggestionId, type) {
            try {
                const result = await apiCall(\`/api/suggestions/\${suggestionId}/vote\`, {
                    method: 'POST',
                    body: JSON.stringify({ type })
                });
                
                if (result.success) {
                    showNotification(\`Głos \${type === 'up' ? 'za' : 'przeciw'} został oddany\`, 'success');
                    await loadSuggestions(true);
                }
            } catch (error) {
                showNotification('Błąd podczas głosowania', 'error');
            }
        }

        // Utility functions
        function getImpactClass(score) {
            if (score > 70) return 'high-impact';
            if (score > 40) return 'medium-impact';
            return 'low-impact';
        }

        function getComplexityLevel(score) {
            if (score > 70) return 'high';
            if (score > 40) return 'medium';
            return 'low';
        }

        function getEventTitle(type) {
            const titles = {
                'suggestion_status_change': 'Zmiana statusu sugestii',
                'new_suggestion': 'Nowa sugestia',
                'vote_cast': 'Oddano głos',
                'comment_added': 'Dodano komentarz',
                'conflict_detected': 'Wykryto konflikt prawny'
            };
            return titles[type] || 'Zdarzenie';
        }

        function getEventDescription(event) {
            switch(event.type) {
                case 'suggestion_status_change':
                    return \`Sugestia #\${event.suggestionId} w dokumencie \${event.document}: \${event.oldStatus} → \${event.newStatus}\`;
                default:
                    return JSON.stringify(event);
            }
        }

        // Notifications
        function showNotification(message, type = 'info') {
            // Simple notification system - could be enhanced with toast library
            alert(\`\${type.toUpperCase()}: \${message}\`);
        }

        // Loading and error states
        function showLoading(containerId) {
            document.getElementById(containerId).innerHTML = \`
                <div class="loading">
                    <div class="spinner"></div>
                    <p>Ładowanie...</p>
                </div>
            \`;
        }

        function showError(containerId, message) {
            document.getElementById(containerId).innerHTML = \`
                <div style="text-align: center; padding: 2rem; color: #e53e3e;">
                    <p>❌ \${message}</p>
                </div>
            \`;
        }

        // Event listeners setup
        function setupEventListeners() {
            document.getElementById('suggestion-form').addEventListener('submit', handleSuggestionSubmit);
            document.getElementById('searchQuery').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') performSearch();
            });
            
            // Sort change handler
            document.getElementById('suggestionSort').addEventListener('change', function(e) {
                state.sortBy = e.target.value;
                loadSuggestions(true);
            });
        }

        // Real-time updates (simplified)
        function initializeRealTimeUpdates() {
            // Poll for updates every 30 seconds
            setInterval(async () => {
                await loadQuickStats();
                await loadRecentActivity();
            }, 30000);
        }

        // Load more suggestions
        function loadMoreSuggestions() {
            state.currentPage++;
            loadSuggestions();
        }

        // Placeholder functions for sidebar content
        async function loadQuickStats() {
            // Implementation for quick stats
        }

        async function loadLegalConflicts() {
            // Implementation for legal conflicts
        }

        async function loadRecentActivity() {
            // Implementation for recent activity
        }

        // Comment functionality
        function addComment(suggestionId) {
            const content = prompt('Dodaj komentarz:');
            if (content && content.trim()) {
                apiCall(\`/api/suggestions/\${suggestionId}/comments\`, {
                    method: 'POST',
                    body: JSON.stringify({
                        author: 'Anonymous', // In production, get from user session
                        content: content.trim()
                    })
                }).then(result => {
                    if (result.success) {
                        showNotification('Komentarz został dodany', 'success');
                        loadSuggestions(true);
                    }
                }).catch(() => {
                    showNotification('Błąd podczas dodawania komentarza', 'error');
                });
            }
        }
    </script>
</body>
</html>
  `;
}

module.exports = {
  generateInteractivePlatform,
  legalEngine,
  dataStore,
  logger
};