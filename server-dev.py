#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🚀 SSPO Regulamin Platform - Development Server with Full API
Fast Python-based server for testing and development
"""

import json
import datetime
import time
import os
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import threading
import random

# Global data storage
suggestions = []
analytics = {
    "totalVisits": 0,
    "documentViews": {},
    "suggestionStats": {
        "total": 0,
        "approved": 0,
        "rejected": 0,
        "pending": 0
    }
}

class SSPOHandler(BaseHTTPRequestHandler):
    
    def do_GET(self):
        """Handle GET requests"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        query_params = parse_qs(parsed_path.query)
        
        # Static files and main page
        if path == "/" or path == "/index.html":
            self.serve_main_page()
        elif path == "/api/health":
            self.serve_health_check()
        elif path == "/api/analytics":
            self.serve_analytics()
        elif path == "/api/suggestions":
            self.serve_suggestions()
        elif path == "/api/analyze":
            self.serve_analyze(query_params)
        elif path == "/api/stats":
            self.serve_stats()
        elif path == "/documents/":
            self.serve_documents()
        elif path == "/api/check":
            self.serve_system_check()
        else:
            self.send_error(404, "Endpoint not found")
    
    def do_POST(self):
        """Handle POST requests"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Read POST data
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length).decode('utf-8')
        
        if path == "/api/suggestions":
            self.handle_suggestion_post(post_data)
        elif path.startswith("/api/suggestions/") and path.endswith("/vote"):
            suggestion_id = path.split("/")[3]
            self.handle_vote_post(suggestion_id)
        else:
            self.send_error(404, "Endpoint not found")
    
    def serve_main_page(self):
        """Serve the main HTML page"""
        analytics["totalVisits"] += 1
        
        html_content = """<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🚀 SSPO Regulamin v3.0 - Full Debug Mode</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; margin: 0; padding: 20px; 
               background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
        .container { max-width: 1200px; margin: 0 auto; background: white; 
                    border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(45deg, #1e3c72, #2a5298); color: white; 
                 padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 2.5em; font-weight: 300; }
        .version-badge { display: inline-block; background: rgba(255,255,255,0.2); 
                        padding: 8px 16px; border-radius: 20px; margin-top: 10px; }
        .api-status { padding: 20px; background: #d4edda; border-left: 5px solid #28a745; margin: 20px; }
        .api-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
                   gap: 15px; padding: 20px; }
        .api-endpoint { background: #f8f9fa; padding: 20px; border-radius: 10px; 
                       border: 1px solid #dee2e6; }
        .api-endpoint h3 { margin-top: 0; color: #2a5298; }
        .test-btn { background: #007bff; color: white; padding: 10px 20px; border: none; 
                   border-radius: 5px; cursor: pointer; margin: 5px; }
        .test-btn:hover { background: #0056b3; }
        .result { margin-top: 10px; padding: 10px; border-radius: 5px; font-family: monospace; 
                 font-size: 12px; }
        .success { background: #d4edda; color: #155724; }
        .error { background: #f8d7da; color: #721c24; }
        .suggestion-form { background: #f8f9fa; padding: 25px; margin: 20px; 
                          border-radius: 15px; border-left: 5px solid #2a5298; }
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; margin-bottom: 5px; font-weight: 600; }
        .form-group input, .form-group textarea, .form-group select { 
            width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; }
        .submit-btn { background: linear-gradient(45deg, #2a5298, #1e3c72); color: white; 
                     padding: 15px 30px; border: none; border-radius: 10px; 
                     font-size: 1.1em; cursor: pointer; width: 100%; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 SSPO Regulamin v3.0</h1>
            <div class="version-badge">
                ✅ FULL DEBUG MODE - Python Development Server
            </div>
        </div>
        
        <div class="api-status">
            <h2>🔧 API Development Dashboard</h2>
            <p><strong>Status:</strong> ✅ All endpoints operational | <strong>Server:</strong> Python HTTP | <strong>Port:</strong> 8000</p>
            <p><strong>Visited:</strong> """ + str(analytics["totalVisits"]) + """ times | <strong>Suggestions:</strong> """ + str(len(suggestions)) + """</p>
        </div>
        
        <div class="api-grid">
            <div class="api-endpoint">
                <h3>🏥 Health Check</h3>
                <p>Sprawdza status systemu</p>
                <button class="test-btn" onclick="testAPI('/api/health')">Test</button>
                <div id="result-health" class="result" style="display:none;"></div>
            </div>
            
            <div class="api-endpoint">
                <h3>🧠 AI Analysis</h3>
                <p>Analiza prawna tekstu</p>
                <input type="text" id="analyze-text" placeholder="Wpisz tekst do analizy..." style="width:100%; margin:5px 0;">
                <button class="test-btn" onclick="testAnalyze()">Analizuj</button>
                <div id="result-analyze" class="result" style="display:none;"></div>
            </div>
            
            <div class="api-endpoint">
                <h3>📊 Statistics</h3>
                <p>Statystyki platformy</p>
                <button class="test-btn" onclick="testAPI('/api/stats')">Pobierz Stats</button>
                <div id="result-stats" class="result" style="display:none;"></div>
            </div>
            
            <div class="api-endpoint">
                <h3>📄 Documents</h3>
                <p>Lista dokumentów</p>
                <button class="test-btn" onclick="testAPI('/documents/')">Lista Docs</button>
                <div id="result-docs" class="result" style="display:none;"></div>
            </div>
            
            <div class="api-endpoint">
                <h3>🔍 System Check</h3>
                <p>Kompleksowa diagnostyka</p>
                <button class="test-btn" onclick="testAPI('/api/check')">Pełny Check</button>
                <div id="result-check" class="result" style="display:none;"></div>
            </div>
            
            <div class="api-endpoint">
                <h3>💡 Suggestions API</h3>
                <p>CRUD dla sugestii</p>
                <button class="test-btn" onclick="testAPI('/api/suggestions')">Pobierz</button>
                <button class="test-btn" onclick="addTestSuggestion()">Dodaj Test</button>
                <div id="result-suggestions" class="result" style="display:none;"></div>
            </div>
        </div>
        
        <div class="suggestion-form">
            <h2>💡 Dodaj sugestię (Working Form)</h2>
            <form id="suggestionForm">
                <div class="form-group">
                    <label>📍 Dokument:</label>
                    <select name="document" required>
                        <option value="">Wybierz...</option>
                        <option value="01-regulamin-sspo">01 - Regulamin SSPO</option>
                        <option value="02-ordynacja-wyborcza">02 - Ordynacja wyborcza</option>
                        <option value="04-regulamin-finansowy">04 - Regulamin finansowy</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>👤 Autor:</label>
                    <input type="text" name="author" placeholder="Twoje imię...">
                </div>
                <div class="form-group">
                    <label>📝 Opis problemu:</label>
                    <textarea name="description" rows="3" required></textarea>
                </div>
                <div class="form-group">
                    <label>💡 Rozwiązanie:</label>
                    <textarea name="solution" rows="3" required></textarea>
                </div>
                <button type="submit" class="submit-btn">📤 WYŚLIJ SUGESTIĘ</button>
            </form>
        </div>
    </div>
    
    <script>
        async function testAPI(endpoint) {
            const resultId = 'result-' + endpoint.split('/')[2];
            const resultDiv = document.getElementById(resultId);
            
            try {
                const response = await fetch(endpoint);
                const data = await response.json();
                
                resultDiv.innerHTML = JSON.stringify(data, null, 2);
                resultDiv.className = 'result success';
                resultDiv.style.display = 'block';
            } catch (error) {
                resultDiv.innerHTML = 'Error: ' + error.message;
                resultDiv.className = 'result error';
                resultDiv.style.display = 'block';
            }
        }
        
        async function testAnalyze() {
            const text = document.getElementById('analyze-text').value || 'regulamin zobowiązuje studentów';
            const resultDiv = document.getElementById('result-analyze');
            
            try {
                const response = await fetch(`/api/analyze?q=${encodeURIComponent(text)}`);
                const data = await response.json();
                
                resultDiv.innerHTML = JSON.stringify(data, null, 2);
                resultDiv.className = 'result success';
                resultDiv.style.display = 'block';
            } catch (error) {
                resultDiv.innerHTML = 'Error: ' + error.message;
                resultDiv.className = 'result error';
                resultDiv.style.display = 'block';
            }
        }
        
        async function addTestSuggestion() {
            const testData = {
                document: '01-regulamin-sspo',
                author: 'Debug User',
                description: 'Test suggestion from debug interface',
                solution: 'This is a test solution',
                category: 'improvement',
                priority: 'medium'
            };
            
            try {
                const response = await fetch('/api/suggestions', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(testData)
                });
                
                const result = await response.json();
                const resultDiv = document.getElementById('result-suggestions');
                resultDiv.innerHTML = JSON.stringify(result, null, 2);
                resultDiv.className = 'result success';
                resultDiv.style.display = 'block';
            } catch (error) {
                console.error('Error:', error);
            }
        }
        
        // Form submission
        document.getElementById('suggestionForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            try {
                const response = await fetch('/api/suggestions', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                alert('✅ Sugestia dodana! ID: ' + result.suggestionId);
                e.target.reset();
            } catch (error) {
                alert('❌ Błąd: ' + error.message);
            }
        });
    </script>
</body>
</html>"""
        
        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(html_content.encode('utf-8'))
    
    def serve_health_check(self):
        """Health check endpoint"""
        health_data = {
            "status": "healthy",
            "timestamp": datetime.datetime.now().isoformat(),
            "uptime": time.time(),
            "version": "3.0.0-python-dev",
            "environment": "development",
            "database": {
                "suggestions": len(suggestions),
                "analytics": len(analytics)
            },
            "performance": {
                "responseTime": "< 1ms",
                "server": "Python HTTP"
            }
        }
        
        self.send_json_response(health_data)
    
    def serve_analytics(self):
        """Analytics endpoint"""
        self.send_json_response(analytics)
    
    def serve_suggestions(self):
        """Suggestions endpoint"""
        response_data = {
            "suggestions": suggestions[-20:],  # Last 20
            "analytics": analytics["suggestionStats"]
        }
        self.send_json_response(response_data)
    
    def serve_analyze(self, query_params):
        """AI Analysis endpoint"""
        query = query_params.get('q', [''])[0]
        
        if not query:
            self.send_error(400, "Missing query parameter 'q'")
            return
        
        # Mock NLP analysis
        legal_keywords = {
            'obligations': ['musi', 'zobowiązuje', 'powinien', 'ma obowiązek'],
            'rights': ['ma prawo', 'może', 'jest uprawniony'],
            'prohibitions': ['zabrania się', 'nie może', 'nie wolno'],
            'procedures': ['procedura', 'tryb', 'sposób', 'proces'],
            'penalties': ['kara', 'sankcja', 'odpowiedzialność']
        }
        
        categories = []
        tokens = query.lower().split()
        
        for category, keywords in legal_keywords.items():
            matches = [kw for kw in keywords if kw in query.lower()]
            if matches:
                categories.append({
                    "category": category,
                    "matches": matches,
                    "confidence": len(matches) / len(keywords)
                })
        
        analysis_result = {
            "success": True,
            "analysis": {
                "query": query,
                "tokens": len(tokens),
                "categories": categories,
                "legalConcepts": [cat["category"] for cat in categories],
                "confidence": sum(cat["confidence"] for cat in categories) / max(len(categories), 1),
                "suggestions": ["Sprawdź dokument 01-regulamin-sspo", "Konsultuj z zespołem prawnym"]
            }
        }
        
        self.send_json_response(analysis_result)
    
    def serve_stats(self):
        """Statistics endpoint"""
        stats = {
            "suggestions": {
                "total": len(suggestions),
                "pending": len([s for s in suggestions if s.get("status") == "pending"]),
                "approved": len([s for s in suggestions if s.get("status") == "approved"]),
                "rejected": len([s for s in suggestions if s.get("status") == "rejected"]),
                "implemented": len([s for s in suggestions if s.get("status") == "implemented"])
            },
            "analytics": {
                "totalVisits": analytics.get("totalVisits", 0),
                "documentViews": analytics.get("documentViews", {}),
                "avgVotesPerSuggestion": sum(s.get("votes", 0) for s in suggestions) / max(len(suggestions), 1)
            },
            "system": {
                "uptime": time.time(),
                "timestamp": datetime.datetime.now().isoformat(),
                "server": "Python Development Server"
            }
        }
        
        self.send_json_response(stats)
    
    def serve_documents(self):
        """Documents list endpoint"""
        documents = [
            {
                "id": "01-regulamin-sspo",
                "title": "Regulamin SSPO (główny)",
                "description": "Główny regulamin Samorządu Studentów Politechniki Opolskiej",
                "lastModified": "2024-12-18",
                "sections": 15,
                "status": "active"
            },
            {
                "id": "02-ordynacja-wyborcza",
                "title": "Ordynacja wyborcza",
                "description": "Zasady przeprowadzania wyborów w SSPO",
                "lastModified": "2024-11-20",
                "sections": 8,
                "status": "active"
            },
            {
                "id": "04-regulamin-finansowy",
                "title": "Regulamin finansowy",
                "description": "Zasady zarządzania finansami SSPO",
                "lastModified": "2024-12-01",
                "sections": 12,
                "status": "active"
            }
        ]
        
        response_data = {
            "success": True,
            "documents": documents,
            "totalCount": len(documents)
        }
        
        self.send_json_response(response_data)
    
    def serve_system_check(self):
        """System check endpoint"""
        system_check = {
            "success": True,
            "system": {
                "timestamp": datetime.datetime.now().isoformat(),
                "services": {
                    "database": {"status": "operational", "responseTime": "1ms"},
                    "api": {"status": "operational", "endpoints": ["/api/suggestions", "/api/analytics", "/api/health"]},
                    "frontend": {"status": "operational", "assets": "loaded"}
                },
                "performance": {
                    "uptime": time.time(),
                    "server": "Python HTTP Development Server"
                },
                "features": {
                    "suggestions": len(suggestions) > 0,
                    "analytics": True,
                    "legalAnalysis": True,
                    "notifications": True
                }
            },
            "message": "System działa prawidłowo - Python Development Mode"
        }
        
        self.send_json_response(system_check)
    
    def handle_suggestion_post(self, post_data):
        """Handle suggestion creation"""
        try:
            data = json.loads(post_data)
            suggestion = {
                "id": int(time.time() * 1000),  # Timestamp as ID
                "timestamp": datetime.datetime.now().isoformat(),
                "status": "pending",
                "votes": 0,
                "comments": [],
                **data
            }
            
            suggestions.append(suggestion)
            analytics["suggestionStats"]["total"] += 1
            analytics["suggestionStats"]["pending"] += 1
            
            response = {
                "success": True,
                "message": "Sugestia zapisana!",
                "suggestionId": suggestion["id"]
            }
            
            self.send_json_response(response)
            
        except json.JSONDecodeError:
            self.send_error(400, "Invalid JSON")
    
    def handle_vote_post(self, suggestion_id):
        """Handle voting on suggestion"""
        try:
            suggestion_id = int(suggestion_id)
            suggestion = next((s for s in suggestions if s["id"] == suggestion_id), None)
            
            if suggestion:
                suggestion["votes"] = suggestion.get("votes", 0) + 1
                response = {
                    "success": True,
                    "votes": suggestion["votes"]
                }
                self.send_json_response(response)
            else:
                self.send_error(404, "Suggestion not found")
                
        except ValueError:
            self.send_error(400, "Invalid suggestion ID")
    
    def send_json_response(self, data):
        """Send JSON response with CORS headers"""
        self.send_response(200)
        self.send_header('Content-type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False, indent=2).encode('utf-8'))
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def log_message(self, format, *args):
        """Custom log format"""
        timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print(f"🌐 [{timestamp}] {format % args}")

def run_server(port=8000):
    """Run the development server"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, SSPOHandler)
    
    print(f"""
🚀 SSPO Regulamin Platform - Development Server
================================================
✅ Server starting on: http://localhost:{port}
🔧 Mode: Full API Debug
📊 Features: All endpoints active
🧠 AI Analysis: Mock NLP enabled
💾 Storage: In-memory (development)

Press Ctrl+C to stop the server
""")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
        httpd.server_close()

if __name__ == "__main__":
    # Add some test data
    suggestions.append({
        "id": 1,
        "document": "01-regulamin-sspo",
        "author": "Test User",
        "description": "Przykładowa sugestia dla testów",
        "solution": "Przykładowe rozwiązanie",
        "status": "pending",
        "votes": 3,
        "timestamp": datetime.datetime.now().isoformat(),
        "comments": []
    })
    
    analytics["suggestionStats"]["total"] = 1
    analytics["suggestionStats"]["pending"] = 1
    
    run_server(8000)