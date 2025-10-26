#!/bin/bash
# AI Browser - Unix Launch Script
# ================================

echo ""
echo "======================================"
echo "  AI Browser - Starting..."
echo "======================================"
echo ""

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "[ERROR] Project not built!"
    echo "Please run ./install.sh first, or run: npm run build"
    echo ""
    exit 1
fi

# Reminder about LM Studio
echo "[INFO] Make sure LM Studio is running with:"
echo "       - A model loaded"
echo "       - Local server started on port 1234"
echo ""
echo "Press Enter to launch AI Browser..."
read

# Start the application
echo ""
echo "[INFO] Launching AI Browser..."
echo ""
npm start

