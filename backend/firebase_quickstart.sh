#!/bin/bash
# Firebase Quick Start Setup Script
# Usage: bash firebase_quickstart.sh

set -e

echo "=========================================="
echo "DensityX-AI Firebase Integration Quickstart"
echo "=========================================="
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.8+"
    exit 1
fi
echo "✅ Python 3 found"

# Create .env file
if [ ! -f .env ]; then
    echo ""
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "✅ Created .env file"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env with your Firebase credentials:"
    echo "   1. Get service account JSON from Firebase Console"
    echo "   2. Set FIREBASE_CREDENTIALS_JSON or FIREBASE_CREDENTIALS_PATH"
    echo "   3. Set FIREBASE_DATABASE_URL"
    echo "   4. Set FIREBASE_STORAGE_BUCKET"
    echo ""
else
    echo "✅ .env file already exists"
fi

# Create virtual environment
if [ ! -d venv ]; then
    echo ""
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo "✅ Virtual environment created"
fi

# Activate virtual environment
echo ""
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo ""
echo "Installing dependencies (this may take a moment)..."
pip install --upgrade pip > /dev/null 2>&1
pip install -r requirements.txt > /dev/null 2>&1
echo "✅ Dependencies installed"

# Show next steps
echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Edit .env with your Firebase credentials"
echo "2. Run: python main.py"
echo "3. Check logs for: [startup] Firebase connected successfully!"
echo ""
echo "For detailed setup instructions, see: FIREBASE_SETUP.md"
