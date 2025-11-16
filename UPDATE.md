# Auto-Update System Documentation

The Seed Store desktop application includes a comprehensive auto-update system that ensures users always have the latest features and security updates.

## Overview

The update system is built using:
- **electron-updater**: Handles the core update functionality
- **GitHub Releases**: Serves as the update server and distribution platform
- **GitHub Actions**: Automates the build and release process
- **Code Signing**: Ensures update authenticity and security

## User Experience

### Update Notifications

Users receive notifications about available updates through:
1. **Startup Check**: Automatic check 3 seconds after application startup
2. **Menu Option**: Manual check via "Help > Check for Updates"
3. **Visual Notifications**: In-app notification banners with progress indicators

### Update Process

1. **Detection**: App checks GitHub Releases for newer versions
2. **Notification**: User is informed about available updates
3. **Download**: User can choose to download the update
4. **Installation**: After download, user can restart and install
5. **Verification**: Updates are verified before installation

### Update Settings

Users can control update behavior through:
- Auto-check on startup (default: enabled)
- Auto-download updates (default: disabled)
- Update notifications (default: enabled)
- Check interval (default: 24 hours)

## Developer Guide

### Release Process

1. **Prepare Release**:
   ```bash
   npm run prepare:release [patch|minor|major]
   ```

2. **Version Management**:
   ```bash
   npm run version:bump patch    # Bump patch version
   npm run version:check         # Validate version consistency
   npm run version:current       # Show current version
   ```

3. **Create Release**:
   ```bash
   git push origin v1.0.1        # Push version tag to trigger release
   ```

### GitHub Actions Workflow

The release workflow:
1. Builds the application for all platforms (Windows, macOS, Linux)
2. Signs the executables (when certificates are configured)
3. Creates a GitHub Release with all platform assets
4. Updates the auto-updater metadata files

### Configuration

#### electron-builder Configuration

```json
{
  "publish": {
    "provider": "github",
    "owner": "choukseaaryan",
    "repo": "seed-store"
  }
}
```

#### Auto-updater Settings

```javascript
// In main.js
autoUpdater.checkForUpdatesAndNotify();
```

### Security

#### Code Signing

- **Windows**: Requires `.p12/.pfx` certificate and password
- **macOS**: Requires Apple Developer certificates and notarization
- **Linux**: Uses embedded signatures in AppImage format

#### Verification

Updates are verified through:
- Digital signatures (Windows/macOS)
- Checksum validation
- HTTPS-only downloads
- Publisher verification

### Testing Updates

#### Development Mode

In development, auto-updater is disabled. Use:
```bash
npm run dev:desktop
```

#### Testing Environment

For testing updates:
1. Create a separate GitHub repository
2. Update the publish configuration
3. Build and test the update flow
4. Verify rollback mechanisms

### Troubleshooting

#### Common Issues

1. **Update Check Fails**
   - Check internet connection
   - Verify GitHub repository access
   - Check rate limiting

2. **Download Fails**
   - Check available disk space
   - Verify permissions
   - Check antivirus interference

3. **Installation Fails**
   - Check administrator privileges
   - Verify file integrity
   - Check for running processes

#### Debug Information

Enable debug logging:
```javascript
autoUpdater.logger = console;
autoUpdater.logger.transports.file.level = 'debug';
```

Logs are saved to:
- **Windows**: `%USERPROFILE%\\AppData\\Roaming\\seed-store-electron\\logs\\`
- **macOS**: `~/Library/Logs/seed-store-electron/`
- **Linux**: `~/.config/seed-store-electron/logs/`

### Manual Updates

If auto-update fails, users can:
1. Download the latest installer from GitHub Releases
2. Uninstall the current version
3. Install the new version manually

### Rollback Mechanism

Currently, rollback is handled by:
1. Keeping the previous version installer
2. Manual rollback through uninstall/reinstall
3. Future: Automatic rollback on failed updates

## API Reference

### Electron Main Process

```javascript
// Check for updates
autoUpdater.checkForUpdatesAndNotify();

// Download update
autoUpdater.downloadUpdate();

// Install update
autoUpdater.quitAndInstall();
```

### Renderer Process

```javascript
// Check for updates
await window.electronAPI.checkForUpdates();

// Listen for update status
window.electronAPI.onUpdateStatus((status) => {
  console.log('Update status:', status);
});
```

### React Hooks

```javascript
import { useUpdate } from './context/UpdateContext';

const {
  updateStatus,
  isUpdateAvailable,
  checkForUpdates,
  downloadUpdate,
  installUpdate
} = useUpdate();
```

## Best Practices

### For Releases

1. Always test updates in a staging environment
2. Include detailed release notes
3. Increment versions following semantic versioning
4. Sign all releases for security
5. Verify update metadata files

### For Development

1. Test update scenarios during development
2. Handle all update states in the UI
3. Provide clear error messages
4. Test network failure scenarios
5. Validate update package integrity

### For Users

1. Keep the application updated
2. Review release notes before updating
3. Report update issues promptly
4. Maintain backups of important data

## Monitoring

### Analytics

Track update metrics:
- Update adoption rates
- Success/failure rates
- Time to update
- User update preferences

### Error Reporting

Monitor update errors:
- Network connectivity issues
- Permission problems
- Corrupted downloads
- Installation failures

## Future Enhancements

### Planned Features

1. **Delta Updates**: Reduce download size for incremental updates
2. **Background Downloads**: Download updates without user interaction
3. **Rollback Automation**: Automatic rollback on failed updates
4. **Beta Channels**: Support for alpha/beta release channels
5. **Update Scheduling**: Allow users to schedule update installations

### Improvements

1. Better error handling and recovery
2. Enhanced progress indicators
3. Offline update capability
4. Update size optimization
5. Faster update checks