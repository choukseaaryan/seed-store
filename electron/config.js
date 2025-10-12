const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  // Development settings
  development: {
    clientUrl: 'http://localhost:3000',
    serverUrl: 'http://localhost:3001',
    openDevTools: true,
    enableHotReload: true,
    useEmbeddedServer: false,
    nodeEnv: 'development'
  },
  
  // Production settings
  production: {
    clientPath: path.join(__dirname, 'index.html'),
    serverPath: path.join(__dirname, '..', 'server'),
    serverPort: 3001,
    openDevTools: false,
    enableHotReload: false,
    useEmbeddedServer: true,
    nodeEnv: 'production'
  },
  
  // Window settings
  window: {
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    show: false,
    titleBarStyle: 'default',
    title: 'Seed Store - Inventory Management System'
  },
  
  // Security settings
  security: {
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
    webSecurity: false // Disable for local file access in Electron
  },
  
  // Build settings
  build: {
    appId: 'com.seedstore.desktop',
    productName: 'Seed Store',
    directories: {
      output: 'dist',
      buildResources: 'build'
    }
  },
  
  // Get current config based on environment
  get current() {
    return this[isDev ? 'development' : 'production'];
  },
  
  // Get window config
  get windowConfig() {
    return {
      ...this.window,
      webPreferences: {
        ...this.security,
        preload: path.join(__dirname, 'preload.js')
      }
    };
  }
};
