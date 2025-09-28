#!/bin/bash
# SSPO Debug API Tester
# Test all API endpoints and monitor performance

echo "🧪 SSPO Regulamin Platform - API Debug Suite"
echo "============================================="
echo "⏰ Started: $(date)"
echo ""

BASE_URL="http://localhost"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test API Health
echo "🔍 Testing API Health..."
HEALTH_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}\nTIME:%{time_total}" "$BASE_URL/api/health")
HEALTH_CODE=$(echo "$HEALTH_RESPONSE" | grep "HTTPSTATUS" | cut -d: -f2)
HEALTH_TIME=$(echo "$HEALTH_RESPONSE" | grep "TIME" | cut -d: -f2)

if [ "$HEALTH_CODE" = "200" ]; then
    echo -e "  ✅ Health Check: ${GREEN}PASSED${NC} (${HEALTH_TIME}s)"
else
    echo -e "  ❌ Health Check: ${RED}FAILED${NC} (HTTP $HEALTH_CODE)"
fi

# Test AI Analysis
echo "🤖 Testing AI Analysis..."
ANALYSIS_DATA='{"text":"Test regulamin content","document":"01-regulamin-sspo.md"}'
ANALYSIS_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}\nTIME:%{time_total}" -X POST -H "Content-Type: application/json" -d "$ANALYSIS_DATA" "$BASE_URL/api/analyze")
ANALYSIS_CODE=$(echo "$ANALYSIS_RESPONSE" | grep "HTTPSTATUS" | cut -d: -f2)
ANALYSIS_TIME=$(echo "$ANALYSIS_RESPONSE" | grep "TIME" | cut -d: -f2)

if [ "$ANALYSIS_CODE" = "200" ]; then
    echo -e "  ✅ AI Analysis: ${GREEN}PASSED${NC} (${ANALYSIS_TIME}s)"
else
    echo -e "  ❌ AI Analysis: ${RED}FAILED${NC} (HTTP $ANALYSIS_CODE)"
fi

# Test Statistics
echo "📊 Testing Statistics..."
STATS_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}\nTIME:%{time_total}" "$BASE_URL/api/stats")
STATS_CODE=$(echo "$STATS_RESPONSE" | grep "HTTPSTATUS" | cut -d: -f2)
STATS_TIME=$(echo "$STATS_RESPONSE" | grep "TIME" | cut -d: -f2)

if [ "$STATS_CODE" = "200" ]; then
    echo -e "  ✅ Statistics: ${GREEN}PASSED${NC} (${STATS_TIME}s)"
else
    echo -e "  ❌ Statistics: ${RED}FAILED${NC} (HTTP $STATS_CODE)"
fi

# Test Document Endpoint
echo "📄 Testing Document Retrieval..."
DOC_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}\nTIME:%{time_total}" "$BASE_URL/documents/01-regulamin-sspo")
DOC_CODE=$(echo "$DOC_RESPONSE" | grep "HTTPSTATUS" | cut -d: -f2)
DOC_TIME=$(echo "$DOC_RESPONSE" | grep "TIME" | cut -d: -f2)

if [ "$DOC_CODE" = "200" ]; then
    echo -e "  ✅ Document Retrieval: ${GREEN}PASSED${NC} (${DOC_TIME}s)"
else
    echo -e "  ❌ Document Retrieval: ${RED}FAILED${NC} (HTTP $DOC_CODE)"
fi

# Test Conflict Check
echo "⚖️  Testing Conflict Check..."
CONFLICT_DATA='{"currentText":"Test content","proposedChanges":"Modified content"}'
CONFLICT_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}\nTIME:%{time_total}" -X POST -H "Content-Type: application/json" -d "$CONFLICT_DATA" "$BASE_URL/api/check")
CONFLICT_CODE=$(echo "$CONFLICT_RESPONSE" | grep "HTTPSTATUS" | cut -d: -f2)
CONFLICT_TIME=$(echo "$CONFLICT_RESPONSE" | grep "TIME" | cut -d: -f2)

if [ "$CONFLICT_CODE" = "200" ]; then
    echo -e "  ✅ Conflict Check: ${GREEN}PASSED${NC} (${CONFLICT_TIME}s)"
else
    echo -e "  ❌ Conflict Check: ${RED}FAILED${NC} (HTTP $CONFLICT_CODE)"
fi

echo ""
echo "============================================="
echo "⏰ Completed: $(date)"
echo "🎯 Debug Summary:"
echo "   - All core API endpoints tested"
echo "   - Response times measured" 
echo "   - Error codes captured"
echo "   - Ready for production monitoring"
echo ""