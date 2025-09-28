#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🏛️ Legal System Collaborative Platform
Kompleksowy system współpracy nad dokumentami prawnymi
z analizą spójności i profesjonalnymi narzędziami prawnymi
"""

from flask import Flask, render_template, request, jsonify, session, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
import json
import re
import os
import uuid
import nltk
from collections import defaultdict
import difflib
import markdown
from markupsafe import Markup
import sqlite3

# Initialize Flask app with advanced configuration
app = Flask(__name__)
app.config['SECRET_KEY'] = 'legal-system-secret-key-2025'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///legal_system.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file upload

# Initialize extensions
db = SQLAlchemy(app)
migrate = Migrate(app, db)
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
    role = db.Column(db.String(50), default='contributor')  # admin, editor, contributor, viewer
    institution = db.Column(db.String(200))
    expertise_areas = db.Column(db.Text)  # JSON string of legal expertise areas
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_active = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    documents = db.relationship('Document', backref='author', lazy=True)
    comments = db.relationship('Comment', backref='author', lazy=True)
    revisions = db.relationship('DocumentRevision', backref='author', lazy=True)

class LegalSystem(db.Model):
    """Represents a complete legal system (e.g., SSPO, University, Company)"""
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    type = db.Column(db.String(50))  # university, company, organization, government
    jurisdiction = db.Column(db.String(100))  # Poland, EU, etc.
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='draft')  # draft, review, active, archived
    
    # Legal system metadata
    legal_framework = db.Column(db.Text)  # JSON with legal framework info
    compliance_requirements = db.Column(db.Text)  # JSON with compliance needs
    
    # Relationships
    documents = db.relationship('Document', backref='legal_system', lazy=True)
    consistency_checks = db.relationship('ConsistencyCheck', backref='legal_system', lazy=True)

class Document(db.Model):
    """Individual legal document within a system"""
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(300), nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False)
    content = db.Column(db.Text)
    content_markdown = db.Column(db.Text)
    
    # Document metadata
    document_type = db.Column(db.String(50))  # constitution, statute, regulation, policy, etc.
    legal_weight = db.Column(db.Integer, default=5)  # 1-10, higher = more authority
    hierarchy_level = db.Column(db.Integer, default=5)  # 1-10, 1 = highest authority
    
    # Status and workflow
    status = db.Column(db.String(20), default='draft')  # draft, review, approved, published, archived
    version = db.Column(db.String(20), default='1.0')
    
    # Relationships
    legal_system_id = db.Column(db.Integer, db.ForeignKey('legal_system.id'), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    published_at = db.Column(db.DateTime)
    
    # Legal analysis fields
    legal_concepts = db.Column(db.Text)  # JSON array of identified legal concepts
    cross_references = db.Column(db.Text)  # JSON array of references to other documents
    compliance_notes = db.Column(db.Text)
    
    # Relationships
    comments = db.relationship('Comment', backref='document', lazy=True, cascade='all, delete-orphan')
    revisions = db.relationship('DocumentRevision', backref='document', lazy=True, cascade='all, delete-orphan')
    references_from = db.relationship('DocumentReference', 
                                    foreign_keys='DocumentReference.source_document_id',
                                    backref='source_document', lazy=True)
    references_to = db.relationship('DocumentReference',
                                   foreign_keys='DocumentReference.target_document_id', 
                                   backref='target_document', lazy=True)

class DocumentRevision(db.Model):
    """Document revision history"""
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Revision content
    content = db.Column(db.Text)
    content_markdown = db.Column(db.Text)
    version = db.Column(db.String(20))
    change_summary = db.Column(db.Text)
    change_type = db.Column(db.String(50))  # minor_edit, major_revision, restructure, etc.
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    approved_by = db.Column(db.Integer, db.ForeignKey('user.id'))
    approved_at = db.Column(db.DateTime)

class Comment(db.Model):
    """Comments and suggestions on documents"""
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Comment content
    content = db.Column(db.Text, nullable=False)
    comment_type = db.Column(db.String(50), default='general')  # general, suggestion, legal_concern, typo
    
    # Position in document (for inline comments)
    paragraph_id = db.Column(db.String(100))
    selection_start = db.Column(db.Integer)
    selection_end = db.Column(db.Integer)
    selected_text = db.Column(db.Text)
    
    # Status and workflow
    status = db.Column(db.String(20), default='open')  # open, resolved, accepted, rejected
    priority = db.Column(db.String(20), default='medium')  # low, medium, high, critical
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    resolved_at = db.Column(db.DateTime)
    resolved_by = db.Column(db.Integer, db.ForeignKey('user.id'))
    
    # Legal analysis
    legal_impact = db.Column(db.String(20))  # none, low, medium, high, critical
    affects_compliance = db.Column(db.Boolean, default=False)

class DocumentReference(db.Model):
    """Cross-references between documents"""
    id = db.Column(db.Integer, primary_key=True)
    source_document_id = db.Column(db.Integer, db.ForeignKey('document.id'), nullable=False)
    target_document_id = db.Column(db.Integer, db.ForeignKey('document.id'), nullable=False)
    
    reference_type = db.Column(db.String(50))  # supersedes, amends, references, conflicts_with
    section_reference = db.Column(db.String(200))  # specific section referenced
    description = db.Column(db.Text)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    verified = db.Column(db.Boolean, default=False)

class ConsistencyCheck(db.Model):
    """Automated consistency checks between documents"""
    id = db.Column(db.Integer, primary_key=True)
    legal_system_id = db.Column(db.Integer, db.ForeignKey('legal_system.id'), nullable=False)
    
    check_type = db.Column(db.String(50))  # terminology, hierarchy, conflicts, gaps
    status = db.Column(db.String(20))  # passed, failed, warning, pending
    severity = db.Column(db.String(20))  # info, warning, error, critical
    
    # Check details
    description = db.Column(db.Text)
    affected_documents = db.Column(db.Text)  # JSON array of document IDs
    recommendations = db.Column(db.Text)
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_run = db.Column(db.DateTime)
    auto_check = db.Column(db.Boolean, default=True)

# =====================================
# USER MANAGEMENT
# =====================================

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# =====================================
# LEGAL ANALYSIS ENGINE
# =====================================

class LegalAnalysisEngine:
    """Advanced legal analysis and consistency checking"""
    
    LEGAL_TERMS = {
        'obligations': ['musi', 'zobowiązuje', 'powinien', 'ma obowiązek', 'jest zobowiązany', 'wymaga się'],
        'rights': ['ma prawo', 'może', 'jest uprawniony', 'przysługuje prawo', 'wolno'],
        'prohibitions': ['zabrania się', 'nie może', 'nie wolno', 'jest zabronione', 'niedozwolone'],
        'procedures': ['procedura', 'tryb', 'sposób', 'metodyka', 'proces', 'postępowanie'],
        'penalties': ['kara', 'sankcja', 'odpowiedzialność', 'konsekwencja', 'grzywna'],
        'timeframes': ['termin', 'okres', 'czas', 'deadline', 'do dnia', 'w ciągu', 'najpóźniej'],
        'definitions': ['oznacza', 'definiuje się', 'rozumie się przez', 'definicja', 'pojęcie'],
        'authorities': ['organ', 'instytucja', 'władza', 'uprawniony do', 'kompetencja']
    }
    
    HIERARCHY_KEYWORDS = {
        'konstytucja': 1,
        'ustawa': 2,
        'rozporządzenie': 3,
        'regulamin': 4,
        'zarządzenie': 5,
        'instrukcja': 6,
        'procedura': 7,
        'wytyczne': 8
    }
    
    @staticmethod
    def analyze_document(content):
        """Comprehensive legal analysis of document content"""
        analysis = {
            'legal_concepts': [],
            'terminology': [],
            'structure_issues': [],
            'consistency_warnings': [],
            'compliance_notes': [],
            'cross_references': [],
            'definitions': []
        }
        
        # Tokenize content
        words = content.lower().split()
        sentences = content.split('.')
        
        # Identify legal concepts
        for concept_type, keywords in LegalAnalysisEngine.LEGAL_TERMS.items():
            found_terms = []
            for keyword in keywords:
                if keyword in content.lower():
                    found_terms.append(keyword)
            
            if found_terms:
                analysis['legal_concepts'].append({
                    'type': concept_type,
                    'terms': found_terms,
                    'count': len(found_terms)
                })
        
        # Extract definitions
        definition_patterns = [
            r'(.+?)\s+oznacza\s+(.+?)(?:\.|$)',
            r'przez\s+(.+?)\s+rozumie się\s+(.+?)(?:\.|$)',
            r'definicja\s+(.+?):\s+(.+?)(?:\.|$)'
        ]
        
        for pattern in definition_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            for match in matches:
                analysis['definitions'].append({
                    'term': match[0].strip(),
                    'definition': match[1].strip()
                })
        
        # Find cross-references
        reference_patterns = [
            r'zgodnie z\s+(.+?)(?:\s|$)',
            r'w myśl\s+(.+?)(?:\s|$)',
            r'na podstawie\s+(.+?)(?:\s|$)',
            r'jak określono w\s+(.+?)(?:\s|$)'
        ]
        
        for pattern in reference_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            analysis['cross_references'].extend(matches)
        
        # Structure analysis
        sections = content.count('§')
        paragraphs = content.count('\n\n')
        
        analysis['structure'] = {
            'sections': sections,
            'paragraphs': paragraphs,
            'words': len(words),
            'sentences': len(sentences)
        }
        
        return analysis
    
    @staticmethod
    def check_consistency(legal_system_id):
        """Check consistency across all documents in a legal system"""
        documents = Document.query.filter_by(legal_system_id=legal_system_id).all()
        
        if len(documents) < 2:
            return []
        
        issues = []
        
        # Check for terminology inconsistencies
        all_definitions = {}
        for doc in documents:
            if doc.legal_concepts:
                concepts = json.loads(doc.legal_concepts)
                for definition in concepts.get('definitions', []):
                    term = definition['term'].lower()
                    if term in all_definitions and all_definitions[term] != definition['definition']:
                        issues.append({
                            'type': 'terminology_conflict',
                            'severity': 'warning',
                            'description': f'Niespójne definicje terminu "{term}"',
                            'documents': [doc.id for doc in documents if term in (doc.content or '').lower()],
                            'recommendation': f'Ujednolicić definicję terminu "{term}" we wszystkich dokumentach'
                        })
                    all_definitions[term] = definition['definition']
        
        # Check hierarchy conflicts
        hierarchy_docs = [(doc, LegalAnalysisEngine._get_document_hierarchy_level(doc)) 
                         for doc in documents]
        hierarchy_docs.sort(key=lambda x: x[1])
        
        for i, (doc, level) in enumerate(hierarchy_docs):
            for j, (other_doc, other_level) in enumerate(hierarchy_docs[i+1:], i+1):
                if doc.content and other_doc.content:
                    if 'uchyla' in doc.content.lower() and other_doc.title.lower() in doc.content.lower():
                        if level > other_level:
                            issues.append({
                                'type': 'hierarchy_violation',
                                'severity': 'error',
                                'description': f'Dokument niższego rzędu ({doc.title}) próbuje uchylić dokument wyższego rzędu ({other_doc.title})',
                                'documents': [doc.id, other_doc.id],
                                'recommendation': 'Sprawdzić hierarchię prawną dokumentów'
                            })
        
        return issues
    
    @staticmethod
    def _get_document_hierarchy_level(document):
        """Determine hierarchy level of document"""
        title_lower = document.title.lower()
        for keyword, level in LegalAnalysisEngine.HIERARCHY_KEYWORDS.items():
            if keyword in title_lower:
                return level
        return document.hierarchy_level or 5

# =====================================
# ROUTES - MAIN APPLICATION
# =====================================

@app.route('/')
def index():
    """Main dashboard showing all legal systems"""
    legal_systems = LegalSystem.query.filter_by(status='active').all()
    recent_documents = Document.query.order_by(Document.updated_at.desc()).limit(10).all()
    
    return render_template('index.html', 
                         legal_systems=legal_systems,
                         recent_documents=recent_documents)

@app.route('/system/<int:system_id>')
def legal_system_view(system_id):
    """View a complete legal system"""
    legal_system = LegalSystem.query.get_or_404(system_id)
    documents = Document.query.filter_by(legal_system_id=system_id).order_by(Document.hierarchy_level).all()
    
    # Run consistency check
    consistency_issues = LegalAnalysisEngine.check_consistency(system_id)
    
    return render_template('legal_system.html', 
                         legal_system=legal_system,
                         documents=documents,
                         consistency_issues=consistency_issues)

@app.route('/document/<slug>')
def document_view(slug):
    """Public document view (no login required)"""
    document = Document.query.filter_by(slug=slug).first_or_404()
    comments = Comment.query.filter_by(document_id=document.id, status='open').order_by(Comment.created_at.desc()).all()
    
    # Convert markdown to HTML
    if document.content_markdown:
        html_content = Markup(markdown.markdown(document.content_markdown, extensions=['toc', 'tables', 'codehilite']))
    else:
        html_content = Markup(document.content or '')
    
    # Legal analysis
    if document.legal_concepts:
        legal_analysis = json.loads(document.legal_concepts)
    else:
        legal_analysis = LegalAnalysisEngine.analyze_document(document.content or '')
        document.legal_concepts = json.dumps(legal_analysis)
        db.session.commit()
    
    return render_template('document_view.html', 
                         document=document,
                         html_content=html_content,
                         comments=comments,
                         legal_analysis=legal_analysis)

@app.route('/document/<slug>/edit')
@login_required
def document_edit(slug):
    """Collaborative document editor"""
    document = Document.query.filter_by(slug=slug).first_or_404()
    
    # Check permissions
    if not current_user.role in ['admin', 'editor'] and current_user.id != document.author_id:
        flash('Nie masz uprawnień do edycji tego dokumentu', 'error')
        return redirect(url_for('document_view', slug=slug))
    
    # Get document history
    revisions = DocumentRevision.query.filter_by(document_id=document.id).order_by(DocumentRevision.created_at.desc()).limit(10).all()
    
    # Get inline comments
    inline_comments = Comment.query.filter_by(document_id=document.id).filter(Comment.paragraph_id.isnot(None)).all()
    
    return render_template('document_editor.html', 
                         document=document,
                         revisions=revisions,
                         inline_comments=inline_comments)

@app.route('/api/document/<slug>/save', methods=['POST'])
@login_required  
def save_document(slug):
    """Save document changes"""
    document = Document.query.filter_by(slug=slug).first_or_404()
    
    # Check permissions
    if not current_user.role in ['admin', 'editor'] and current_user.id != document.author_id:
        return jsonify({'success': False, 'error': 'Brak uprawnień'}), 403
    
    data = request.get_json()
    
    # Create revision
    revision = DocumentRevision(
        document_id=document.id,
        author_id=current_user.id,
        content=document.content,
        content_markdown=document.content_markdown,
        version=document.version,
        change_summary=data.get('change_summary', 'Automatyczne zapisanie'),
        change_type=data.get('change_type', 'minor_edit')
    )
    
    # Update document
    document.content = data.get('content', '')
    document.content_markdown = data.get('content_markdown', '')
    document.updated_at = datetime.utcnow()
    
    # Re-analyze document
    legal_analysis = LegalAnalysisEngine.analyze_document(document.content)
    document.legal_concepts = json.dumps(legal_analysis)
    
    db.session.add(revision)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Dokument zapisany',
        'version': document.version,
        'analysis': legal_analysis
    })

@app.route('/api/document/<slug>/comment', methods=['POST'])
def add_comment(slug):
    """Add comment to document (public, no login required for viewing)"""
    document = Document.query.filter_by(slug=slug).first_or_404()
    data = request.get_json()
    
    # For public comments, create anonymous user or require basic info
    if current_user.is_authenticated:
        author_id = current_user.id
    else:
        # Create anonymous comment (you might want to require email)
        return jsonify({'success': False, 'error': 'Zaloguj się aby komentować'}), 401
    
    comment = Comment(
        document_id=document.id,
        author_id=author_id,
        content=data.get('content', ''),
        comment_type=data.get('type', 'general'),
        paragraph_id=data.get('paragraph_id'),
        selection_start=data.get('selection_start'),
        selection_end=data.get('selection_end'),
        selected_text=data.get('selected_text'),
        priority=data.get('priority', 'medium'),
        legal_impact=data.get('legal_impact', 'none')
    )
    
    db.session.add(comment)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Komentarz dodany',
        'comment_id': comment.id
    })

# =====================================
# USER AUTHENTICATION ROUTES
# =====================================

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        data = request.get_json() if request.is_json else request.form
        
        # Validation
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'success': False, 'error': 'Użytkownik już istnieje'})
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'success': False, 'error': 'Email już używany'})
        
        # Create user
        user = User(
            username=data['username'],
            email=data['email'],
            password_hash=generate_password_hash(data['password']),
            full_name=data.get('full_name', ''),
            institution=data.get('institution', ''),
            expertise_areas=json.dumps(data.get('expertise_areas', []))
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
            user.last_active = datetime.utcnow()
            db.session.commit()
            
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

# =====================================
# API ENDPOINTS
# =====================================

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
    
    # GET - list systems
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

@app.route('/api/consistency-check/<int:system_id>')
def api_consistency_check(system_id):
    """Run consistency check on legal system"""
    issues = LegalAnalysisEngine.check_consistency(system_id)
    
    # Save results to database
    for issue in issues:
        check = ConsistencyCheck(
            legal_system_id=system_id,
            check_type=issue['type'],
            status='failed' if issue['severity'] in ['error', 'critical'] else 'warning',
            severity=issue['severity'],
            description=issue['description'],
            affected_documents=json.dumps(issue['documents']),
            recommendations=issue['recommendation'],
            last_run=datetime.utcnow()
        )
        db.session.add(check)
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'issues_found': len(issues),
        'issues': issues
    })

# =====================================
# ADMIN ROUTES
# =====================================

@app.route('/admin')
@login_required
def admin_dashboard():
    if current_user.role != 'admin':
        flash('Brak uprawnień administratora', 'error')
        return redirect(url_for('index'))
    
    stats = {
        'users': User.query.count(),
        'systems': LegalSystem.query.count(),
        'documents': Document.query.count(),
        'comments': Comment.query.count(),
        'recent_activity': Comment.query.order_by(Comment.created_at.desc()).limit(10).all()
    }
    
    return render_template('admin/dashboard.html', stats=stats)

# =====================================
# INITIALIZE DATABASE
# =====================================

def create_sample_data():
    """Create sample legal system and documents"""
    
    # Create sample legal system
    sspo_system = LegalSystem(
        name='SSPO - Samorząd Studentów Politechniki Opolskiej',
        description='Kompletny system prawny Samorządu Studentów Politechniki Opolskiej',
        type='university',
        jurisdiction='Poland',
        status='active'
    )
    db.session.add(sspo_system)
    db.session.flush()  # Get ID
    
    # Create sample user
    admin_user = User(
        username='admin',
        email='admin@sspo.pl',
        password_hash=generate_password_hash('admin123'),
        full_name='Administrator SSPO',
        role='admin',
        institution='Politechnika Opolska',
        expertise_areas=json.dumps(['prawo administracyjne', 'prawo studenckie'])
    )
    db.session.add(admin_user)
    db.session.flush()
    
    # Sample documents
    documents_data = [
        {
            'title': 'Regulamin SSPO - Dokument Główny',
            'slug': 'regulamin-sspo-glowny',
            'document_type': 'constitution',
            'hierarchy_level': 1,
            'legal_weight': 10,
            'content': """# REGULAMIN SAMORZĄDU STUDENTÓW POLITECHNIKI OPOLSKIEJ

## Rozdział I - Postanowienia ogólne

§ 1. Samorząd Studentów Politechniki Opolskiej, zwany dalej Samorządem, jest reprezentantem ogółu studentów uczelni.

§ 2. Samorząd działa na podstawie:
1) ustawy z dnia 20 lipca 2018 r. Prawo o szkolnictwie wyższym i nauce
2) Statutu Politechniki Opolskiej
3) niniejszego Regulaminu

## Rozdział II - Organy Samorządu

§ 3. Organami Samorządu są:
1) Parlament Studentów - organ uchwałodawczy
2) Zarząd Samorządu - organ wykonawczy
3) Komisja Rewizyjna - organ kontrolny

§ 4. Parlament Studentów składa się z przedstawicieli wydziałów, wybieranych w wyborach bezpośrednich.

## Rozdział III - Kompetencje

§ 5. Do kompetencji Samorządu należy:
1) reprezentowanie studentów wobec władz uczelni
2) opiniowanie spraw dotyczących studentów
3) zarządzanie funduszami Samorządu
4) prowadzenie działalności kulturalnej, sportowej i naukowej"""
        },
        {
            'title': 'Ordynacja Wyborcza SSPO',
            'slug': 'ordynacja-wyborcza-sspo',
            'document_type': 'statute',
            'hierarchy_level': 2,
            'legal_weight': 8,
            'content': """# ORDYNACJA WYBORCZA SAMORZĄDU STUDENTÓW

## Rozdział I - Zasady ogólne

§ 1. Wybory do organów Samorządu odbywają się zgodnie z zasadami:
1) powszechności - prawo wybierania przysługuje wszystkim studentom
2) równości - każdy student ma jeden głos
3) bezpośredniości - studenci głosują bezpośrednio na kandydatów
4) tajności - głosowanie jest tajne

## Rozdział II - Organy wyborcze

§ 2. Wyborami kieruje Uczelniana Komisja Wyborcza.

§ 3. Uczelniana Komisja Wyborcza składa się z 5 członków powoływanych przez Parlament Studentów.

## Rozdział III - Procedura wyborcza

§ 4. Wybory zarządza Parlament Studentów nie później niż 60 dni przed zakończeniem kadencji."""
        },
        {
            'title': 'Regulamin Finansowy SSPO',
            'slug': 'regulamin-finansowy-sspo',
            'document_type': 'regulation',
            'hierarchy_level': 3,
            'legal_weight': 7,
            'content': """# REGULAMIN FINANSOWY SAMORZĄDU STUDENTÓW

## Rozdział I - Źródła finansowania

§ 1. Źródłami finansowania działalności Samorządu są:
1) środki przyznane przez uczelnię
2) dotacje i granty
3) wpłaty od studentów
4) przychody z działalności gospodarczej

## Rozdział II - Zarządzanie finansami

§ 2. Za gospodarkę finansową Samorządu odpowiada Zarząd.

§ 3. Skarbnik Samorządu prowadzi ewidencję finansową zgodnie z obowiązującymi przepisami.

§ 4. Wydatki powyżej 1000 zł wymagają uchwały Zarządu."""
        }
    ]
    
    for doc_data in documents_data:
        document = Document(
            legal_system_id=sspo_system.id,
            author_id=admin_user.id,
            **doc_data,
            status='published',
            version='1.0',
            published_at=datetime.utcnow()
        )
        db.session.add(document)
    
    db.session.commit()
    print("✅ Sample data created successfully!")

if __name__ == '__main__':
    # Create tables
    with app.app_context():
        db.create_all()
        
        # Create sample data if no users exist
        if User.query.count() == 0:
            create_sample_data()
    
    print("""
🏛️ Legal System Collaborative Platform
==========================================
✅ Server starting on: http://localhost:5000
🔧 Features:
   • Document collaboration (like Google Docs)
   • Legal consistency checking
   • User management & authentication
   • Cross-document references
   • Comment system
   • Version control
   • Public document viewing (no login required)
   • Admin dashboard

🚀 Demo Login: admin / admin123

Press Ctrl+C to stop
""")
    
    app.run(debug=True, host='0.0.0.0', port=5000)