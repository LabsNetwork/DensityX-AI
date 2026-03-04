#!/bin/bash

# Firebase deployment automation script
# Builds frontend and deploys to Firebase Hosting

set -e

echo "🚀 DensityX-AI Firebase Deployment Starting..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check prerequisites
echo "${BLUE}📋 Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo "${RED}❌ Node.js not found. Please install Node.js.${NC}"
    exit 1
fi

if ! command -v firebase &> /dev/null; then
    echo "${YELLOW}⚠️  Firebase CLI not found. Installing...${NC}"
    npm install -g firebase-tools
fi

if [ ! -f ".firebaserc" ]; then
    echo "${RED}❌ .firebaserc not found. Run setup-firebase.sh first.${NC}"
    exit 1
fi

echo "${GREEN}✅ Prerequisites checked${NC}"
echo ""

# Build frontend
echo "${BLUE}🏗️  Building frontend...${NC}"
cd frontend
npm install
npm run build

if [ ! -d "dist" ]; then
    echo "${RED}❌ Frontend build failed - dist folder not created${NC}"
    exit 1
fi

cd ..
echo "${GREEN}✅ Frontend built successfully${NC}"
echo ""

# Deploy to Firebase
echo "${BLUE}🌐 Deploying to Firebase Hosting...${NC}"
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo "${GREEN}✅ Deployment successful!${NC}"
    echo ""
    echo "${BLUE}📍 Project URL: https://$(grep -A1 'default' .firebaserc | grep -o '"[^"]*"' | tail -1 | tr -d '"').web.app${NC}"
    echo ""
    echo "${YELLOW}Next steps:${NC}"
    echo "  1. Visit the project URL in your browser"
    echo "  2. Test verified cluster functionality"
    echo "  3. Monitor Firebase Console for errors"
    echo ""
else
    echo "${RED}❌ Deployment failed${NC}"
    exit 1
fi
