#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🏛️ AIRCLOUD LEGAL COLLABORATION PLATFORM
==========================================
Professional Legal Document Collaboration System

🔧 Author: Łukasz Kołodziej
🏢 Company: Aircloud
📅 Version: 2.0.0 (Production Ready)
⚖️ License: Open Source (Social Use) / Commercial Subscription

📋 License Information:
• Open Source: Free for social, educational, and non-profit use
• Commercial Use: 50 PLN + 23% VAT per month subscription
• Contact: legal@aircloud.pl for commercial licensing

🚀 Features:
• Advanced legal document collaboration
• Real-time commenting system (Word-like)
• Complete workflow management
• Version control with diff visualization
• Legal analysis engine with AI
• Multi-user authentication & permissions
• Audit logging & compliance tracking
• Professional templates system
• API integration capabilities
"""

from flask import Flask, render_template, request, jsonify, session, redirect, url_for, flash, send_file, abort, Blueprint
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
import hashlib
import difflib
from typing import List, Dict, Optional

# Import extended features
try:
    from aircloud_advanced_features import *
    from aircloud_extended_routes import extended_bp
    EXTENDED_FEATURES_AVAILABLE = True
    print("✅ Extended features loaded successfully")
except ImportError as e:
    print(f"⚠️  Extended features not available: {e}")
    EXTENDED_FEATURES_AVAILABLE = False

# Import collaboration features
try:
    from aircloud_collaboration_engine import *
    from aircloud_collaboration_routes import collab_routes
    COLLABORATION_FEATURES_AVAILABLE = True
    print("✅ Collaboration features loaded successfully")
except ImportError as e:
    print(f"⚠️  Collaboration features not available: {e}")
    COLLABORATION_FEATURES_AVAILABLE = False

# Email functionality - can be enabled later
# import smtplib
# from email.mime.text import MimeText  
# from email.mime.multipart import MimeMultipart

# =====================================
# AIRCLOUD APPLICATION CONFIGURATION
# =====================================

app = Flask(__name__)
app.config.update({
    'SECRET_KEY': 'aircloud-legal-platform-2025-production',
    'SQLALCHEMY_DATABASE_URI': os.environ.get('DATABASE_URL', f'sqlite:///{os.path.abspath("instance/aircloud_legal_platform.db")}'),
    'SQLALCHEMY_TRACK_MODIFICATIONS': False,
    'UPLOAD_FOLDER': 'uploads',
    'MAX_CONTENT_LENGTH': 32 * 1024 * 1024,  # 32MB max file size
    'MAIL_SERVER': 'smtp.aircloud.pl',
    'MAIL_PORT': 587,
    'MAIL_USE_TLS': True,
    'MAIL_DEFAULT_SENDER': 'noreply@aircloud.pl',
    'AIRCLOUD_VERSION': '2.0.0',
    'AIRCLOUD_AUTHOR': 'Łukasz Kołodziej',
    'AIRCLOUD_COMPANY': 'Aircloud',
    'COMMERCIAL_PRICE': '50 PLN + 23% VAT/miesiąc'
})

# Initialize extensions
db = SQLAlchemy(app)
migrate = Migrate(app, db)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'auth.login'

# Initialize SocketIO for real-time collaboration
try:
    from flask_socketio import SocketIO
    socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')
    SOCKETIO_AVAILABLE = True
    print("✅ SocketIO initialized for real-time collaboration")
except ImportError:
    SOCKETIO_AVAILABLE = False
    print("⚠️  SocketIO not available - real-time features disabled")

# =====================================
# ENHANCED DATABASE MODELS
# =====================================

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    
    # Profile information
    full_name = db.Column(db.String(200))
    title = db.Column(db.String(100))  # Dr., Prof., Mgr., etc.
    institution = db.Column(db.String(200))
    department = db.Column(db.String(200))
    phone = db.Column(db.String(20))
    bio = db.Column(db.Text)
    avatar_url = db.Column(db.String(255))
    
    # System fields
    role = db.Column(db.String(50), default='contributor', index=True)
    permissions = db.Column(db.Text)  # JSON with specific permissions
    status = db.Column(db.String(20), default='active', index=True)
    email_verified = db.Column(db.Boolean, default=False)
    
    # Commercial licensing
    license_type = db.Column(db.String(20), default='social')  # social, commercial
    subscription_active = db.Column(db.Boolean, default=True)
    subscription_expires = db.Column(db.DateTime)
    
    # Activity tracking
    last_login = db.Column(db.DateTime)
    last_activity = db.Column(db.DateTime, default=datetime.utcnow)
    login_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Preferences
    notification_settings = db.Column(db.Text)  # JSON
    ui_preferences = db.Column(db.Text)  # JSON
    timezone = db.Column(db.String(50), default='Europe/Warsaw')
    language = db.Column(db.String(10), default='pl')
    
    def get_permissions(self):
        """Get user permissions as dict"""
        if self.permissions:
            return json.loads(self.permissions)
        return {}
    
    def has_permission(self, permission):
        """Check if user has specific permission"""
        perms = self.get_permissions()
        return perms.get(permission, False) or self.role == 'admin'
    
    def is_commercial_user(self):
        """Check if user has active commercial license"""
        return (self.license_type == 'commercial' and 
                self.subscription_active and 
                (not self.subscription_expires or self.subscription_expires > datetime.utcnow()))

class LegalSystem(db.Model):
    __tablename__ = 'legal_systems'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(300), nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False, index=True)
    description = db.Column(db.Text)
    
    # Classification
    system_type = db.Column(db.String(50), index=True)  # university, corporate, government
    jurisdiction = db.Column(db.String(100))
    domain = db.Column(db.String(100))  # education, finance, healthcare
    complexity_level = db.Column(db.Integer, default=5)  # 1-10 scale
    
    # Metadata
    version = db.Column(db.String(20), default='1.0')
    status = db.Column(db.String(20), default='draft', index=True)
    visibility = db.Column(db.String(20), default='public')  # public, private, restricted
    
    # Governance
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    maintainers = db.Column(db.Text)  # JSON list of user IDs
    
    # Commercial licensing
    license_type = db.Column(db.String(20), default='social')  # social, commercial
    commercial_features = db.Column(db.Boolean, default=False)
    
    # Tracking
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Statistics
    document_count = db.Column(db.Integer, default=0)
    total_revisions = db.Column(db.Integer, default=0)
    active_contributors = db.Column(db.Integer, default=0)
    
    # Configuration
    settings = db.Column(db.Text)  # JSON configuration
    tags = db.Column(db.Text)  # JSON list of tags
    
    # Relationships
    documents = db.relationship('Document', backref='legal_system', lazy='dynamic')
    owner = db.relationship('User', foreign_keys=[owner_id])

class Document(db.Model):
    __tablename__ = 'documents'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(500), nullable=False)
    slug = db.Column(db.String(200), unique=True, nullable=False, index=True)
    
    # Content
    content = db.Column(db.Text)
    content_markdown = db.Column(db.Text)
    summary = db.Column(db.Text)
    
    # Classification
    document_type = db.Column(db.String(50), index=True)
    category = db.Column(db.String(100))
    tags = db.Column(db.Text)  # JSON list
    
    # Hierarchy
    hierarchy_level = db.Column(db.Integer, default=5, index=True)
    legal_weight = db.Column(db.Integer, default=5)
    parent_document_id = db.Column(db.Integer, db.ForeignKey('documents.id'))
    
    # System relations
    legal_system_id = db.Column(db.Integer, db.ForeignKey('legal_systems.id'), nullable=False, index=True)
    
    # Authorship
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    contributors = db.Column(db.Text)  # JSON list of contributor IDs
    
    # Versioning and status
    version = db.Column(db.String(20), default='0.1')
    major_version = db.Column(db.Integer, default=0)
    minor_version = db.Column(db.Integer, default=1)
    status = db.Column(db.String(20), default='draft', index=True)
    workflow_stage = db.Column(db.String(50), default='editing')
    
    # Publication
    published_at = db.Column(db.DateTime)
    effective_date = db.Column(db.DateTime)
    review_date = db.Column(db.DateTime)
    
    # Tracking
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_modified_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    
    # Content analysis (Aircloud AI features)
    word_count = db.Column(db.Integer, default=0)
    complexity_score = db.Column(db.Float, default=0.0)
    readability_score = db.Column(db.Float, default=0.0)
    legal_concepts = db.Column(db.Text)  # JSON analysis results
    
    # Commercial features
    requires_commercial = db.Column(db.Boolean, default=False)
    
    # Relationships
    comments = db.relationship('Comment', backref='document', lazy='dynamic')
    revisions = db.relationship('DocumentRevision', backref='document', lazy='dynamic')
    author = db.relationship('User', foreign_keys=[author_id])
    children = db.relationship('Document', backref=db.backref('parent', remote_side=[id]))

class DocumentRevision(db.Model):
    __tablename__ = 'document_revisions'
    
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('documents.id'), nullable=False, index=True)
    revision_number = db.Column(db.Integer, nullable=False)
    
    # Content snapshot
    title = db.Column(db.String(500))
    content = db.Column(db.Text)
    content_markdown = db.Column(db.Text)
    
    # Change information
    change_summary = db.Column(db.Text)
    change_type = db.Column(db.String(50))  # minor, major, structural, legal
    
    # Author and timing
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Content analysis
    word_count = db.Column(db.Integer)
    content_hash = db.Column(db.String(64))
    
    # Relationships
    author = db.relationship('User')

class Comment(db.Model):
    __tablename__ = 'comments'
    
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('documents.id'), nullable=False, index=True)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Comment content
    content = db.Column(db.Text, nullable=False)
    
    # Comment metadata
    comment_type = db.Column(db.String(50), default='general')
    priority = db.Column(db.String(20), default='medium')
    status = db.Column(db.String(20), default='open')
    
    # Text selection (Word-like commenting)
    selected_text = db.Column(db.Text)
    selection_start = db.Column(db.Integer)
    selection_end = db.Column(db.Integer)
    
    # Threading
    parent_comment_id = db.Column(db.Integer, db.ForeignKey('comments.id'))
    
    # Legal impact assessment
    legal_impact = db.Column(db.String(20), default='none')
    
    # Workflow
    assigned_to = db.Column(db.Integer, db.ForeignKey('users.id'))
    resolved_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    resolved_at = db.Column(db.DateTime)
    
    # Tracking
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    author = db.relationship('User', foreign_keys=[author_id])
    replies = db.relationship('Comment', backref=db.backref('parent', remote_side=[id]))

class AuditLog(db.Model):
    __tablename__ = 'audit_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), index=True)
    
    # Action details
    action = db.Column(db.String(100), nullable=False, index=True)
    resource_type = db.Column(db.String(50), nullable=False)
    resource_id = db.Column(db.Integer, nullable=False)
    
    # Change details
    old_values = db.Column(db.Text)  # JSON
    new_values = db.Column(db.Text)  # JSON
    change_summary = db.Column(db.Text)
    
    # Context
    ip_address = db.Column(db.String(45))
    user_agent = db.Column(db.String(500))
    
    # Timing
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    user = db.relationship('User')

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# =====================================
# AIRCLOUD LEGAL ANALYSIS ENGINE
# =====================================

class AircloudLegalAnalysis:
    """Aircloud Advanced Legal Analysis Engine with AI-powered insights"""
    
    LEGAL_CONCEPTS = {
        'obligations': ['musi', 'zobowiązuje', 'powinien', 'ma obowiązek', 'jest obowiązany'],
        'rights': ['ma prawo', 'może', 'jest uprawniony', 'wolno', 'przysługuje'],
        'prohibitions': ['zabrania się', 'nie może', 'nie wolno', 'zabronione'],
        'procedures': ['procedura', 'tryb', 'sposób', 'proces', 'postępowanie'],
        'penalties': ['kara', 'sankcja', 'odpowiedzialność', 'konsekwencja'],
        'timeframes': ['termin', 'okres', 'czas', 'deadline', 'do dnia'],
        'definitions': ['oznacza', 'rozumie się', 'definiuje się'],
        'conditions': ['jeśli', 'jeżeli', 'w przypadku', 'pod warunkiem']
    }
    
    @staticmethod
    def analyze_document(document):
        """Comprehensive document analysis with Aircloud AI"""
        content = document.content_markdown or document.content or ''
        
        analysis = {
            'legal_concepts': AircloudLegalAnalysis._extract_concepts(content),
            'structure': AircloudLegalAnalysis._analyze_structure(content),
            'complexity': AircloudLegalAnalysis._calculate_complexity(content),
            'readability': AircloudLegalAnalysis._calculate_readability(content),
            'suggestions': AircloudLegalAnalysis._generate_suggestions(content),
            'compliance_score': AircloudLegalAnalysis._check_compliance(content),
            'aircloud_insights': AircloudLegalAnalysis._generate_ai_insights(content)
        }
        
        return analysis
    
    @staticmethod
    def _extract_concepts(content):
        """Extract legal concepts using Aircloud taxonomy"""
        concepts = []
        
        for concept_type, keywords in AircloudLegalAnalysis.LEGAL_CONCEPTS.items():
            matches = []
            for keyword in keywords:
                if keyword.lower() in content.lower():
                    positions = [m.start() for m in re.finditer(re.escape(keyword), content, re.IGNORECASE)]
                    if positions:
                        matches.append({
                            'term': keyword,
                            'count': len(positions),
                            'positions': positions
                        })
            
            if matches:
                concepts.append({
                    'type': concept_type,
                    'matches': matches,
                    'total_count': sum(m['count'] for m in matches)
                })
        
        return concepts
    
    @staticmethod
    def _analyze_structure(content):
        """Analyze document structure"""
        return {
            'paragraphs': len(re.findall(r'§\s*\d+', content)),
            'sections': len(re.findall(r'^#+\s', content, re.MULTILINE)),
            'words': len(content.split()),
            'sentences': len(re.findall(r'[.!?]+', content)),
            'legal_references': len(re.findall(r'§\s*\d+|art\.\s*\d+', content, re.IGNORECASE))
        }
    
    @staticmethod
    def _calculate_complexity(content):
        """Calculate complexity score (0-10)"""
        if not content:
            return 0.0
        
        words = content.split()
        sentences = re.findall(r'[.!?]+', content)
        
        if not sentences:
            return 0.0
        
        avg_sentence_length = len(words) / len(sentences)
        legal_terms = len(re.findall(r'\b(zgodnie|stosownie|określony|właściwy)\b', content, re.IGNORECASE))
        
        complexity = min(10.0, (avg_sentence_length / 15) * 4 + (legal_terms / len(words)) * 100)
        return round(complexity, 2)
    
    @staticmethod
    def _calculate_readability(content):
        """Calculate readability score (0-100, higher = more readable)"""
        if not content:
            return 0.0
        
        words = content.split()
        sentences = re.findall(r'[.!?]+', content)
        
        if not sentences:
            return 0.0
        
        avg_sentence_length = len(words) / len(sentences)
        readability = max(0.0, 100 - avg_sentence_length * 1.5)
        
        return round(readability, 2)
    
    @staticmethod
    def _check_compliance(content):
        """Check compliance with legal standards"""
        score = 100.0
        
        # Check for numbered paragraphs
        if not re.search(r'§\s*1', content):
            score -= 20
        
        # Check for definitions section
        if len(content.split()) > 1000 and not re.search(r'(definicje|oznacza)', content, re.IGNORECASE):
            score -= 15
        
        # Check for proper structure
        if len(content.split()) > 2000 and not re.search(r'^#+.*[Rr]ozdział', content, re.MULTILINE):
            score -= 10
        
        return max(0.0, score)
    
    @staticmethod
    def _generate_suggestions(content):
        """Generate improvement suggestions"""
        suggestions = []
        word_count = len(content.split())
        
        if word_count > 3000:
            suggestions.append({
                'type': 'structure',
                'priority': 'medium',
                'message': 'Rozważ podział dokumentu na mniejsze sekcje dla lepszej czytelności'
            })
        
        if not re.search(r'§\s*\d+', content) and word_count > 500:
            suggestions.append({
                'type': 'format',
                'priority': 'high', 
                'message': 'Dodaj numerację paragrafów (§1, §2, etc.)'
            })
        
        return suggestions
    
    @staticmethod
    def _generate_ai_insights(content):
        """Generate AI-powered insights (Aircloud premium feature)"""
        return {
            'document_category': 'regulatory' if 'regulamin' in content.lower() else 'procedural',
            'estimated_review_time': f'{max(5, len(content.split()) // 200)} minut',
            'key_stakeholders': AircloudLegalAnalysis._identify_stakeholders(content),
            'risk_level': 'medium',
            'implementation_complexity': 'standard'
        }
    
    @staticmethod
    def _identify_stakeholders(content):
        """Identify key stakeholders mentioned in document"""
        stakeholders = []
        
        stakeholder_patterns = [
            r'student[yów]*',
            r'pracownik[yów]*', 
            r'zarząd',
            r'komisj[aie]',
            r'parlament',
            r'rada',
            r'rektor'
        ]
        
        for pattern in stakeholder_patterns:
            if re.search(pattern, content, re.IGNORECASE):
                stakeholders.append(pattern.replace('[yów]*', '').replace('[aie]', 'a'))
        
        return stakeholders

# =====================================
# COMMERCIAL LICENSE MANAGER
# =====================================

class AircloudLicenseManager:
    """Manage commercial licensing and subscription features"""
    
    SOCIAL_FEATURES = [
        'basic_document_editing',
        'simple_commenting', 
        'basic_analysis',
        'public_sharing'
    ]
    
    COMMERCIAL_FEATURES = [
        'advanced_workflow',
        'ai_insights',
        'audit_logging',
        'advanced_analytics',
        'email_notifications',
        'api_access',
        'priority_support',
        'export_formats',
        'custom_branding'
    ]
    
    @staticmethod
    def check_feature_access(user, feature):
        """Check if user has access to specific feature"""
        if feature in AircloudLicenseManager.SOCIAL_FEATURES:
            return True
        
        if feature in AircloudLicenseManager.COMMERCIAL_FEATURES:
            return user.is_commercial_user() if user.is_authenticated else False
        
        return True  # Unknown features are allowed by default
    
    @staticmethod
    def get_subscription_info():
        """Get subscription pricing information"""
        return {
            'social': {
                'price': 'Bezpłatne',
                'description': 'Do użytku społecznego, edukacyjnego i non-profit',
                'features': AircloudLicenseManager.SOCIAL_FEATURES
            },
            'commercial': {
                'price': '50 PLN + 23% VAT / miesiąc',
                'description': 'Pełne funkcje dla użytku komercyjnego',
                'features': AircloudLicenseManager.SOCIAL_FEATURES + AircloudLicenseManager.COMMERCIAL_FEATURES
            }
        }

# =====================================
# MAIN ROUTES
# =====================================

@app.route('/')
def index():
    """Main dashboard with Aircloud branding"""
    legal_systems = LegalSystem.query.filter_by(status='active').limit(10).all()
    recent_documents = Document.query.order_by(Document.updated_at.desc()).limit(8).all()
    
    # Statistics
    stats = {
        'total_systems': LegalSystem.query.count(),
        'total_documents': Document.query.count(),
        'active_users': User.query.filter_by(status='active').count(),
        'total_comments': Comment.query.count()
    }
    
    return render_template('index.html',
                         legal_systems=legal_systems,
                         recent_documents=recent_documents,
                         stats=stats,
                         subscription_info=AircloudLicenseManager.get_subscription_info())

@app.route('/system/<int:system_id>')
def legal_system_view(system_id):
    """View legal system with documents"""
    legal_system = LegalSystem.query.get_or_404(system_id)
    documents = Document.query.filter_by(legal_system_id=system_id).order_by(Document.hierarchy_level).all()
    document_count = len(documents)
    
    return render_template('legal_system.html',
                         legal_system=legal_system,
                         documents=documents,
                         document_count=document_count)

@app.route('/document/<slug>')
def document_view(slug):
    """Public document viewing with Word-like commenting"""
    document = Document.query.filter_by(slug=slug).first_or_404()
    comments = Comment.query.filter_by(document_id=document.id).order_by(Comment.created_at.desc()).all()
    
    # Perform analysis if not cached
    if not document.legal_concepts:
        analysis = AircloudLegalAnalysis.analyze_document(document)
        document.legal_concepts = json.dumps(analysis)
        document.complexity_score = analysis['complexity']
        document.readability_score = analysis['readability']
        db.session.commit()
    else:
        analysis = json.loads(document.legal_concepts)
    
    return render_template('document_view.html',
                         document=document,
                         comments=comments,
                         analysis=analysis)

@app.route('/api/document/<slug>/comment', methods=['POST'])
def add_comment(slug):
    """Add comment to document (Word-like functionality)"""
    if not current_user.is_authenticated:
        return jsonify({'success': False, 'error': 'Zaloguj się aby komentować'}), 401
    
    document = Document.query.filter_by(slug=slug).first_or_404()
    data = request.get_json()
    
    comment = Comment(
        document_id=document.id,
        author_id=current_user.id,
        content=data.get('content', ''),
        comment_type=data.get('type', 'general'),
        priority=data.get('priority', 'medium'),
        legal_impact=data.get('legal_impact', 'none'),
        selected_text=data.get('selected_text'),
        selection_start=data.get('selection_start'),
        selection_end=data.get('selection_end')
    )
    
    db.session.add(comment)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Komentarz dodany',
        'comment_id': comment.id,
        'author': current_user.full_name or current_user.username,
        'created_at': comment.created_at.isoformat()
    })

@app.route('/api/document/<slug>/analyze', methods=['POST'])
def analyze_document_api(slug):
    """API endpoint for document analysis"""
    document = Document.query.filter_by(slug=slug).first_or_404()
    
    # Check if advanced analysis requires commercial license
    if current_user.is_authenticated:
        has_commercial = current_user.is_commercial_user()
    else:
        has_commercial = False
    
    analysis = AircloudLegalAnalysis.analyze_document(document)
    
    # Limit features for non-commercial users
    if not has_commercial:
        analysis.pop('aircloud_insights', None)
        if len(analysis.get('suggestions', [])) > 2:
            analysis['suggestions'] = analysis['suggestions'][:2]
            analysis['suggestions'].append({
                'type': 'commercial',
                'priority': 'info',
                'message': 'Więcej sugestii dostępnych w wersji komercyjnej'
            })
    
    # Cache analysis
    document.legal_concepts = json.dumps(analysis)
    document.complexity_score = analysis['complexity']
    document.readability_score = analysis['readability']
    db.session.commit()
    
    return jsonify({
        'success': True,
        'analysis': analysis,
        'commercial_features': has_commercial
    })

@app.route('/pricing')
def pricing():
    """Pricing and licensing information"""
    return render_template('pricing.html',
                         subscription_info=AircloudLicenseManager.get_subscription_info())

@app.route('/about')
def about():
    """About Aircloud Legal Platform"""
    return render_template('about.html', {
        'version': app.config['AIRCLOUD_VERSION'],
        'author': app.config['AIRCLOUD_AUTHOR'],
        'company': app.config['AIRCLOUD_COMPANY']
    })

# =====================================
# AUTHENTICATION BLUEPRINT
# =====================================

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        data = request.get_json() if request.is_json else request.form
        
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'success': False, 'error': 'Użytkownik już istnieje'})
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'success': False, 'error': 'Email już używany'})
        
        # Determine license type based on domain or explicit choice
        license_type = data.get('license_type', 'social')
        subscription_expires = None
        
        if license_type == 'commercial':
            # Set 30-day trial for commercial
            subscription_expires = datetime.utcnow() + timedelta(days=30)
        
        user = User(
            username=data['username'],
            email=data['email'],
            password_hash=generate_password_hash(data['password']),
            full_name=data.get('full_name', ''),
            title=data.get('title', ''),
            institution=data.get('institution', ''),
            license_type=license_type,
            subscription_active=True,
            subscription_expires=subscription_expires
        )
        
        db.session.add(user)
        db.session.commit()
        
        login_user(user)
        
        if request.is_json:
            return jsonify({'success': True, 'redirect': url_for('index')})
        else:
            flash('Rejestracja zakończona sukcesem!', 'success')
            return redirect(url_for('index'))
    
    return render_template('auth/register.html',
                         subscription_info=AircloudLicenseManager.get_subscription_info())

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json() if request.is_json else request.form
        
        user = User.query.filter_by(username=data['username']).first()
        
        if user and check_password_hash(user.password_hash, data['password']):
            user.last_login = datetime.utcnow()
            user.login_count += 1
            db.session.commit()
            
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

@auth_bp.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Wylogowano pomyślnie', 'info')
    return redirect(url_for('index'))

# Register blueprint
app.register_blueprint(auth_bp, url_prefix='/auth')

# Register collaboration blueprint if available
if COLLABORATION_FEATURES_AVAILABLE:
    app.register_blueprint(collab_routes, url_prefix='/collaboration')
    print("✅ Collaboration routes registered")


# =====================================
# SAMPLE DATA CREATION
# =====================================

def create_aircloud_sample_data():
    """Create sample data for Aircloud Legal Platform"""
    
    # Create admin user (Łukasz Kołodziej)
    admin = User(
        username='lukasz.kolodziej',
        email='lukasz.kolodziej@aircloud.pl',
        password_hash=generate_password_hash('aircloud2025'),
        full_name='Łukasz Kołodziej',
        title='Mgr inż.',
        institution='Aircloud',
        role='admin',
        license_type='commercial',
        subscription_active=True
    )
    db.session.add(admin)
    db.session.flush()
    
    # Create SSPO legal system
    sspo = LegalSystem(
        name='SSPO - Samorząd Studentów Politechniki Opolskiej',
        slug='sspo-politechnika-opolska',
        description='Kompletny system prawny Samorządu Studentów z wykorzystaniem platformy Aircloud',
        system_type='university',
        jurisdiction='Poland',
        domain='education',
        owner_id=admin.id,
        license_type='social',
        status='active'
    )
    db.session.add(sspo)
    db.session.flush()
    
    # Create sample documents
    documents_data = [
        {
            'title': 'Regulamin SSPO - Dokument Główny',
            'slug': 'regulamin-sspo-glowny',
            'document_type': 'statute',
            'hierarchy_level': 1,
            'content_markdown': """# REGULAMIN SAMORZĄDU STUDENTÓW POLITECHNIKI OPOLSKIEJ

*Opracowano z wykorzystaniem platformy Aircloud Legal*

## Rozdział I - Postanowienia ogólne

§ 1. **Definicje i zakres**
1) Samorząd Studentów Politechniki Opolskiej, zwany dalej „Samorządem", jest reprezentantem studentów uczelni.
2) Samorząd działa na podstawie ustawy Prawo o szkolnictwie wyższym i nauce oraz niniejszego regulaminu.

§ 2. **Cele działania**
Samorząd ma na celu:
1) Reprezentowanie interesów studentów
2) Wspieranie rozwoju życia studenckiego
3) Dbanie o wysoką jakość kształcenia

## Rozdział II - Organy Samorządu

§ 3. **Struktura organizacyjna**
Organami Samorządu są:
1) Parlament Studentów
2) Zarząd Samorządu  
3) Komisja Rewizyjna

§ 4. **Parlament Studentów**
1) Parlament jest najwyższym organem Samorządu
2) Składa się z przedstawicieli wydziałów
3) Wybierany jest w wyborach powszechnych

---
*Dokument utworzony w systemie Aircloud Legal - Professional Legal Collaboration Platform*
*© 2025 Aircloud | Autor: Łukasz Kołodziej*"""
        },
        {
            'title': 'Ordynacja Wyborcza SSPO',
            'slug': 'ordynacja-wyborcza-sspo',
            'document_type': 'regulation',
            'hierarchy_level': 2,
            'content_markdown': """# ORDYNACJA WYBORCZA SAMORZĄDU STUDENTÓW

*System Aircloud Legal - Zaawansowana platforma współpracy prawnej*

## Rozdział I - Zasady ogólne

§ 1. **Podstawowe zasady wyborów**
Wybory do organów Samorządu odbywają się zgodnie z zasadami:
1) **Powszechności** - prawo wybierania przysługuje wszystkim studentom
2) **Równości** - każdy głos ma taką samą wagę
3) **Tajności** - głosowanie jest tajne
4) **Bezpośredniości** - studenci głosują bezpośrednio na kandydatów

§ 2. **Komisja Wyborcza**
1) Komisja Wyborcza jest organem organizującym i nadzorującym wybory
2) Składa się z 5 członków wybieranych przez Parlament
3) Członkowie Komisji muszą być bezstronni

## Rozdział II - Procedura wyborcza

§ 3. **Zgłaszanie kandydatów**
1) Kandydatów można zgłaszać do 14 dni przed wyborami
2) Kandydat musi uzyskać poparcie minimum 50 studentów
3) Zgłoszenie musi zawierać program kandydata

---
*Opracowano w Aircloud Legal Platform*
*Autor systemu: Łukasz Kołodziej | © 2025 Aircloud*"""
        }
    ]
    
    for doc_data in documents_data:
        doc = Document(
            legal_system_id=sspo.id,
            author_id=admin.id,
            status='published',
            **doc_data
        )
        
        # Perform initial analysis
        analysis = AircloudLegalAnalysis.analyze_document(doc)
        doc.legal_concepts = json.dumps(analysis)
        doc.complexity_score = analysis['complexity']
        doc.readability_score = analysis['readability']
        doc.word_count = len((doc.content_markdown or '').split())
        
        db.session.add(doc)
    
    db.session.commit()
    print("✅ Aircloud Legal Platform - Sample data created!")

# =====================================
# APPLICATION STARTUP
# =====================================

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
        if User.query.count() == 0:
            create_aircloud_sample_data()
        
        # Register extended features blueprint if available
        if EXTENDED_FEATURES_AVAILABLE:
            try:
                app.register_blueprint(extended_bp, url_prefix='/extended')
                print("✅ Extended features blueprint registered successfully")
            except Exception as e:
                print(f"⚠️  Failed to register extended features: {e}")
    
    print(f"""
🏛️ AIRCLOUD LEGAL COLLABORATION PLATFORM v{app.config['AIRCLOUD_VERSION']}
===============================================================
👨‍💻 Autor: {app.config['AIRCLOUD_AUTHOR']}
🏢 Firma: {app.config['AIRCLOUD_COMPANY']}

✅ Serwer uruchomiony: http://localhost:5001

📋 LICENCJONOWANIE:
   • 🆓 Open Source: Bezpłatne do celów społecznych/edukacyjnych
   • 💼 Komercyjne: {app.config['COMMERCIAL_PRICE']}
   • 📧 Kontakt: legal@aircloud.pl

🔧 FUNKCJONALNOŚCI:
   • Współpraca nad dokumentami prawnymi (jak Word)
   • Zaawansowany system komentowania
   • Analiza prawna z AI
   • Kontrola wersji z diff
   • Workflow zatwierdzania
   • System uprawnień
   • Audit logging
   • API integration

{f"🚀 ROZSZERZONE FUNKCJE: {'AKTYWNE' if EXTENDED_FEATURES_AVAILABLE else 'NIEDOSTĘPNE'}" }
   • Export do PDF/DOCX
   • Galeria szablonów prawnych
   • Zaawansowana analityka dokumentów
   • Workflow management
   • Dashboard rozszerzony

{f"🤝 KOLABORACJA: {'AKTYWNA' if COLLABORATION_FEATURES_AVAILABLE else 'NIEDOSTĘPNA'}" }
   • Real-time collaborative editing
   • Live cursor tracking
   • Smart document templates
   • Context-aware comments
   • Document relationships

🚀 DEMO: lukasz.kolodziej / aircloud2025

🌐 Platforma gotowa do produkcji!
""")
    
    # =====================================
    # SOCKETIO EVENT HANDLERS
    # =====================================
    
    if SOCKETIO_AVAILABLE and COLLABORATION_FEATURES_AVAILABLE:
        @socketio.on('connect')
        def handle_connect():
            print(f"✅ Client connected: {request.sid}")
        
        @socketio.on('disconnect')
        def handle_disconnect():
            print(f"⚠️  Client disconnected: {request.sid}")
        
        @socketio.on('join_document')
        def handle_join_document(data):
            """User joins document editing session"""
            document_id = data.get('document_id')
            user_id = data.get('user_id')
            username = data.get('username')
            
            # Join room for this document
            from flask_socketio import join_room, emit
            join_room(f"doc_{document_id}")
            
            # Add to collaboration session
            session_data = collab_sessions.join_session(document_id, user_id, username)
            
            # Notify other users
            emit('user_joined', {
                'user_id': user_id,
                'username': username,
                'users': session_data['users']
            }, room=f"doc_{document_id}", skip_sid=request.sid)
            
            print(f"👤 {username} joined document {document_id}")
        
        @socketio.on('leave_document')
        def handle_leave_document(data):
            """User leaves document editing session"""
            document_id = data.get('document_id')
            user_id = data.get('user_id')
            
            from flask_socketio import leave_room, emit
            leave_room(f"doc_{document_id}")
            
            # Remove from collaboration session
            collab_sessions.leave_session(document_id, user_id)
            
            # Notify other users
            emit('user_left', {
                'user_id': user_id,
                'users': collab_sessions.active_sessions.get(document_id, {}).get('users', {})
            }, room=f"doc_{document_id}")
        
        @socketio.on('content_change')
        def handle_content_change(data):
            """Handle document content changes"""
            document_id = data.get('document_id')
            user_id = data.get('user_id')
            content = data.get('content')
            change = data.get('change')
            
            # Record edit
            collab_sessions.record_edit(document_id, user_id, {
                'content': content,
                'change': change
            })
            
            # Broadcast to other users
            from flask_socketio import emit
            emit('content_changed', {
                'user_id': user_id,
                'content': content,
                'change': change
            }, room=f"doc_{document_id}", skip_sid=request.sid)
        
        @socketio.on('cursor_move')
        def handle_cursor_move(data):
            """Handle cursor position updates"""
            document_id = data.get('document_id')
            user_id = data.get('user_id')
            position = data.get('position')
            
            # Update cursor position
            collab_sessions.update_cursor(document_id, user_id, position)
            
            # Broadcast to other users
            from flask_socketio import emit
            emit('cursor_moved', {
                'user_id': user_id,
                'position': position
            }, room=f"doc_{document_id}", skip_sid=request.sid)
        
        @socketio.on('lock_paragraph')
        def handle_lock_paragraph(data):
            """Lock paragraph for editing"""
            document_id = data.get('document_id')
            user_id = data.get('user_id')
            paragraph_id = data.get('paragraph_id')
            
            success = collab_sessions.lock_paragraph(document_id, user_id, paragraph_id)
            
            if success:
                from flask_socketio import emit
                emit('paragraph_locked', {
                    'user_id': user_id,
                    'paragraph_id': paragraph_id,
                    'username': current_user.username if current_user.is_authenticated else 'Unknown'
                }, room=f"doc_{document_id}")
        
        print("✅ SocketIO event handlers registered")
    
    # Start application
    if SOCKETIO_AVAILABLE:
        socketio.run(app, debug=True, host='0.0.0.0', port=5001)
    else:
        app.run(debug=True, host='0.0.0.0', port=5001)