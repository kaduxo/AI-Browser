/**
 * Renderer Process - UI Logic and AI Integration
 * Handles user interactions, AI API calls, and UI updates
 */

// Type definitions are declared in preload.ts and available globally

/**
 * AI Configuration and State
 */
interface AISettings {
  provider: "lmstudio" | "anthropic";
  apiEndpoint: string;
  modelName: string;
  anthropicApiKey?: string;
  anthropicModel?: string;
  temperature: number;
  maxTokens: number;
}

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface PageContext {
  url: string;
  title: string;
  content?: string;
}

interface Bookmark {
  id: string;
  title: string;
  url: string;
  timestamp: number;
}

class AIBrowser {
  private settings: AISettings;
  private messages: Message[] = [];
  private currentAbortController: AbortController | null = null;
  private isProcessing = false;
  private agentMode = false;
  private autoApprove = false;
  private currentPageContext: PageContext | null = null;
  private bookmarks: Bookmark[] = [];

  constructor() {
    // Load settings from localStorage or use defaults
    this.settings = this.loadSettings();
    this.loadTheme();
    this.loadBookmarks();
    this.loadAutoApprove();
    this.init();
  }

  private init() {
    this.setupEventListeners();
    this.setupNavigationHandlers();
    this.toggleAutoApproveVisibility(); // Set initial visibility
    this.addSystemMessage("AI Browser initialized. Ready to assist!");
  }

  /**
   * Load settings from localStorage
   */
  private loadSettings(): AISettings {
    const saved = localStorage.getItem("ai-settings");
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      provider: "lmstudio",
      apiEndpoint: "http://localhost:1234/v1/chat/completions",
      modelName: "local-model",
      temperature: 0.7,
      maxTokens: 512,
    };
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings() {
    localStorage.setItem("ai-settings", JSON.stringify(this.settings));
  }

  /**
   * Setup all UI event listeners
   */
  private setupEventListeners() {
    // Navigation controls
    document.getElementById("back-btn")?.addEventListener("click", () => {
      window.electronAPI.navigation.navigateBack();
    });

    document.getElementById("forward-btn")?.addEventListener("click", () => {
      window.electronAPI.navigation.navigateForward();
    });

    document.getElementById("reload-btn")?.addEventListener("click", () => {
      window.electronAPI.navigation.reload();
    });

    const urlInput = document.getElementById("url-input") as HTMLInputElement;
    urlInput?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        window.electronAPI.navigation.navigateTo(urlInput.value);
      }
    });

    // Quick action buttons
    document.getElementById("summarize-btn")?.addEventListener("click", () => {
      this.summarizePage();
    });

    document
      .getElementById("context-extract-btn")
      ?.addEventListener("click", () => {
        this.extractAndDisplayContext();
      });

    // Agent mode toggle
    const agentToggle = document.getElementById(
      "agent-mode-toggle"
    ) as HTMLInputElement;
    agentToggle?.addEventListener("change", (e) => {
      this.agentMode = (e.target as HTMLInputElement).checked;
      this.toggleAutoApproveVisibility();
      this.addSystemMessage(
        this.agentMode
          ? "🤖 Agent Mode enabled - AI can suggest multi-step actions"
          : "Agent Mode disabled"
      );
      // Disable auto-approve when agent mode is off
      if (!this.agentMode && this.autoApprove) {
        this.autoApprove = false;
        const autoToggle = document.getElementById(
          "auto-approve-toggle"
        ) as HTMLInputElement;
        if (autoToggle) autoToggle.checked = false;
      }
    });

    // Auto-Approve toggle
    const autoApproveToggle = document.getElementById(
      "auto-approve-toggle"
    ) as HTMLInputElement;
    autoApproveToggle?.addEventListener("change", (e) => {
      this.autoApprove = (e.target as HTMLInputElement).checked;
      this.saveAutoApprove();
      this.addSystemMessage(
        this.autoApprove
          ? "⚡ Auto-Approve enabled! AI will execute actions independently. Use INTERRUPT button to stop."
          : "Auto-Approve disabled. AI will ask for confirmation before each action."
      );
    });

    // Chat controls
    document.getElementById("send-btn")?.addEventListener("click", () => {
      this.sendMessage();
    });

    const chatInput = document.getElementById(
      "chat-input"
    ) as HTMLTextAreaElement;
    chatInput?.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    document.getElementById("clear-chat-btn")?.addEventListener("click", () => {
      this.clearChat();
    });

    // Interrupt button
    document
      .getElementById("interrupt-button")
      ?.addEventListener("click", () => {
        this.interruptCurrentOperation();
      });

    // Tab switching
    document.querySelectorAll(".tab-button").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        const tabName = target.getAttribute("data-tab");
        this.switchTab(tabName!);
      });
    });

    // Settings - Provider switcher
    document.getElementById("ai-provider")?.addEventListener("change", (e) => {
      const provider = (e.target as HTMLSelectElement).value as
        | "lmstudio"
        | "anthropic";
      this.settings.provider = provider;
      this.saveSettings();
      this.toggleProviderSettings(provider);
    });

    document.getElementById("api-endpoint")?.addEventListener("change", (e) => {
      this.settings.apiEndpoint = (e.target as HTMLInputElement).value;
      this.saveSettings();
    });

    document.getElementById("model-name")?.addEventListener("change", (e) => {
      this.settings.modelName = (e.target as HTMLInputElement).value;
      this.saveSettings();
    });

    document
      .getElementById("anthropic-api-key")
      ?.addEventListener("change", (e) => {
        this.settings.anthropicApiKey = (e.target as HTMLInputElement).value;
        this.saveSettings();
      });

    document
      .getElementById("anthropic-model")
      ?.addEventListener("change", (e) => {
        this.settings.anthropicModel = (e.target as HTMLSelectElement).value;
        this.saveSettings();
      });

    document.getElementById("temperature")?.addEventListener("change", (e) => {
      this.settings.temperature = parseFloat(
        (e.target as HTMLInputElement).value
      );
      this.saveSettings();
    });

    document.getElementById("max-tokens")?.addEventListener("change", (e) => {
      this.settings.maxTokens = parseInt((e.target as HTMLInputElement).value);
      this.saveSettings();
    });

    document
      .getElementById("ad-blocker-toggle")
      ?.addEventListener("change", async (e) => {
        const enabled = (e.target as HTMLInputElement).checked;
        await window.electronAPI.adBlocker.setEnabled(enabled);
        this.addSystemMessage(`Ad Blocker ${enabled ? "enabled" : "disabled"}`);
      });

    document
      .getElementById("test-connection-btn")
      ?.addEventListener("click", () => {
        this.testConnection();
      });

    // Tools
    document.getElementById("read-file-btn")?.addEventListener("click", () => {
      this.readFile();
    });

    document.getElementById("write-file-btn")?.addEventListener("click", () => {
      this.writeFile();
    });

    document
      .getElementById("execute-script-btn")
      ?.addEventListener("click", () => {
        this.executeScriptPrompt();
      });

    document
      .getElementById("execute-command-btn")
      ?.addEventListener("click", () => {
        this.executeCommand();
      });

    // Populate settings UI
    this.updateSettingsUI();

    // Theme toggle
    document.getElementById("theme-toggle")?.addEventListener("click", () => {
      this.toggleTheme();
    });

    // Bookmarks
    document.getElementById("bookmark-btn")?.addEventListener("click", () => {
      this.addBookmark();
    });
  }

  /**
   * Load auto-approve setting from localStorage
   */
  private loadAutoApprove() {
    const saved = localStorage.getItem("auto-approve");
    if (saved === "true") {
      this.autoApprove = true;
      const toggle = document.getElementById(
        "auto-approve-toggle"
      ) as HTMLInputElement;
      if (toggle) toggle.checked = true;
    }
  }

  /**
   * Save auto-approve setting to localStorage
   */
  private saveAutoApprove() {
    localStorage.setItem("auto-approve", this.autoApprove.toString());
  }

  /**
   * Show/hide auto-approve toggle based on agent mode
   */
  private toggleAutoApproveVisibility() {
    const container = document.getElementById("auto-approve-container");
    if (container) {
      container.style.display = this.agentMode ? "flex" : "none";
    }
  }

  /**
   * Load theme from localStorage
   */
  private loadTheme() {
    const darkMode = localStorage.getItem("dark-mode") === "true";
    if (darkMode) {
      document.body.classList.add("dark-mode");
      this.updateThemeIcon();
    }
  }

  /**
   * Toggle dark/light theme
   */
  private toggleTheme() {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("dark-mode", isDark.toString());
    this.updateThemeIcon();
  }

  /**
   * Update theme toggle icon
   */
  private updateThemeIcon() {
    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
      themeBtn.textContent = document.body.classList.contains("dark-mode")
        ? "☀️"
        : "🌙";
    }
  }

  /**
   * Load bookmarks from localStorage
   */
  private loadBookmarks() {
    const saved = localStorage.getItem("bookmarks");
    if (saved) {
      this.bookmarks = JSON.parse(saved);
      this.updateBookmarksList();
    }
  }

  /**
   * Save bookmarks to localStorage
   */
  private saveBookmarks() {
    localStorage.setItem("bookmarks", JSON.stringify(this.bookmarks));
  }

  /**
   * Add current page to bookmarks
   */
  private async addBookmark() {
    if (!this.currentPageContext) {
      this.addSystemMessage("No page to bookmark");
      return;
    }

    const bookmark: Bookmark = {
      id: Date.now().toString(),
      title: this.currentPageContext.title,
      url: this.currentPageContext.url,
      timestamp: Date.now(),
    };

    this.bookmarks.unshift(bookmark);
    this.saveBookmarks();
    this.updateBookmarksList();
    this.addSystemMessage(`Bookmarked: ${bookmark.title}`);
  }

  /**
   * Remove a bookmark
   */
  private removeBookmark(id: string) {
    this.bookmarks = this.bookmarks.filter((b) => b.id !== id);
    this.saveBookmarks();
    this.updateBookmarksList();
  }

  /**
   * Update bookmarks list UI
   */
  private updateBookmarksList() {
    const listContainer = document.getElementById("bookmarks-list");
    if (!listContainer) return;

    if (this.bookmarks.length === 0) {
      listContainer.innerHTML =
        '<p style="color: #6b7280; font-size: 14px">No bookmarks yet. Click ⭐ Bookmark to save the current page.</p>';
      return;
    }

    listContainer.innerHTML = this.bookmarks
      .map(
        (bookmark) => `
      <div style="
        padding: 12px;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
      " class="bookmark-item" data-url="${bookmark.url}" data-id="${bookmark.id}">
        <span style="font-size: 16px">⭐</span>
        <div style="flex: 1; min-width: 0">
          <div style="font-weight: 500; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
            ${bookmark.title}
          </div>
          <div style="font-size: 12px; color: #6b7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
            ${bookmark.url}
          </div>
        </div>
        <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px" data-action="delete">
          🗑️
        </button>
      </div>
    `
      )
      .join("");

    // Add click handlers
    listContainer.querySelectorAll(".bookmark-item").forEach((item) => {
      const url = item.getAttribute("data-url");
      const id = item.getAttribute("data-id");

      item.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        if (target.getAttribute("data-action") === "delete") {
          e.stopPropagation();
          if (id) this.removeBookmark(id);
        } else if (url) {
          window.electronAPI.navigation.navigateTo(url);
        }
      });
    });
  }

  /**
   * Setup navigation event handlers from main process
   */
  private setupNavigationHandlers() {
    window.electronAPI.navigation.onNavigated((data) => {
      const urlInput = document.getElementById("url-input") as HTMLInputElement;
      if (urlInput) {
        urlInput.value = data.url;
      }
    });

    window.electronAPI.navigation.onLoading((loading) => {
      const reloadBtn = document.getElementById("reload-btn");
      if (reloadBtn) {
        reloadBtn.textContent = loading ? "✕" : "↻";
      }
    });

    window.electronAPI.navigation.onPageInfoUpdated((info) => {
      this.currentPageContext = info;
    });
  }

  /**
   * Switch between sidebar tabs
   */
  private switchTab(tabName: string) {
    // Update tab buttons
    document.querySelectorAll(".tab-button").forEach((btn) => {
      btn.classList.remove("active");
      if (btn.getAttribute("data-tab") === tabName) {
        btn.classList.add("active");
      }
    });

    // Update tab content - hide all tabs
    document.querySelectorAll(".tab-content").forEach((content) => {
      (content as HTMLElement).style.display = "none";
    });

    // Show selected tab with flex display to maintain layout
    const activeTab = document.getElementById(`${tabName}-tab`);
    if (activeTab) {
      activeTab.style.display = "flex";

      // Force scroll position update for chat tab
      if (tabName === "chat") {
        const chatMessages = document.getElementById("chat-messages");
        if (chatMessages) {
          setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
          }, 50);
        }
      }
    }
  }

  /**
   * Toggle provider settings visibility
   */
  private toggleProviderSettings(provider: "lmstudio" | "anthropic") {
    const lmstudioSettings = document.getElementById("lmstudio-settings");
    const anthropicSettings = document.getElementById("anthropic-settings");

    if (lmstudioSettings && anthropicSettings) {
      if (provider === "lmstudio") {
        lmstudioSettings.style.display = "block";
        anthropicSettings.style.display = "none";
      } else {
        lmstudioSettings.style.display = "none";
        anthropicSettings.style.display = "block";
      }
    }
  }

  /**
   * Update settings UI with current values
   */
  private updateSettingsUI() {
    (document.getElementById("ai-provider") as HTMLSelectElement).value =
      this.settings.provider;
    (document.getElementById("api-endpoint") as HTMLInputElement).value =
      this.settings.apiEndpoint;
    (document.getElementById("model-name") as HTMLInputElement).value =
      this.settings.modelName;

    if (this.settings.anthropicApiKey) {
      (document.getElementById("anthropic-api-key") as HTMLInputElement).value =
        this.settings.anthropicApiKey;
    }
    if (this.settings.anthropicModel) {
      (document.getElementById("anthropic-model") as HTMLSelectElement).value =
        this.settings.anthropicModel;
    }

    (document.getElementById("temperature") as HTMLInputElement).value =
      this.settings.temperature.toString();
    (document.getElementById("max-tokens") as HTMLInputElement).value =
      this.settings.maxTokens.toString();

    // Show correct provider settings
    this.toggleProviderSettings(this.settings.provider);
  }

  /**
   * Add a message to the chat UI
   */
  private addMessage(
    role: "user" | "assistant" | "system",
    content: string,
    context?: string
  ) {
    const messagesContainer = document.getElementById("chat-messages");
    if (!messagesContainer) return;

    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${role}`;

    // Add context badge if provided
    if (context) {
      const contextBadge = document.createElement("div");
      contextBadge.className = "context-badge";
      contextBadge.textContent = context;
      messageDiv.appendChild(contextBadge);
    }

    // Message content bubble
    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content";
    contentDiv.textContent = content;
    messageDiv.appendChild(contentDiv);

    // Add timestamp (except for system messages)
    if (role !== "system") {
      const timestamp = document.createElement("div");
      timestamp.className = "message-time";
      timestamp.textContent = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      messageDiv.appendChild(timestamp);
    }

    messagesContainer.appendChild(messageDiv);

    // Smooth scroll to bottom with a slight delay for animation
    requestAnimationFrame(() => {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
  }

  /**
   * Add a system message
   */
  private addSystemMessage(content: string) {
    this.addMessage("system", content);
  }

  /**
   * Clear chat history
   */
  private clearChat() {
    this.messages = [];
    const messagesContainer = document.getElementById("chat-messages");
    if (messagesContainer) {
      messagesContainer.innerHTML = "";
    }
    this.addSystemMessage("Chat cleared");
  }

  /**
   * Get current page context
   */
  private async getPageContext(
    includeContent = true
  ): Promise<PageContext | null> {
    try {
      if (includeContent) {
        return await window.electronAPI.content.getPageContent();
      } else if (this.currentPageContext) {
        return this.currentPageContext;
      }
      return null;
    } catch (error) {
      console.error("Error getting page context:", error);
      return null;
    }
  }

  /**
   * Build context-aware prompt
   */
  private async buildContextPrompt(userMessage: string): Promise<string> {
    const useContext = (
      document.getElementById("use-context-checkbox") as HTMLInputElement
    )?.checked;
    const useSelection = (
      document.getElementById("use-selection-checkbox") as HTMLInputElement
    )?.checked;

    let prompt = userMessage;
    let contextParts: string[] = [];

    if (useContext) {
      const context = await this.getPageContext(false);
      if (context) {
        contextParts.push(`Current page: "${context.title}" (${context.url})`);
      }
    }

    if (useSelection) {
      const selectedText = await window.electronAPI.content.getSelectedText();
      if (selectedText && selectedText.trim()) {
        contextParts.push(
          `Selected text: "${selectedText.substring(0, 500)}${
            selectedText.length > 500 ? "..." : ""
          }"`
        );
      }
    }

    if (contextParts.length > 0) {
      prompt = `Context:\n${contextParts.join(
        "\n"
      )}\n\nUser query: ${userMessage}`;
    }

    // Add agent mode instructions
    if (this.agentMode) {
      prompt += `\n\nAGENT MODE ACTIVE: You can suggest multiple browser actions in sequence using these formats:
- To navigate: [ACTION:navigate:https://example.com]
- To search: [ACTION:search:your search query]
- To run JavaScript: [ACTION:script:your JavaScript code]

IMPORTANT: When given a multi-step task, suggest ALL steps in your response. Each action will require user approval before execution. 
Example: If asked to "search and summarize", respond with: "I'll help with that. [ACTION:search:query here]" and then after the search completes, I will continue with the next step.`;
    }

    return prompt;
  }

  /**
   * Send a message to the AI
   */
  private async sendMessage() {
    const chatInput = document.getElementById(
      "chat-input"
    ) as HTMLTextAreaElement;
    const userMessage = chatInput.value.trim();

    if (!userMessage || this.isProcessing) return;

    chatInput.value = "";
    this.isProcessing = true;
    this.showInterruptButton();

    // Build context-aware prompt
    const prompt = await this.buildContextPrompt(userMessage);

    // Add user message to UI
    this.addMessage("user", userMessage);

    // Add message to conversation history
    this.messages.push({ role: "user", content: prompt });

    try {
      // Call AI API
      const response = await this.callAI(this.messages);

      // Add assistant response to UI and history
      this.addMessage("assistant", response);
      this.messages.push({ role: "assistant", content: response });

      // Check for special commands in agent mode
      if (this.agentMode) {
        await this.handleAgentResponse(response);
      }
    } catch (error: any) {
      console.error("[AI] Error:", error);

      if (error.name === "AbortError") {
        this.addSystemMessage("Request interrupted by user");
      } else {
        this.addSystemMessage(
          `Error: ${error.message || "Failed to get AI response"}`
        );
      }
    } finally {
      this.isProcessing = false;
      this.hideInterruptButton();
    }
  }

  /**
   * Call the AI API (LM Studio or Anthropic)
   */
  private async callAI(messages: Message[]): Promise<string> {
    this.currentAbortController = new AbortController();

    if (this.settings.provider === "anthropic") {
      return await this.callAnthropicAPI(messages);
    } else {
      return await this.callLMStudioAPI(messages);
    }
  }

  /**
   * Call LM Studio API (OpenAI-compatible)
   */
  private async callLMStudioAPI(messages: Message[]): Promise<string> {
    const response = await fetch(this.settings.apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.settings.modelName,
        messages: messages,
        temperature: this.settings.temperature,
        max_tokens: this.settings.maxTokens,
      }),
      signal: this.currentAbortController!.signal,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error("No response from AI");
    }

    return data.choices[0].message.content;
  }

  /**
   * Call Anthropic API (Claude)
   */
  private async callAnthropicAPI(messages: Message[]): Promise<string> {
    if (!this.settings.anthropicApiKey) {
      throw new Error("Anthropic API key not configured");
    }

    const model = this.settings.anthropicModel || "claude-3-5-sonnet-20241022";

    // Convert messages to Anthropic format
    const anthropicMessages = messages.map((msg) => ({
      role: msg.role === "system" ? "user" : msg.role,
      content: msg.content,
    }));

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.settings.anthropicApiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: model,
        messages: anthropicMessages,
        max_tokens: this.settings.maxTokens,
        temperature: this.settings.temperature,
      }),
      signal: this.currentAbortController!.signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Anthropic API error: ${response.status} - ${
          errorData.error?.message || response.statusText
        }`
      );
    }

    const data = await response.json();

    if (!data.content || data.content.length === 0) {
      throw new Error("No response from Claude");
    }

    return data.content[0].text;
  }

  /**
   * Handle agent mode responses (check for action suggestions)
   */
  private async handleAgentResponse(response: string) {
    // Parse response for action suggestions
    // Look for patterns like [ACTION:navigate:url], [ACTION:script:code], etc.

    const actionPattern = /\[ACTION:(\w+):(.+?)\]/g;
    const matches = [...response.matchAll(actionPattern)];

    for (const match of matches) {
      const actionType = match[1];
      const actionData = match[2];

      let confirmed = this.autoApprove; // Auto-approve if enabled

      // Ask user for confirmation only if auto-approve is disabled
      if (!this.autoApprove) {
        confirmed = await window.electronAPI.agent.confirmAction(
          actionType,
          actionData
        );
      } else {
        // Show what's being auto-executed
        const preview =
          actionData.length > 60
            ? actionData.substring(0, 60) + "..."
            : actionData;
        this.addSystemMessage(`⚡ Auto-executing: ${actionType} → ${preview}`);
      }

      if (confirmed) {
        await this.executeAgentAction(actionType, actionData);
      } else {
        this.addSystemMessage(`Agent action "${actionType}" denied by user`);
      }
    }
  }

  /**
   * Execute an agent action
   */
  private async executeAgentAction(actionType: string, actionData: string) {
    console.log(`[Agent] Executing action: ${actionType}`, actionData);

    try {
      switch (actionType.toLowerCase()) {
        case "navigate":
          await window.electronAPI.navigation.navigateTo(actionData);
          this.addSystemMessage(`Navigated to: ${actionData}`);
          // Wait for page to load
          await new Promise((resolve) => setTimeout(resolve, 2000));
          break;

        case "script":
          const result = await window.electronAPI.content.executeScript(
            actionData
          );
          if (result.success) {
            this.addSystemMessage("Script executed successfully");
          } else {
            this.addSystemMessage(`Script execution failed: ${result.error}`);
          }
          break;

        case "search":
          const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(
            actionData
          )}`;
          await window.electronAPI.navigation.navigateTo(searchUrl);
          this.addSystemMessage(`Searching for: ${actionData}`);
          // Wait for search results to load
          await new Promise((resolve) => setTimeout(resolve, 2000));
          break;

        default:
          this.addSystemMessage(`Unknown agent action: ${actionType}`);
      }

      // Auto-continue: Ask AI what to do next
      if (this.agentMode) {
        await this.continueAgentWorkflow();
      }
    } catch (error: any) {
      console.error("[Agent] Action error:", error);
      this.addSystemMessage(`Agent action failed: ${error.message}`);
    }
  }

  /**
   * Continue agent workflow after an action
   */
  private async continueAgentWorkflow() {
    // Give a moment for page to stabilize
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Build context-aware continuation prompt
    const pageContext = await this.getPageContext(false);
    let continuePrompt = "Action completed. ";

    if (pageContext) {
      continuePrompt += `Current page: "${pageContext.title}". `;
    }

    continuePrompt +=
      "Continue with the next step of the task, or provide results if complete.";

    // Add to message history and get AI response
    this.messages.push({ role: "user", content: continuePrompt });

    try {
      this.isProcessing = true;
      this.showInterruptButton();

      const response = await this.callAI(this.messages);
      this.addMessage("assistant", response);
      this.messages.push({ role: "assistant", content: response });

      // Check for more actions
      await this.handleAgentResponse(response);
    } catch (error: any) {
      if (error.name !== "AbortError") {
        this.addSystemMessage(`Error continuing workflow: ${error.message}`);
      }
    } finally {
      this.isProcessing = false;
      this.hideInterruptButton();
    }
  }

  /**
   * Summarize the current page
   */
  private async summarizePage() {
    if (this.isProcessing) return;

    this.isProcessing = true;
    this.showInterruptButton();

    try {
      const pageData = await window.electronAPI.content.getPageContent();

      if (!pageData || !pageData.content) {
        this.addSystemMessage("No page content to summarize");
        return;
      }

      this.addSystemMessage(`Summarizing: ${pageData.title}`);

      const prompt = `Summarize the following webpage content concisely:\n\nTitle: ${pageData.title}\nURL: ${pageData.url}\n\nContent:\n${pageData.content}`;

      const response = await this.callAI([{ role: "user", content: prompt }]);

      this.addMessage("assistant", response, "📄 Page Summary");
    } catch (error: any) {
      console.error("[Summarize] Error:", error);

      if (error.name === "AbortError") {
        this.addSystemMessage("Summarization interrupted");
      } else {
        this.addSystemMessage(`Summarization failed: ${error.message}`);
      }
    } finally {
      this.isProcessing = false;
      this.hideInterruptButton();
    }
  }

  /**
   * Extract and display current page context
   */
  private async extractAndDisplayContext() {
    try {
      const pageData = await window.electronAPI.content.getPageContent();
      const selectedText = await window.electronAPI.content.getSelectedText();

      let contextInfo = "";

      if (pageData) {
        contextInfo += `Title: ${pageData.title}\n`;
        contextInfo += `URL: ${pageData.url}\n`;
        contextInfo += `Content length: ${pageData.content.length} characters\n`;
      }

      if (selectedText) {
        contextInfo += `\nSelected text (${
          selectedText.length
        } chars):\n${selectedText.substring(0, 200)}${
          selectedText.length > 200 ? "..." : ""
        }`;
      }

      if (contextInfo) {
        this.addSystemMessage(contextInfo);
      } else {
        this.addSystemMessage("No context available");
      }
    } catch (error: any) {
      console.error("[Context] Error:", error);
      this.addSystemMessage(`Error extracting context: ${error.message}`);
    }
  }

  /**
   * Test connection to LM Studio
   */
  private async testConnection() {
    const statusDiv = document.getElementById("connection-status");
    if (!statusDiv) return;

    statusDiv.style.display = "block";
    statusDiv.style.background = "#fef3c7";
    statusDiv.style.color = "#92400e";
    statusDiv.textContent = "Testing connection...";

    try {
      const response = await fetch(this.settings.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.settings.modelName,
          messages: [{ role: "user", content: "Hello" }],
          max_tokens: 10,
        }),
      });

      if (response.ok) {
        statusDiv.style.background = "#d1fae5";
        statusDiv.style.color = "#065f46";
        statusDiv.textContent = "✓ Connection successful!";
      } else {
        statusDiv.style.background = "#fee2e2";
        statusDiv.style.color = "#991b1b";
        statusDiv.textContent = `✗ Connection failed: ${response.status} ${response.statusText}`;
      }
    } catch (error: any) {
      console.error("[Test] Error:", error);
      statusDiv.style.background = "#fee2e2";
      statusDiv.style.color = "#991b1b";
      statusDiv.textContent = `✗ Connection failed: ${error.message}`;
    }

    setTimeout(() => {
      statusDiv.style.display = "none";
    }, 5000);
  }

  /**
   * Read a file using Electron dialog
   */
  private async readFile() {
    try {
      const result = await window.electronAPI.file.readFile();

      if (result.success) {
        this.showToolOutput(`File: ${result.path}\n\n${result.content}`);
        this.addSystemMessage(`File read: ${result.path}`);
      } else if (result.error !== "User cancelled") {
        this.addSystemMessage(`Error reading file: ${result.error}`);
      }
    } catch (error: any) {
      console.error("[File] Error:", error);
      this.addSystemMessage(`Error: ${error.message}`);
    }
  }

  /**
   * Write a file using Electron dialog
   */
  private async writeFile() {
    // Get content from chat or prompt user
    const content = prompt("Enter content to write to file:");
    if (!content) return;

    try {
      const result = await window.electronAPI.file.writeFile(content);

      if (result.success) {
        this.addSystemMessage(`File written: ${result.path}`);
      } else if (result.error !== "User cancelled") {
        this.addSystemMessage(`Error writing file: ${result.error}`);
      }
    } catch (error: any) {
      console.error("[File] Error:", error);
      this.addSystemMessage(`Error: ${error.message}`);
    }
  }

  /**
   * Prompt for and execute a script on the current page
   */
  private async executeScriptPrompt() {
    const script = prompt("Enter JavaScript to execute on the current page:");
    if (!script) return;

    try {
      const result = await window.electronAPI.content.executeScript(script);

      if (result.success) {
        this.showToolOutput(
          `Script executed successfully.\n\nResult:\n${JSON.stringify(
            result.result,
            null,
            2
          )}`
        );
        this.addSystemMessage("Script executed");
      } else if (result.error !== "User cancelled") {
        this.addSystemMessage(`Script error: ${result.error}`);
      }
    } catch (error: any) {
      console.error("[Script] Error:", error);
      this.addSystemMessage(`Error: ${error.message}`);
    }
  }

  /**
   * Execute a shell command
   */
  private async executeCommand() {
    const input = document.getElementById(
      "shell-command-input"
    ) as HTMLTextAreaElement;
    const command = input.value.trim();

    if (!command) return;

    try {
      const result = await window.electronAPI.shell.executeCommand(command);

      if (result.success) {
        let output = "";
        if (result.stdout) output += `STDOUT:\n${result.stdout}\n`;
        if (result.stderr) output += `STDERR:\n${result.stderr}`;

        this.showToolOutput(output || "Command completed (no output)");
        this.addSystemMessage("Command executed");
        input.value = "";
      } else if (result.error !== "User cancelled") {
        this.showToolOutput(`ERROR:\n${result.error}`);
      }
    } catch (error: any) {
      console.error("[Command] Error:", error);
      this.addSystemMessage(`Error: ${error.message}`);
    }
  }

  /**
   * Show output in the tools panel
   */
  private showToolOutput(output: string) {
    const outputDiv = document.getElementById("tool-output");
    const outputContent = document.getElementById("tool-output-content");

    if (outputDiv && outputContent) {
      outputDiv.style.display = "block";
      outputContent.textContent = output;
    }
  }

  /**
   * Show the interrupt button
   */
  private showInterruptButton() {
    const btn = document.getElementById("interrupt-button");
    if (btn) {
      btn.classList.add("visible");
    }
  }

  /**
   * Hide the interrupt button
   */
  private hideInterruptButton() {
    const btn = document.getElementById("interrupt-button");
    if (btn) {
      btn.classList.remove("visible");
    }
  }

  /**
   * Interrupt current AI operation
   */
  private interruptCurrentOperation() {
    console.log("[Interrupt] User interrupted operation");

    if (this.currentAbortController) {
      this.currentAbortController.abort();
      this.currentAbortController = null;
    }

    this.isProcessing = false;
    this.hideInterruptButton();
    this.addSystemMessage("⛔ Operation interrupted by user");
  }
}

// Initialize the application
const aiBrowser = new AIBrowser();
console.log("[AI Browser] Initialized");
