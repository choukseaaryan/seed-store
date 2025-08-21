# Seed Store Desktop Application

This directory contains the Electron wrapper that transforms the Seed Store web application into a native desktop application.

## Features

- **Cross-platform**: Windows, macOS, and Linux support
- **Integrated**: Both frontend and backend run within the desktop app
- **Native**: Full access to system resources and native APIs
- **Secure**: Context isolation and security best practices
- **Menu Integration**: Native application menus with keyboard shortcuts

## Development

### Prerequisites

- Node.js 18+ and npm
- All dependencies installed in parent directories

### Quick Start

```bash
# From the root directory
npm run dev:desktop

# Or from this directory
npm run dev
```

### Development Mode

In development mode, the Electron app:
- Loads the React app from `http://localhost:3000`
- Opens DevTools automatically
- Enables hot reload
- Connects to the development server

### Production Mode

In production mode, the Electron app:
- Loads the built React app from `../client/dist/`
- Includes the built server as extra resources
- Runs without DevTools
- Optimized for distribution

## Building

### Build for Current Platform

```bash
npm run build
```

### Build for Specific Platform

```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux
```

### Create Distributables

```bash
# Create unpacked app
npm run pack

# Create installers
npm run dist
```

## Configuration

The `config.js` file contains all configuration options:

- **Window settings**: Size, position, behavior
- **Security settings**: Node integration, context isolation
- **Build settings**: App ID, product name, directories
- **Environment-specific settings**: Development vs production

## Security

The Electron app follows security best practices:

- **Context Isolation**: Renderer process cannot access Node.js APIs directly
- **Preload Script**: Secure communication between main and renderer processes
- **No Node Integration**: Renderer process runs in a sandbox
- **Web Security**: Prevents loading of insecure content

## File Structure

```
electron/
├── main.js          # Main Electron process
├── preload.js       # Preload script for security
├── config.js        # Configuration file
├── package.json     # Dependencies and scripts
├── assets/          # App icons and resources
└── README.md        # This file
```

## Troubleshooting

### Common Issues

1. **App won't start**: Check if all dependencies are installed
2. **Blank screen**: Ensure the React app is running on the correct port
3. **Build failures**: Verify that client and server have been built first

### Debug Mode

To enable debug mode, set the environment variable:

```bash
# Windows
set NODE_ENV=development

# macOS/Linux
export NODE_ENV=development
```

### Logs

Check the console output for error messages. In development mode, DevTools will also show any JavaScript errors.

## Distribution

The built application will be available in the `dist/` directory:

- **Windows**: `.exe` installer and portable `.exe`
- **macOS**: `.dmg` disk image
- **Linux**: `.AppImage` and other package formats

## Contributing

When modifying the Electron app:

1. Test on all target platforms
2. Follow security best practices
3. Update configuration as needed
4. Test both development and production modes
