#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SSPO Regulamin Platform v3.0 - Full Document Management System
System przeglądania dokumentów z komentarzami + autoryzacja użytkowników
"""

import os
import json
import sqlite3
import hashlib
import secrets
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, render_template_string, session, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
import markdown
from pathlib import Path
import re

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)

# Konfiguracja bazy danych
DATABASE = 'sspo_platform.db'

class DatabaseManager:
    def __init__(self, db_path):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Inicjalizacja bazy danych z wszystkimi tabelami"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            # Tabela użytkowników
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    full_name TEXT,
                    role TEXT DEFAULT 'user',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    last_login TIMESTAMP,
                    is_active BOOLEAN DEFAULT 1,
                    profile_data TEXT -- JSON dla dodatkowych danych
                )
            ''')
            
            # Tabela dokumentów
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS documents (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    filename TEXT UNIQUE NOT NULL,
                    title TEXT NOT NULL,
                    description TEXT,
                    content TEXT,
                    version TEXT DEFAULT '1.0',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    created_by INTEGER REFERENCES users(id),
                    status TEXT DEFAULT 'draft',
                    category TEXT,
                    tags TEXT, -- JSON array
                    view_count INTEGER DEFAULT 0
                )
            ''')
            
            # Tabela komentarzy do dokumentów
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS document_comments (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    document_id INTEGER REFERENCES documents(id),
                    user_id INTEGER REFERENCES users(id),
                    parent_comment_id INTEGER REFERENCES document_comments(id),
                    content TEXT NOT NULL,
                    selection_start INTEGER,
                    selection_end INTEGER,
                    selection_text TEXT,
                    comment_type TEXT DEFAULT 'general', -- general, suggestion, question, correction
                    status TEXT DEFAULT 'active', -- active, resolved, archived
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    likes INTEGER DEFAULT 0,
                    metadata TEXT -- JSON dla dodatkowych danych
                )
            ''')
            
            # Tabela reakcji na komentarze
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS comment_reactions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    comment_id INTEGER REFERENCES document_comments(id),
                    user_id INTEGER REFERENCES users(id),
                    reaction_type TEXT, -- like, dislike, helpful, agree, disagree
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(comment_id, user_id, reaction_type)
                )
            ''')
            
            # Tabela sesji użytkowników
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS user_sessions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER REFERENCES users(id),
                    session_token TEXT UNIQUE NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    expires_at TIMESTAMP,
                    ip_address TEXT,
                    user_agent TEXT,
                    is_active BOOLEAN DEFAULT 1
                )
            ''')
            
            # Tabela aktywności użytkowników
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS user_activity (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER REFERENCES users(id),
                    activity_type TEXT, -- login, logout, view_document, add_comment, etc.
                    resource_type TEXT, -- document, comment, user
                    resource_id INTEGER,
                    description TEXT,
                    metadata TEXT, -- JSON
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    ip_address TEXT
                )
            ''')
            
            conn.commit()
            print("✅ Baza danych zainicjalizowana pomyślnie")
    
    def get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

# Inicjalizacja bazy danych
db = DatabaseManager(DATABASE)

class UserManager:
    @staticmethod
    def create_user(username, email, password, full_name=None, role='user'):
        """Tworzenie nowego użytkownika"""
        with db.get_connection() as conn:
            cursor = conn.cursor()
            
            # Sprawdź czy użytkownik już istnieje
            cursor.execute('SELECT id FROM users WHERE username = ? OR email = ?', (username, email))
            if cursor.fetchone():
                return {'success': False, 'error': 'Użytkownik już istnieje'}
            
            # Hashuj hasło
            password_hash = generate_password_hash(password)
            
            # Wstaw użytkownika
            cursor.execute('''
                INSERT INTO users (username, email, password_hash, full_name, role)
                VALUES (?, ?, ?, ?, ?)
            ''', (username, email, password_hash, full_name, role))
            
            user_id = cursor.lastrowid
            conn.commit()
            
            return {'success': True, 'user_id': user_id}
    
    @staticmethod
    def authenticate_user(username, password):
        """Autoryzacja użytkownika"""
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT id, username, email, password_hash, full_name, role, is_active
                FROM users WHERE username = ? OR email = ?
            ''', (username, username))
            
            user = cursor.fetchone()
            if not user or not user['is_active']:
                return None
            
            if check_password_hash(user['password_hash'], password):
                # Aktualizuj ostatnie logowanie
                cursor.execute('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', (user['id'],))
                conn.commit()
                
                return dict(user)
            
            return None
    
    @staticmethod
    def get_user_by_id(user_id):
        """Pobierz użytkownika po ID"""
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT id, username, email, full_name, role, created_at, last_login, is_active
                FROM users WHERE id = ? AND is_active = 1
            ''', (user_id,))
            
            user = cursor.fetchone()
            return dict(user) if user else None

class DocumentManager:
    @staticmethod
    def load_documents_from_files():
        """Ładowanie dokumentów z plików .md do bazy"""
        with db.get_connection() as conn:
            cursor = conn.cursor()
            
            # Lista dokumentów do załadowania
            docs_to_load = [
                ('01-regulamin-sspo.md', 'Regulamin SSPO', 'Główny regulamin Samorządu Studentów Politechniki Opolskiej'),
                ('02-ordynacja-wyborcza.md', 'Ordynacja wyborcza', 'Zasady przeprowadzania wyborów w SSPO'),
                ('03-kodeks-etyczny.md', 'Kodeks etyczny', 'Zasady etyczne obowiązujące członków SSPO'),
                ('04-regulamin-finansowy.md', 'Regulamin finansowy', 'Zasady zarządzania finansami SSPO'),
                ('05-regulamin-wrs.md', 'Regulamin WRS', 'Regulamin Wyższego Rzecznika Studenckiego'),
                ('06-regulamin-komisji-etyki.md', 'Regulamin Komisji Etyki', 'Zasady działania komisji etyki'),
                ('07-regulamin-kolegium-honorowych.md', 'Regulamin Kolegium Honorowych', 'Regulamin kolegium honorowych'),
                ('08-regulamin-rady-doradczej.md', 'Regulamin Rady Doradczej', 'Zasady działania rady doradczej'),
            ]
            
            for filename, title, description in docs_to_load:
                file_path = Path(filename)
                
                # Sprawdź czy dokument już istnieje w bazie
                cursor.execute('SELECT id FROM documents WHERE filename = ?', (filename,))
                if cursor.fetchone():
                    continue
                
                # Załaduj zawartość pliku
                content = ""
                if file_path.exists():
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                else:
                    content = f"# {title}\n\n{description}\n\n*Dokument w przygotowaniu...*"
                
                # Wstaw do bazy
                cursor.execute('''
                    INSERT INTO documents (filename, title, description, content, status, category)
                    VALUES (?, ?, ?, ?, 'published', 'legal')
                ''', (filename, title, description, content))
            
            conn.commit()
            print(f"✅ Załadowano dokumenty do bazy danych")
    
    @staticmethod
    def get_all_documents():
        """Pobierz wszystkie dokumenty"""
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT d.*, u.username as created_by_username,
                       COUNT(dc.id) as comment_count
                FROM documents d
                LEFT JOIN users u ON d.created_by = u.id
                LEFT JOIN document_comments dc ON d.id = dc.document_id AND dc.status = 'active'
                GROUP BY d.id
                ORDER BY d.created_at DESC
            ''')
            
            return [dict(row) for row in cursor.fetchall()]
    
    @staticmethod
    def get_document_by_id(doc_id):
        """Pobierz dokument po ID"""
        with db.get_connection() as conn:
            cursor = conn.cursor()
            
            # Zwiększ licznik wyświetleń
            cursor.execute('UPDATE documents SET view_count = view_count + 1 WHERE id = ?', (doc_id,))
            
            cursor.execute('''
                SELECT d.*, u.username as created_by_username
                FROM documents d
                LEFT JOIN users u ON d.created_by = u.id
                WHERE d.id = ?
            ''', (doc_id,))
            
            document = cursor.fetchone()
            conn.commit()
            
            return dict(document) if document else None

class CommentManager:
    @staticmethod
    def add_comment(document_id, user_id, content, comment_type='general', 
                   selection_start=None, selection_end=None, selection_text=None,
                   parent_comment_id=None):
        """Dodawanie komentarza do dokumentu"""
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO document_comments 
                (document_id, user_id, parent_comment_id, content, selection_start, 
                 selection_end, selection_text, comment_type)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (document_id, user_id, parent_comment_id, content, 
                  selection_start, selection_end, selection_text, comment_type))
            
            comment_id = cursor.lastrowid
            conn.commit()
            
            return comment_id
    
    @staticmethod
    def get_comments_for_document(document_id):
        """Pobierz komentarze dla dokumentu"""
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT dc.*, u.username, u.full_name,
                       COUNT(cr.id) as reaction_count
                FROM document_comments dc
                JOIN users u ON dc.user_id = u.id
                LEFT JOIN comment_reactions cr ON dc.id = cr.comment_id
                WHERE dc.document_id = ? AND dc.status = 'active'
                GROUP BY dc.id
                ORDER BY dc.created_at ASC
            ''', (document_id,))
            
            return [dict(row) for row in cursor.fetchall()]
    
    @staticmethod
    def add_reaction(comment_id, user_id, reaction_type):
        """Dodaj reakcję do komentarza"""
        with db.get_connection() as conn:
            cursor = conn.cursor()
            
            # Usuń poprzednią reakcję tego typu od tego użytkownika
            cursor.execute('''
                DELETE FROM comment_reactions 
                WHERE comment_id = ? AND user_id = ? AND reaction_type = ?
            ''', (comment_id, user_id, reaction_type))
            
            # Dodaj nową reakcję
            cursor.execute('''
                INSERT INTO comment_reactions (comment_id, user_id, reaction_type)
                VALUES (?, ?, ?)
            ''', (comment_id, user_id, reaction_type))
            
            conn.commit()
            return True

# Inicjalizuj dokumenty przy starcie
DocumentManager.load_documents_from_files()

# =====================================================
# ROUTES - AUTORYZACJA
# =====================================================

@app.route('/auth/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        data = request.get_json() if request.is_json else request.form
        
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        full_name = data.get('full_name', '')
        
        if not all([username, email, password]):
            return jsonify({'success': False, 'error': 'Wszystkie pola są wymagane'})
        
        result = UserManager.create_user(username, email, password, full_name)
        
        if request.is_json:
            return jsonify(result)
        else:
            if result['success']:
                return redirect(url_for('login'))
            else:
                return render_template_string(REGISTER_TEMPLATE, error=result['error'])
    
    return render_template_string(REGISTER_TEMPLATE)

@app.route('/auth/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json() if request.is_json else request.form
        
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            error = 'Login i hasło są wymagane'
            if request.is_json:
                return jsonify({'success': False, 'error': error})
            else:
                return render_template_string(LOGIN_TEMPLATE, error=error)
        
        user = UserManager.authenticate_user(username, password)
        
        if user:
            session['user_id'] = user['id']
            session['username'] = user['username']
            session['role'] = user['role']
            
            if request.is_json:
                return jsonify({'success': True, 'user': user})
            else:
                return redirect(url_for('index'))
        else:
            error = 'Nieprawidłowy login lub hasło'
            if request.is_json:
                return jsonify({'success': False, 'error': error})
            else:
                return render_template_string(LOGIN_TEMPLATE, error=error)
    
    return render_template_string(LOGIN_TEMPLATE)

@app.route('/auth/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

# =====================================================
# ROUTES - GŁÓWNE STRONY
# =====================================================

@app.route('/')
def index():
    documents = DocumentManager.get_all_documents()
    user = None
    if 'user_id' in session:
        user = UserManager.get_user_by_id(session['user_id'])
    
    return render_template_string(INDEX_TEMPLATE, documents=documents, user=user)

@app.route('/document/<int:doc_id>')
def view_document(doc_id):
    document = DocumentManager.get_document_by_id(doc_id)
    if not document:
        return "Dokument nie znaleziony", 404
    
    comments = CommentManager.get_comments_for_document(doc_id)
    user = None
    if 'user_id' in session:
        user = UserManager.get_user_by_id(session['user_id'])
    
    # Konwertuj markdown na HTML
    document['content_html'] = markdown.markdown(document['content'])
    
    return render_template_string(DOCUMENT_VIEW_TEMPLATE, 
                                document=document, 
                                comments=comments, 
                                user=user)

# =====================================================
# API ENDPOINTS
# =====================================================

@app.route('/api/comments', methods=['POST'])
def api_add_comment():
    if 'user_id' not in session:
        return jsonify({'success': False, 'error': 'Musisz być zalogowany'})
    
    data = request.get_json()
    
    comment_id = CommentManager.add_comment(
        document_id=data['document_id'],
        user_id=session['user_id'],
        content=data['content'],
        comment_type=data.get('comment_type', 'general'),
        selection_start=data.get('selection_start'),
        selection_end=data.get('selection_end'),
        selection_text=data.get('selection_text'),
        parent_comment_id=data.get('parent_comment_id')
    )
    
    return jsonify({'success': True, 'comment_id': comment_id})

@app.route('/api/comments/<int:comment_id>/react', methods=['POST'])
def api_add_reaction(comment_id):
    if 'user_id' not in session:
        return jsonify({'success': False, 'error': 'Musisz być zalogowany'})
    
    data = request.get_json()
    reaction_type = data.get('reaction_type', 'like')
    
    CommentManager.add_reaction(comment_id, session['user_id'], reaction_type)
    
    return jsonify({'success': True})

@app.route('/api/documents')
def api_get_documents():
    documents = DocumentManager.get_all_documents()
    return jsonify({'success': True, 'documents': documents})

@app.route('/api/document/<int:doc_id>')
def api_get_document(doc_id):
    document = DocumentManager.get_document_by_id(doc_id)
    if not document:
        return jsonify({'success': False, 'error': 'Dokument nie znaleziony'})
    
    return jsonify({'success': True, 'document': document})

@app.route('/api/document/<int:doc_id>/comments')
def api_get_comments(doc_id):
    comments = CommentManager.get_comments_for_document(doc_id)
    return jsonify({'success': True, 'comments': comments})

@app.route('/api/user/profile')
def api_user_profile():
    if 'user_id' not in session:
        return jsonify({'success': False, 'error': 'Nie zalogowany'})
    
    user = UserManager.get_user_by_id(session['user_id'])
    return jsonify({'success': True, 'user': user})

# =====================================================
# TEMPLATES HTML
# =====================================================

INDEX_TEMPLATE = '''
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SSPO Regulamin v3.0 - System Zarządzania Dokumentami</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
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
            position: relative;
        }
        
        .header h1 {
            font-size: 2.5em;
            font-weight: 300;
            margin-bottom: 10px;
        }
        
        .user-menu {
            position: absolute;
            top: 20px;
            right: 30px;
            display: flex;
            gap: 15px;
            align-items: center;
        }
        
        .user-menu a {
            color: white;
            text-decoration: none;
            padding: 8px 16px;
            border-radius: 20px;
            background: rgba(255,255,255,0.2);
            transition: background 0.3s;
        }
        
        .user-menu a:hover {
            background: rgba(255,255,255,0.3);
        }
        
        .content {
            padding: 30px;
        }
        
        .documents-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 25px;
            margin-top: 30px;
        }
        
        .document-card {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transition: transform 0.3s, box-shadow 0.3s;
            cursor: pointer;
        }
        
        .document-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }
        
        .document-title {
            font-size: 1.4em;
            font-weight: 600;
            color: #2a5298;
            margin-bottom: 10px;
        }
        
        .document-description {
            color: #666;
            line-height: 1.6;
            margin-bottom: 15px;
        }
        
        .document-stats {
            display: flex;
            justify-content: space-between;
            font-size: 0.9em;
            color: #888;
            border-top: 1px solid #f0f0f0;
            padding-top: 15px;
        }
        
        .welcome-section {
            background: #f8f9fa;
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 30px;
            border-left: 5px solid #2a5298;
        }
        
        @media (max-width: 768px) {
            .documents-grid {
                grid-template-columns: 1fr;
            }
            
            .user-menu {
                position: relative;
                top: auto;
                right: auto;
                justify-content: center;
                margin-top: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏛️ SSPO Regulamin v3.0</h1>
            <p style="opacity: 0.9;">System Zarządzania Dokumentami z Komentarzami</p>
            
            <div class="user-menu">
                {% if user %}
                    <span>Witaj, {{ user.full_name or user.username }}!</span>
                    <a href="/auth/logout">Wyloguj</a>
                {% else %}
                    <a href="/auth/login">Zaloguj</a>
                    <a href="/auth/register">Rejestracja</a>
                {% endif %}
            </div>
        </div>
        
        <div class="content">
            <div class="welcome-section">
                <h2>📚 Przeglądaj Dokumenty SSPO</h2>
                <p>
                    Wszystkie dokumenty można przeglądać bez logowania. 
                    {% if not user %}
                        <strong>Zaloguj się</strong>, aby dodawać komentarze i uczestniczyć w dyskusjach!
                    {% else %}
                        Możesz teraz dodawać komentarze i uczestniczyć w dyskusjach!
                    {% endif %}
                </p>
            </div>
            
            <div class="documents-grid">
                {% for doc in documents %}
                <div class="document-card" onclick="window.location.href='/document/{{ doc.id }}'">
                    <div class="document-title">{{ doc.title }}</div>
                    <div class="document-description">{{ doc.description }}</div>
                    <div class="document-stats">
                        <span>👀 {{ doc.view_count or 0 }} wyświetleń</span>
                        <span>💬 {{ doc.comment_count or 0 }} komentarzy</span>
                        <span>📅 {{ doc.updated_at[:10] }}</span>
                    </div>
                </div>
                {% endfor %}
            </div>
            
            {% if not documents %}
            <div style="text-align: center; padding: 50px; color: #666;">
                <h3>Brak dokumentów</h3>
                <p>Dokumenty zostaną wkrótce załadowane do systemu.</p>
            </div>
            {% endif %}
        </div>
    </div>
</body>
</html>
'''

LOGIN_TEMPLATE = '''
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Logowanie - SSPO</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .login-container {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            max-width: 400px;
            width: 100%;
        }
        
        .login-header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .login-header h1 {
            color: #2a5298;
            font-size: 2em;
            margin-bottom: 10px;
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
        
        .form-group input {
            width: 100%;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 1em;
            transition: border-color 0.3s;
        }
        
        .form-group input:focus {
            outline: none;
            border-color: #2a5298;
        }
        
        .submit-btn {
            width: 100%;
            background: linear-gradient(45deg, #2a5298, #1e3c72);
            color: white;
            padding: 15px;
            border: none;
            border-radius: 10px;
            font-size: 1.1em;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        }
        
        .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(42, 82, 152, 0.3);
        }
        
        .error {
            background: #f8d7da;
            color: #721c24;
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 20px;
            border: 1px solid #f5c6cb;
        }
        
        .links {
            text-align: center;
            margin-top: 20px;
        }
        
        .links a {
            color: #2a5298;
            text-decoration: none;
            margin: 0 10px;
        }
        
        .links a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="login-header">
            <h1>🔐 Logowanie</h1>
            <p>Zaloguj się do systemu SSPO</p>
        </div>
        
        {% if error %}
        <div class="error">{{ error }}</div>
        {% endif %}
        
        <form method="POST">
            <div class="form-group">
                <label>Login lub email:</label>
                <input type="text" name="username" required>
            </div>
            
            <div class="form-group">
                <label>Hasło:</label>
                <input type="password" name="password" required>
            </div>
            
            <button type="submit" class="submit-btn">Zaloguj się</button>
        </form>
        
        <div class="links">
            <a href="/auth/register">Nie masz konta? Zarejestruj się</a>
            |
            <a href="/">Powrót do strony głównej</a>
        </div>
    </div>
</body>
</html>
'''

REGISTER_TEMPLATE = '''
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rejestracja - SSPO</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .register-container {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            max-width: 450px;
            width: 100%;
        }
        
        .register-header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .register-header h1 {
            color: #2a5298;
            font-size: 2em;
            margin-bottom: 10px;
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
        
        .form-group input {
            width: 100%;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 1em;
            transition: border-color 0.3s;
        }
        
        .form-group input:focus {
            outline: none;
            border-color: #2a5298;
        }
        
        .submit-btn {
            width: 100%;
            background: linear-gradient(45deg, #2a5298, #1e3c72);
            color: white;
            padding: 15px;
            border: none;
            border-radius: 10px;
            font-size: 1.1em;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        }
        
        .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(42, 82, 152, 0.3);
        }
        
        .error {
            background: #f8d7da;
            color: #721c24;
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 20px;
            border: 1px solid #f5c6cb;
        }
        
        .links {
            text-align: center;
            margin-top: 20px;
        }
        
        .links a {
            color: #2a5298;
            text-decoration: none;
            margin: 0 10px;
        }
        
        .links a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="register-container">
        <div class="register-header">
            <h1>📝 Rejestracja</h1>
            <p>Utwórz konto w systemie SSPO</p>
        </div>
        
        {% if error %}
        <div class="error">{{ error }}</div>
        {% endif %}
        
        <form method="POST">
            <div class="form-group">
                <label>Nazwa użytkownika:</label>
                <input type="text" name="username" required>
            </div>
            
            <div class="form-group">
                <label>Adres email:</label>
                <input type="email" name="email" required>
            </div>
            
            <div class="form-group">
                <label>Pełne imię i nazwisko:</label>
                <input type="text" name="full_name">
            </div>
            
            <div class="form-group">
                <label>Hasło:</label>
                <input type="password" name="password" required>
            </div>
            
            <button type="submit" class="submit-btn">Zarejestruj się</button>
        </form>
        
        <div class="links">
            <a href="/auth/login">Masz już konto? Zaloguj się</a>
            |
            <a href="/">Powrót do strony głównej</a>
        </div>
    </div>
</body>
</html>
'''

DOCUMENT_VIEW_TEMPLATE = '''
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ document.title }} - SSPO</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Segoe UI', sans-serif;
            background: #f5f7fa;
            line-height: 1.6;
        }
        
        .header {
            background: linear-gradient(45deg, #1e3c72, #2a5298);
            color: white;
            padding: 20px 0;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .header-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .header h1 {
            font-size: 1.8em;
            font-weight: 300;
        }
        
        .nav-links a {
            color: white;
            text-decoration: none;
            margin-left: 20px;
            padding: 8px 16px;
            border-radius: 20px;
            background: rgba(255,255,255,0.2);
            transition: background 0.3s;
        }
        
        .nav-links a:hover {
            background: rgba(255,255,255,0.3);
        }
        
        .container {
            max-width: 1200px;
            margin: 20px auto;
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 30px;
            padding: 0 20px;
        }
        
        .document-content {
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            position: relative;
        }
        
        .document-header {
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .document-title {
            color: #2a5298;
            font-size: 2.2em;
            font-weight: 600;
            margin-bottom: 10px;
        }
        
        .document-meta {
            color: #666;
            display: flex;
            gap: 20px;
            font-size: 0.9em;
        }
        
        .document-body {
            font-size: 1.1em;
            line-height: 1.8;
        }
        
        .document-body h1, .document-body h2, .document-body h3 {
            color: #2a5298;
            margin: 30px 0 15px 0;
            position: relative;
        }
        
        .document-body h1 {
            font-size: 1.8em;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 10px;
        }
        
        .document-body h2 {
            font-size: 1.4em;
        }
        
        .document-body h3 {
            font-size: 1.2em;
        }
        
        .document-body p {
            margin-bottom: 15px;
            text-align: justify;
        }
        
        .document-body ul, .document-body ol {
            margin: 15px 0 15px 30px;
        }
        
        .document-body li {
            margin-bottom: 8px;
        }
        
        .comments-section {
            background: white;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            max-height: calc(100vh - 140px);
            overflow-y: auto;
            position: sticky;
            top: 20px;
        }
        
        .comments-header {
            padding: 20px;
            border-bottom: 1px solid #f0f0f0;
            background: #f8f9fa;
            border-radius: 15px 15px 0 0;
        }
        
        .comments-header h3 {
            color: #2a5298;
            margin-bottom: 10px;
        }
        
        .comment-form {
            padding: 20px;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .comment-form textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            resize: vertical;
            min-height: 80px;
            font-family: inherit;
            font-size: 0.9em;
        }
        
        .comment-form textarea:focus {
            outline: none;
            border-color: #2a5298;
        }
        
        .comment-form button {
            background: #2a5298;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            margin-top: 10px;
            font-weight: 600;
        }
        
        .comment-form button:hover {
            background: #1e3c72;
        }
        
        .comments-list {
            padding: 20px;
        }
        
        .comment {
            border-bottom: 1px solid #f0f0f0;
            padding: 15px 0;
            position: relative;
        }
        
        .comment:last-child {
            border-bottom: none;
        }
        
        .comment-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        
        .comment-author {
            font-weight: 600;
            color: #2a5298;
        }
        
        .comment-date {
            color: #888;
            font-size: 0.8em;
        }
        
        .comment-content {
            color: #333;
            line-height: 1.5;
            margin-bottom: 10px;
        }
        
        .comment-actions {
            display: flex;
            gap: 10px;
        }
        
        .comment-action {
            background: none;
            border: 1px solid #ddd;
            padding: 4px 12px;
            border-radius: 15px;
            cursor: pointer;
            font-size: 0.8em;
            color: #666;
            transition: all 0.3s;
        }
        
        .comment-action:hover {
            background: #f0f0f0;
            color: #333;
        }
        
        .selection-highlight {
            background: #fff3cd;
            border-left: 3px solid #ffc107;
            padding: 2px 5px;
            margin: 5px 0;
            font-style: italic;
            font-size: 0.9em;
        }
        
        .login-prompt {
            text-align: center;
            padding: 20px;
            color: #666;
        }
        
        .login-prompt a {
            color: #2a5298;
            text-decoration: none;
        }
        
        .login-prompt a:hover {
            text-decoration: underline;
        }
        
        @media (max-width: 768px) {
            .container {
                grid-template-columns: 1fr;
            }
            
            .comments-section {
                position: relative;
                max-height: none;
            }
            
            .header-content {
                flex-direction: column;
                gap: 15px;
            }
            
            .nav-links {
                display: flex;
                gap: 10px;
            }
        }
        
        /* Text selection highlighting for comments */
        ::selection {
            background: rgba(42, 82, 152, 0.3);
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-content">
            <h1>📄 {{ document.title }}</h1>
            <div class="nav-links">
                <a href="/">🏠 Strona główna</a>
                {% if user %}
                    <span style="opacity: 0.8;">{{ user.username }}</span>
                    <a href="/auth/logout">Wyloguj</a>
                {% else %}
                    <a href="/auth/login">Zaloguj</a>
                {% endif %}
            </div>
        </div>
    </div>
    
    <div class="container">
        <div class="document-content">
            <div class="document-header">
                <h1 class="document-title">{{ document.title }}</h1>
                <div class="document-meta">
                    <span>👀 {{ document.view_count or 0 }} wyświetleń</span>
                    <span>📅 Ostatnia aktualizacja: {{ document.updated_at[:10] }}</span>
                    <span>📝 Wersja: {{ document.version }}</span>
                </div>
            </div>
            
            <div class="document-body" id="documentBody">
                {{ document.content_html|safe }}
            </div>
        </div>
        
        <div class="comments-section">
            <div class="comments-header">
                <h3>💬 Komentarze ({{ comments|length }})</h3>
                <p style="font-size: 0.9em; color: #666;">
                    Zaznacz tekst w dokumencie, aby skomentować fragment
                </p>
            </div>
            
            {% if user %}
            <div class="comment-form">
                <textarea id="commentText" placeholder="Napisz komentarz do dokumentu..."></textarea>
                <div id="selectionInfo" style="display: none; background: #f8f9fa; padding: 10px; margin: 10px 0; border-radius: 6px; font-size: 0.9em;">
                    <strong>Komentarz do zaznaczonego fragmentu:</strong>
                    <div class="selection-highlight" id="selectedText"></div>
                </div>
                <button onclick="addComment()">Dodaj komentarz</button>
            </div>
            {% else %}
            <div class="login-prompt">
                <p><a href="/auth/login">Zaloguj się</a>, aby dodawać komentarze</p>
            </div>
            {% endif %}
            
            <div class="comments-list">
                {% for comment in comments %}
                <div class="comment">
                    <div class="comment-header">
                        <span class="comment-author">{{ comment.full_name or comment.username }}</span>
                        <span class="comment-date">{{ comment.created_at[:16] }}</span>
                    </div>
                    
                    {% if comment.selection_text %}
                    <div class="selection-highlight">
                        "{{ comment.selection_text }}"
                    </div>
                    {% endif %}
                    
                    <div class="comment-content">{{ comment.content }}</div>
                    
                    {% if user %}
                    <div class="comment-actions">
                        <button class="comment-action" onclick="reactToComment({{ comment.id }}, 'like')">
                            👍 {{ comment.reaction_count or 0 }}
                        </button>
                        <button class="comment-action" onclick="replyToComment({{ comment.id }})">
                            💬 Odpowiedz
                        </button>
                    </div>
                    {% endif %}
                </div>
                {% endfor %}
                
                {% if not comments %}
                <div style="text-align: center; padding: 30px; color: #888;">
                    <p>Brak komentarzy. Bądź pierwszy!</p>
                </div>
                {% endif %}
            </div>
        </div>
    </div>
    
    <script>
        let selectedText = '';
        let selectionStart = null;
        let selectionEnd = null;
        
        // Obsługa zaznaczania tekstu
        document.addEventListener('mouseup', function() {
            const selection = window.getSelection();
            if (selection.toString().length > 0) {
                selectedText = selection.toString();
                
                // Znajdź pozycję w dokumencie
                const documentBody = document.getElementById('documentBody');
                const range = selection.getRangeAt(0);
                
                // Oblicz pozycję względem całego dokumentu
                const preCaretRange = range.cloneRange();
                preCaretRange.selectNodeContents(documentBody);
                preCaretRange.setEnd(range.startContainer, range.startOffset);
                selectionStart = preCaretRange.toString().length;
                
                preCaretRange.setEnd(range.endContainer, range.endOffset);
                selectionEnd = preCaretRange.toString().length;
                
                // Pokaż info o zaznaczeniu
                document.getElementById('selectedText').textContent = selectedText;
                document.getElementById('selectionInfo').style.display = 'block';
            } else {
                selectedText = '';
                selectionStart = null;
                selectionEnd = null;
                document.getElementById('selectionInfo').style.display = 'none';
            }
        });
        
        // Dodawanie komentarza
        async function addComment() {
            const content = document.getElementById('commentText').value.trim();
            if (!content) {
                alert('Wpisz treść komentarza');
                return;
            }
            
            const data = {
                document_id: {{ document.id }},
                content: content,
                comment_type: selectedText ? 'selection' : 'general'
            };
            
            if (selectedText) {
                data.selection_start = selectionStart;
                data.selection_end = selectionEnd;
                data.selection_text = selectedText;
            }
            
            try {
                const response = await fetch('/api/comments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    location.reload(); // Odśwież stronę aby pokazać nowy komentarz
                } else {
                    alert('Błąd: ' + result.error);
                }
            } catch (error) {
                alert('Błąd połączenia: ' + error.message);
            }
        }
        
        // Reakcja na komentarz
        async function reactToComment(commentId, reactionType) {
            try {
                const response = await fetch(`/api/comments/${commentId}/react`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ reaction_type: reactionType })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    location.reload();
                } else {
                    alert('Błąd: ' + result.error);
                }
            } catch (error) {
                alert('Błąd połączenia: ' + error.message);
            }
        }
        
        // Odpowiadanie na komentarz (placeholder)
        function replyToComment(commentId) {
            alert('Funkcja odpowiadania zostanie wkrótce dodana!');
        }
    </script>
</body>
</html>
'''

# =====================================================
# SERVER START
# =====================================================

if __name__ == '__main__':
    print("🚀 SSPO Document Management Platform v3.0")
    print("=" * 50)
    print("✅ Baza danych SQLite3")
    print("✅ System użytkowników z autoryzacją")
    print("✅ Przeglądanie dokumentów bez logowania")
    print("✅ Komentarze z zaznaczaniem fragmentów tekstu")
    print("✅ Reakcje na komentarze")
    print("✅ Responsywny interfejs")
    print("=" * 50)
    print("🌐 Uruchomiono na: http://localhost:5000")
    print("📊 Panel administracyjny: /admin (wkrótce)")
    print("🔐 API endpoints: /api/*")
    
    app.run(host='0.0.0.0', port=5000, debug=True)