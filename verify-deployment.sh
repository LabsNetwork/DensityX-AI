#!/bin/bash

# Deployment verification script
# Checks Firebase deployment health and connectivity

set -e

echo "✅ DensityX-AI Deployment Verification"
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Extract project ID from .firebaserc
PROJECT_ID=$(grep -A1 'default' .firebaserc | grep -o '"[^"]*"' | tail -1 | tr -d '"')
SITE_URL="https://${PROJECT_ID}.web.app"

echo "${BLUE}🔍 Checking deployment...${NC}"
echo ""

# Check if site is accessible
echo "Testing connectivity to: $SITE_URL"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL" || echo "000")

if [ "$HTTP_STATUS" == "200" ]; then
    echo "${GREEN}✅ Site is accessible (HTTP 200)${NC}"
else
    echo "${RED}❌ Site returned HTTP $HTTP_STATUS${NC}"
fi

echo ""
echo "${BLUE}📊 Checking Firebase Console...${NC}"
CONSOLE_URL="https://console.firebase.google.com/project/${PROJECT_ID}"
echo "Firebase Console: $CONSOLE_URL"

echo ""
echo "${BLUE}📝 Deployment Summary:${NC}"
echo "  Project ID: $PROJECT_ID"
echo "  Site URL: $SITE_URL"
echo "  Hosting: $(firebase hosting:sites:list 2>/dev/null | grep "$PROJECT_ID" || echo "Not found")"

echo ""
echo "${YELLOW}Verification Checklist:${NC}"
echo "  [ ] Site is accessible at $SITE_URL"
echo "  [ ] No HTTP errors in browser console"
echo "  [ ] Map is loading correctly"
echo "  [ ] Verified clusters are displaying"
echo "  [ ] Real-time updates working"
echo ""

echo "${BLUE}💡 Troubleshooting Tips:${NC}"
echo "  1. Clear browser cache (Ctrl+Shift+Del)"
echo "  2. Check Firebase Console for errors"
echo "  3. Verify database rules allow read access"
echo "  4. Check network tab in browser DevTools"
echo "  5. Ensure frontend/.env.production has correct values"
