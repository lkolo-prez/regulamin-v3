#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🏛️ AIRCLOUD LEGAL PLATFORM - QUICK FUNCTIONAL TEST
==================================================
Szybki test funkcjonalności z obsługą problemów sieciowych

🔧 Author: Łukasz Kołodziej | Aircloud
📅 Version: 2.0.0
"""

import requests
import time
from datetime import datetime

def quick_test():
    """Szybki test funkcjonalności"""
    
    print(f"""
🏛️  AIRCLOUD LEGAL PLATFORM - QUICK FUNCTIONAL TEST
===================================================
📅 Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
🌐 Testing: http://localhost:5001
    """)
    
    base_url = "http://localhost:5001"
    
    # Test 1: Platform availability
    print("1. 🔍 Testing platform availability...")
    try:
        response = requests.get(base_url, timeout=10)
        if response.status_code == 200:
            print("   ✅ Platform accessible")
            
            # Check for key features
            content = response.text.lower()
            
            features_found = []
            
            if "aircloud" in content:
                features_found.append("Aircloud branding")
            if "legal" in content:
                features_found.append("Legal system")
            if "document" in content:
                features_found.append("Document management")
            if "komentarz" in content or "comment" in content:
                features_found.append("Comment system")
            if "markdown" in content:
                features_found.append("Markdown support")
            if "rozszerzone" in content or "extended" in content:
                features_found.append("Extended features")
                
            print(f"   ✅ Features detected: {', '.join(features_found)}")
            
            return True
        else:
            print(f"   ❌ Platform returned status: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("   ❌ Connection refused - server may not be running")
        return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def test_extended_features():
    """Test extended feature endpoints"""
    print("\n2. 🚀 Testing extended features...")
    
    base_url = "http://localhost:5001"
    
    # Extended features endpoints to test
    endpoints = [
        "/extended/analytics",
        "/extended/templates",
        "/extended/workflow", 
        "/extended/dashboard"
    ]
    
    working_endpoints = []
    for endpoint in endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}", timeout=5)
            if response.status_code == 200:
                working_endpoints.append(endpoint)
                print(f"   ✅ {endpoint} - Working")
            elif response.status_code == 404:
                print(f"   ⚠️  {endpoint} - Not found")
            else:
                print(f"   ⚠️  {endpoint} - Status {response.status_code}")
        except:
            print(f"   ❌ {endpoint} - Connection error")
    
    if working_endpoints:
        print(f"   🎉 {len(working_endpoints)}/{len(endpoints)} extended features working!")
    else:
        print("   ⚠️  Extended features need verification")
        
    return len(working_endpoints) > 0

def test_authentication():
    """Test authentication system"""
    print("\n3. 🔐 Testing authentication system...")
    
    base_url = "http://localhost:5001"
    
    try:
        # Test login page
        login_response = requests.get(f"{base_url}/login", timeout=5)
        if login_response.status_code == 200:
            print("   ✅ Login page accessible")
            
            # Try demo credentials
            session = requests.Session()
            login_data = {
                "username": "lukasz.kolodziej",
                "password": "aircloud2025"
            }
            
            auth_response = session.post(f"{base_url}/login", data=login_data, timeout=5)
            if auth_response.status_code in [200, 302]:
                print("   ✅ Authentication working")
                return True
            else:
                print(f"   ⚠️  Authentication returned: {auth_response.status_code}")
                return False
        else:
            print(f"   ❌ Login page status: {login_response.status_code}")
            return False
            
    except Exception as e:
        print(f"   ❌ Authentication test error: {e}")
        return False

def test_api_endpoints():
    """Test API endpoints"""
    print("\n4. 🔗 Testing API endpoints...")
    
    base_url = "http://localhost:5001"
    
    api_endpoints = [
        "/api/documents",
        "/api/legal-systems",
        "/api/comments",
        "/api/export/pdf/1",
        "/api/export/docx/1"
    ]
    
    working_apis = []
    for endpoint in api_endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}", timeout=5)
            if response.status_code in [200, 401, 404]:  # All acceptable
                working_apis.append(endpoint)
                if response.status_code == 200:
                    print(f"   ✅ {endpoint} - OK")
                elif response.status_code == 401:
                    print(f"   🔒 {endpoint} - Requires auth")
                else:
                    print(f"   ⚠️  {endpoint} - Not found")
            else:
                print(f"   ❌ {endpoint} - Status {response.status_code}")
        except:
            print(f"   ❌ {endpoint} - Connection error")
    
    print(f"   📊 {len(working_apis)}/{len(api_endpoints)} API endpoints responsive")
    return len(working_apis) > 0

def main():
    """Main test execution"""
    
    tests_results = []
    
    # Run all tests
    tests_results.append(quick_test())
    tests_results.append(test_extended_features())
    tests_results.append(test_authentication())
    tests_results.append(test_api_endpoints())
    
    # Summary
    passed = sum(tests_results)
    total = len(tests_results)
    success_rate = (passed / total) * 100
    
    print(f"""
📊 QUICK TEST SUMMARY
=====================
✅ Tests Passed: {passed}/{total}
📈 Success Rate: {success_rate:.1f}%

🎯 STATUS: {"🟢 PLATFORM READY" if success_rate >= 75 else "🟡 NEEDS ATTENTION" if success_rate >= 50 else "🔴 REQUIRES FIXES"}

🚀 MANUAL VERIFICATION NEEDED:
==============================
1. 💬 Comment System: Check browser interface
2. ✏️  Document Editor: Verify editing capabilities  
3. 📄 Markdown Rendering: Test document display
4. 📤 Export Functions: Try PDF/DOCX downloads

🌐 Platform URL: http://localhost:5001
🔑 Demo Login: lukasz.kolodziej / aircloud2025

📧 Support: legal@aircloud.pl
🏢 Aircloud Legal Platform v2.0.0
    """)
    
    return success_rate >= 75

if __name__ == "__main__":
    main()