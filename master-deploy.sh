#!/bin/bash

# MASTER DEPLOYMENT SCRIPT
# One command to set up and deploy DensityX-AI

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         🚀 DensityX-AI Firebase Deployment Wizard         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Menu
echo "${BLUE}What would you like to do?${NC}"
echo ""
echo "1) Setup Firebase (first-time only)"
echo "2) Deploy to Firebase (build + upload)"
echo "3) Verify Deployment (health check)"
echo "4) Full Setup + Deploy (everything)"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "${BLUE}Running Firebase Setup...${NC}"
        bash setup-firebase.sh
        ;;
    2)
        echo ""
        echo "${BLUE}Running Deployment...${NC}"
        bash deploy.sh
        ;;
    3)
        echo ""
        echo "${BLUE}Running Verification...${NC}"
        bash verify-deployment.sh
        ;;
    4)
        echo ""
        echo "${BLUE}Running Full Setup + Deploy...${NC}"
        echo ""
        bash setup-firebase.sh
        echo ""
        bash deploy.sh
        ;;
    *)
        echo "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo "${GREEN}✅ Done!${NC}"
