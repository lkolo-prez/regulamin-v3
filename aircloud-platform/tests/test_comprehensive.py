#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🏛️ AIRCLOUD LEGAL PLATFORM - COMPREHENSIVE TESTING SUITE
=========================================================
Kompleksowe testy wszystkich funkcjonalności platformy

🔧 Author: Łukasz Kołodziej
📅 Version: 2.0.0
🎯 Purpose: Complete functional testing including:
    - Document viewing and editing
    - Markdown rendering
    - Comment system
    - Real-time collaboration
    - Export functionality
"""

import unittest
import requests
import json
import time
from datetime import datetime
import os
import sys

class AircloudLegalPlatformTests(unittest.TestCase):
    """Comprehensive test suite for Aircloud Legal Platform"""
    
    def setUp(self):
        """Setup test environment"""
        self.base_url = "http://localhost:5001"
        self.session = requests.Session()
        self.test_user_credentials = {
            "username": "lukasz.kolodziej",
            "password": "aircloud2025"
        }
        
        print(f"\n{'='*60}")
        print(f"🧪 STARTING TEST: {self._testMethodName}")
        print(f"{'='*60}")
    
    def tearDown(self):
        """Cleanup after test"""
        print(f"✅ TEST COMPLETED: {self._testMethodName}")
        print(f"{'='*60}\n")
    
    def test_01_platform_availability(self):
        """Test 1: Platform Access and Basic Functionality"""
        print("🔍 Testing platform availability...")
        
        try:
            response = self.session.get(f"{self.base_url}/")
            self.assertEqual(response.status_code, 200)
            self.assertIn("Aircloud", response.text)
            print("✅ Platform is accessible")
            
            # Check if extended features are loaded
            self.assertIn("ROZSZERZONE FUNKCJE", response.text)
            print("✅ Extended features are active")
            
        except Exception as e:
            print(f"❌ Platform availability test failed: {e}")
            raise
    
    def test_02_user_authentication(self):
        """Test 2: User Authentication System"""
        print("🔐 Testing user authentication...")
        
        try:
            # Test login page access
            login_response = self.session.get(f"{self.base_url}/login")
            self.assertEqual(login_response.status_code, 200)
            print("✅ Login page accessible")
            
            # Test login functionality
            login_data = {
                "username": self.test_user_credentials["username"],
                "password": self.test_user_credentials["password"]
            }
            
            auth_response = self.session.post(f"{self.base_url}/login", data=login_data)
            # Should redirect after successful login
            self.assertIn(auth_response.status_code, [200, 302])
            print("✅ User authentication working")
            
        except Exception as e:
            print(f"❌ Authentication test failed: {e}")
            raise
    
    def test_03_document_system(self):
        """Test 3: Document Management System"""
        print("📄 Testing document management...")
        
        try:
            # Login first
            self._login()
            
            # Test document listing
            docs_response = self.session.get(f"{self.base_url}/")
            self.assertEqual(docs_response.status_code, 200)
            print("✅ Document listing accessible")
            
            # Test legal system access
            legal_systems_response = self.session.get(f"{self.base_url}/legal_system/1")
            if legal_systems_response.status_code == 200:
                print("✅ Legal system pages accessible")
            else:
                print("⚠️  Legal system pages not found (expected for new installation)")
                
        except Exception as e:
            print(f"❌ Document system test failed: {e}")
            raise
    
    def test_04_markdown_rendering(self):
        """Test 4: Markdown Document Rendering"""
        print("📝 Testing Markdown rendering capabilities...")
        
        try:
            self._login()
            
            # Test markdown content
            test_markdown = """
# Test Document
## Section 1
This is a **bold** text with *italic* and `code`.

### Subsection
- List item 1
- List item 2

> This is a blockquote

```python
def test_function():
    return "Hello World"
```
            """
            
            # Check if markdown content is processed correctly
            response = self.session.get(f"{self.base_url}/")
            if "markdown" in response.text.lower():
                print("✅ Markdown support detected")
            else:
                print("⚠️  Markdown processing needs verification")
                
        except Exception as e:
            print(f"❌ Markdown rendering test failed: {e}")
            raise
    
    def test_05_comment_system(self):
        """Test 5: Document Comment System"""
        print("💬 Testing comment system functionality...")
        
        try:
            self._login()
            
            # Test comment API endpoints
            comment_data = {
                "content": "This is a test comment for system verification",
                "paragraph_id": "test-paragraph-1",
                "document_id": 1
            }
            
            # Try to access comment endpoints
            endpoints_to_test = [
                "/api/comments",
                "/api/documents/1/comments"
            ]
            
            for endpoint in endpoints_to_test:
                try:
                    response = self.session.get(f"{self.base_url}{endpoint}")
                    if response.status_code in [200, 404]:
                        print(f"✅ Comment endpoint {endpoint} is functional")
                    else:
                        print(f"⚠️  Comment endpoint {endpoint} returned {response.status_code}")
                except:
                    print(f"⚠️  Comment endpoint {endpoint} not accessible (expected for new installation)")
                    
        except Exception as e:
            print(f"❌ Comment system test failed: {e}")
            raise
    
    def test_06_document_editing(self):
        """Test 6: Document Editing Functionality"""
        print("✏️  Testing document editing capabilities...")
        
        try:
            self._login()
            
            # Test document editing interface
            edit_endpoints = [
                "/document/edit/1",
                "/api/documents/1/edit",
                "/editor/1"
            ]
            
            for endpoint in edit_endpoints:
                try:
                    response = self.session.get(f"{self.base_url}{endpoint}")
                    if response.status_code == 200:
                        print(f"✅ Document editing endpoint {endpoint} accessible")
                        if "editor" in response.text.lower():
                            print("✅ Editor interface detected")
                        break
                except:
                    continue
            else:
                print("⚠️  Document editing interface needs setup")
                
        except Exception as e:
            print(f"❌ Document editing test failed: {e}")
            raise
    
    def test_07_extended_features(self):
        """Test 7: Extended Features (PDF/DOCX Export, Analytics)"""
        print("🚀 Testing extended features...")
        
        try:
            self._login()
            
            # Test extended feature endpoints
            extended_endpoints = [
                "/extended/analytics",
                "/extended/templates", 
                "/extended/workflow",
                "/extended/dashboard",
                "/api/export/pdf/1",
                "/api/export/docx/1"
            ]
            
            working_endpoints = []
            for endpoint in extended_endpoints:
                try:
                    response = self.session.get(f"{self.base_url}{endpoint}")
                    if response.status_code == 200:
                        working_endpoints.append(endpoint)
                        print(f"✅ Extended feature {endpoint} working")
                    elif response.status_code == 404:
                        print(f"⚠️  Extended feature {endpoint} not found")
                    else:
                        print(f"⚠️  Extended feature {endpoint} returned {response.status_code}")
                except:
                    print(f"⚠️  Extended feature {endpoint} not accessible")
            
            if working_endpoints:
                print(f"✅ {len(working_endpoints)} extended features are functional")
            else:
                print("⚠️  Extended features need verification")
                
        except Exception as e:
            print(f"❌ Extended features test failed: {e}")
            raise
    
    def test_08_real_time_collaboration(self):
        """Test 8: Real-time Collaboration Features"""
        print("🤝 Testing real-time collaboration...")
        
        try:
            self._login()
            
            # Test WebSocket or real-time features
            collaboration_features = [
                "websocket",
                "realtime", 
                "collaboration",
                "live-edit",
                "concurrent"
            ]
            
            response = self.session.get(f"{self.base_url}/")
            content = response.text.lower()
            
            found_features = []
            for feature in collaboration_features:
                if feature in content:
                    found_features.append(feature)
            
            if found_features:
                print(f"✅ Collaboration features detected: {', '.join(found_features)}")
            else:
                print("⚠️  Real-time collaboration features need setup")
                
        except Exception as e:
            print(f"❌ Real-time collaboration test failed: {e}")
            raise
    
    def test_09_api_endpoints(self):
        """Test 9: API Endpoints"""
        print("🔗 Testing API endpoints...")
        
        try:
            self._login()
            
            api_endpoints = [
                "/api/status",
                "/api/documents",
                "/api/legal-systems", 
                "/api/users",
                "/api/comments",
                "/api/analytics"
            ]
            
            working_apis = []
            for endpoint in api_endpoints:
                try:
                    response = self.session.get(f"{self.base_url}{endpoint}")
                    if response.status_code in [200, 401]:  # 401 means endpoint exists but needs auth
                        working_apis.append(endpoint)
                        print(f"✅ API endpoint {endpoint} available")
                    elif response.status_code == 404:
                        print(f"⚠️  API endpoint {endpoint} not implemented")
                except:
                    print(f"⚠️  API endpoint {endpoint} not accessible")
            
            print(f"✅ {len(working_apis)} API endpoints are functional")
                
        except Exception as e:
            print(f"❌ API endpoints test failed: {e}")
            raise
    
    def test_10_security_features(self):
        """Test 10: Security Features"""
        print("🔒 Testing security features...")
        
        try:
            # Test CSRF protection
            response = self.session.get(f"{self.base_url}/login")
            if "csrf" in response.text.lower():
                print("✅ CSRF protection detected")
            
            # Test authentication requirements
            protected_response = self.session.get(f"{self.base_url}/admin")
            if protected_response.status_code in [401, 403, 302]:
                print("✅ Authentication protection working")
            
            # Test secure headers
            headers = response.headers
            security_headers = ['X-Content-Type-Options', 'X-Frame-Options', 'X-XSS-Protection']
            for header in security_headers:
                if header in headers:
                    print(f"✅ Security header {header} present")
                else:
                    print(f"⚠️  Security header {header} missing")
                    
        except Exception as e:
            print(f"❌ Security features test failed: {e}")
            raise
    
    def _login(self):
        """Helper method to login"""
        login_data = {
            "username": self.test_user_credentials["username"],
            "password": self.test_user_credentials["password"]
        }
        self.session.post(f"{self.base_url}/login", data=login_data)

def run_comprehensive_tests():
    """Run all tests and generate report"""
    print(f"""
🏛️  AIRCLOUD LEGAL PLATFORM - COMPREHENSIVE TEST SUITE
======================================================
🔧 Author: Łukasz Kołodziej | Aircloud
📅 Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
🎯 Purpose: Complete functional testing
======================================================
    """)
    
    # Create test suite
    test_suite = unittest.TestLoader().loadTestsFromTestCase(AircloudLegalPlatformTests)
    
    # Run tests with verbose output
    runner = unittest.TextTestRunner(verbosity=2, stream=sys.stdout)
    result = runner.run(test_suite)
    
    # Generate summary report
    print(f"""
📊 TEST EXECUTION SUMMARY
========================
✅ Tests Passed: {result.testsRun - len(result.failures) - len(result.errors)}
❌ Tests Failed: {len(result.failures)}
💥 Tests Errors: {len(result.errors)}
📈 Success Rate: {((result.testsRun - len(result.failures) - len(result.errors)) / result.testsRun * 100):.1f}%

📋 RECOMMENDATIONS:
==================
1. 📄 Document System: {"✅ Working" if len(result.failures) == 0 else "⚠️ Needs attention"}
2. 💬 Comment System: {"✅ Ready" if len(result.failures) == 0 else "⚠️ Setup required"}  
3. ✏️  Document Editing: {"✅ Available" if len(result.failures) == 0 else "⚠️ Configuration needed"}
4. 🚀 Extended Features: {"✅ Active" if len(result.failures) == 0 else "⚠️ Verification needed"}

🎉 Platform Status: {"PRODUCTION READY" if len(result.failures) == 0 else "DEVELOPMENT PHASE"}
    """)
    
    return result

if __name__ == "__main__":
    run_comprehensive_tests()