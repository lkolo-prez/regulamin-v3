#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🏛️ Legal System Collaborative Platform - SIMPLIFIED VERSION
Kompleksowy system współpracy nad dokumentami prawnymi
"""

from flask import Flask, render_template, request, jsonify, session, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import json
import re
import os

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'legal-system-secret-key-2025'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///legal_system.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# =====================================
# DATABASE MODELS
# =====================================

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    full_name = db.Column(db.String(200))
    role = db.Column(db.String(50), default='contributor')
    institution = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)

class LegalSystem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    type = db.Column(db.String(50))
    jurisdiction = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='active')
    
    documents = db.relationship('Document', backref='legal_system', lazy=True)

class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(300), nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False)
    content = db.Column(db.Text)
    content_markdown = db.Column(db.Text)
    
    document_type = db.Column(db.String(50))
    hierarchy_level = db.Column(db.Integer, default=5)
    legal_weight = db.Column(db.Integer, default=5)
    status = db.Column(db.String(20), default='draft')
    version = db.Column(db.String(20), default='1.0')
    
    legal_system_id = db.Column(db.Integer, db.ForeignKey('legal_system.id'), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    published_at = db.Column(db.DateTime)
    
    legal_concepts = db.Column(db.Text)
    
    comments = db.relationship('Comment', backref='document', lazy=True)
    author = db.relationship('User', backref='documents')

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    content = db.Column(db.Text, nullable=False)
    comment_type = db.Column(db.String(50), default='general')
    status = db.Column(db.String(20), default='open')
    priority = db.Column(db.String(20), default='medium')
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    legal_impact = db.Column(db.String(20), default='none')
    selected_text = db.Column(db.Text)
    
    author = db.relationship('User', backref='comments')

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# =====================================
# LEGAL ANALYSIS ENGINE (Simplified)
# =====================================

class LegalAnalysisEngine:
    LEGAL_TERMS = {
        'obligations': ['musi', 'zobowiązuje', 'powinien', 'ma obowiązek'],
        'rights': ['ma prawo', 'może', 'jest uprawniony'],
        'prohibitions': ['zabrania się', 'nie może', 'nie wolno'],
        'procedures': ['procedura', 'tryb', 'sposób', 'proces'],
        'penalties': ['kara', 'sankcja', 'odpowiedzialność'],
        'timeframes': ['termin', 'okres', 'czas', 'deadline']
    }
    
    @staticmethod
    def analyze_document(content):
        if not content:
            return {'legal_concepts': [], 'structure': {'sections': 0, 'words': 0}}
            
        analysis = {
            'legal_concepts': [],
            'structure': {
                'sections': content.count('§'),
                'words': len(content.split()),
                'paragraphs': content.count('\n\n'),
                'sentences': content.count('.')
            }
        }
        
        # Find legal concepts
        for concept_type, keywords in LegalAnalysisEngine.LEGAL_TERMS.items():
            found_terms = [kw for kw in keywords if kw in content.lower()]
            if found_terms:
                analysis['legal_concepts'].append({
                    'type': concept_type,
                    'terms': found_terms,
                    'count': len(found_terms)
                })
        
        return analysis
    
    @staticmethod
    def check_consistency(legal_system_id):
        documents = Document.query.filter_by(legal_system_id=legal_system_id).all()
        issues = []
        
        if len(documents) > 1:
            # Simple consistency check - look for hierarchy conflicts
            for doc in documents:
                if doc.hierarchy_level == 1 and 'regulamin' in doc.title.lower():
                    issues.append({
                        'type': 'hierarchy_warning',
                        'severity': 'warning',
                        'description': f'Dokument "{doc.title}" ma najwyższy poziom hierarchii ale może nie być konstytucją',
                        'documents': [doc.id],
                        'recommendation': 'Sprawdź czy poziom hierarchii jest odpowiedni'
                    })
        
        return issues

# =====================================
# ROUTES
# =====================================

@app.route('/')
def index():
    legal_systems = LegalSystem.query.filter_by(status='active').all()
    recent_documents = Document.query.order_by(Document.updated_at.desc()).limit(10).all()
    
    return render_template('index.html', 
                         legal_systems=legal_systems,
                         recent_documents=recent_documents)

@app.route('/system/<int:system_id>')
def legal_system_view(system_id):
    legal_system = LegalSystem.query.get_or_404(system_id)
    documents = Document.query.filter_by(legal_system_id=system_id).order_by(Document.hierarchy_level).all()
    consistency_issues = LegalAnalysisEngine.check_consistency(system_id)
    
    return render_template('legal_system.html', 
                         legal_system=legal_system,
                         documents=documents,
                         consistency_issues=consistency_issues)

@app.route('/document/<slug>')
def document_view(slug):
    document = Document.query.filter_by(slug=slug).first_or_404()
    comments = Comment.query.filter_by(document_id=document.id).order_by(Comment.created_at.desc()).all()
    
    # Legal analysis
    if document.legal_concepts:
        legal_analysis = json.loads(document.legal_concepts)
    else:
        legal_analysis = LegalAnalysisEngine.analyze_document(document.content or document.content_markdown)
        document.legal_concepts = json.dumps(legal_analysis)
        db.session.commit()
    
    return render_template('document_view.html', 
                         document=document,
                         html_content=document.content_markdown or document.content,
                         comments=comments,
                         legal_analysis=legal_analysis)

@app.route('/document/<slug>/edit')
@login_required
def document_edit(slug):
    document = Document.query.filter_by(slug=slug).first_or_404()
    
    if not current_user.role in ['admin', 'editor'] and current_user.id != document.author_id:
        flash('Nie masz uprawnień do edycji tego dokumentu', 'error')
        return redirect(url_for('document_view', slug=slug))
    
    return render_template('document_editor.html', document=document)

@app.route('/api/document/<slug>/save', methods=['POST'])
@login_required  
def save_document(slug):
    document = Document.query.filter_by(slug=slug).first_or_404()
    
    if not current_user.role in ['admin', 'editor'] and current_user.id != document.author_id:
        return jsonify({'success': False, 'error': 'Brak uprawnień'}), 403
    
    data = request.get_json()
    
    document.content = data.get('content', '')
    document.content_markdown = data.get('content_markdown', '')
    document.updated_at = datetime.utcnow()
    
    legal_analysis = LegalAnalysisEngine.analyze_document(document.content or document.content_markdown)
    document.legal_concepts = json.dumps(legal_analysis)
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Dokument zapisany',
        'version': document.version,
        'analysis': legal_analysis
    })

@app.route('/api/document/<slug>/comment', methods=['POST'])
def add_comment(slug):
    document = Document.query.filter_by(slug=slug).first_or_404()
    data = request.get_json()
    
    if not current_user.is_authenticated:
        return jsonify({'success': False, 'error': 'Zaloguj się aby komentować'}), 401
    
    comment = Comment(
        document_id=document.id,
        author_id=current_user.id,
        content=data.get('content', ''),
        comment_type=data.get('type', 'general'),
        priority=data.get('priority', 'medium'),
        legal_impact=data.get('legal_impact', 'none'),
        selected_text=data.get('selected_text')
    )
    
    db.session.add(comment)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Komentarz dodany',
        'comment_id': comment.id
    })

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        data = request.get_json() if request.is_json else request.form
        
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'success': False, 'error': 'Użytkownik już istnieje'})
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'success': False, 'error': 'Email już używany'})
        
        user = User(
            username=data['username'],
            email=data['email'],
            password_hash=generate_password_hash(data['password']),
            full_name=data.get('full_name', ''),
            institution=data.get('institution', '')
        )
        
        db.session.add(user)
        db.session.commit()
        
        login_user(user)
        
        if request.is_json:
            return jsonify({'success': True, 'redirect': url_for('index')})
        else:
            flash('Rejestracja zakończona sukcesem!', 'success')
            return redirect(url_for('index'))
    
    return render_template('auth/register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json() if request.is_json else request.form
        
        user = User.query.filter_by(username=data['username']).first()
        
        if user and check_password_hash(user.password_hash, data['password']):
            login_user(user, remember=data.get('remember', False))
            
            if request.is_json:
                return jsonify({'success': True, 'redirect': url_for('index')})
            else:
                flash('Zalogowano pomyślnie!', 'success')
                return redirect(url_for('index'))
        else:
            error = 'Nieprawidłowy login lub hasło'
            if request.is_json:
                return jsonify({'success': False, 'error': error})
            else:
                flash(error, 'error')
    
    return render_template('auth/login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Wylogowano pomyślnie', 'info')
    return redirect(url_for('index'))

@app.route('/api/systems', methods=['GET', 'POST'])
def api_legal_systems():
    if request.method == 'POST':
        if not current_user.is_authenticated or current_user.role not in ['admin', 'editor']:
            return jsonify({'error': 'Unauthorized'}), 401
        
        data = request.get_json()
        system = LegalSystem(
            name=data['name'],
            description=data.get('description', ''),
            type=data.get('type', 'organization'),
            jurisdiction=data.get('jurisdiction', 'Poland')
        )
        
        db.session.add(system)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'system_id': system.id,
            'message': 'System prawny utworzony'
        })
    
    systems = LegalSystem.query.filter_by(status='active').all()
    return jsonify({
        'systems': [{
            'id': s.id,
            'name': s.name,
            'description': s.description,
            'type': s.type,
            'document_count': len(s.documents),
            'created_at': s.created_at.isoformat()
        } for s in systems]
    })

@app.route('/api/documents', methods=['POST'])
@login_required
def create_document():
    if current_user.role not in ['admin', 'editor']:
        return jsonify({'success': False, 'error': 'Brak uprawnień'}), 403
    
    data = request.get_json()
    
    # Generate unique slug
    base_slug = data.get('slug', data['title'].lower().replace(' ', '-'))
    slug = base_slug
    counter = 1
    while Document.query.filter_by(slug=slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1
    
    document = Document(
        title=data['title'],
        slug=slug,
        content_markdown=data.get('content_markdown', ''),
        document_type=data.get('document_type', 'other'),
        hierarchy_level=int(data.get('hierarchy_level', 5)),
        legal_weight=int(data.get('legal_weight', 5)),
        legal_system_id=data['legal_system_id'],
        author_id=current_user.id,
        status='draft'
    )
    
    db.session.add(document)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'document_id': document.id,
        'slug': document.slug,
        'message': 'Dokument utworzony'
    })

@app.route('/api/consistency-check/<int:system_id>')
def api_consistency_check(system_id):
    issues = LegalAnalysisEngine.check_consistency(system_id)
    
    return jsonify({
        'success': True,
        'issues_found': len(issues),
        'issues': issues
    })

def create_sample_data():
    # Create admin user
    admin = User(
        username='admin',
        email='admin@sspo.pl',
        password_hash=generate_password_hash('admin123'),
        full_name='Administrator SSPO',
        role='admin',
        institution='Politechnika Opolska'
    )
    db.session.add(admin)
    db.session.flush()
    
    # Create SSPO system
    sspo = LegalSystem(
        name='SSPO - Samorząd Studentów Politechniki Opolskiej',
        description='Kompletny system prawny Samorządu Studentów',
        type='university',
        jurisdiction='Poland',
        status='active'
    )
    db.session.add(sspo)
    db.session.flush()
    
    # Create sample documents
    documents = [
        {
            'title': 'Regulamin SSPO - Dokument Główny',
            'slug': 'regulamin-sspo-glowny',
            'document_type': 'statute',
            'hierarchy_level': 2,
            'content_markdown': """# REGULAMIN SAMORZĄDU STUDENTÓW

## Rozdział I - Postanowienia ogólne

§ 1. Samorząd Studentów jest reprezentantem studentów uczelni.

§ 2. Samorząd działa na podstawie ustawy i niniejszego regulaminu.

## Rozdział II - Organy

§ 3. Organami Samorządu są:
1) Parlament Studentów
2) Zarząd Samorządu  
3) Komisja Rewizyjna"""
        },
        {
            'title': 'Ordynacja Wyborcza',
            'slug': 'ordynacja-wyborcza',
            'document_type': 'regulation',
            'hierarchy_level': 3,
            'content_markdown': """# ORDYNACJA WYBORCZA

## Zasady wyborów

§ 1. Wybory odbywają się zgodnie z zasadami:
- powszechności
- równości  
- tajności
- bezpośredniości"""
        }
    ]
    
    for doc_data in documents:
        doc = Document(
            legal_system_id=sspo.id,
            author_id=admin.id,
            status='published',
            **doc_data
        )
        db.session.add(doc)
    
    db.session.commit()
    print("✅ Sample data created!")

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
        if User.query.count() == 0:
            create_sample_data()
    
    print("""
🏛️ Legal System Collaborative Platform
==========================================
✅ Server starting on: http://localhost:5000
🔧 Features:
   • Document collaboration
   • Legal analysis
   • User management  
   • Comment system
   • Consistency checking

🚀 Demo: admin / admin123
""")
    
    app.run(debug=True, host='0.0.0.0', port=5000)