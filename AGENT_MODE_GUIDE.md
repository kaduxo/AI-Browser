# 🤖 Agent Mode - Quick Guide

## ✨ What's New

### Improved Chat UI

- ✅ **Smooth scrolling** - Auto-scrolls to latest message
- ✅ **Custom scrollbar** - Beautiful styled scrollbar
- ✅ **Message animations** - Smooth slide-in effect
- ✅ **Timestamps** - Each message shows time
- ✅ **Better styling** - Gradients and shadows
- ✅ **Text wrapping** - Long messages wrap properly

### Enhanced Agent Mode

- ✅ **Automatic instructions** - AI now knows how to control the browser
- ✅ **Action patterns** - AI can suggest specific browser actions
- ✅ **User approval** - All actions require your confirmation

---

## 🚀 How to Use Agent Mode

### Step 1: Enable Agent Mode

1. Look at the top-right of the toolbar
2. Toggle "Agent Mode" switch to ON (turns blue)
3. You'll see a system message confirming it's enabled

### Step 2: Ask AI to Take Actions

#### Example 1: Search Google

**You say**: "Search for Python tutorials"

**AI will respond with**:

```
I'll search for that. [ACTION:search:Python tutorials]
```

**What happens**:

- A dialog appears asking for approval
- Shows the search query
- Click "Approve" to execute
- Browser navigates to Google search results

#### Example 2: Navigate to a Website

**You say**: "Go to Wikipedia"

**AI will respond with**:

```
I'll navigate to Wikipedia. [ACTION:navigate:https://wikipedia.org]
```

**What happens**:

- Dialog asks for approval with the URL
- Click "Approve" to navigate
- Browser loads the website

#### Example 3: Run JavaScript

**You say**: "Extract all links from this page"

**AI will respond with**:

```
Here's a script to extract links:
[ACTION:script:Array.from(document.querySelectorAll('a')).map(a => a.href)]
```

**What happens**:

- Dialog shows the JavaScript code
- You review it
- Click "Approve" to execute
- Results appear in Tools tab

---

## 💡 Example Commands to Try

### With Agent Mode ON:

1. **"Search for the latest news about AI"**

   - AI will search Google for you

2. **"Navigate to GitHub"**

   - AI will go to github.com

3. **"Go to the Python documentation"**

   - AI will find and navigate to python.org

4. **"Search for Electron tutorials and open the first result"**

   - AI suggests multiple steps (requires multiple approvals)

5. **"Extract all headings from this page"**

   - AI generates JavaScript to extract H1, H2, etc.

6. **"Count how many images are on this page"**
   - AI creates a script to count images

---

## 🎯 Action Format Reference

The AI uses these special formats:

### Navigate to URL

```
[ACTION:navigate:https://example.com]
```

### Search Google

```
[ACTION:search:your search query here]
```

### Execute JavaScript

```
[ACTION:script:document.title]
```

---

## 🔒 Safety Features

### Every Action Requires Approval

- ✅ Dialog shows what will happen
- ✅ You can see the exact action
- ✅ Click "Approve" to proceed or "Deny" to cancel

### Interrupt Anytime

- ✅ Global "⛔ INTERRUPT" button appears during processing
- ✅ Stops any ongoing operation
- ✅ Click anytime to cancel

### Review Scripts

- ✅ JavaScript code is shown before execution
- ✅ Read it carefully
- ✅ Only approve safe operations

---

## 📋 Step-by-Step First Test

### Test 1: Simple Search

1. **Enable Agent Mode** (toggle in toolbar)
2. **Type**: "Search for chocolate chip cookie recipes"
3. **Press Enter** or click Send
4. **Wait** for AI response
5. **Approve** when dialog appears
6. **Watch** browser navigate to Google

### Test 2: Navigate

1. **Keep Agent Mode ON**
2. **Type**: "Go to Wikipedia homepage"
3. **Press Enter**
4. **Approve** the navigation
5. **See** Wikipedia load

### Test 3: Extract Data

1. **Navigate** to any webpage (like Wikipedia)
2. **Type**: "Show me all the links on this page"
3. **Wait** for AI to generate script
4. **Review** the JavaScript code
5. **Approve** if it looks safe
6. **Check** Tools tab for output

---

## 🐛 Troubleshooting

### AI Doesn't Suggest Actions

**Problem**: AI just talks, doesn't use [ACTION:...] format

**Solution**:

1. Make sure Agent Mode toggle is ON (blue)
2. Be explicit: "Use agent mode to search for..."
3. Try: "Search Google for X" instead of "Can you find X"

### Actions Don't Execute

**Problem**: Approved action but nothing happens

**Solution**:

1. Check if dialog actually said "Approved"
2. Look for system messages in chat
3. Check browser console (Ctrl+Shift+I) for errors

### Can't See Results

**Problem**: Script executed but no output

**Solution**:

1. Go to 🛠️ Tools tab
2. Look for "Output" section
3. Results appear in the code block there

---

## 💬 Better Chat Experience

### New Features:

- **Smooth scrolling** - Automatically scrolls to new messages
- **Timestamps** - See when each message was sent
- **Animations** - Messages slide in smoothly
- **Better contrast** - Easier to read
- **Custom scrollbar** - Looks modern and clean

### Tips:

- Long messages wrap properly
- Code is preserved with proper formatting
- System messages are clearly distinguished
- User messages on right, AI on left

---

## 🎨 Visual Guide

```
┌─────────────────────────────────────────┐
│  💬 Chat Tab                            │
├─────────────────────────────────────────┤
│                                         │
│  ┌────────────────────────┐             │
│  │ AI Message             │  [11:23 AM] │
│  │ I'll search for that.  │             │
│  │ [ACTION:search:Python] │             │
│  └────────────────────────┘             │
│                                         │
│             ┌─────────────────────────┐ │
│  [11:23 AM]│ Thanks!                 │ │
│             │ (Your message)          │ │
│             └─────────────────────────┘ │
│                                         │
│  ⚠️ Agent Mode enabled - Confirms...    │
│                                         │
├─────────────────────────────────────────┤
│ [Type message...]                       │
│ [Send] [Clear]                          │
└─────────────────────────────────────────┘
```

---

## 🚀 Ready to Use!

Your AI Browser now has:

- ✅ Beautiful, scrollable chat
- ✅ Smart agent mode
- ✅ Safe action execution
- ✅ Better visual feedback

Just run `npm start` and try the examples above!

---

**Pro Tip**: Start with simple searches, then try more complex actions once you're comfortable with the approval process.

**Enjoy your enhanced AI Browser!** 🎉

Kaduxo Built with ❤️ for the AI community