#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🏛️ ADVANCED LEGAL COLLABORATION PLATFORM v2.0
==================================================
Zaawansowany system współpracy nad dokumentami prawnymi
z pełnym workflow, wersjonowaniem i analizą prawną
"""

from flask import Flask, render_template, request, jsonify, session, redirect, url_for, flash, send_file, abort
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
import smtplib
from email.mime.text import MimeText
from email.mime.multipart import MimeMultipart

# Initialize Flask app with advanced config
app = Flask(__name__)
app.config.update({
    'SECRET_KEY': 'advanced-legal-system-2025-secure',
    'SQLALCHEMY_DATABASE_URI': 'sqlite:///advanced_legal_system.db',
    'SQLALCHEMY_TRACK_MODIFICATIONS': False,
    'UPLOAD_FOLDER': 'uploads',
    'MAX_CONTENT_LENGTH': 16 * 1024 * 1024,  # 16MB max file size
    'MAIL_SERVER': 'smtp.gmail.com',
    'MAIL_PORT': 587,
    'MAIL_USE_TLS': True,
    'MAIL_DEFAULT_SENDER': 'legal-system@sspo.pl'
})

# Initialize extensions
db = SQLAlchemy(app)
migrate = Migrate(app, db)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'auth.login'

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
    email_verification_token = db.Column(db.String(100))
    
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
    
    # Relationships
    authored_documents = db.relationship('Document', foreign_keys='Document.author_id', backref='author')
    comments = db.relationship('Comment', backref='author', lazy='dynamic')
    review_assignments = db.relationship('ReviewAssignment', backref='reviewer', lazy='dynamic')
    notifications = db.relationship('Notification', backref='user', lazy='dynamic')
    
    def get_permissions(self):
        """Get user permissions as dict"""
        if self.permissions:
            return json.loads(self.permissions)
        return {}
    
    def has_permission(self, permission):
        """Check if user has specific permission"""
        perms = self.get_permissions()
        return perms.get(permission, False) or self.role == 'admin'
    
    def get_notification_settings(self):
        """Get notification settings"""
        if self.notification_settings:
            return json.loads(self.notification_settings)
        return {
            'email_comments': True,
            'email_reviews': True,
            'email_mentions': True,
            'browser_notifications': True
        }

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
    approval_workflow = db.Column(db.Text)  # JSON workflow definition
    
    # Tracking
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_review_date = db.Column(db.DateTime)
    next_review_date = db.Column(db.DateTime)
    
    # Statistics
    document_count = db.Column(db.Integer, default=0)
    total_revisions = db.Column(db.Integer, default=0)
    active_contributors = db.Column(db.Integer, default=0)
    
    # Configuration
    settings = db.Column(db.Text)  # JSON configuration
    tags = db.Column(db.Text)  # JSON list of tags
    
    # Relationships
    documents = db.relationship('Document', backref='legal_system', lazy='dynamic',
                              cascade='all, delete-orphan')
    owner = db.relationship('User', foreign_keys=[owner_id])

class DocumentTemplate(db.Model):
    __tablename__ = 'document_templates'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(100))  # statute, regulation, procedure
    template_content = db.Column(db.Text, nullable=False)
    placeholders = db.Column(db.Text)  # JSON with placeholder definitions
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    usage_count = db.Column(db.Integer, default=0)
    is_public = db.Column(db.Boolean, default=True)

class Document(db.Model):
    __tablename__ = 'documents'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(500), nullable=False)
    slug = db.Column(db.String(200), unique=True, nullable=False, index=True)
    
    # Content
    content = db.Column(db.Text)
    content_markdown = db.Column(db.Text)
    content_structured = db.Column(db.Text)  # JSON structured content
    summary = db.Column(db.Text)
    
    # Classification
    document_type = db.Column(db.String(50), index=True)
    category = db.Column(db.String(100))
    subcategory = db.Column(db.String(100))
    tags = db.Column(db.Text)  # JSON list
    
    # Hierarchy and relations
    hierarchy_level = db.Column(db.Integer, default=5, index=True)
    legal_weight = db.Column(db.Integer, default=5)
    parent_document_id = db.Column(db.Integer, db.ForeignKey('documents.id'))
    superseded_by_id = db.Column(db.Integer, db.ForeignKey('documents.id'))
    related_documents = db.Column(db.Text)  # JSON list of related doc IDs
    
    # System relations
    legal_system_id = db.Column(db.Integer, db.ForeignKey('legal_systems.id'), nullable=False, index=True)
    template_id = db.Column(db.Integer, db.ForeignKey('document_templates.id'))
    
    # Authorship
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    contributors = db.Column(db.Text)  # JSON list of contributor IDs
    
    # Versioning and status
    version = db.Column(db.String(20), default='0.1')
    major_version = db.Column(db.Integer, default=0)
    minor_version = db.Column(db.Integer, default=1)
    status = db.Column(db.String(20), default='draft', index=True)
    workflow_stage = db.Column(db.String(50), default='editing')
    
    # Approval workflow
    requires_approval = db.Column(db.Boolean, default=True)
    approval_status = db.Column(db.String(20), default='pending')
    approved_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    approved_at = db.Column(db.DateTime)
    
    # Publication
    published_at = db.Column(db.DateTime)
    effective_date = db.Column(db.DateTime)
    expiration_date = db.Column(db.DateTime)
    review_date = db.Column(db.DateTime)
    
    # Tracking
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_modified_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    
    # Content analysis
    word_count = db.Column(db.Integer, default=0)
    complexity_score = db.Column(db.Float, default=0.0)
    readability_score = db.Column(db.Float, default=0.0)
    legal_concepts = db.Column(db.Text)  # JSON analysis results
    consistency_hash = db.Column(db.String(64))  # For change detection
    
    # Access control
    visibility = db.Column(db.String(20), default='public')
    access_permissions = db.Column(db.Text)  # JSON permissions
    
    # Relationships
    revisions = db.relationship('DocumentRevision', backref='document', lazy='dynamic',
                              cascade='all, delete-orphan')
    comments = db.relationship('Comment', backref='document', lazy='dynamic',
                             cascade='all, delete-orphan')
    reviews = db.relationship('ReviewAssignment', backref='document', lazy='dynamic')
    children = db.relationship('Document', backref=db.backref('parent', remote_side=[id]))
    last_modifier = db.relationship('User', foreign_keys=[last_modified_by])
    approver = db.relationship('User', foreign_keys=[approved_by])

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
    changed_sections = db.Column(db.Text)  # JSON list of changed sections
    
    # Author and timing
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Content analysis
    word_count = db.Column(db.Integer)
    changes_word_count = db.Column(db.Integer)
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
    content_html = db.Column(db.Text)  # Rendered HTML
    
    # Comment metadata
    comment_type = db.Column(db.String(50), default='general')  # general, legal, editorial, question
    priority = db.Column(db.String(20), default='medium')  # low, medium, high, critical
    status = db.Column(db.String(20), default='open')  # open, resolved, dismissed
    category = db.Column(db.String(50))  # suggestion, error, clarification
    
    # Text selection and positioning
    selected_text = db.Column(db.Text)
    selection_start = db.Column(db.Integer)
    selection_end = db.Column(db.Integer)
    anchor_id = db.Column(db.String(100))  # HTML anchor for positioning
    
    # Threading
    parent_comment_id = db.Column(db.Integer, db.ForeignKey('comments.id'))
    thread_root_id = db.Column(db.Integer, db.ForeignKey('comments.id'))
    
    # Legal impact assessment
    legal_impact = db.Column(db.String(20), default='none')  # none, low, medium, high
    requires_legal_review = db.Column(db.Boolean, default=False)
    affects_compliance = db.Column(db.Boolean, default=False)
    
    # Workflow
    assigned_to = db.Column(db.Integer, db.ForeignKey('users.id'))
    resolved_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    resolved_at = db.Column(db.DateTime)
    resolution_note = db.Column(db.Text)
    
    # Tracking
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Engagement metrics
    upvotes = db.Column(db.Integer, default=0)
    downvotes = db.Column(db.Integer, default=0)
    
    # Relationships
    replies = db.relationship('Comment', backref=db.backref('parent', remote_side=[id]))
    assignee = db.relationship('User', foreign_keys=[assigned_to])
    resolver = db.relationship('User', foreign_keys=[resolved_by])

class ReviewAssignment(db.Model):
    __tablename__ = 'review_assignments'
    
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('documents.id'), nullable=False)
    reviewer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    assigned_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Review details
    review_type = db.Column(db.String(50))  # legal, editorial, technical, peer
    scope = db.Column(db.String(50))  # full, sections, changes_only
    deadline = db.Column(db.DateTime)
    priority = db.Column(db.String(20), default='medium')
    
    # Status tracking
    status = db.Column(db.String(20), default='assigned')  # assigned, in_progress, completed, cancelled
    started_at = db.Column(db.DateTime)
    completed_at = db.Column(db.DateTime)
    
    # Review results
    recommendation = db.Column(db.String(20))  # approve, reject, needs_changes
    overall_score = db.Column(db.Integer)  # 1-10 rating
    review_notes = db.Column(db.Text)
    
    # Detailed feedback
    legal_compliance_score = db.Column(db.Integer)
    clarity_score = db.Column(db.Integer)
    consistency_score = db.Column(db.Integer)
    completeness_score = db.Column(db.Integer)
    
    # Tracking
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    assigner = db.relationship('User', foreign_keys=[assigned_by])

class Notification(db.Model):
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    
    # Notification content
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    notification_type = db.Column(db.String(50), index=True)
    
    # Context
    related_object_type = db.Column(db.String(50))  # document, comment, review
    related_object_id = db.Column(db.Integer)
    action_url = db.Column(db.String(255))
    
    # Status
    is_read = db.Column(db.Boolean, default=False, index=True)
    is_sent = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    read_at = db.Column(db.DateTime)

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
    session_id = db.Column(db.String(100))
    
    # Timing
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    user = db.relationship('User')

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# =====================================
# ADVANCED LEGAL ANALYSIS ENGINE
# =====================================

class AdvancedLegalAnalysisEngine:
    """Enhanced legal analysis with NLP, consistency checking, and compliance validation"""
    
    # Extended legal terminology database
    LEGAL_TAXONOMY = {
        'obligations': {
            'keywords': ['musi', 'zobowiązuje', 'powinien', 'ma obowiązek', 'jest obowiązany', 'wymaga się'],
            'patterns': [r'§\s*\d+\.\s*(musi|zobowiązuje)', r'obowiązek\s+\w+'],
            'severity': 'high'
        },
        'rights': {
            'keywords': ['ma prawo', 'może', 'jest uprawniony', 'wolno', 'przysługuje'],
            'patterns': [r'prawo\s+do\s+\w+', r'uprawniony\s+do'],
            'severity': 'medium'
        },
        'prohibitions': {
            'keywords': ['zabrania się', 'nie może', 'nie wolno', 'zabronione', 'niedozwolone'],
            'patterns': [r'zabrania się\s+\w+', r'nie\s+wolno\s+\w+'],
            'severity': 'high'
        },
        'procedures': {
            'keywords': ['procedura', 'tryb', 'sposób', 'proces', 'postępowanie', 'metoda'],
            'patterns': [r'procedura\s+\w+', r'w\s+trybie\s+\w+'],
            'severity': 'medium'
        },
        'penalties': {
            'keywords': ['kara', 'sankcja', 'odpowiedzialność', 'konsekwencja', 'ukaranie'],
            'patterns': [r'kara\s+\w+', r'sankcja\s+w\s+postaci'],
            'severity': 'high'
        },
        'timeframes': {
            'keywords': ['termin', 'okres', 'czas', 'deadline', 'do dnia', 'w ciągu'],
            'patterns': [r'w\s+terminie\s+\d+', r'do\s+dnia\s+\d+'],
            'severity': 'medium'
        },
        'definitions': {
            'keywords': ['oznacza', 'rozumie się', 'definiuje się', 'określa się jako'],
            'patterns': [r'"\w+"\s+oznacza', r'rozumie się\s+przez'],
            'severity': 'low'
        },
        'conditions': {
            'keywords': ['jeśli', 'jeżeli', 'w przypadku', 'pod warunkiem', 'o ile'],
            'patterns': [r'w\s+przypadku\s+gdy', r'jeśli\s+\w+'],
            'severity': 'medium'
        }
    }
    
    HIERARCHY_MAPPING = {
        'konstytucja': 1,
        'ustawa': 2,
        'rozporządzenie': 3,
        'regulamin': 4,
        'instrukcja': 5,
        'procedura': 6,
        'zasady': 7,
        'wytyczne': 8,
        'inne': 9
    }
    
    @classmethod
    def analyze_document_advanced(cls, document):
        """Advanced document analysis with multiple dimensions"""
        
        content = document.content_markdown or document.content or ''
        
        analysis = {
            'legal_concepts': cls._extract_legal_concepts(content),
            'structure': cls._analyze_structure(content),
            'complexity': cls._calculate_complexity(content),
            'readability': cls._calculate_readability(content),
            'compliance_check': cls._check_compliance(content, document),
            'cross_references': cls._find_cross_references(content),
            'inconsistencies': cls._find_internal_inconsistencies(content),
            'improvement_suggestions': cls._generate_improvement_suggestions(content)
        }
        
        return analysis
    
    @classmethod
    def _extract_legal_concepts(cls, content):
        """Extract legal concepts using taxonomy"""
        concepts = []
        
        for concept_type, config in cls.LEGAL_TAXONOMY.items():
            matches = []
            
            # Keyword matching
            for keyword in config['keywords']:
                if keyword.lower() in content.lower():
                    matches.append({
                        'term': keyword,
                        'type': 'keyword',
                        'positions': [m.start() for m in re.finditer(re.escape(keyword), content, re.IGNORECASE)]
                    })
            
            # Pattern matching
            for pattern in config['patterns']:
                for match in re.finditer(pattern, content, re.IGNORECASE):
                    matches.append({
                        'term': match.group(),
                        'type': 'pattern',
                        'positions': [match.start()]
                    })
            
            if matches:
                concepts.append({
                    'concept': concept_type,
                    'severity': config['severity'],
                    'matches': matches,
                    'count': len(matches)
                })
        
        return concepts
    
    @classmethod
    def _analyze_structure(cls, content):
        """Analyze document structure"""
        return {
            'sections': len(re.findall(r'^#+\s', content, re.MULTILINE)),
            'paragraphs': len(re.findall(r'§\s*\d+', content)),
            'subsections': len(re.findall(r'^\d+\)', content, re.MULTILINE)),
            'words': len(content.split()),
            'sentences': len(re.findall(r'[.!?]+', content)),
            'legal_references': len(re.findall(r'§\s*\d+|art\.\s*\d+|ust\.\s*\d+', content, re.IGNORECASE))
        }
    
    @classmethod
    def _calculate_complexity(cls, content):
        """Calculate document complexity score"""
        if not content:
            return 0.0
        
        factors = {
            'avg_sentence_length': len(content.split()) / max(len(re.findall(r'[.!?]+', content)), 1),
            'legal_terms_density': len(re.findall(r'\b(zgodnie|stosownie|odpowiednio|właściwy|określony)\b', content, re.IGNORECASE)) / max(len(content.split()), 1) * 100,
            'cross_references': len(re.findall(r'§\s*\d+|art\.\s*\d+', content, re.IGNORECASE)),
            'conditional_statements': len(re.findall(r'\b(jeśli|jeżeli|w przypadku|pod warunkiem)\b', content, re.IGNORECASE))
        }
        
        # Normalize to 0-10 scale
        complexity = min(10.0, (factors['avg_sentence_length'] / 20) * 3 + 
                              (factors['legal_terms_density']) * 2 + 
                              (factors['cross_references'] / 10) * 2 +
                              (factors['conditional_statements'] / 5) * 3)
        
        return round(complexity, 2)
    
    @classmethod
    def _calculate_readability(cls, content):
        """Simple readability score (Polish adaptation)"""
        if not content:
            return 0.0
        
        words = content.split()
        sentences = re.findall(r'[.!?]+', content)
        
        if not sentences:
            return 0.0
        
        avg_sentence_length = len(words) / len(sentences)
        
        # Simple formula adapted for Polish legal texts
        readability = max(0.0, 100 - avg_sentence_length * 2)
        
        return round(readability, 2)
    
    @classmethod
    def _check_compliance(cls, content, document):
        """Check compliance with legal writing standards"""
        issues = []
        
        # Check for common compliance issues
        if not re.search(r'§\s*1', content):
            issues.append({
                'type': 'structure',
                'severity': 'medium',
                'issue': 'Brak paragrafów numerowanych od §1'
            })
        
        if len(content.split()) > 5000 and not re.search(r'^#+.*[Rr]ozdział', content, re.MULTILINE):
            issues.append({
                'type': 'structure',
                'severity': 'low',
                'issue': 'Długi dokument bez podziału na rozdziały'
            })
        
        # Check for undefined terms
        potential_terms = re.findall(r'"([^"]+)"', content)
        if potential_terms and not re.search(r'(oznacza|rozumie się|definiuje się)', content):
            issues.append({
                'type': 'definitions',
                'severity': 'medium',
                'issue': 'Potencjalne terminy w cudzysłowach bez definicji'
            })
        
        return issues
    
    @classmethod
    def _find_cross_references(cls, content):
        """Find cross-references to other documents/sections"""
        references = []
        
        patterns = [
            (r'§\s*(\d+)', 'paragraph'),
            (r'art\.\s*(\d+)', 'article'),
            (r'ust\.\s*(\d+)', 'subsection'),
            (r'pkt\s*(\d+)', 'point'),
            (r'rozdział\s*([IVX]+|\d+)', 'chapter'),
        ]
        
        for pattern, ref_type in patterns:
            matches = re.finditer(pattern, content, re.IGNORECASE)
            for match in matches:
                references.append({
                    'type': ref_type,
                    'reference': match.group(),
                    'position': match.start(),
                    'target': match.group(1)
                })
        
        return references
    
    @classmethod
    def _find_internal_inconsistencies(cls, content):
        """Find potential internal inconsistencies"""
        inconsistencies = []
        
        # Look for conflicting obligations
        obligations = re.findall(r'(musi|zobowiązuje|powinien).*?(?=[.§])', content, re.IGNORECASE)
        prohibitions = re.findall(r'(nie może|zabrania się|nie wolno).*?(?=[.§])', content, re.IGNORECASE)
        
        # Simple heuristic for potential conflicts
        obligation_subjects = set()
        prohibition_subjects = set()
        
        for obligation in obligations:
            words = obligation.split()
            if len(words) > 2:
                obligation_subjects.add(words[1])
        
        for prohibition in prohibitions:
            words = prohibition.split()
            if len(words) > 3:
                prohibition_subjects.add(words[2])
        
        conflicts = obligation_subjects.intersection(prohibition_subjects)
        if conflicts:
            inconsistencies.append({
                'type': 'obligation_conflict',
                'severity': 'high',
                'issue': f'Potencjalny konflikt dla podmiotów: {", ".join(conflicts)}'
            })
        
        return inconsistencies
    
    @classmethod
    def _generate_improvement_suggestions(cls, content):
        """Generate improvement suggestions"""
        suggestions = []
        
        # Check document length
        word_count = len(content.split())
        if word_count > 3000:
            suggestions.append({
                'category': 'structure',
                'priority': 'medium',
                'suggestion': 'Rozważ podział na mniejsze dokumenty lub dodanie spisu treści',
                'reasoning': f'Dokument ma {word_count} słów, co może utrudniać nawigację'
            })
        
        # Check for passive voice overuse (simplified)
        passive_indicators = len(re.findall(r'\b(zostanie|został|zostały|zostać)\b', content, re.IGNORECASE))
        total_sentences = len(re.findall(r'[.!?]+', content))
        
        if total_sentences > 0 and passive_indicators / total_sentences > 0.3:
            suggestions.append({
                'category': 'style',
                'priority': 'low',
                'suggestion': 'Rozważ zmniejszenie użycia strony biernej',
                'reasoning': 'Nadmierne użycie strony biernej może utrudniać zrozumienie'
            })
        
        # Check for section numbering
        if not re.search(r'§\s*\d+', content) and word_count > 500:
            suggestions.append({
                'category': 'structure',
                'priority': 'high',
                'suggestion': 'Dodaj numerację paragrafów (§1, §2, etc.)',
                'reasoning': 'Numeracja ułatwia odniesienia i nawigację'
            })
        
        return suggestions
    
    @classmethod
    def check_system_consistency(cls, legal_system_id):
        """Advanced system-wide consistency checking"""
        documents = Document.query.filter_by(legal_system_id=legal_system_id).all()
        issues = []
        
        if len(documents) < 2:
            return issues
        
        # Check hierarchy consistency
        cls._check_hierarchy_consistency(documents, issues)
        
        # Check terminology consistency
        cls._check_terminology_consistency(documents, issues)
        
        # Check cross-reference validity
        cls._check_cross_references_validity(documents, issues)
        
        # Check for redundancy
        cls._check_redundancy(documents, issues)
        
        return issues
    
    @classmethod
    def _check_hierarchy_consistency(cls, documents, issues):
        """Check if document hierarchy makes sense"""
        hierarchy_docs = [(doc, doc.hierarchy_level) for doc in documents if doc.hierarchy_level]
        hierarchy_docs.sort(key=lambda x: x[1])
        
        for i in range(len(hierarchy_docs) - 1):
            current_doc, current_level = hierarchy_docs[i]
            next_doc, next_level = hierarchy_docs[i + 1]
            
            if next_level - current_level > 2:
                issues.append({
                    'type': 'hierarchy_gap',
                    'severity': 'medium',
                    'description': f'Duża różnica w hierarchii między "{current_doc.title}" (poziom {current_level}) a "{next_doc.title}" (poziom {next_level})',
                    'documents': [current_doc.id, next_doc.id],
                    'recommendation': 'Sprawdź czy poziomy hierarchii są odpowiednio przypisane'
                })
    
    @classmethod
    def _check_terminology_consistency(cls, documents, issues):
        """Check for consistent terminology usage"""
        term_usage = {}
        
        for doc in documents:
            content = doc.content_markdown or doc.content or ''
            
            # Extract quoted terms (likely definitions)
            terms = re.findall(r'"([^"]+)"', content)
            for term in terms:
                if term not in term_usage:
                    term_usage[term] = []
                term_usage[term].append(doc.id)
        
        # Check for terms used in multiple documents
        for term, doc_ids in term_usage.items():
            if len(doc_ids) > 1:
                # This could indicate need for consistent definition
                issues.append({
                    'type': 'terminology_consistency',
                    'severity': 'low',
                    'description': f'Termin "{term}" używany w wielu dokumentach',
                    'documents': doc_ids,
                    'recommendation': 'Upewnij się, że termin ma spójną definicję we wszystkich dokumentach'
                })
    
    @classmethod
    def _check_cross_references_validity(cls, documents, issues):
        """Check if cross-references point to existing sections"""
        doc_sections = {}
        
        # Build index of sections per document
        for doc in documents:
            content = doc.content_markdown or doc.content or ''
            sections = re.findall(r'§\s*(\d+)', content)
            doc_sections[doc.id] = [int(s) for s in sections]
        
        # Check references (simplified - assumes references within same document)
        for doc in documents:
            content = doc.content_markdown or doc.content or ''
            references = re.findall(r'§\s*(\d+)', content)
            
            available_sections = doc_sections.get(doc.id, [])
            for ref in references:
                if int(ref) not in available_sections:
                    issues.append({
                        'type': 'broken_reference',
                        'severity': 'high',
                        'description': f'W dokumencie "{doc.title}" odwołanie do §{ref}, ale taka sekcja nie istnieje',
                        'documents': [doc.id],
                        'recommendation': f'Sprawdź odwołanie do §{ref} lub dodaj brakującą sekcję'
                    })
    
    @classmethod
    def _check_redundancy(cls, documents, issues):
        """Check for potential redundant content"""
        # Simple similarity check based on titles
        titles = [(doc.title.lower(), doc.id) for doc in documents]
        
        for i in range(len(titles)):
            for j in range(i + 1, len(titles)):
                title1, id1 = titles[i]
                title2, id2 = titles[j]
                
                # Simple similarity check
                common_words = set(title1.split()) & set(title2.split())
                if len(common_words) >= 2:
                    issues.append({
                        'type': 'potential_redundancy',
                        'severity': 'low',
                        'description': f'Dokumenty mogą zawierać podobną treść: "{title1}" i "{title2}"',
                        'documents': [id1, id2],
                        'recommendation': 'Sprawdź czy dokumenty nie powielają tej samej treści'
                    })

# =====================================
# NOTIFICATION SYSTEM
# =====================================

class NotificationManager:
    """Manage notifications and email alerts"""
    
    @staticmethod
    def create_notification(user_id, title, message, notification_type, 
                          related_object_type=None, related_object_id=None, action_url=None):
        """Create a new notification"""
        notification = Notification(
            user_id=user_id,
            title=title,
            message=message,
            notification_type=notification_type,
            related_object_type=related_object_type,
            related_object_id=related_object_id,
            action_url=action_url
        )
        
        db.session.add(notification)
        db.session.commit()
        
        # Send email if user preferences allow
        user = User.query.get(user_id)
        if user and NotificationManager._should_send_email(user, notification_type):
            NotificationManager._send_email_notification(user, notification)
        
        return notification
    
    @staticmethod
    def _should_send_email(user, notification_type):
        """Check if email should be sent based on user preferences"""
        settings = user.get_notification_settings()
        
        email_mapping = {
            'comment_added': settings.get('email_comments', True),
            'review_assigned': settings.get('email_reviews', True),
            'mention': settings.get('email_mentions', True),
            'document_updated': settings.get('email_updates', True)
        }
        
        return email_mapping.get(notification_type, False)
    
    @staticmethod
    def _send_email_notification(user, notification):
        """Send email notification (placeholder - would need real SMTP setup)"""
        # This would be implemented with actual email service
        print(f"📧 Email to {user.email}: {notification.title}")
        
        notification.is_sent = True
        db.session.commit()
    
    @staticmethod
    def notify_document_comment(document, comment):
        """Notify about new comment on document"""
        # Notify document author
        if document.author_id != comment.author_id:
            NotificationManager.create_notification(
                user_id=document.author_id,
                title=f'Nowy komentarz do "{document.title}"',
                message=f'{comment.author.full_name or comment.author.username} dodał komentarz',
                notification_type='comment_added',
                related_object_type='comment',
                related_object_id=comment.id,
                action_url=f'/document/{document.slug}#comment-{comment.id}'
            )
        
        # Notify contributors
        if document.contributors:
            contributor_ids = json.loads(document.contributors)
            for contributor_id in contributor_ids:
                if contributor_id != comment.author_id:
                    NotificationManager.create_notification(
                        user_id=contributor_id,
                        title=f'Nowy komentarz do "{document.title}"',
                        message=f'{comment.author.full_name or comment.author.username} dodał komentarz',
                        notification_type='comment_added',
                        related_object_type='comment',
                        related_object_id=comment.id,
                        action_url=f'/document/{document.slug}#comment-{comment.id}'
                    )
    
    @staticmethod
    def notify_review_assignment(review_assignment):
        """Notify about review assignment"""
        NotificationManager.create_notification(
            user_id=review_assignment.reviewer_id,
            title=f'Przydzielono recenzję dokumentu',
            message=f'Zostałeś przydzielony do recenzji "{review_assignment.document.title}"',
            notification_type='review_assigned',
            related_object_type='review',
            related_object_id=review_assignment.id,
            action_url=f'/review/{review_assignment.id}'
        )

# Continue in next part due to length...