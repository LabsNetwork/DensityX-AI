#!/bin/bash

###############################################################################
# DensityX-AI Server Startup Script
# Purpose: Reliable server startup with error handling
# Usage: ./start_server.sh
###############################################################################

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_PATH="$SCRIPT_DIR/venv"
PYTHON_BIN="$VENV_PATH/bin/python"
LOG_FILE="$SCRIPT_DIR/server.log"

echo "=========================================="
echo "DensityX-AI Backend Server Starting"
echo "=========================================="
echo ""

# Check if venv exists
if [ ! -d "$VENV_PATH" ]; then
    echo "❌ Virtual environment not found at $VENV_PATH"
    echo "Creating virtual environment..."
    python3 -m venv "$VENV_PATH"
    echo "✅ Virtual environment created"
fi

# Check if Python executable exists
if [ ! -f "$PYTHON_BIN" ]; then
    echo "❌ Python executable not found at $PYTHON_BIN"
    exit 1
fi

# Activate venv and check dependencies
echo "Checking dependencies..."
"$PYTHON_BIN" -m pip install --quiet --upgrade pip > /dev/null 2>&1 || true
"$PYTHON_BIN" -m pip install --quiet -r "$SCRIPT_DIR/requirements.txt" > /dev/null 2>&1 || {
    echo "⚠️  Some dependencies failed to install, but continuing..."
}
echo "✅ Dependencies ready"

# Check .env file
if [ ! -f "$SCRIPT_DIR/.env" ]; then
    echo "⚠️  .env file not found!"
    echo "Creating from template..."
    if [ -f "$SCRIPT_DIR/.env.example" ]; then
        cp "$SCRIPT_DIR/.env.example" "$SCRIPT_DIR/.env"
        echo "⚠️  Please edit .env with your Firebase credentials"
        echo "    Location: $SCRIPT_DIR/.env"
    fi
fi

# Kill any existing process on port 8003
echo "Checking for existing processes on port 8003..."
if lsof -i :8003 > /dev/null 2>&1; then
    PID=$(lsof -ti :8003 | head -1)
    echo "Stopping existing process (PID: $PID)..."
    kill -9 "$PID" 2>/dev/null || true
    sleep 2
fi

# Start server with logging
echo ""
echo "Starting DensityX-AI Backend Server..."
echo "Server logs: $LOG_FILE"
echo ""

cd "$SCRIPT_DIR"

# Run server with output to both console and file
"$PYTHON_BIN" main.py 2>&1 | tee -a "$LOG_FILE" &
SERVER_PID=$!

# Wait for server to start
sleep 3

# Check if server started successfully
if ps -p $SERVER_PID > /dev/null 2>&1; then
    echo ""
    echo "=========================================="
    echo "✅ SERVER STARTED SUCCESSFULLY"
    echo "=========================================="
    echo ""
    echo "Server Details:"
    echo "  PID: $SERVER_PID"
    echo "  URL: http://localhost:8003"
    echo "  Log: $LOG_FILE"
    echo ""
    echo "Health Check:"
    sleep 2
    curl -s http://127.0.0.1:8003/health | python3 -m json.tool 2>/dev/null || \
    curl -s http://localhost:8003/health | python3 -m json.tool 2>/dev/null || \
    echo "  ⚠️  Could not verify health (server may still be starting)"
    echo ""
    echo "Firebase Status: Check logs for '[firebase]' messages"
    echo ""
else
    echo "❌ Server failed to start"
    echo "Check logs: tail -f $LOG_FILE"
    exit 1
fi
