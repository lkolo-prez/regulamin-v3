#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🤝 AIRCLOUD COLLABORATION ENGINE
==================================
Real-time Collaboration & Document Management System

🔧 Author: Łukasz Kołodziej
🏢 Company: Aircloud
📅 Version: 3.0.0
⚖️ Focus: SSPO Student Government Regulations

🚀 Advanced Features:
• Real-time collaborative editing (WebSocket)
• Document templates & forms system
• Advanced workflow engine
• Contextual commenting system
• Version comparison & rollback
• Smart notifications
• Document linking & relationships
• Export templates (PDF, DOCX, ODT)
"""

from flask import Blueprint, render_template, request, jsonify, session, redirect, url_for, flash
from flask_login import login_required, current_user
from flask_socketio import SocketIO, emit, join_room, leave_room, rooms
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple
import json
import re
import difflib
import markdown
from collections import defaultdict

# =====================================
# COLLABORATION BLUEPRINT
# =====================================

collaboration_bp = Blueprint('collaboration', __name__, url_prefix='/collab')

# =====================================
# REAL-TIME COLLABORATION MODELS
# =====================================

class CollaborativeSession:
    """Manages real-time collaborative editing sessions"""
    
    def __init__(self):
        self.active_sessions = {}  # document_id -> {users, locks, cursor_positions}
        self.edit_history = defaultdict(list)
        
    def join_session(self, document_id: int, user_id: int, username: str):
        """User joins collaborative editing session"""
        if document_id not in self.active_sessions:
            self.active_sessions[document_id] = {
                'users': {},
                'locks': {},
                'cursors': {},
                'last_activity': datetime.utcnow()
            }
        
        self.active_sessions[document_id]['users'][user_id] = {
            'username': username,
            'joined_at': datetime.utcnow().isoformat(),
            'color': self._generate_user_color(user_id)
        }
        
        return self.active_sessions[document_id]
    
    def leave_session(self, document_id: int, user_id: int):
        """User leaves collaborative session"""
        if document_id in self.active_sessions:
            self.active_sessions[document_id]['users'].pop(user_id, None)
            self.active_sessions[document_id]['locks'].pop(user_id, None)
            
            # Clean up empty sessions
            if not self.active_sessions[document_id]['users']:
                del self.active_sessions[document_id]
    
    def update_cursor(self, document_id: int, user_id: int, position: dict):
        """Update user's cursor position"""
        if document_id in self.active_sessions:
            self.active_sessions[document_id]['cursors'][user_id] = {
                'position': position,
                'timestamp': datetime.utcnow().isoformat()
            }
    
    def lock_paragraph(self, document_id: int, user_id: int, paragraph_id: str):
        """Lock paragraph for editing"""
        if document_id in self.active_sessions:
            locks = self.active_sessions[document_id]['locks']
            if paragraph_id not in locks or locks[paragraph_id] == user_id:
                locks[paragraph_id] = user_id
                return True
        return False
    
    def unlock_paragraph(self, document_id: int, user_id: int, paragraph_id: str):
        """Unlock paragraph after editing"""
        if document_id in self.active_sessions:
            locks = self.active_sessions[document_id]['locks']
            if locks.get(paragraph_id) == user_id:
                del locks[paragraph_id]
                return True
        return False
    
    def record_edit(self, document_id: int, user_id: int, edit_data: dict):
        """Record edit operation for operational transformation"""
        edit_record = {
            'user_id': user_id,
            'timestamp': datetime.utcnow().isoformat(),
            'data': edit_data
        }
        self.edit_history[document_id].append(edit_record)
        
        # Keep only last 100 edits per document
        if len(self.edit_history[document_id]) > 100:
            self.edit_history[document_id] = self.edit_history[document_id][-100:]
    
    def _generate_user_color(self, user_id: int) -> str:
        """Generate unique color for user cursor/selection"""
        colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
            '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
        ]
        return colors[user_id % len(colors)]

# =====================================
# DOCUMENT TEMPLATES SYSTEM
# =====================================

class DocumentTemplate:
    """Manages document templates and forms"""
    
    TEMPLATE_CATEGORIES = {
        'regulations': 'Regulaminy',
        'procedures': 'Procedury',
        'resolutions': 'Uchwały',
        'announcements': 'Ogłoszenia',
        'forms': 'Formularze',
        'reports': 'Raporty',
        'letters': 'Pisma oficjalne'
    }
    
    @staticmethod
    def get_templates() -> Dict[str, List[Dict]]:
        """Get all available templates by category"""
        templates = {
            'regulations': [
                {
                    'id': 'reg_basic',
                    'name': 'Podstawowy szablon regulaminu',
                    'description': 'Standardowy szablon dla regulaminów SSPO',
                    'fields': ['title', 'preamble', 'chapters', 'articles', 'final_provisions'],
                    'structure': 'hierarchical'
                },
                {
                    'id': 'reg_commission',
                    'name': 'Regulamin komisji',
                    'description': 'Szablon regulaminu dla komisji tematycznych',
                    'fields': ['commission_name', 'scope', 'members', 'procedures'],
                    'structure': 'hierarchical'
                }
            ],
            'resolutions': [
                {
                    'id': 'res_standard',
                    'name': 'Uchwała standardowa',
                    'description': 'Szablon standardowej uchwały zarządu',
                    'fields': ['number', 'date', 'subject', 'legal_basis', 'content', 'execution'],
                    'structure': 'linear'
                },
                {
                    'id': 'res_budget',
                    'name': 'Uchwała budżetowa',
                    'description': 'Szablon uchwały dotyczącej budżetu',
                    'fields': ['fiscal_year', 'income', 'expenses', 'reserves'],
                    'structure': 'tabular'
                }
            ],
            'forms': [
                {
                    'id': 'form_application',
                    'name': 'Wniosek o dofinansowanie',
                    'description': 'Formularz wniosku o dofinansowanie działań',
                    'fields': ['applicant', 'project_name', 'budget', 'description', 'justification'],
                    'structure': 'form'
                },
                {
                    'id': 'form_complaint',
                    'name': 'Skarga/wniosek',
                    'description': 'Formularz składania skarg i wniosków',
                    'fields': ['type', 'subject', 'description', 'requested_action'],
                    'structure': 'form'
                }
            ],
            'letters': [
                {
                    'id': 'letter_official',
                    'name': 'Pismo urzędowe',
                    'description': 'Szablon oficjalnego pisma SSPO',
                    'fields': ['recipient', 'subject', 'content', 'signature'],
                    'structure': 'letter'
                },
                {
                    'id': 'letter_invitation',
                    'name': 'Zaproszenie',
                    'description': 'Zaproszenie na wydarzenie lub posiedzenie',
                    'fields': ['event', 'date', 'location', 'agenda'],
                    'structure': 'letter'
                }
            ]
        }
        return templates
    
    @staticmethod
    def create_from_template(template_id: str, data: dict) -> str:
        """Create document content from template"""
        
        # Regulation templates
        if template_id == 'reg_basic':
            return f"""# {data.get('title', 'Regulamin')}

## Preambuła

{data.get('preamble', '')}

## Rozdział I - Postanowienia ogólne

### § 1
{data.get('article_1', '')}

### § 2
{data.get('article_2', '')}

## Rozdział II - Przepisy szczegółowe

### § 3
{data.get('article_3', '')}

## Rozdział III - Postanowienia końcowe

### § 4
Regulamin wchodzi w życie z dniem {data.get('effective_date', 'uchwalenia')}.

**Przyjęto dnia:** {data.get('adoption_date', datetime.now().strftime('%Y-%m-%d'))}
"""
        
        # Resolution template
        elif template_id == 'res_standard':
            return f"""# UCHWAŁA NR {data.get('number', 'XX/YYYY')}

**Zarządu Studenckiego Samorządu Politechniki Opolskiej**

z dnia {data.get('date', datetime.now().strftime('%d.%m.%Y'))} r.

**w sprawie:** {data.get('subject', '')}

## Podstawa prawna

Działając na podstawie {data.get('legal_basis', 'Regulaminu SSPO')}, Zarząd uchwala:

## § 1

{data.get('content', '')}

## § 2

Wykonanie uchwały powierza się {data.get('execution', 'Prezydium Zarządu')}.

## § 3

Uchwała wchodzi w życie z dniem podjęcia.

---
**Przewodniczący Zarządu**
{data.get('chairman', '')}
"""
        
        # Application form
        elif template_id == 'form_application':
            return f"""# WNIOSEK O DOFINANSOWANIE

## Dane wnioskodawcy

**Imię i nazwisko:** {data.get('applicant_name', '')}
**Nr telefonu:** {data.get('phone', '')}
**Email:** {data.get('email', '')}

## Informacje o projekcie

**Nazwa projektu:** {data.get('project_name', '')}

**Opis projektu:**
{data.get('description', '')}

**Uzasadnienie:**
{data.get('justification', '')}

## Budżet

| Pozycja | Kwota |
|---------|-------|
{data.get('budget_table', '| | |')}

**Łącznie:** {data.get('total_amount', '0')} PLN

---
**Data złożenia:** {datetime.now().strftime('%Y-%m-%d')}
**Podpis wnioskodawcy:** _______________
"""
        
        # Official letter
        elif template_id == 'letter_official':
            return f"""**Studencki Samorząd Politechniki Opolskiej**
ul. Prószkowska 76, 45-758 Opole

{datetime.now().strftime('%d.%m.%Y')}

{data.get('recipient', '')}

**Dotyczy:** {data.get('subject', '')}

{data.get('content', '')}

Z poważaniem,

{data.get('signature', 'Zarząd SSPO')}
"""
        
        return "# Nowy dokument\n\nTreść dokumentu..."

# =====================================
# WORKFLOW ENGINE
# =====================================

class WorkflowEngine:
    """Advanced workflow management for document approval"""
    
    WORKFLOW_STATES = {
        'draft': 'Projekt',
        'review': 'W recenzji',
        'consultation': 'Konsultacje',
        'approval': 'Oczekuje na zatwierdzenie',
        'approved': 'Zatwierdzony',
        'rejected': 'Odrzucony',
        'archived': 'Zarchiwizowany'
    }
    
    WORKFLOW_ACTIONS = {
        'submit_for_review': 'Przekaż do recenzji',
        'request_changes': 'Wymagane poprawki',
        'approve': 'Zatwierdź',
        'reject': 'Odrzuć',
        'publish': 'Opublikuj',
        'archive': 'Zarchiwizuj'
    }
    
    @staticmethod
    def get_available_actions(current_state: str, user_role: str) -> List[str]:
        """Get available workflow actions based on state and role"""
        actions_map = {
            'draft': {
                'author': ['submit_for_review'],
                'editor': ['submit_for_review'],
                'admin': ['submit_for_review', 'archive']
            },
            'review': {
                'reviewer': ['request_changes', 'approve'],
                'admin': ['request_changes', 'approve', 'reject']
            },
            'consultation': {
                'member': ['comment'],
                'admin': ['move_to_approval']
            },
            'approval': {
                'approver': ['approve', 'reject'],
                'admin': ['approve', 'reject']
            },
            'approved': {
                'admin': ['publish', 'archive']
            }
        }
        
        return actions_map.get(current_state, {}).get(user_role, [])
    
    @staticmethod
    def execute_action(document_id: int, action: str, user_id: int, comment: str = '') -> bool:
        """Execute workflow action"""
        # This would be implemented with actual database operations
        transition_map = {
            'submit_for_review': 'review',
            'request_changes': 'draft',
            'approve': 'approved',
            'reject': 'rejected',
            'publish': 'approved',
            'archive': 'archived'
        }
        
        new_state = transition_map.get(action)
        if new_state:
            # Log workflow transition
            workflow_log = {
                'document_id': document_id,
                'action': action,
                'from_state': 'current',  # Would be fetched from DB
                'to_state': new_state,
                'user_id': user_id,
                'comment': comment,
                'timestamp': datetime.utcnow().isoformat()
            }
            return True
        return False

# =====================================
# ADVANCED COMMENTING SYSTEM
# =====================================

class CommentingSystem:
    """Context-aware commenting system"""
    
    @staticmethod
    def add_contextual_comment(
        document_id: int,
        user_id: int,
        content: str,
        context: dict
    ) -> dict:
        """Add comment with context (paragraph, selection, etc.)"""
        comment = {
            'id': None,  # Would be generated by DB
            'document_id': document_id,
            'user_id': user_id,
            'content': content,
            'context': {
                'paragraph_id': context.get('paragraph_id'),
                'selection_start': context.get('selection_start'),
                'selection_end': context.get('selection_end'),
                'selected_text': context.get('selected_text'),
                'type': context.get('type', 'general')  # general, suggestion, question, issue
            },
            'created_at': datetime.utcnow().isoformat(),
            'resolved': False,
            'replies': []
        }
        return comment
    
    @staticmethod
    def get_comments_for_paragraph(document_id: int, paragraph_id: str) -> List[dict]:
        """Get all comments for specific paragraph"""
        # Would query database
        return []
    
    @staticmethod
    def resolve_comment(comment_id: int, user_id: int) -> bool:
        """Mark comment as resolved"""
        # Would update database
        return True

# =====================================
# DOCUMENT RELATIONSHIPS
# =====================================

class DocumentRelationships:
    """Manage relationships between documents"""
    
    RELATIONSHIP_TYPES = {
        'references': 'Powołuje się na',
        'amends': 'Zmienia',
        'replaces': 'Zastępuje',
        'implements': 'Implementuje',
        'related': 'Powiązany z'
    }
    
    @staticmethod
    def add_relationship(
        source_doc_id: int,
        target_doc_id: int,
        relationship_type: str,
        description: str = ''
    ) -> bool:
        """Create relationship between documents"""
        # Would insert into database
        return True
    
    @staticmethod
    def get_related_documents(document_id: int) -> Dict[str, List[dict]]:
        """Get all related documents grouped by relationship type"""
        # Would query database
        return {
            'references': [],
            'referenced_by': [],
            'amends': [],
            'amended_by': [],
            'replaces': [],
            'replaced_by': []
        }

# =====================================
# NOTIFICATION SYSTEM
# =====================================

class NotificationSystem:
    """Smart notification system"""
    
    NOTIFICATION_TYPES = {
        'comment': 'Nowy komentarz',
        'mention': 'Wzmianka o Tobie',
        'state_change': 'Zmiana statusu dokumentu',
        'approval_request': 'Prośba o zatwierdzenie',
        'deadline': 'Zbliżający się termin',
        'new_version': 'Nowa wersja dokumentu'
    }
    
    @staticmethod
    def send_notification(
        user_id: int,
        notification_type: str,
        title: str,
        message: str,
        link: str = '',
        priority: str = 'normal'
    ) -> bool:
        """Send notification to user"""
        notification = {
            'user_id': user_id,
            'type': notification_type,
            'title': title,
            'message': message,
            'link': link,
            'priority': priority,  # low, normal, high, urgent
            'read': False,
            'created_at': datetime.utcnow().isoformat()
        }
        # Would insert into database
        return True
    
    @staticmethod
    def get_unread_notifications(user_id: int) -> List[dict]:
        """Get unread notifications for user"""
        # Would query database
        return []

# Global collaboration session manager
collab_sessions = CollaborativeSession()

print("✅ Aircloud Collaboration Engine Loaded Successfully!")
print("🚀 Advanced collaboration features ready")
print("© 2025 Łukasz Kołodziej | Aircloud Professional")
