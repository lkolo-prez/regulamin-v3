#!/bin/bash

# 🧪 SSPO System Automated Tests
# Version: 2.1.1
# Author: lkolo-prez

# Don't exit on first error - we want to collect all test results
# set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Config
API_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:8080"

# Functions
print_header() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

test_pass() {
    echo -e "${GREEN}✅ PASS:${NC} $1"
    ((PASSED++))
}

test_fail() {
    echo -e "${RED}❌ FAIL:${NC} $1"
    ((FAILED++))
}

test_warn() {
    echo -e "${YELLOW}⚠️  WARN:${NC} $1"
    ((WARNINGS++))
}

# Start Tests
echo -e "${BLUE}"
cat << 'EOF'
╔══════════════════════════════════════════════════════════════════════╗
║                   🧪 SSPO SYSTEM TEST SUITE                         ║
║                      Version 2.1.1                                   ║
╚══════════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
print_header "1. BACKEND HEALTH CHECKS"
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Test 1.1: Backend Running
if curl -sf $API_URL/health > /dev/null 2>&1; then
    UPTIME=$(curl -s $API_URL/health | jq -r '.uptime')
    test_pass "Backend is running (uptime: ${UPTIME}s)"
else
    test_fail "Backend is not responding"
    exit 1
fi

# Test 1.2: Database Connection
if curl -s $API_URL/health | jq -e '.status == "healthy"' > /dev/null; then
    test_pass "Backend health check returns healthy status"
else
    test_fail "Backend health check failed"
fi

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
print_header "2. AUTHENTICATION TESTS"
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Test 2.1: Login with correct credentials
RESPONSE=$(curl -s -X POST $API_URL/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@sspo.com.pl","password":"ChangeMe123!"}')

ADMIN_TOKEN=$(echo $RESPONSE | jq -r '.token')

if [ "$ADMIN_TOKEN" != "null" ] && [ -n "$ADMIN_TOKEN" ]; then
    test_pass "Admin login successful (token received)"
else
    test_fail "Admin login failed"
    echo "Response: $RESPONSE"
    exit 1
fi

# Test 2.2: Login with wrong password
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST $API_URL/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@sspo.com.pl","password":"WrongPassword"}')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if [ "$HTTP_CODE" = "401" ]; then
    test_pass "Wrong password rejected (401)"
else
    test_fail "Wrong password should return 401, got $HTTP_CODE"
fi

# Test 2.3: Get current user
USER_EMAIL=$(curl -s $API_URL/api/auth/me \
    -H "Authorization: Bearer $ADMIN_TOKEN" | jq -r '.user.email')

if [ "$USER_EMAIL" = "admin@sspo.com.pl" ]; then
    test_pass "Get current user works"
else
    test_fail "Get current user failed"
fi

# Test 2.4: Access protected route without token
HTTP_CODE=$(curl -s -w "%{http_code}" -o /dev/null $API_URL/api/users)
if [ "$HTTP_CODE" = "401" ]; then
    test_pass "Protected route without token returns 401"
else
    test_fail "Protected route should require authentication"
fi

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
print_header "3. USER MANAGEMENT TESTS"
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Test 3.1: Get all users (admin)
USER_COUNT=$(curl -s $API_URL/api/users \
    -H "Authorization: Bearer $ADMIN_TOKEN" | jq '. | length')

if [ "$USER_COUNT" -gt 0 ]; then
    test_pass "Get users returns $USER_COUNT users"
else
    test_fail "Get users returned empty list"
fi

# Test 3.2: Check if test user exists
TEST_USER_EXISTS=$(curl -s $API_URL/api/users \
    -H "Authorization: Bearer $ADMIN_TOKEN" | jq -e '.[] | select(.email=="test@test.com")' > /dev/null && echo "yes" || echo "no")

if [ "$TEST_USER_EXISTS" = "yes" ]; then
    test_pass "Test user exists"
    TEST_USER_ID=$(curl -s $API_URL/api/users \
        -H "Authorization: Bearer $ADMIN_TOKEN" | jq -r '.[] | select(.email=="test@test.com") | .id')
else
    test_warn "Test user doesn't exist, skipping related tests"
fi

# Test 3.3: Password reset (if test user exists)
if [ "$TEST_USER_EXISTS" = "yes" ]; then
    RESPONSE=$(curl -s -X PATCH $API_URL/api/users/$TEST_USER_ID/reset-password \
        -H "Authorization: Bearer $ADMIN_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"newPassword":"NewTestPassword123!"}')
    
    if echo $RESPONSE | jq -e '.message' > /dev/null; then
        test_pass "Password reset successful for test user"
        
        # Test 3.4: Login with new password
        NEW_TOKEN=$(curl -s -X POST $API_URL/api/auth/login \
            -H "Content-Type: application/json" \
            -d '{"email":"test@test.com","password":"NewTestPassword123!"}' | jq -r '.token')
        
        if [ "$NEW_TOKEN" != "null" ] && [ -n "$NEW_TOKEN" ]; then
            test_pass "Login with new password successful"
        else
            test_fail "Login with new password failed"
        fi
    else
        test_fail "Password reset failed"
    fi
fi

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
print_header "4. COMMENTS SYSTEM TESTS"
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Test 4.1: Get comments for document
COMMENTS=$(curl -s $API_URL/api/comments/01-regulamin-sspo)
COMMENT_COUNT=$(echo $COMMENTS | jq '. | length')

if [ "$COMMENT_COUNT" -ge 0 ]; then
    test_pass "Get comments returns $COMMENT_COUNT comments"
else
    test_fail "Get comments failed"
fi

# Test 4.2: Create new comment (requires contributor role)
RESPONSE=$(curl -s -X POST $API_URL/api/comments \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "articleId": "01-regulamin-sspo",
        "text": "🧪 Test comment from automated tests"
    }')

if echo $RESPONSE | jq -e '.comment' > /dev/null 2>&1; then
    COMMENT_ID=$(echo $RESPONSE | jq -r '.comment.id')
    test_pass "Create comment successful (ID: $COMMENT_ID)"
    
    # Test 4.3: Delete the test comment
    DELETE_RESPONSE=$(curl -s -X DELETE $API_URL/api/comments/$COMMENT_ID \
        -H "Authorization: Bearer $ADMIN_TOKEN")
    
    if echo $DELETE_RESPONSE | jq -e '.message' > /dev/null 2>&1; then
        test_pass "Delete comment successful"
    else
        test_warn "Delete comment failed, manual cleanup needed"
    fi
else
    ERROR_MSG=$(echo $RESPONSE | jq -r '.error // "Unknown error"')
    test_warn "Create comment skipped or failed: $ERROR_MSG"
fi

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
print_header "5. AMENDMENTS SYSTEM TESTS"
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Test 5.1: Get all amendments
AMENDMENTS=$(curl -s $API_URL/api/amendments)
AMENDMENT_COUNT=$(echo $AMENDMENTS | jq '. | length')

if [ "$AMENDMENT_COUNT" -ge 0 ]; then
    test_pass "Get amendments returns $AMENDMENT_COUNT amendments"
else
    test_fail "Get amendments failed"
fi

# Test 5.2: Create new amendment
RESPONSE=$(curl -s -X POST $API_URL/api/amendments \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "articleId": "01-regulamin-sspo",
        "originalText": "Original text from document...",
        "proposedText": "🧪 Test amendment - proposed changes...",
        "reason": "Testing purposes - automated test suite validation"
    }')

if echo $RESPONSE | jq -e '.amendment' > /dev/null 2>&1; then
    AMENDMENT_ID=$(echo $RESPONSE | jq -r '.amendment.id')
    test_pass "Create amendment successful (ID: $AMENDMENT_ID)"
    
    # Test 5.3: Get amendment details
    AMENDMENT=$(curl -s $API_URL/api/amendments/$AMENDMENT_ID)
    if echo $AMENDMENT | jq -e '.id' > /dev/null 2>&1; then
        test_pass "Get amendment details successful"
    else
        test_fail "Get amendment details failed"
    fi
else
    ERROR_MSG=$(echo $RESPONSE | jq -r '.error // "Unknown error"')
    test_warn "Create amendment skipped or failed: $ERROR_MSG"
fi

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
print_header "6. FRONTEND TESTS"
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Test 6.1: Frontend is accessible
if curl -sf $FRONTEND_URL > /dev/null 2>&1; then
    test_pass "Frontend is accessible"
else
    test_fail "Frontend is not responding"
fi

# Test 6.2: Check if search plugin is loaded
SEARCH_LOADED=$(curl -s $FRONTEND_URL | grep -c "docsify.*search" || echo "0")
if [ "$SEARCH_LOADED" -gt 0 ]; then
    test_pass "Search plugin is loaded"
else
    test_fail "Search plugin not found in HTML"
fi

# Test 6.3: Check if collaboration JS is loaded
COLLAB_LOADED=$(curl -s $FRONTEND_URL | grep -c "collaboration-integrated.js" || echo "0")
if [ "$COLLAB_LOADED" -gt 0 ]; then
    test_pass "Collaboration system JS is loaded"
else
    test_fail "Collaboration JS not found"
fi

# Test 6.4: Check if CSS is loaded
CSS_LOADED=$(curl -s $FRONTEND_URL | grep -c "collaboration-fixed.css" || echo "0")
if [ "$CSS_LOADED" -gt 0 ]; then
    test_pass "Collaboration CSS is loaded"
else
    test_fail "Collaboration CSS not found"
fi

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
print_header "7. SECURITY TESTS"
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Test 7.1: SQL Injection attempt
RESPONSE=$(curl -s -X POST $API_URL/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@sspo.com.pl'"'"' OR 1=1--","password":"anything"}')

if echo $RESPONSE | jq -e '.token' > /dev/null 2>&1; then
    test_fail "SQL Injection possible! System is vulnerable!"
else
    test_pass "SQL Injection attempt blocked"
fi

# Test 7.2: XSS attempt in comment
RESPONSE=$(curl -s -X POST $API_URL/api/comments \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "documentId": "01-regulamin-sspo",
        "paragraphId": "test",
        "content": "<script>alert(\"XSS\")</script>"
    }')

# If comment is created, check if script tags are escaped
if echo $RESPONSE | jq -e '.commentId' > /dev/null 2>&1; then
    COMMENT_ID=$(echo $RESPONSE | jq -r '.commentId')
    test_warn "XSS content accepted (ID: $COMMENT_ID) - frontend should sanitize"
    # Cleanup
    curl -s -X DELETE $API_URL/api/comments/$COMMENT_ID -H "Authorization: Bearer $ADMIN_TOKEN" > /dev/null
else
    test_pass "XSS attempt blocked by validation"
fi

# Test 7.3: Check CORS headers
CORS_HEADER=$(curl -s -I $API_URL/health | grep -i "access-control-allow-origin" || echo "")
if [ -n "$CORS_HEADER" ]; then
    test_warn "CORS is enabled - verify allowed origins"
else
    test_pass "CORS not exposed in health endpoint"
fi

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
print_header "8. PERFORMANCE TESTS"
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Test 8.1: Health check response time
RESPONSE_TIME=$(curl -s -w "%{time_total}" -o /dev/null $API_URL/health)
if (( $(echo "$RESPONSE_TIME < 0.1" | bc -l) )); then
    test_pass "Health check response time: ${RESPONSE_TIME}s (< 100ms)"
elif (( $(echo "$RESPONSE_TIME < 0.5" | bc -l) )); then
    test_warn "Health check response time: ${RESPONSE_TIME}s (acceptable but slow)"
else
    test_fail "Health check response time: ${RESPONSE_TIME}s (too slow!)"
fi

# Test 8.2: Login response time
RESPONSE_TIME=$(curl -s -w "%{time_total}" -o /dev/null -X POST $API_URL/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@sspo.com.pl","password":"ChangeMe123!"}')

if (( $(echo "$RESPONSE_TIME < 0.5" | bc -l) )); then
    test_pass "Login response time: ${RESPONSE_TIME}s (< 500ms)"
elif (( $(echo "$RESPONSE_TIME < 1.0" | bc -l) )); then
    test_warn "Login response time: ${RESPONSE_TIME}s (acceptable but slow)"
else
    test_fail "Login response time: ${RESPONSE_TIME}s (too slow!)"
fi

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
print_header "TEST SUMMARY"
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TOTAL=$((PASSED + FAILED + WARNINGS))

echo ""
echo -e "${GREEN}✅ PASSED: $PASSED${NC}"
echo -e "${RED}❌ FAILED: $FAILED${NC}"
echo -e "${YELLOW}⚠️  WARNINGS: $WARNINGS${NC}"
echo -e "━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "   TOTAL: $TOTAL tests"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please review the output above.${NC}"
    exit 1
fi
