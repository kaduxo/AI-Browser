/**
 * Preload Script - Secure bridge between main and renderer processes
 * Exposes safe IPC methods to the renderer via contextBridge
 */

import { contextBridge, ipcRenderer } from "electron";

// Navigation API
const navigationAPI = {
  navigateTo: (url: string) => ipcRenderer.invoke("navigate-to", url),
  navigateBack: () => ipcRenderer.invoke("navigate-back"),
  navigateForward: () => ipcRenderer.invoke("navigate-forward"),
  reload: () => ipcRenderer.invoke("reload-page"),
  stop: () => ipcRenderer.invoke("stop-loading"),

  // Event listeners
  onNavigated: (callback: (data: any) => void) => {
    ipcRenderer.on("browser-navigated", (event, data) => callback(data));
  },
  onLoading: (callback: (loading: boolean) => void) => {
    ipcRenderer.on("browser-loading", (event, loading) => callback(loading));
  },
  onTitleUpdated: (callback: (title: string) => void) => {
    ipcRenderer.on("browser-title-updated", (event, title) => callback(title));
  },
  onPageInfoUpdated: (callback: (info: any) => void) => {
    ipcRenderer.on("page-info-updated", (event, info) => callback(info));
  },
};

// Page content API
const contentAPI = {
  getPageContent: () => ipcRenderer.invoke("get-page-content"),
  getSelectedText: () => ipcRenderer.invoke("get-selected-text"),
  executeScript: (script: string) =>
    ipcRenderer.invoke("execute-script", script),
};

// File system API (with dialogs)
const fileAPI = {
  readFile: () => ipcRenderer.invoke("read-file"),
  writeFile: (content: string, suggestedName?: string) =>
    ipcRenderer.invoke("write-file", content, suggestedName),
};

// Shell API (with confirmation)
const shellAPI = {
  executeCommand: (command: string) =>
    ipcRenderer.invoke("execute-command", command),
};

// Agent API
const agentAPI = {
  confirmAction: (action: string, details: string) =>
    ipcRenderer.invoke("confirm-agent-action", action, details),
};

// Ad blocker API
const adBlockerAPI = {
  setEnabled: (enabled: boolean) =>
    ipcRenderer.invoke("set-ad-blocker", enabled),
  getStatus: () => ipcRenderer.invoke("get-ad-blocker-status"),
};

// Expose APIs to renderer
contextBridge.exposeInMainWorld("electronAPI", {
  navigation: navigationAPI,
  content: contentAPI,
  file: fileAPI,
  shell: shellAPI,
  agent: agentAPI,
  adBlocker: adBlockerAPI,
});

// Type definitions for TypeScript
export interface ElectronAPI {
  navigation: typeof navigationAPI;
  content: typeof contentAPI;
  file: typeof fileAPI;
  shell: typeof shellAPI;
  agent: typeof agentAPI;
  adBlocker: typeof adBlockerAPI;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
