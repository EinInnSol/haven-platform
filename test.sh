#!/bin/bash

# HAVEN Platform - Post-Deployment Test Suite
# Verifies all endpoints are working after deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get worker URL from user
echo "🏠 HAVEN Platform - Test Suite"
echo "=============================="
echo ""
read -p "Enter your Worker URL (e.g., https://haven-platform.your-account.workers.dev): " WORKER_URL

# Remove trailing slash if present
WORKER_URL=${WORKER_URL%/}

echo ""
echo "Testing: $WORKER_URL"
echo ""

# Test counter
PASSED=0
FAILED=0

# Test function
test_endpoint() {
    local name=$1
    local url=$2
    local expected_status=$3
    
    echo -n "Testing $name... "
    
    status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$status" -eq "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $status)"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} (HTTP $status, expected $expected_status)"
        ((FAILED++))
    fi
}

# Test health endpoint
test_endpoint "Health Check" "$WORKER_URL/api/health" 200

# Test QR generation
echo -n "Testing QR Generation... "
qr_response=$(curl -s -X POST "$WORKER_URL/api/qr/generate" \
    -H "Content-Type: application/json" \
    -d '{"location":"Test Location","campaign_name":"Test"}')

if echo "$qr_response" | grep -q "success"; then
    qr_id=$(echo "$qr_response" | grep -o '"qr_id":"[^"]*"' | cut -d'"' -f4)
    echo -e "${GREEN}✓ PASS${NC} (QR ID: ${qr_id:0:8}...)"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
fi

# Test intake start (if we got a QR ID)
if [ ! -z "$qr_id" ]; then
    test_endpoint "Intake Start" "$WORKER_URL/api/intake/$qr_id/start" 200
fi

# Test caseworker dashboard (demo)
test_endpoint "Caseworker Dashboard" "$WORKER_URL/api/caseworker/550e8400-e29b-41d4-a716-446655440001/dashboard" 200

# Test caseworker briefing (demo)
echo -n "Testing AI Briefing Generation... "
briefing_response=$(curl -s "$WORKER_URL/api/caseworker/550e8400-e29b-41d4-a716-446655440001/briefing")

if echo "$briefing_response" | grep -q "success"; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
fi

# Test cost summary
test_endpoint "Cost Summary" "$WORKER_URL/api/cost-summary" 200

# Test frontend pages
test_endpoint "Home Page" "$WORKER_URL/" 200
test_endpoint "Intake Page" "$WORKER_URL/intake/demo" 200
test_endpoint "Caseworker Dashboard" "$WORKER_URL/caseworker/demo" 200
test_endpoint "Municipal Analytics" "$WORKER_URL/municipal" 200
test_endpoint "Admin Panel" "$WORKER_URL/admin" 200

# Summary
echo ""
echo "=============================="
echo "Test Results:"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed! Platform is ready.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Visit $WORKER_URL in your browser"
    echo "2. Generate QR codes at $WORKER_URL/admin"
    echo "3. Test intake flow at $WORKER_URL/intake/demo"
    echo "4. Check caseworker dashboard at $WORKER_URL/caseworker/demo"
    exit 0
else
    echo -e "${RED}✗ Some tests failed. Check the output above.${NC}"
    echo ""
    echo "Common issues:"
    echo "- Database not initialized (run: npm run db:init)"
    echo "- API keys not set (run: wrangler secret put ANTHROPIC_API_KEY)"
    echo "- Worker not deployed (run: npm run deploy)"
    exit 1
fi
