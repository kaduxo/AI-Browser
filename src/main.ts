/**
 * Main Process - Electron Entry Point
 * Handles window creation, BrowserView management, and IPC communication
 */

import {
  app,
  BrowserWindow,
  BrowserView,
  ipcMain,
  dialog,
  shell,
  session,
} from "electron";
import * as path from "path";
import * as fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// Ad blocker - common ad domains
const adDomains = [
  "doubleclick.net",
  "googlesyndication.com",
  "googleadservices.com",
  "google-analytics.com",
  "googletagmanager.com",
  "facebook.com/tr",
  "facebook.net",
  "scorecardresearch.com",
  "outbrain.com",
  "taboola.com",
  "advertising.com",
  "adnxs.com",
  "adsystem.com",
  "amazon-adsystem.com",
  "criteo.com",
  "serving-sys.com",
];

let adBlockerEnabled = true;

let mainWindow: BrowserWindow | null = null;
let browserView: BrowserView | null = null;

// Security: Keep track of allowed operations
const pendingOperations = new Map<string, { approved: boolean; data: any }>();

/**
 * Setup ad blocker
 */
function setupAdBlocker() {
  session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
    if (!adBlockerEnabled) {
      callback({});
      return;
    }

    const url = details.url.toLowerCase();
    const shouldBlock = adDomains.some((domain) => url.includes(domain));

    if (shouldBlock) {
      console.log("[Ad Blocker] Blocked:", details.url);
      callback({ cancel: true });
    } else {
      callback({});
    }
  });
}

/**
 * Create the main application window with integrated browser view
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
    show: false,
  });

  // Create BrowserView for web content
  browserView = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      javascript: true,
    },
  });

  mainWindow.setBrowserView(browserView);

  // Load the main UI
  mainWindow.loadFile(path.join(__dirname, "../src/index.html"));

  // Show window when ready
  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
    updateBrowserViewBounds();
  });

  // Handle window resize
  mainWindow.on("resize", updateBrowserViewBounds);

  mainWindow.on("closed", () => {
    mainWindow = null;
    browserView = null;
  });

  // Navigation handlers for BrowserView
  setupBrowserViewHandlers();
}

/**
 * Update BrowserView bounds to account for sidebar (400px right panel)
 */
function updateBrowserViewBounds() {
  if (!mainWindow || !browserView) return;

  const bounds = mainWindow.getBounds();
  const sidebarWidth = 450; // AI sidebar width
  const toolbarHeight = 60; // Navigation toolbar height

  browserView.setBounds({
    x: 0,
    y: toolbarHeight,
    width: bounds.width - sidebarWidth,
    height: bounds.height - toolbarHeight,
  });
}

/**
 * Setup event handlers for BrowserView navigation
 */
function setupBrowserViewHandlers() {
  if (!browserView) return;

  const webContents = browserView.webContents;

  // Navigation events
  webContents.on("did-start-loading", () => {
    mainWindow?.webContents.send("browser-loading", true);
  });

  webContents.on("did-stop-loading", () => {
    mainWindow?.webContents.send("browser-loading", false);
    sendPageInfo();
  });

  webContents.on("did-navigate", (event, url) => {
    mainWindow?.webContents.send("browser-navigated", {
      url,
      canGoBack: webContents.canGoBack(),
      canGoForward: webContents.canGoForward(),
    });
  });

  webContents.on("did-navigate-in-page", (event, url) => {
    mainWindow?.webContents.send("browser-navigated", {
      url,
      canGoBack: webContents.canGoBack(),
      canGoForward: webContents.canGoForward(),
    });
  });

  webContents.on("page-title-updated", (event, title) => {
    mainWindow?.webContents.send("browser-title-updated", title);
  });

  // Security: Open external links in default browser
  webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}

/**
 * Send current page information to renderer
 */
async function sendPageInfo() {
  if (!browserView) return;

  try {
    const url = browserView.webContents.getURL();
    const title = browserView.webContents.getTitle();

    mainWindow?.webContents.send("page-info-updated", {
      url,
      title,
    });
  } catch (error) {
    console.error("Error getting page info:", error);
  }
}

/**
 * IPC Handlers
 */

// Navigation controls
ipcMain.handle("navigate-to", async (event, url: string) => {
  if (!browserView) return;

  // Basic URL validation and sanitization
  let targetUrl = url.trim();

  if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
    // Check if it's a valid domain or search query
    if (targetUrl.includes(".") && !targetUrl.includes(" ")) {
      targetUrl = "https://" + targetUrl;
    } else {
      // Treat as search query (DuckDuckGo)
      targetUrl = `https://duckduckgo.com/?q=${encodeURIComponent(targetUrl)}`;
    }
  }

  browserView.webContents.loadURL(targetUrl);
});

ipcMain.handle("navigate-back", async () => {
  if (browserView?.webContents.canGoBack()) {
    browserView.webContents.goBack();
  }
});

ipcMain.handle("navigate-forward", async () => {
  if (browserView?.webContents.canGoForward()) {
    browserView.webContents.goForward();
  }
});

ipcMain.handle("reload-page", async () => {
  browserView?.webContents.reload();
});

ipcMain.handle("stop-loading", async () => {
  browserView?.webContents.stop();
});

// Page content extraction
ipcMain.handle("get-page-content", async () => {
  if (!browserView) return null;

  try {
    const url = browserView.webContents.getURL();
    const title = browserView.webContents.getTitle();

    // Extract page text content
    const content = await browserView.webContents.executeJavaScript(`
      (function() {
        // Remove script and style elements
        const clone = document.body.cloneNode(true);
        const scripts = clone.querySelectorAll('script, style, noscript');
        scripts.forEach(el => el.remove());
        
        // Get text content
        let text = clone.textContent || clone.innerText || '';
        
        // Clean up whitespace
        text = text.replace(/\\s+/g, ' ').trim();
        
        // Limit to first 10000 characters to avoid huge payloads
        return text.substring(0, 10000);
      })();
    `);

    return { url, title, content };
  } catch (error) {
    console.error("Error extracting page content:", error);
    return null;
  }
});

// Get selected text
ipcMain.handle("get-selected-text", async () => {
  if (!browserView) return null;

  try {
    const selectedText = await browserView.webContents.executeJavaScript(`
      window.getSelection().toString();
    `);

    return selectedText;
  } catch (error) {
    console.error("Error getting selected text:", error);
    return null;
  }
});

// Execute JavaScript in page (with user approval)
ipcMain.handle("execute-script", async (event, script: string) => {
  if (!browserView) return { success: false, error: "No browser view" };

  try {
    // Security: Show confirmation dialog
    const result = await dialog.showMessageBox(mainWindow!, {
      type: "warning",
      title: "Execute Script",
      message:
        "The AI wants to execute the following script on the current page:",
      detail: script,
      buttons: ["Cancel", "Execute"],
      defaultId: 0,
      cancelId: 0,
    });

    if (result.response !== 1) {
      return { success: false, error: "User cancelled" };
    }

    // Execute the script
    const execResult = await browserView.webContents.executeJavaScript(script);
    console.log("[Security] Script executed:", script);

    return { success: true, result: execResult };
  } catch (error: any) {
    console.error("Error executing script:", error);
    return { success: false, error: error.message };
  }
});

// File operations (with user approval)
ipcMain.handle("read-file", async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow!, {
      properties: ["openFile"],
      filters: [
        { name: "Text Files", extensions: ["txt", "md", "json", "csv"] },
        { name: "All Files", extensions: ["*"] },
      ],
    });

    if (result.canceled || result.filePaths.length === 0) {
      return { success: false, error: "User cancelled" };
    }

    const filePath = result.filePaths[0];
    const content = fs.readFileSync(filePath, "utf-8");

    console.log("[Security] File read:", filePath);
    return { success: true, content, path: filePath };
  } catch (error: any) {
    console.error("Error reading file:", error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle(
  "write-file",
  async (event, content: string, suggestedName?: string) => {
    try {
      const result = await dialog.showSaveDialog(mainWindow!, {
        defaultPath: suggestedName || "document.txt",
        filters: [
          { name: "Text Files", extensions: ["txt"] },
          { name: "Markdown", extensions: ["md"] },
          { name: "JSON", extensions: ["json"] },
          { name: "All Files", extensions: ["*"] },
        ],
      });

      if (result.canceled || !result.filePath) {
        return { success: false, error: "User cancelled" };
      }

      fs.writeFileSync(result.filePath, content, "utf-8");

      console.log("[Security] File written:", result.filePath);
      return { success: true, path: result.filePath };
    } catch (error: any) {
      console.error("Error writing file:", error);
      return { success: false, error: error.message };
    }
  }
);

// Shell command execution (sandboxed and confirmed)
ipcMain.handle("execute-command", async (event, command: string) => {
  try {
    // Security: Show confirmation dialog with command
    const result = await dialog.showMessageBox(mainWindow!, {
      type: "warning",
      title: "Execute Command",
      message: "The AI wants to execute the following command:",
      detail: command,
      buttons: ["Cancel", "Execute"],
      defaultId: 0,
      cancelId: 0,
    });

    if (result.response !== 1) {
      return { success: false, error: "User cancelled" };
    }

    // Execute command with timeout
    const { stdout, stderr } = await execAsync(command, {
      timeout: 30000, // 30 second timeout
      maxBuffer: 1024 * 1024, // 1MB max output
    });

    console.log("[Security] Command executed:", command);
    return { success: true, stdout, stderr };
  } catch (error: any) {
    console.error("Error executing command:", error);
    return { success: false, error: error.message };
  }
});

// Agent mode confirmation
ipcMain.handle(
  "confirm-agent-action",
  async (event, action: string, details: string) => {
    const result = await dialog.showMessageBox(mainWindow!, {
      type: "question",
      title: "Agent Mode - Confirm Action",
      message: `AI Agent wants to: ${action}`,
      detail: details,
      buttons: ["Deny", "Approve"],
      defaultId: 0,
      cancelId: 0,
    });

    return result.response === 1;
  }
);

// Ad blocker toggle
ipcMain.handle("set-ad-blocker", async (event, enabled: boolean) => {
  adBlockerEnabled = enabled;
  console.log("[Ad Blocker]", enabled ? "Enabled" : "Disabled");
  return { success: true };
});

ipcMain.handle("get-ad-blocker-status", async () => {
  return adBlockerEnabled;
});

/**
 * App lifecycle
 */

app.whenReady().then(() => {
  setupAdBlocker();
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Log unhandled errors
process.on("uncaughtException", (error) => {
  console.error("[Main Process] Uncaught exception:", error);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error(
    "[Main Process] Unhandled rejection at:",
    promise,
    "reason:",
    reason
  );
});
