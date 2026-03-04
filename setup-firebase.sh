#!/bin/bash

# Firebase setup automation script
# Initializes Firebase project configuration

set -e

echo "🔧 DensityX-AI Firebase Setup Starting..."
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if Firebase CLI is installed
echo "${BLUE}📋 Checking Firebase CLI...${NC}"

if ! command -v firebase &> /dev/null; then
    echo "${YELLOW}Installing Firebase CLI...${NC}"
    npm install -g firebase-tools
fi

echo "${GREEN}✅ Firebase CLI ready${NC}"
echo ""

# Check .firebaserc exists
if [ ! -f ".firebaserc" ]; then
    echo "${RED}❌ .firebaserc not found${NC}"
    exit 1
fi

PROJECT_ID=$(grep -A1 'default' .firebaserc | grep -o '"[^"]*"' | tail -1 | tr -d '"')

echo "${BLUE}🔐 Setting up Firebase project: ${PROJECT_ID}${NC}"
echo ""

# Login to Firebase
echo "${YELLOW}Note: You'll be redirected to browser for Firebase login${NC}"
firebase login --no-localhost

echo ""
echo "${BLUE}📂 Checking project...${NC}"
firebase projects:list

echo ""
echo "${BLUE}🗄️  Deploying database rules...${NC}"
firebase deploy --only database

echo ""
echo "${BLUE}🔐 Deploying Firestore rules...${NC}"
firebase deploy --only firestore

echo ""
echo "${GREEN}✅ Firebase setup complete!${NC}"
echo ""
echo "${YELLOW}Environment files created:${NC}"
echo "  - frontend/.env.production"
echo "  - frontend/.env.development"
echo "  - database.rules.json"
echo "  - firestore.rules"
echo ""
echo "${YELLOW}Next: Run 'npm run deploy' to build and deploy frontend${NC}"
