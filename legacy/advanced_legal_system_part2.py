# Continue advanced_legal_system.py - PART 2

# =====================================
# AUDIT AND LOGGING SYSTEM
# =====================================

class AuditLogger:
    """Comprehensive audit logging system"""
    
    @staticmethod
    def log_action(action, resource_type, resource_id, user_id=None, 
                   old_values=None, new_values=None, change_summary=None):
        """Log user action for audit trail"""
        
        audit_entry = AuditLog(
            user_id=user_id or (current_user.id if current_user.is_authenticated else None),
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            old_values=json.dumps(old_values) if old_values else None,
            new_values=json.dumps(new_values) if new_values else None,
            change_summary=change_summary,
            ip_address=request.remote_addr if request else None,
            user_agent=request.headers.get('User-Agent') if request else None,
            session_id=session.get('session_id') if session else None
        )
        
        db.session.add(audit_entry)
        db.session.commit()
        
        return audit_entry

# =====================================
# DOCUMENT VERSION CONTROL
# =====================================

class DocumentVersionManager:
    """Advanced document versioning and diff system"""
    
    @staticmethod
    def create_revision(document, change_summary=None, change_type='minor'):
        """Create a new document revision"""
        
        # Get current revision number
        last_revision = DocumentRevision.query.filter_by(
            document_id=document.id
        ).order_by(DocumentRevision.revision_number.desc()).first()
        
        revision_number = (last_revision.revision_number + 1) if last_revision else 1
        
        # Create revision
        revision = DocumentRevision(
            document_id=document.id,
            revision_number=revision_number,
            title=document.title,
            content=document.content,
            content_markdown=document.content_markdown,
            change_summary=change_summary,
            change_type=change_type,
            author_id=current_user.id if current_user.is_authenticated else document.author_id,
            word_count=len((document.content_markdown or document.content or '').split()),
            content_hash=hashlib.md5((document.content_markdown or '').encode()).hexdigest()
        )
        
        # Calculate changes if there's a previous version
        if last_revision:
            old_content = last_revision.content_markdown or last_revision.content or ''
            new_content = document.content_markdown or document.content or ''
            
            # Calculate word count difference
            old_words = len(old_content.split())
            new_words = len(new_content.split())
            revision.changes_word_count = new_words - old_words
            
            # Analyze changed sections (simplified)
            changed_sections = DocumentVersionManager._find_changed_sections(old_content, new_content)
            revision.changed_sections = json.dumps(changed_sections)
        
        db.session.add(revision)
        db.session.commit()
        
        # Update document version
        if change_type == 'major':
            document.major_version += 1
            document.minor_version = 0
        else:
            document.minor_version += 1
        
        document.version = f"{document.major_version}.{document.minor_version}"
        document.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return revision
    
    @staticmethod
    def _find_changed_sections(old_content, new_content):
        """Find changed sections between versions"""
        old_sections = re.split(r'\n#+\s+', old_content)
        new_sections = re.split(r'\n#+\s+', new_content)
        
        changed = []
        
        # Simple diff of sections
        for i, (old_section, new_section) in enumerate(zip(old_sections, new_sections)):
            if old_section != new_section:
                section_title = new_section.split('\n')[0] if '\n' in new_section else f"Section {i+1}"
                changed.append({
                    'section': section_title,
                    'change_type': 'modified',
                    'section_number': i + 1
                })
        
        # Handle added sections
        if len(new_sections) > len(old_sections):
            for i in range(len(old_sections), len(new_sections)):
                section_title = new_sections[i].split('\n')[0] if '\n' in new_sections[i] else f"Section {i+1}"
                changed.append({
                    'section': section_title,
                    'change_type': 'added',
                    'section_number': i + 1
                })
        
        # Handle removed sections
        if len(old_sections) > len(new_sections):
            for i in range(len(new_sections), len(old_sections)):
                section_title = old_sections[i].split('\n')[0] if '\n' in old_sections[i] else f"Section {i+1}"
                changed.append({
                    'section': section_title,
                    'change_type': 'removed',
                    'section_number': i + 1
                })
        
        return changed
    
    @staticmethod
    def get_diff_html(document_id, revision1_id, revision2_id=None):
        """Generate HTML diff between two revisions"""
        
        revision1 = DocumentRevision.query.get_or_404(revision1_id)
        
        if revision2_id:
            revision2 = DocumentRevision.query.get_or_404(revision2_id)
        else:
            # Compare with current version
            document = Document.query.get_or_404(document_id)
            revision2_content = document.content_markdown or document.content or ''
            revision2_title = f"Current Version ({document.version})"
        
        content1 = revision1.content_markdown or revision1.content or ''
        content2 = revision2.content_markdown if 'revision2' in locals() else revision2_content
        
        # Generate diff using difflib
        diff = list(difflib.unified_diff(
            content1.splitlines(keepends=True),
            content2.splitlines(keepends=True),
            fromfile=f"Revision {revision1.revision_number}",
            tofile=revision2.title if 'revision2' in locals() else revision2_title,
            lineterm=''
        ))
        
        # Convert to HTML (simplified)
        html_diff = []
        for line in diff:
            if line.startswith('+++') or line.startswith('---'):
                html_diff.append(f'<div class="diff-header">{line}</div>')
            elif line.startswith('+'):
                html_diff.append(f'<div class="diff-added">{line}</div>')
            elif line.startswith('-'):
                html_diff.append(f'<div class="diff-removed">{line}</div>')
            elif line.startswith('@@'):
                html_diff.append(f'<div class="diff-location">{line}</div>')
            else:
                html_diff.append(f'<div class="diff-context">{line}</div>')
        
        return '\n'.join(html_diff)

# =====================================
# WORKFLOW ENGINE
# =====================================

class WorkflowEngine:
    """Document approval and workflow management"""
    
    WORKFLOW_STAGES = {
        'editing': 'Edycja',
        'internal_review': 'Przegląd wewnętrzny',
        'expert_review': 'Przegląd ekspercki',
        'legal_review': 'Przegląd prawny',
        'approval': 'Zatwierdzenie',
        'published': 'Opublikowane',
        'archived': 'Zarchiwizowane'
    }
    
    STAGE_TRANSITIONS = {
        'editing': ['internal_review', 'archived'],
        'internal_review': ['editing', 'expert_review', 'legal_review'],
        'expert_review': ['editing', 'legal_review', 'approval'],
        'legal_review': ['editing', 'approval'],
        'approval': ['published', 'editing'],
        'published': ['editing', 'archived'],
        'archived': ['editing']
    }
    
    @staticmethod
    def can_transition(document, target_stage):
        """Check if document can transition to target stage"""
        current_stage = document.workflow_stage
        allowed_transitions = WorkflowEngine.STAGE_TRANSITIONS.get(current_stage, [])
        return target_stage in allowed_transitions
    
    @staticmethod
    def transition_document(document, target_stage, user, notes=None):
        """Transition document to new workflow stage"""
        
        if not WorkflowEngine.can_transition(document, target_stage):
            return False, f"Cannot transition from {document.workflow_stage} to {target_stage}"
        
        # Check permissions
        if not WorkflowEngine._has_transition_permission(user, document.workflow_stage, target_stage):
            return False, "Insufficient permissions for this transition"
        
        old_stage = document.workflow_stage
        document.workflow_stage = target_stage
        
        # Handle specific transitions
        if target_stage == 'published':
            document.status = 'published'
            document.published_at = datetime.utcnow()
        elif target_stage == 'archived':
            document.status = 'archived'
        
        # Create audit log
        AuditLogger.log_action(
            action='workflow_transition',
            resource_type='document',
            resource_id=document.id,
            user_id=user.id,
            old_values={'workflow_stage': old_stage},
            new_values={'workflow_stage': target_stage},
            change_summary=f"Workflow transition: {old_stage} → {target_stage}" + (f" | Notes: {notes}" if notes else "")
        )
        
        # Send notifications
        WorkflowEngine._send_workflow_notifications(document, old_stage, target_stage, user)
        
        db.session.commit()
        return True, "Workflow transition successful"
    
    @staticmethod
    def _has_transition_permission(user, from_stage, to_stage):
        """Check if user has permission for specific transition"""
        if user.role == 'admin':
            return True
        
        permission_map = {
            ('editing', 'internal_review'): ['editor', 'author'],
            ('internal_review', 'expert_review'): ['editor'],
            ('expert_review', 'legal_review'): ['editor'],
            ('legal_review', 'approval'): ['legal_reviewer'],
            ('approval', 'published'): ['admin', 'publisher']
        }
        
        required_roles = permission_map.get((from_stage, to_stage), [])
        return user.role in required_roles or user.has_permission(f'workflow_{to_stage}')
    
    @staticmethod
    def _send_workflow_notifications(document, old_stage, new_stage, user):
        """Send notifications for workflow transitions"""
        
        # Notify document author
        if document.author_id != user.id:
            NotificationManager.create_notification(
                user_id=document.author_id,
                title=f'Zmiana statusu dokumentu "{document.title}"',
                message=f'Status zmieniony z "{WorkflowEngine.WORKFLOW_STAGES[old_stage]}" na "{WorkflowEngine.WORKFLOW_STAGES[new_stage]}"',
                notification_type='workflow_change',
                related_object_type='document',
                related_object_id=document.id,
                action_url=f'/document/{document.slug}'
            )
        
        # Notify based on new stage
        if new_stage in ['expert_review', 'legal_review']:
            # Find appropriate reviewers and notify them
            # This would query users with appropriate roles
            reviewers = User.query.filter_by(role=f'{new_stage.split("_")[0]}_reviewer').all()
            for reviewer in reviewers:
                NotificationManager.create_notification(
                    user_id=reviewer.id,
                    title=f'Dokument oczekuje na przegląd',
                    message=f'"{document.title}" oczekuje na przegląd typu: {WorkflowEngine.WORKFLOW_STAGES[new_stage]}',
                    notification_type='review_needed',
                    related_object_type='document',
                    related_object_id=document.id,
                    action_url=f'/document/{document.slug}/review'
                )

# =====================================
# ADVANCED ROUTES AND API
# =====================================

from flask import Blueprint

# Create blueprints for organized routing
auth_bp = Blueprint('auth', __name__)
api_bp = Blueprint('api', __name__, url_prefix='/api/v1')
admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

# Authentication routes
@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        data = request.get_json() if request.is_json else request.form
        
        # Enhanced validation
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'success': False, 'error': 'Użytkownik już istnieje'})
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'success': False, 'error': 'Email już używany'})
        
        # Create user with enhanced fields
        user = User(
            username=data['username'],
            email=data['email'],
            password_hash=generate_password_hash(data['password']),
            full_name=data.get('full_name', ''),
            title=data.get('title', ''),
            institution=data.get('institution', ''),
            department=data.get('department', ''),
            phone=data.get('phone', ''),
            bio=data.get('bio', ''),
            email_verification_token=str(uuid.uuid4())
        )
        
        db.session.add(user)
        db.session.commit()
        
        # Log registration
        AuditLogger.log_action('user_registered', 'user', user.id, user.id)
        
        login_user(user)
        
        if request.is_json:
            return jsonify({'success': True, 'redirect': url_for('index')})
        else:
            flash('Rejestracja zakończona sukcesem!', 'success')
            return redirect(url_for('index'))
    
    return render_template('auth/register.html')

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json() if request.is_json else request.form
        
        user = User.query.filter_by(username=data['username']).first()
        
        if user and check_password_hash(user.password_hash, data['password']):
            # Update login tracking
            user.last_login = datetime.utcnow()
            user.login_count += 1
            db.session.commit()
            
            login_user(user, remember=data.get('remember', False))
            
            # Log successful login
            AuditLogger.log_action('user_login', 'user', user.id, user.id)
            
            if request.is_json:
                return jsonify({'success': True, 'redirect': url_for('index')})
            else:
                flash('Zalogowano pomyślnie!', 'success')
                return redirect(url_for('index'))
        else:
            # Log failed login attempt
            if user:
                AuditLogger.log_action('login_failed', 'user', user.id)
            
            error = 'Nieprawidłowy login lub hasło'
            if request.is_json:
                return jsonify({'success': False, 'error': error})
            else:
                flash(error, 'error')
    
    return render_template('auth/login.html')

@auth_bp.route('/logout')
@login_required
def logout():
    # Log logout
    AuditLogger.log_action('user_logout', 'user', current_user.id, current_user.id)
    
    logout_user()
    flash('Wylogowano pomyślnie', 'info')
    return redirect(url_for('index'))

# API Routes
@api_bp.route('/documents', methods=['GET'])
def api_documents():
    """Enhanced document API with filtering and pagination"""
    
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    legal_system_id = request.args.get('legal_system_id', type=int)
    document_type = request.args.get('type')
    status = request.args.get('status')
    search = request.args.get('search')
    
    query = Document.query
    
    # Apply filters
    if legal_system_id:
        query = query.filter_by(legal_system_id=legal_system_id)
    if document_type:
        query = query.filter_by(document_type=document_type)
    if status:
        query = query.filter_by(status=status)
    if search:
        query = query.filter(Document.title.contains(search) | 
                           Document.content_markdown.contains(search))
    
    # Order by hierarchy and last updated
    query = query.order_by(Document.hierarchy_level, Document.updated_at.desc())
    
    # Paginate
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    documents = pagination.items
    
    return jsonify({
        'success': True,
        'documents': [{
            'id': doc.id,
            'title': doc.title,
            'slug': doc.slug,
            'document_type': doc.document_type,
            'hierarchy_level': doc.hierarchy_level,
            'status': doc.status,
            'version': doc.version,
            'author': doc.author.full_name or doc.author.username,
            'updated_at': doc.updated_at.isoformat(),
            'word_count': doc.word_count,
            'complexity_score': doc.complexity_score
        } for doc in documents],
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': pagination.total,
            'pages': pagination.pages,
            'has_next': pagination.has_next,
            'has_prev': pagination.has_prev
        }
    })

@api_bp.route('/documents/<slug>/analysis', methods=['GET'])
def api_document_analysis(slug):
    """Get detailed document analysis"""
    document = Document.query.filter_by(slug=slug).first_or_404()
    
    # Perform fresh analysis
    analysis = AdvancedLegalAnalysisEngine.analyze_document_advanced(document)
    
    # Update document with analysis results
    document.legal_concepts = json.dumps(analysis)
    document.complexity_score = analysis['complexity']
    document.readability_score = analysis['readability']
    db.session.commit()
    
    return jsonify({
        'success': True,
        'document_id': document.id,
        'analysis': analysis,
        'generated_at': datetime.utcnow().isoformat()
    })

@api_bp.route('/systems/<int:system_id>/consistency-check', methods=['POST'])
def api_system_consistency_check(system_id):
    """Perform comprehensive system consistency check"""
    legal_system = LegalSystem.query.get_or_404(system_id)
    
    # Run consistency check
    issues = AdvancedLegalAnalysisEngine.check_system_consistency(system_id)
    
    # Update system statistics
    legal_system.last_review_date = datetime.utcnow()
    db.session.commit()
    
    # Log the check
    AuditLogger.log_action(
        'consistency_check', 
        'legal_system', 
        system_id, 
        current_user.id if current_user.is_authenticated else None,
        change_summary=f"Found {len(issues)} consistency issues"
    )
    
    return jsonify({
        'success': True,
        'system_id': system_id,
        'issues_found': len(issues),
        'issues': issues,
        'severity_breakdown': {
            'high': len([i for i in issues if i.get('severity') == 'high']),
            'medium': len([i for i in issues if i.get('severity') == 'medium']),
            'low': len([i for i in issues if i.get('severity') == 'low'])
        },
        'checked_at': datetime.utcnow().isoformat()
    })

# Continue with more routes and main application setup...

if __name__ == '__main__':
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(api_bp)
    app.register_blueprint(admin_bp)
    
    with app.app_context():
        db.create_all()
        
        # Create sample data if database is empty
        if User.query.count() == 0:
            create_advanced_sample_data()
    
    print("""
🏛️ ADVANCED Legal Collaboration Platform v2.0
================================================
✅ Server starting on: http://localhost:5001
🔧 Advanced Features:
   • Complete workflow management
   • Advanced legal analysis engine  
   • Document versioning & diff
   • Notification system
   • Audit logging
   • Role-based permissions
   • Template system
   • API with filtering & pagination
   • Consistency checking
   • Cross-reference validation

🚀 Demo: admin / admin123
📊 Analytics dashboard
🔍 Advanced search & filtering
""")
    
    app.run(debug=True, host='0.0.0.0', port=5001)