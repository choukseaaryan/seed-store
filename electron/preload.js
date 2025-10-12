const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Get application information
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getAppName: () => ipcRenderer.invoke('get-app-name'),
  
  // Menu actions
  onMenuAction: (callback) => {
    ipcRenderer.on('menu-action', (event, action) => callback(action));
  },
  
  // Remove menu action listener
  removeMenuActionListener: () => {
    ipcRenderer.removeAllListeners('menu-action');
  },
  
  // Platform information
  platform: process.platform,
  
  // Development mode
  isDev: process.env.NODE_ENV === 'development'
});

// Ensure electronAPI is available before DOM loads
window.addEventListener('DOMContentLoaded', () => {
  // Set title
  document.title = 'Seed Store - Inventory Management System';
  
  // Add platform-specific CSS classes
  document.body.classList.add(`platform-${process.platform}`);
  
  // Handle menu actions - ensure electronAPI exists
  if (window.electronAPI && window.electronAPI.onMenuAction) {
    window.electronAPI.onMenuAction((action) => {
      switch (action) {
        case 'new-sale':
          // Navigate to POS page if we're in the app
          if (window.location.pathname !== '/pos') {
            window.location.href = '/pos';
          }
          break;
        default:
          console.log('Unknown menu action:', action);
      }
    });
  }
});

// Clean up listeners when page unloads
window.addEventListener('beforeunload', () => {
  if (window.electronAPI && window.electronAPI.removeMenuActionListener) {
    window.electronAPI.removeMenuActionListener();
  }
});
