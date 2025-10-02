#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🧪 AIRCLOUD COLLABORATION - COMPREHENSIVE TESTS
================================================
Tests for collaboration features

Author: Łukasz Kołodziej
Company: Aircloud
Version: 3.0.0
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_imports():
    """Test if all collaboration modules can be imported"""
    print("\n" + "="*60)
    print("🧪 TEST 1: Module Imports")
    print("="*60)
    
    try:
        from aircloud_collaboration_engine import (
            CollaborativeSession,
            DocumentTemplate,
            WorkflowEngine,
            CommentingSystem,
            DocumentRelationships,
            NotificationSystem
        )
        print("✅ aircloud_collaboration_engine imported successfully")
        return True
    except ImportError as e:
        print(f"❌ Failed to import: {e}")
        return False

def test_collaborative_session():
    """Test CollaborativeSession functionality"""
    print("\n" + "="*60)
    print("🧪 TEST 2: Collaborative Session")
    print("="*60)
    
    try:
        from aircloud_collaboration_engine import CollaborativeSession
        
        session = CollaborativeSession()
        
        # Test joining session
        session_data = session.join_session(1, 100, "test_user")
        assert 100 in session_data['users'], "User not added to session"
        print("✅ User joined session successfully")
        
        # Test cursor update
        session.update_cursor(1, 100, {'line': 5, 'ch': 10})
        assert 100 in session.active_sessions[1]['cursors'], "Cursor not updated"
        print("✅ Cursor updated successfully")
        
        # Test paragraph locking
        success = session.lock_paragraph(1, 100, 'para_1')
        assert success, "Failed to lock paragraph"
        print("✅ Paragraph locked successfully")
        
        # Test unlocking
        success = session.unlock_paragraph(1, 100, 'para_1')
        assert success, "Failed to unlock paragraph"
        print("✅ Paragraph unlocked successfully")
        
        # Test leaving session
        session.leave_session(1, 100)
        assert 100 not in session.active_sessions.get(1, {}).get('users', {}), "User not removed"
        print("✅ User left session successfully")
        
        return True
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

def test_document_templates():
    """Test DocumentTemplate functionality"""
    print("\n" + "="*60)
    print("🧪 TEST 3: Document Templates")
    print("="*60)
    
    try:
        from aircloud_collaboration_engine import DocumentTemplate
        
        # Get all templates
        templates = DocumentTemplate.get_templates()
        assert len(templates) > 0, "No templates found"
        print(f"✅ Found {len(templates)} template categories")
        
        # Count total templates
        total = sum(len(cat) for cat in templates.values())
        print(f"✅ Total {total} templates available")
        
        # Test each category
        for category, tmpl_list in templates.items():
            print(f"   📁 {category}: {len(tmpl_list)} templates")
        
        # Test creating document from template
        test_data = {
            'title': 'Test Regulamin',
            'preamble': 'Na podstawie...',
            'article_1': 'Test content'
        }
        content = DocumentTemplate.create_from_template('reg_basic', test_data)
        assert 'Test Regulamin' in content, "Template generation failed"
        print("✅ Document created from template successfully")
        
        return True
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

def test_workflow_engine():
    """Test WorkflowEngine functionality"""
    print("\n" + "="*60)
    print("🧪 TEST 4: Workflow Engine")
    print("="*60)
    
    try:
        from aircloud_collaboration_engine import WorkflowEngine
        
        # Test workflow states
        states = WorkflowEngine.WORKFLOW_STATES
        assert len(states) > 0, "No workflow states defined"
        print(f"✅ {len(states)} workflow states defined")
        
        for state, name in states.items():
            print(f"   📋 {state}: {name}")
        
        # Test actions
        actions = WorkflowEngine.WORKFLOW_ACTIONS
        print(f"✅ {len(actions)} workflow actions available")
        
        # Test available actions for different roles
        available = WorkflowEngine.get_available_actions('draft', 'author')
        assert isinstance(available, list), "Failed to get available actions"
        print(f"✅ Author in draft state has {len(available)} actions available")
        
        return True
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

def test_commenting_system():
    """Test CommentingSystem functionality"""
    print("\n" + "="*60)
    print("🧪 TEST 5: Commenting System")
    print("="*60)
    
    try:
        from aircloud_collaboration_engine import CommentingSystem
        
        # Test adding comment
        comment = CommentingSystem.add_contextual_comment(
            document_id=1,
            user_id=100,
            content="Test comment",
            context={
                'paragraph_id': 'para_1',
                'selected_text': 'test text',
                'type': 'suggestion'
            }
        )
        assert comment is not None, "Failed to add comment"
        assert comment['content'] == "Test comment", "Comment content mismatch"
        print("✅ Contextual comment added successfully")
        print(f"   💬 Comment type: {comment['context']['type']}")
        print(f"   📍 Context: {comment['context']['paragraph_id']}")
        
        return True
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

def test_document_relationships():
    """Test DocumentRelationships functionality"""
    print("\n" + "="*60)
    print("🧪 TEST 6: Document Relationships")
    print("="*60)
    
    try:
        from aircloud_collaboration_engine import DocumentRelationships
        
        # Test relationship types
        rel_types = DocumentRelationships.RELATIONSHIP_TYPES
        assert len(rel_types) > 0, "No relationship types defined"
        print(f"✅ {len(rel_types)} relationship types available")
        
        for key, name in rel_types.items():
            print(f"   🔗 {key}: {name}")
        
        # Test adding relationship
        success = DocumentRelationships.add_relationship(
            source_doc_id=1,
            target_doc_id=2,
            relationship_type='references',
            description='Test reference'
        )
        assert success, "Failed to add relationship"
        print("✅ Document relationship added successfully")
        
        return True
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

def test_notification_system():
    """Test NotificationSystem functionality"""
    print("\n" + "="*60)
    print("🧪 TEST 7: Notification System")
    print("="*60)
    
    try:
        from aircloud_collaboration_engine import NotificationSystem
        
        # Test notification types
        notif_types = NotificationSystem.NOTIFICATION_TYPES
        assert len(notif_types) > 0, "No notification types defined"
        print(f"✅ {len(notif_types)} notification types available")
        
        for key, name in notif_types.items():
            print(f"   🔔 {key}: {name}")
        
        # Test sending notification
        success = NotificationSystem.send_notification(
            user_id=100,
            notification_type='comment',
            title='Test notification',
            message='This is a test',
            priority='normal'
        )
        assert success, "Failed to send notification"
        print("✅ Notification sent successfully")
        
        return True
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

def test_flask_routes():
    """Test if Flask routes can be imported"""
    print("\n" + "="*60)
    print("🧪 TEST 8: Flask Routes")
    print("="*60)
    
    try:
        from aircloud_collaboration_routes import collab_routes
        print("✅ Collaboration routes blueprint imported")
        
        # Count registered routes
        rules = list(collab_routes.url_map.iter_rules())
        print(f"✅ {len(rules)} routes registered in blueprint")
        
        return True
    except ImportError as e:
        print(f"❌ Failed to import routes: {e}")
        return False

def run_all_tests():
    """Run all tests and print summary"""
    print("\n" + "="*60)
    print("🚀 AIRCLOUD COLLABORATION - TEST SUITE")
    print("="*60)
    print("Author: Łukasz Kołodziej")
    print("Company: Aircloud")
    print("Version: 3.0.0")
    
    tests = [
        ("Module Imports", test_imports),
        ("Collaborative Session", test_collaborative_session),
        ("Document Templates", test_document_templates),
        ("Workflow Engine", test_workflow_engine),
        ("Commenting System", test_commenting_system),
        ("Document Relationships", test_document_relationships),
        ("Notification System", test_notification_system),
        ("Flask Routes", test_flask_routes),
    ]
    
    results = []
    for name, test_func in tests:
        try:
            result = test_func()
            results.append((name, result))
        except Exception as e:
            print(f"\n❌ {name} crashed: {e}")
            results.append((name, False))
    
    # Print summary
    print("\n" + "="*60)
    print("📊 TEST SUMMARY")
    print("="*60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{status}: {name}")
    
    print("\n" + "="*60)
    print(f"📈 Results: {passed}/{total} tests passed ({passed*100//total}%)")
    print("="*60)
    
    if passed == total:
        print("\n🎉 All tests passed! Collaboration features ready to use!")
    else:
        print(f"\n⚠️  {total-passed} test(s) failed. Please check the output above.")
    
    return passed == total

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
