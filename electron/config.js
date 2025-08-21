const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  // Development settings
  development: {
    clientUrl: 'http://localhost:3000',
    serverUrl: 'http://localhost:3001',
    openDevTools: true,
    enableHotReload: true
  },
  
  // Production settings
  production: {
    clientPath: path.join(__dirname, '../client/dist/index.html'),
    serverPath: path.join(__dirname, '../server/dist'),
    openDevTools: false,
    enableHotReload: false
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
    webSecurity: true
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
