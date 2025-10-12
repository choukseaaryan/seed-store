# Seed Store - Standalone Distribution

## Building the Standalone Application

### Option 1: Using NPM Scripts (Recommended)
```bash
# Build and create distributable package
npm run dist:standalone

# Or just build without creating installer
npm run pack:standalone
```

### Option 2: Using Batch File (Windows)
```cmd
# Double-click or run from command line
build-standalone.bat
```

### Option 3: Manual Steps
```bash
# 1. Install all dependencies
npm run install:all

# 2. Build server
cd server && npm run build && cd ..

# 3. Build client
cd client && npm run build && cd ..

# 4. Build and package Electron app
cd electron && npm run dist
```

## What Gets Packaged

The standalone distribution includes:
- **React Frontend**: Built client application
- **NestJS Backend**: Compiled server with all dependencies
- **Electron Desktop App**: Desktop wrapper that manages both
- **Database**: SQLite database for data persistence
- **All Dependencies**: Everything needed to run without external requirements

## Distribution Files

After building, you'll find in `electron/dist/`:
- **Windows**: `.exe` installer and portable `.exe`
- **macOS**: `.dmg` installer and `.app` bundle
- **Linux**: `.AppImage` and `.deb` packages

## Database Configuration

The standalone app uses SQLite by default for maximum portability. The database file is stored in:
- **Windows**: `%APPDATA%/Seed Store/seed-store.db`
- **macOS**: `~/Library/Application Support/Seed Store/seed-store.db`
- **Linux**: `~/.config/Seed Store/seed-store.db`

## Running the Standalone App

1. **Install**: Run the appropriate installer for your platform
2. **Launch**: Start "Seed Store" from your applications menu
3. **First Run**: The app will automatically:
   - Create the database
   - Start the embedded server
   - Open the desktop interface

## Architecture

```
┌─────────────────────────────────┐
│         Electron Main           │
│  ┌─────────────────────────────┐│
│  │     Server Manager          ││
│  │   (Manages NestJS Server)   ││
│  └─────────────────────────────┘│
│  ┌─────────────────────────────┐│
│  │     Browser Window          ││
│  │    (React Frontend)         ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│      Embedded NestJS Server    │
│  ┌─────────────────────────────┐│
│  │      SQLite Database        ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘
```

## Troubleshooting

### Server Won't Start
- Check if port 3001 is already in use
- Look for error messages in console (Ctrl+Shift+I in development)
- Ensure all dependencies are properly bundled

### Database Issues
- Delete the database file to reset
- Check file permissions in the app data directory
- Ensure SQLite is properly configured

### Build Issues
- Run `npm run clean` and try again
- Ensure all dependencies are installed: `npm run install:all`
- Check Node.js version (requires Node 18+)

## Development vs Production

| Aspect | Development | Production |
|--------|-------------|------------|
| Client | Vite dev server (port 3000) | Built files in Electron |
| Server | Separate NestJS process | Embedded in Electron |
| Database | Development database | SQLite in user data |
| Hot Reload | Enabled | Disabled |
| DevTools | Auto-open | Disabled |
| CORS | Localhost only | File:// protocol |

## Security Notes

- Server runs locally only (localhost:3001)
- No external network access required
- Database is local SQLite file
- All communication stays within the desktop app
- Production builds disable development tools

## Customization

To modify the standalone build:

1. **Server Settings**: Edit `server/.env.production`
2. **Electron Config**: Modify `electron/config.js`
3. **Build Settings**: Update `electron/package.json` build section
4. **Database**: Change Prisma schema and rebuild

## Support

For issues with the standalone distribution:
1. Check the troubleshooting section above
2. Enable DevTools (Ctrl+Shift+I) to see console errors
3. Check the application logs in the data directory
