"""
🌟 AIRCLOUD LEGAL PLATFORM - EXTENDED ROUTES
=============================================
Dodatkowe endpointy i funkcjonalności dla zaawansowanych funkcji

Features:
• Document export (PDF, DOCX)
• Legal templates generator
• Advanced analytics
• Document comparison
• Compliance analysis
• Real-time collaboration
• Workflow automation

Author: Łukasz Kołodziej | Aircloud
Version: 2.1.0 Extended
"""

from flask import Blueprint, request, jsonify, send_file, render_template, flash, redirect, url_for
from flask_login import login_required, current_user
from aircloud_advanced_features import AircloudAdvancedFeatures, AircloudNotificationSystem
import io
import json
from datetime import datetime

# Create Blueprint for extended features
extended_bp = Blueprint('extended', __name__, url_prefix='/extended')

@extended_bp.route('/export/<slug>/pdf')
@login_required
def export_document_pdf(slug):
    """Eksport dokumentu do PDF"""
    from aircloud_legal_platform import Document
    
    document = Document.query.filter_by(slug=slug).first_or_404()
    
    # Check permissions
    if document.legal_system.owner_id != current_user.id and current_user.role not in ['admin', 'editor']:
        flash('Brak uprawnień do eksportu tego dokumentu', 'error')
        return redirect(url_for('document_view', slug=slug))
    
    try:
        pdf_buffer = AircloudAdvancedFeatures.export_document_to_pdf(document)
        
        filename = f"{document.slug}_{datetime.now().strftime('%Y%m%d')}.pdf"
        
        return send_file(
            pdf_buffer,
            as_attachment=True,
            download_name=filename,
            mimetype='application/pdf'
        )
    except Exception as e:
        flash(f'Błąd podczas eksportu PDF: {str(e)}', 'error')
        return redirect(url_for('document_view', slug=slug))

@extended_bp.route('/export/<slug>/docx')
@login_required
def export_document_docx(slug):
    """Eksport dokumentu do DOCX"""
    from aircloud_legal_platform import Document
    
    document = Document.query.filter_by(slug=slug).first_or_404()
    
    # Check permissions
    if document.legal_system.owner_id != current_user.id and current_user.role not in ['admin', 'editor']:
        flash('Brak uprawnień do eksportu tego dokumentu', 'error')
        return redirect(url_for('document_view', slug=slug))
    
    try:
        docx_buffer = AircloudAdvancedFeatures.export_document_to_docx(document)
        
        filename = f"{document.slug}_{datetime.now().strftime('%Y%m%d')}.docx"
        
        return send_file(
            docx_buffer,
            as_attachment=True,
            download_name=filename,
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
    except Exception as e:
        flash(f'Błąd podczas eksportu DOCX: {str(e)}', 'error')
        return redirect(url_for('document_view', slug=slug))

@extended_bp.route('/templates')
@login_required
def template_gallery():
    """Galeria szablonów prawnych"""
    templates = [
        {
            'id': 'regulamin',
            'name': 'Regulamin organizacji',
            'description': 'Szablon regulaminu dla organizacji, stowarzyszeń, firm',
            'category': 'Governance',
            'icon': 'fas fa-gavel'
        },
        {
            'id': 'umowa',
            'name': 'Umowa o współpracy',
            'description': 'Uniwersalny szablon umowy współpracy',
            'category': 'Contracts',
            'icon': 'fas fa-handshake'
        },
        {
            'id': 'procedura',
            'name': 'Procedura organizacyjna',
            'description': 'Szablon procedury wewnętrznej organizacji',
            'category': 'Procedures',
            'icon': 'fas fa-clipboard-list'
        }
    ]
    
    return render_template('extended/templates.html', templates=templates)

@extended_bp.route('/templates/<template_id>/generate', methods=['POST'])
@login_required
def generate_template(template_id):
    """Generuje dokument z szablonu"""
    from aircloud_legal_platform import Document, LegalSystem, db
    
    data = request.get_json()
    
    organization = data.get('organization', 'Nazwa Organizacji')
    system_name = data.get('system_name', 'System Prawny')
    legal_system_id = data.get('legal_system_id')
    
    if not legal_system_id:
        return jsonify({'error': 'Brak ID systemu prawnego'}), 400
    
    legal_system = LegalSystem.query.get_or_404(legal_system_id)
    
    # Check permissions
    if legal_system.owner_id != current_user.id and current_user.role not in ['admin', 'editor']:
        return jsonify({'error': 'Brak uprawnień'}), 403
    
    try:
        content = AircloudAdvancedFeatures.generate_legal_template(
            template_id, system_name, organization
        )
        
        # Create new document
        new_document = Document(
            title=f"{organization} - {template_id.title()}",
            slug=f"{organization.lower().replace(' ', '-')}-{template_id}-{datetime.now().strftime('%Y%m%d')}",
            content_markdown=content,
            document_type=template_id,
            legal_system_id=legal_system_id,
            author_id=current_user.id,
            status='draft',
            hierarchy_level=1
        )
        
        db.session.add(new_document)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'document_id': new_document.id,
            'document_slug': new_document.slug,
            'redirect_url': url_for('document_view', slug=new_document.slug)
        })
        
    except Exception as e:
        return jsonify({'error': f'Błąd generowania szablonu: {str(e)}'}), 500

@extended_bp.route('/analytics/<slug>')
@login_required
def document_analytics(slug):
    """Zaawansowana analityka dokumentu"""
    from aircloud_legal_platform import Document
    
    document = Document.query.filter_by(slug=slug).first_or_404()
    
    # Check permissions
    if document.legal_system.owner_id != current_user.id and current_user.role not in ['admin', 'editor']:
        flash('Brak uprawnień do analizy tego dokumentu', 'error')
        return redirect(url_for('document_view', slug=slug))
    
    analytics = AircloudAdvancedFeatures.generate_document_analytics(document)
    compliance = AircloudAdvancedFeatures.analyze_document_compliance(document)
    
    return render_template('extended/analytics.html', 
                         document=document, 
                         analytics=analytics,
                         compliance=compliance)

@extended_bp.route('/api/compare', methods=['POST'])
@login_required
def compare_documents():
    """Porównanie dwóch dokumentów"""
    from aircloud_legal_platform import Document
    import difflib
    
    data = request.get_json()
    doc1_slug = data.get('document1')
    doc2_slug = data.get('document2')
    
    if not doc1_slug or not doc2_slug:
        return jsonify({'error': 'Brak wymaganych parametrów'}), 400
    
    doc1 = Document.query.filter_by(slug=doc1_slug).first_or_404()
    doc2 = Document.query.filter_by(slug=doc2_slug).first_or_404()
    
    # Check permissions for both documents
    def can_access(doc):
        return (doc.legal_system.owner_id == current_user.id or 
                current_user.role in ['admin', 'editor'] or
                doc.status == 'published')
    
    if not can_access(doc1) or not can_access(doc2):
        return jsonify({'error': 'Brak uprawnień do porównania dokumentów'}), 403
    
    # Generate diff
    text1 = doc1.content_markdown or ""
    text2 = doc2.content_markdown or ""
    
    differ = difflib.unified_diff(
        text1.splitlines(keepends=True),
        text2.splitlines(keepends=True),
        fromfile=doc1.title,
        tofile=doc2.title,
        lineterm=''
    )
    
    diff_result = list(differ)
    
    return jsonify({
        'success': True,
        'document1': {
            'title': doc1.title,
            'slug': doc1.slug,
            'word_count': len(text1.split())
        },
        'document2': {
            'title': doc2.title,
            'slug': doc2.slug,
            'word_count': len(text2.split())
        },
        'diff': diff_result,
        'similarity_score': difflib.SequenceMatcher(None, text1, text2).ratio() * 100
    })

@extended_bp.route('/workflow/<slug>')
@login_required
def document_workflow(slug):
    """Workflow dokumentu - zarządzanie statusem i zatwierdzeniami"""
    from aircloud_legal_platform import Document
    
    document = Document.query.filter_by(slug=slug).first_or_404()
    
    # Check permissions
    if document.legal_system.owner_id != current_user.id and current_user.role not in ['admin', 'editor']:
        flash('Brak uprawnień do zarządzania workflow tego dokumentu', 'error')
        return redirect(url_for('document_view', slug=slug))
    
    workflow_states = [
        {'id': 'draft', 'name': 'Szkic', 'description': 'Dokument w trakcie tworzenia'},
        {'id': 'review', 'name': 'Do przeglądu', 'description': 'Oczekuje na przegląd'},
        {'id': 'approved', 'name': 'Zatwierdzony', 'description': 'Zatwierdzony do publikacji'},
        {'id': 'published', 'name': 'Opublikowany', 'description': 'Aktywny dokument'},
        {'id': 'archived', 'name': 'Zarchiwizowany', 'description': 'Nieaktywny dokument'}
    ]
    
    return render_template('extended/workflow.html', 
                         document=document, 
                         workflow_states=workflow_states)

@extended_bp.route('/api/workflow/<slug>/update', methods=['POST'])
@login_required
def update_workflow_status(slug):
    """Aktualizuje status dokumentu w workflow"""
    from aircloud_legal_platform import Document, db
    
    document = Document.query.filter_by(slug=slug).first_or_404()
    
    # Check permissions
    if document.legal_system.owner_id != current_user.id and current_user.role not in ['admin', 'editor']:
        return jsonify({'error': 'Brak uprawnień'}), 403
    
    data = request.get_json()
    new_status = data.get('status')
    comment = data.get('comment', '')
    
    valid_statuses = ['draft', 'review', 'approved', 'published', 'archived']
    if new_status not in valid_statuses:
        return jsonify({'error': 'Nieprawidłowy status'}), 400
    
    old_status = document.status
    document.status = new_status
    document.updated_at = datetime.utcnow()
    
    db.session.commit()
    
    # Send notification
    AircloudNotificationSystem.create_notification(
        document.author_id,
        f"Status dokumentu '{document.title}' zmieniono z '{old_status}' na '{new_status}'",
        'workflow'
    )
    
    return jsonify({
        'success': True,
        'old_status': old_status,
        'new_status': new_status,
        'message': f'Status dokumentu zmieniony na: {new_status}'
    })

@extended_bp.route('/dashboard')
@login_required
def extended_dashboard():
    """Rozszerzony dashboard z analityką"""
    from aircloud_legal_platform import Document, LegalSystem, Comment
    
    # Get user's documents and systems
    if current_user.role == 'admin':
        documents = Document.query.all()
        systems = LegalSystem.query.all()
    else:
        systems = LegalSystem.query.filter_by(owner_id=current_user.id).all()
        system_ids = [s.id for s in systems]
        documents = Document.query.filter(Document.legal_system_id.in_(system_ids)).all()
    
    # Calculate statistics
    stats = {
        'total_documents': len(documents),
        'draft_documents': len([d for d in documents if d.status == 'draft']),
        'published_documents': len([d for d in documents if d.status == 'published']),
        'total_systems': len(systems),
        'total_words': sum([len((d.content_markdown or '').split()) for d in documents]),
        'avg_readability': sum([AircloudAdvancedFeatures._calculate_readability(d.content_markdown or '') for d in documents]) / len(documents) if documents else 0
    }
    
    # Recent activity
    recent_documents = sorted(documents, key=lambda x: x.updated_at, reverse=True)[:5]
    
    return render_template('extended/dashboard.html', 
                         stats=stats,
                         recent_documents=recent_documents,
                         systems=systems)

print("✅ Aircloud Extended Routes Module Loaded!")
print("🚀 Advanced features endpoints ready for integration")