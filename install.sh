#!/bin/bash
# AI Browser - Unix Installation Script
# ======================================

echo ""
echo "======================================"
echo "  AI Browser - Installation Script"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed!"
    echo "Please download and install Node.js from https://nodejs.org/"
    echo ""
    exit 1
fi

# Display Node.js version
echo "[INFO] Node.js version:"
node --version
echo ""

# Check npm
if ! command -v npm &> /dev/null; then
    echo "[ERROR] npm is not installed!"
    exit 1
fi

echo "[INFO] npm version:"
npm --version
echo ""

# Install dependencies
echo "[STEP 1/2] Installing dependencies..."
echo "This may take a few minutes..."
echo ""
npm install
if [ $? -ne 0 ]; then
    echo ""
    echo "[ERROR] Installation failed!"
    echo "Please check the error messages above."
    exit 1
fi

echo ""
echo "[SUCCESS] Dependencies installed!"
echo ""

# Build TypeScript
echo "[STEP 2/2] Building TypeScript..."
echo ""
npm run build
if [ $? -ne 0 ]; then
    echo ""
    echo "[ERROR] Build failed!"
    echo "Please check the error messages above."
    exit 1
fi

echo ""
echo "[SUCCESS] Build completed!"
echo ""
echo "======================================"
echo "  Installation Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Start LM Studio and load a model"
echo "2. Start LM Studio's local server (port 1234)"
echo "3. Run: ./start.sh (or: npm start)"
echo ""
echo "For help, read START_HERE.md"
echo ""

