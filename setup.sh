#!/bin/bash

###############################################################################
# DensityX-AI Complete Setup Script for New Collaborators
# This script handles everything: venv, dependencies, Firebase config, LaunchAgent
# Run this once when you first clone the repository
###############################################################################

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"
VENV_PATH="$BACKEND_DIR/venv"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  DensityX-AI Complete Collaboration Setup                     ║"
echo "║  This will set up everything for seamless development         ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Step 1: Check prerequisites
echo -e "${BLUE}[STEP 1]${NC} Checking prerequisites..."
echo ""

if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 not found. Please install Python 3.8+${NC}"
    exit 1
fi
PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
echo -e "${GREEN}✅ Python 3 found${NC} (version: $PYTHON_VERSION)"

if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git not found. Please install Git${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Git found${NC}"

# Step 2: Backend setup
echo ""
echo -e "${BLUE}[STEP 2]${NC} Setting up Backend..."
echo ""

cd "$BACKEND_DIR"

# Create virtual environment
if [ ! -d "$VENV_PATH" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv "$VENV_PATH"
    echo -e "${GREEN}✅ Virtual environment created${NC}"
else
    echo -e "${GREEN}✅ Virtual environment already exists${NC}"
fi

# Activate and upgrade pip
echo "Upgrading pip..."
"$VENV_PATH/bin/python" -m pip install --upgrade pip > /dev/null 2>&1
echo -e "${GREEN}✅ Pip upgraded${NC}"

# Install dependencies
echo "Installing Python dependencies (this may take a moment)..."
"$VENV_PATH/bin/pip" install -r requirements.txt > /dev/null 2>&1
echo -e "${GREEN}✅ Python dependencies installed${NC}"

# Step 3: Environment configuration
echo ""
echo -e "${BLUE}[STEP 3]${NC} Setting up Environment Configuration..."
echo ""

if [ ! -f "$BACKEND_DIR/.env" ]; then
    if [ -f "$BACKEND_DIR/.env.example" ]; then
        cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
        echo -e "${YELLOW}⚠️  .env file created${NC}"
        echo ""
        echo -e "${RED}IMPORTANT:${NC} You need to add Firebase credentials:"
        echo ""
        echo "1. Get your Firebase Service Account JSON from:"
        echo "   ${BLUE}Firebase Console → Project Settings → Service Accounts${NC}"
        echo ""
        echo "2. Edit .env file:"
        echo "   ${BLUE}$BACKEND_DIR/.env${NC}"
        echo ""
        echo "3. Fill in:"
        echo "   FIREBASE_CREDENTIALS_JSON='your-json-here'"
        echo "   FIREBASE_DATABASE_URL='your-database-url'"
        echo "   FIREBASE_STORAGE_BUCKET='your-bucket'"
        echo ""
        echo "Ask your project lead for these credentials if you don't have them."
        echo ""
    else
        echo -e "${RED}⚠️  No .env.example found${NC}"
    fi
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

# Step 4: Create logs directory
echo -e "${BLUE}[STEP 4]${NC} Setting up Logging..."
mkdir -p "$BACKEND_DIR/logs"
chmod 755 "$BACKEND_DIR/logs"
echo -e "${GREEN}✅ Logs directory created${NC}"

# Step 5: Make scripts executable
echo -e "${BLUE}[STEP 5]${NC} Setting up Scripts..."
chmod +x "$BACKEND_DIR/start_server.sh" 2>/dev/null || true
echo -e "${GREEN}✅ Scripts made executable${NC}"

# Step 6: Frontend setup (if it exists)
if [ -d "$FRONTEND_DIR" ] && [ -f "$FRONTEND_DIR/package.json" ]; then
    echo ""
    echo -e "${BLUE}[STEP 6]${NC} Setting up Frontend..."
    echo ""
    
    cd "$FRONTEND_DIR"
    
    if [ ! -d "node_modules" ]; then
        echo "Installing Node.js dependencies..."
        npm install > /dev/null 2>&1
        echo -e "${GREEN}✅ Node dependencies installed${NC}"
    else
        echo -e "${GREEN}✅ Node dependencies already installed${NC}"
    fi
fi

# Step 7: Summary
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║${NC} ${GREEN}✅ SETUP COMPLETE!${NC}                                          ${BLUE}║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BLUE}Next Steps:${NC}"
echo ""
echo "1. ${YELLOW}Configure Firebase:${NC}"
echo "   Edit: $BACKEND_DIR/.env"
echo "   Add your Firebase credentials"
echo ""
echo "2. ${YELLOW}Start Backend Server:${NC}"
echo "   Option A (Automatic): bash $BACKEND_DIR/start_server.sh"
echo "   Option B (Manual): $VENV_PATH/bin/python $BACKEND_DIR/main.py"
echo ""
echo "3. ${YELLOW}Start Frontend (if applicable):${NC}"
echo "   cd $FRONTEND_DIR && npm run dev"
echo ""
echo "4. ${YELLOW}Test Backend:${NC}"
echo "   curl http://127.0.0.1:8003/health"
echo ""
echo -e "${BLUE}VSCode Users:${NC}"
echo "   Press ${YELLOW}Ctrl+Shift+D${NC} (Run and Debug) or click Run button"
echo "   Select 'Run DensityX-AI Backend' to start server with one click"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
echo ""
