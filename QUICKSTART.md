# Quick Start Guide - 5 Minutes to AI Browser

Get up and running with AI Browser in just 5 minutes!

## Prerequisites Check

✅ **Node.js 18+** installed? Check with:
```bash
node --version
```

✅ **LM Studio** installed? Download from [lmstudio.ai](https://lmstudio.ai) if not.

## Step 1: Install (2 minutes)

```bash
# Open terminal in the AI Browser directory
cd "AI Browser"

# Install dependencies
npm install

# Build the project
npm run build
```

Wait for the installation to complete (~1-2 minutes depending on your internet).

## Step 2: Setup LM Studio (2 minutes)

### First Time Setup:

1. **Open LM Studio**

2. **Download a model** (if you haven't already):
   - Click "🔍 Search" tab
   - Search: `Mistral 7B Instruct`
   - Click download on: `TheBloke/Mistral-7B-Instruct-v0.2-GGUF`
   - Wait for download (this can take several minutes)

3. **Start the server**:
   - Click "🖥️ Local Server" tab
   - Select your downloaded model
   - Click "Start Server"
   - You should see: `Server running at http://localhost:1234`

### If You Already Have LM Studio:

1. Open LM Studio
2. Go to "🖥️ Local Server"
3. Select any model
4. Click "Start Server"

**Important**: Keep LM Studio running!

## Step 3: Launch AI Browser (30 seconds)

```bash
npm start
```

The application window should open in a few seconds.

## Step 4: Test Everything (1 minute)

### Test 1: Navigation
1. Type in URL bar: `wikipedia.org`
2. Press Enter
3. ✅ Wikipedia should load

### Test 2: AI Connection
1. Click "⚙️ Settings" tab in right sidebar
2. Click "Test Connection"
3. ✅ Should see: "Connection successful!"

### Test 3: AI Chat
1. Click "💬 Chat" tab
2. Type: "Hello! Can you help me browse the web?"
3. Press Enter
4. ✅ AI should respond

### Test 4: Page Summary
1. Navigate to any article on Wikipedia
2. Click "📄 Summarize" button in toolbar
3. ✅ AI should provide a summary

## You're Ready! 🎉

That's it! AI Browser is now fully functional.

## What to Try Next

### Try Context-Aware Chat
1. Stay on a Wikipedia page
2. Make sure "Use page context" is checked ✓
3. Ask: "What's the main topic of this page?"
4. AI understands the page you're on!

### Try Selected Text
1. Highlight any text on a page
2. Check "Use selected text" ✓
3. Ask: "Explain this in simpler terms"
4. AI focuses on what you selected!

### Try Agent Mode
1. Enable "Agent Mode" toggle in toolbar
2. Type: "Search for Python tutorials"
3. Approve the action when prompted
4. AI performs the search automatically!

## Common Issues & Quick Fixes

### ❌ "Connection failed" in Settings

**Fix**:
1. Make sure LM Studio is running
2. Check that it says "Server running at http://localhost:1234"
3. Try stopping and starting the server in LM Studio

### ❌ npm install fails

**Fix**:
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### ❌ Application won't start

**Fix**:
```bash
# Rebuild
npm run clean
npm run build
npm start
```

### ❌ Blank browser window

**Fix**: Just enter a URL in the address bar and press Enter

### ❌ AI is very slow

**Try**:
1. Use a smaller model (7B instead of 13B or 70B)
2. Reduce "Max Tokens" in Settings (try 256 instead of 512)
3. Close other heavy applications

## Keyboard Shortcuts

- `Enter` in URL bar: Navigate
- `Enter` in chat: Send message
- `Shift+Enter` in chat: New line
- `Ctrl+Shift+I`: Open Developer Tools (for debugging)

## Next Steps

Now that you're set up:

📖 **Read the full [README.md](README.md)** for all features

🎯 **Check [EXAMPLES.md](EXAMPLES.md)** for practical use cases

🛠️ **Explore the Tools tab** for file operations and scripts

🤖 **Try Agent Mode** for automation

## Get Help

- 📖 Full documentation: [README.md](README.md)
- 🔧 Detailed setup: [SETUP.md](SETUP.md)
- 💡 Examples: [EXAMPLES.md](EXAMPLES.md)
- 🏗️ Architecture: [ARCHITECTURE.md](ARCHITECTURE.md)

## One-Command Cheat Sheet

```bash
# Install
npm install

# Build
npm run build

# Run
npm start

# Development (auto-compile)
npm run watch    # Terminal 1
npm start        # Terminal 2
```

---

**Enjoy your AI-powered browsing experience!** 🚀

Kaduxo Built with ❤️ for the AI community
