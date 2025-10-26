# AI Browser Architecture

This document explains the technical architecture of AI Browser, including process structure, data flow, and key design decisions.

## Table of Contents
1. [Overview](#overview)
2. [Process Architecture](#process-architecture)
3. [Data Flow](#data-flow)
4. [Security Model](#security-model)
5. [Component Details](#component-details)
6. [Extension Points](#extension-points)

---

## Overview

### Technology Stack
- **Framework**: Electron 28.0.0
- **Language**: TypeScript 5.3.3
- **UI**: HTML5, CSS3, Tailwind CSS (CDN)
- **AI Integration**: LM Studio (OpenAI/Anthropic-compatible API)
- **Build**: TypeScript Compiler (tsc)

### Architecture Style
- **Multi-process**: Electron's process model
- **Event-driven**: IPC for process communication
- **Modular**: Clear separation of concerns
- **Security-first**: Context isolation, sandboxing

---

## Process Architecture

Electron uses a multi-process architecture similar to Chromium:

```
┌─────────────────────────────────────────────────────────┐
│                     Main Process                        │
│                      (main.ts)                          │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Window      │  │  BrowserView │  │  IPC         │ │
│  │  Management  │  │  Management  │  │  Handlers    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  System APIs (File, Shell, Dialogs)             │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           │ IPC (contextBridge)
                           │
┌─────────────────────────────────────────────────────────┐
│                   Preload Script                        │
│                    (preload.ts)                         │
│                                                         │
│  ┌────────────────────────────────────────────────────┐│
│  │  Exposes safe APIs to renderer via contextBridge  ││
│  │  - Navigation API                                  ││
│  │  - Content API                                     ││
│  │  - File API                                        ││
│  │  - Shell API                                       ││
│  │  - Agent API                                       ││
│  └────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
                           │
                           │ window.electronAPI
                           │
┌─────────────────────────────────────────────────────────┐
│                   Renderer Process                      │
│                    (renderer.ts)                        │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  UI Logic    │  │  AI Client   │  │  State       │ │
│  │              │  │              │  │  Management  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                         │
│  ┌────────────────────────────────────────────────────┐│
│  │  index.html (UI Structure)                         ││
│  └────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
                           │
                           │ fetch()
                           │
                    ┌──────▼───────┐
                    │  LM Studio   │
                    │  Local API   │
                    │  :1234       │
                    └──────────────┘
```

### Process Responsibilities

#### Main Process (`src/main.ts`)
- **Purpose**: Backend, privileged operations
- **Responsibilities**:
  - Create and manage application windows
  - Handle BrowserView lifecycle
  - Execute file system operations
  - Run shell commands
  - Display native dialogs
  - Manage IPC handlers

#### Preload Script (`src/preload.ts`)
- **Purpose**: Security bridge
- **Responsibilities**:
  - Expose safe APIs via contextBridge
  - Sanitize data between processes
  - Provide type definitions for renderer

#### Renderer Process (`src/renderer.ts`)
- **Purpose**: Frontend, UI logic
- **Responsibilities**:
  - Handle user interactions
  - Manage application state
  - Call AI API (LM Studio)
  - Update UI based on events
  - Implement business logic

---

## Data Flow

### Navigation Flow
```
User enters URL
    │
    ▼
Renderer: URL input event
    │
    ▼
IPC: navigation.navigateTo(url)
    │
    ▼
Main: Validate and sanitize URL
    │
    ▼
Main: BrowserView.loadURL(url)
    │
    ▼
BrowserView: Load page
    │
    ▼
BrowserView: Emit navigation events
    │
    ▼
Main: Forward events to renderer
    │
    ▼
Renderer: Update UI (URL bar, buttons)
```

### AI Chat Flow
```
User types message
    │
    ▼
Renderer: Build context-aware prompt
    │
    ├─── Get page context (if enabled)
    │    │
    │    ▼
    │    IPC: content.getPageContent()
    │    │
    │    ▼
    │    Main: Execute JS in BrowserView
    │    │
    │    ▼
    │    Return: { url, title, content }
    │
    └─── Get selected text (if enabled)
         │
         ▼
         IPC: content.getSelectedText()
         │
         ▼
         Main: Execute JS in BrowserView
         │
         ▼
         Return: selected text
    │
    ▼
Renderer: Combine prompt with context
    │
    ▼
Renderer: fetch() to LM Studio API
    │
    ▼
LM Studio: Process with LLM
    │
    ▼
LM Studio: Return completion
    │
    ▼
Renderer: Display response
    │
    ▼
Renderer: Check for agent actions (if enabled)
    │
    ▼
IPC: agent.confirmAction() (if action found)
    │
    ▼
Main: Show confirmation dialog
    │
    ▼
User: Approve/Deny
    │
    ▼
Renderer: Execute or skip action
```

### Script Execution Flow
```
AI generates script / User inputs script
    │
    ▼
Renderer: Call electronAPI.content.executeScript(script)
    │
    ▼
IPC: content.executeScript(script)
    │
    ▼
Main: Show confirmation dialog with script content
    │
    ▼
User: Reviews and approves/cancels
    │
    ├─── Approve
    │    │
    │    ▼
    │    Main: BrowserView.executeJavaScript(script)
    │    │
    │    ▼
    │    Main: Log to console (security audit)
    │    │
    │    ▼
    │    Return: { success: true, result }
    │
    └─── Cancel
         │
         ▼
         Return: { success: false, error: 'User cancelled' }
    │
    ▼
Renderer: Display result or error
```

---

## Security Model

### Principle: Defense in Depth

Multiple layers of security protect the system:

```
Layer 1: Sandboxed BrowserView
    └─ Web content isolated
    └─ No Node.js access

Layer 2: Context Isolation
    └─ Renderer cannot access Node.js
    └─ Must use IPC for privileged ops

Layer 3: Preload Script
    └─ Only exposes approved APIs
    └─ Validates data types

Layer 4: Main Process Handlers
    └─ Validates inputs
    └─ Sanitizes commands
    └─ Requires user confirmation

Layer 5: User Confirmation
    └─ Native dialogs for sensitive ops
    └─ Clear description of actions
    └─ Explicit approve/deny
```

### Security Boundaries

```
┌─────────────────────────────────────────┐
│  Trusted                                │
│  ┌────────────────────────────────────┐ │
│  │  Main Process                      │ │
│  │  - File system access              │ │
│  │  - Shell execution                 │ │
│  │  - System dialogs                  │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
               ▲
               │ IPC only
               │
┌─────────────────────────────────────────┐
│  Semi-trusted                           │
│  ┌────────────────────────────────────┐ │
│  │  Renderer Process                  │ │
│  │  - UI logic                        │ │
│  │  - AI API calls                    │ │
│  │  - Local state                     │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
               ▲
               │ No direct access
               │
┌─────────────────────────────────────────┐
│  Untrusted                              │
│  ┌────────────────────────────────────┐ │
│  │  BrowserView / Web Content         │ │
│  │  - User-navigated websites         │ │
│  │  - Completely sandboxed            │ │
│  │  - No access to app internals      │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## Component Details

### Main Process Components

#### Window Manager
- **File**: `main.ts` (createWindow function)
- **Purpose**: Manage main application window
- **Key features**:
  - Create BrowserWindow with security settings
  - Handle window lifecycle events
  - Manage window bounds and state

#### BrowserView Manager
- **File**: `main.ts` (setupBrowserViewHandlers)
- **Purpose**: Manage embedded browser
- **Key features**:
  - Create sandboxed BrowserView
  - Handle navigation events
  - Update view bounds on resize
  - Extract page information

#### IPC Handler Registry
- **File**: `main.ts` (ipcMain.handle calls)
- **Purpose**: Handle renderer requests
- **Handlers**:
  - Navigation: `navigate-to`, `navigate-back`, `navigate-forward`, `reload-page`
  - Content: `get-page-content`, `get-selected-text`, `execute-script`
  - Files: `read-file`, `write-file`
  - Shell: `execute-command`
  - Agent: `confirm-agent-action`

### Renderer Process Components

#### AIBrowser Class
- **File**: `renderer.ts`
- **Purpose**: Main application controller
- **Properties**:
  - `settings`: AISettings - User preferences
  - `messages`: Message[] - Chat history
  - `currentAbortController`: For interrupting operations
  - `isProcessing`: Lock for async operations
  - `agentMode`: Agent mode state

**Key Methods**:

```typescript
// Initialize the application
init(): void

// AI Communication
callAI(messages: Message[]): Promise<string>
sendMessage(): Promise<void>

// Context Management
getPageContext(includeContent: boolean): Promise<PageContext | null>
buildContextPrompt(userMessage: string): Promise<string>

// Features
summarizePage(): Promise<void>
executeScriptPrompt(): Promise<void>

// Agent Mode
handleAgentResponse(response: string): Promise<void>
executeAgentAction(actionType: string, actionData: string): Promise<void>

// Settings
loadSettings(): AISettings
saveSettings(): void

// UI
addMessage(role, content, context?): void
switchTab(tabName: string): void
```

---

## Extension Points

### Adding New Tools

**Step 1**: Add IPC handler in `main.ts`:
```typescript
ipcMain.handle('new-tool-action', async (event, param) => {
  // Implement tool logic
  return result;
});
```

**Step 2**: Expose via preload (`preload.ts`):
```typescript
const newToolAPI = {
  action: (param: string) => ipcRenderer.invoke('new-tool-action', param),
};

contextBridge.exposeInMainWorld('electronAPI', {
  // ... existing APIs
  newTool: newToolAPI,
});
```

**Step 3**: Add UI in `index.html`:
```html
<button id="new-tool-btn">New Tool</button>
```

**Step 4**: Implement in renderer (`renderer.ts`):
```typescript
document.getElementById('new-tool-btn')?.addEventListener('click', async () => {
  const result = await window.electronAPI.newTool.action('param');
  // Handle result
});
```

### Custom AI Prompts

Modify prompt templates in `renderer.ts`:

```typescript
// Example: Custom summarization
private async summarizePage() {
  const prompt = `[Your custom prompt template]
    Title: ${pageData.title}
    Content: ${pageData.content}
  `;
  
  const response = await this.callAI([{ role: 'user', content: prompt }]);
  // ...
}
```

### Agent Action Types

Add new action patterns in `handleAgentResponse()`:

```typescript
private async handleAgentResponse(response: string) {
  // Add new pattern
  const customPattern = /\[CUSTOM:(\w+):(.+?)\]/g;
  // ... parse and handle
}
```

### Custom Settings

Add settings in `AISettings` interface:

```typescript
interface AISettings {
  // ... existing settings
  customSetting: string;
}
```

Then update UI in `index.html` and handlers in `renderer.ts`.

---

## Performance Considerations

### Memory Management
- Chat history grows with usage
- Consider clearing old messages
- BrowserView uses separate process (Chromium)

### Optimization Tips
1. **Debounce frequent operations**
   ```typescript
   let debounceTimer: NodeJS.Timeout;
   function debounce(fn: Function, delay: number) {
     clearTimeout(debounceTimer);
     debounceTimer = setTimeout(fn, delay);
   }
   ```

2. **Limit page content extraction**
   - Already limited to 10,000 characters
   - Consider lazy loading for large pages

3. **Cache page context**
   - Avoid repeated extractions
   - Update only on navigation

4. **Stream AI responses** (future improvement)
   - Currently waits for full response
   - Streaming would improve perceived performance

---

## Error Handling

### Strategy
- **Try-catch blocks** for all async operations
- **User-friendly messages** in UI
- **Detailed logging** to console
- **Graceful degradation** when services unavailable

### Example Pattern
```typescript
try {
  const result = await riskyOperation();
  // Handle success
} catch (error: any) {
  console.error('[Component] Error:', error);
  
  if (error.name === 'AbortError') {
    this.addSystemMessage('Operation cancelled');
  } else {
    this.addSystemMessage(`Error: ${error.message}`);
  }
}
```

---

## Future Improvements

### Planned Architectural Changes
1. **State Management**: Consider MobX or Zustand for complex state
2. **Modular AI Providers**: Abstract AI interface for multiple providers
3. **Plugin System**: Dynamic loading of extensions
4. **Worker Threads**: Offload heavy processing
5. **Database**: SQLite for history, bookmarks
6. **Test Framework**: Unit and integration tests

---

## Debugging

### Development Tools

**Main Process**:
```bash
# Add to main.ts
console.log('[Main]', data);
```

**Renderer Process**:
- Open DevTools: `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (macOS)
- Console shows renderer logs
- Network tab shows LM Studio requests

**IPC Communication**:
```typescript
// Log in preload.ts
console.log('[Preload] IPC call:', method, args);
```

### Common Issues

1. **IPC not working**: Check contextBridge exposure
2. **AI not responding**: Verify LM Studio connection
3. **Scripts failing**: Check BrowserView JavaScript execution
4. **UI not updating**: Ensure event listeners are registered

---

## Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [Electron Security](https://www.electronjs.org/docs/tutorial/security)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [LM Studio API](https://lmstudio.ai/docs)

---

For questions about architecture, open a GitHub discussion or issue.


Kaduxo Built with ❤️ for the AI community