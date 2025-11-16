const { app, BrowserWindow, Menu, shell } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const fs = require('fs');
const config = require('./config');
const serverManager = require('./server-manager');

let mainWindow;

// Setup logging
const logPath = path.join(app.getPath('userData'), 'app.log');
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

// Override console methods to also write to file
console.log = (...args) => {
  const message = `[${new Date().toISOString()}] LOG: ${args.join(' ')}\n`;
  originalConsoleLog(...args);
  fs.appendFileSync(logPath, message);
};

console.error = (...args) => {
  const message = `[${new Date().toISOString()}] ERROR: ${args.join(' ')}\n`;
  originalConsoleError(...args);
  fs.appendFileSync(logPath, message);
};

console.log(`Logging to: ${logPath}`);

// Configure auto-updater
autoUpdater.logger = {
  info: console.log,
  warn: console.log,
  error: console.error
};

// Auto-updater event handlers
autoUpdater.on('checking-for-update', () => {
  console.log('Checking for update...');
  if (mainWindow) {
    mainWindow.webContents.send('update-status', { type: 'checking' });
  }
});

autoUpdater.on('update-available', (info) => {
  console.log('Update available:', info);
  if (mainWindow) {
    mainWindow.webContents.send('update-status', { 
      type: 'available', 
      version: info.version,
      releaseNotes: info.releaseNotes 
    });
  }
});

autoUpdater.on('update-not-available', (info) => {
  console.log('Update not available:', info);
  if (mainWindow) {
    mainWindow.webContents.send('update-status', { type: 'not-available' });
  }
});

autoUpdater.on('error', (err) => {
  console.error('Error in auto-updater:', err);
  if (mainWindow) {
    mainWindow.webContents.send('update-status', { 
      type: 'error', 
      message: err.message 
    });
  }
});

autoUpdater.on('download-progress', (progressObj) => {
  console.log(`Download progress: ${progressObj.percent}%`);
  if (mainWindow) {
    mainWindow.webContents.send('update-status', { 
      type: 'downloading', 
      progress: progressObj 
    });
  }
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('Update downloaded:', info);
  if (mainWindow) {
    mainWindow.webContents.send('update-status', { 
      type: 'downloaded', 
      version: info.version 
    });
  }
});

async function createWindow() {
  console.log(`App starting in ${config.current.nodeEnv} mode`);
  // Start embedded server first in production
  if (config.current.useEmbeddedServer) {
    try {
      console.log('Starting embedded server...');
      await serverManager.startServer();
      console.log('Embedded server started successfully');
      
      // Wait a bit more for server to be fully ready
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error) {
      console.error('Failed to start embedded server:', error);
      // Continue anyway - might work with external server
    }
  }

  // Create the browser window
  mainWindow = new BrowserWindow(config.windowConfig);

  // Load the app
  if (config.current.clientUrl) {
    // In development, load from Vite dev server
    mainWindow.loadURL(config.current.clientUrl);
    // Open DevTools in development
    if (config.current.openDevTools) {
      mainWindow.webContents.openDevTools();
    }
  } else {
    // In production, load the built React app
    mainWindow.loadFile(config.current.clientPath);
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    // Maximize the window
    mainWindow.maximize();
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Prevent navigation to external URLs or file:// URLs
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    // Allow navigation within the app
    if (parsedUrl.protocol === 'file:' && parsedUrl.pathname.includes(config.current.clientPath.replace("index.html", ""))) {
      return;
    }
    
    // Allow localhost for API calls
    if (parsedUrl.protocol === 'http:' && parsedUrl.hostname === 'localhost') {
      return;
    }
    
    // Prevent all other navigation
    event.preventDefault();
    
    // If it's an external URL, open in default browser
    if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
      shell.openExternal(navigationUrl);
    }
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(async () => {
  await createWindow();

  // On macOS, re-create window when dock icon is clicked
  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow();
    }
  });

  // Create application menu
  createMenu();
  
  // Initialize auto-updater (only in production)
  if (!app.isPackaged) {
    console.log('Development mode: Skipping auto-updater');
  } else {
    console.log('Production mode: Initializing auto-updater');
    // Check for updates on startup
    setTimeout(() => {
      autoUpdater.checkForUpdatesAndNotify();
    }, 3000); // Wait 3 seconds after startup
  }
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  // Stop the embedded server
  serverManager.stopServer();
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle app quit
app.on('before-quit', () => {
  serverManager.stopServer();
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Sale',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send('menu-action', 'new-sale');
            }
          }
        },
        {
          label: 'Exit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo', label: 'Undo' },
        { role: 'redo', label: 'Redo' },
        { type: 'separator' },
        { role: 'cut', label: 'Cut' },
        { role: 'copy', label: 'Copy' },
        { role: 'paste', label: 'Paste' },
        { role: 'selectall', label: 'Select All' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload', label: 'Reload' },
        { role: 'forceReload', label: 'Force Reload' },
        { role: 'toggleDevTools', label: 'Toggle Developer Tools' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Actual Size' },
        { role: 'zoomIn', label: 'Zoom In' },
        { role: 'zoomOut', label: 'Zoom Out' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Toggle Full Screen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize', label: 'Minimize' },
        { role: 'close', label: 'Close' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Show Log File',
          click: () => {
            shell.showItemInFolder(logPath);
          }
        },
        {
          label: 'Open Log File',
          click: () => {
            shell.openPath(logPath);
          }
        },
        { type: 'separator' },
        {
          label: 'Check for Updates',
          click: () => {
            if (app.isPackaged) {
              autoUpdater.checkForUpdatesAndNotify();
            } else {
              require('electron').dialog.showMessageBox(mainWindow, {
                type: 'info',
                title: 'Updates',
                message: 'Updates are not available in development mode'
              });
            }
          }
        },
        { type: 'separator' },
        {
          label: 'About Seed Store',
          click: () => {
            // Show about dialog
            require('electron').dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About Seed Store',
              message: 'Seed Store - Inventory Management System',
              detail: `Version ${app.getVersion()}\nA comprehensive inventory and POS system for seed stores.`
            });
          }
        }
      ]
    }
  ];

  // Add macOS-specific menu items
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about', label: 'About Seed Store' },
        { type: 'separator' },
        { role: 'services', label: 'Services' },
        { type: 'separator' },
        { role: 'hide', label: 'Hide Seed Store' },
        { role: 'hideOthers', label: 'Hide Others' },
        { role: 'unhide', label: 'Show All' },
        { type: 'separator' },
        { role: 'quit', label: 'Quit Seed Store' }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Handle IPC messages from renderer process
const { ipcMain } = require('electron');

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('get-app-name', () => {
  return app.getName();
});

// Handle update-related IPC messages
ipcMain.handle('check-for-updates', () => {
  if (!app.isPackaged) {
    return { error: 'Updates not available in development mode' };
  }
  autoUpdater.checkForUpdates();
  return { success: true };
});

ipcMain.handle('download-update', () => {
  if (!app.isPackaged) {
    return { error: 'Updates not available in development mode' };
  }
  autoUpdater.downloadUpdate();
  return { success: true };
});

ipcMain.handle('install-update', () => {
  if (!app.isPackaged) {
    return { error: 'Updates not available in development mode' };
  }
  autoUpdater.quitAndInstall();
  return { success: true };
});

// Handle menu actions
ipcMain.on('menu-action', (event, action) => {
  console.log('Menu action:', action);
});
