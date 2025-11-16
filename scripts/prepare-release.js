#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Release preparation script for Seed Store
 * Handles version bumping, changelog generation, and pre-release validation
 */

function runCommand(command, description) {
  console.log(`📦 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit', shell: true });
    console.log(`✅ ${description} completed successfully`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    process.exit(1);
  }
}

function checkGitStatus() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim()) {
      console.error('❌ Git working directory is not clean. Please commit or stash your changes.');
      console.log(status);
      process.exit(1);
    }
    console.log('✅ Git working directory is clean');
  } catch (error) {
    console.error('❌ Failed to check git status:', error.message);
    process.exit(1);
  }
}

function generateChangelog(version) {
  const changelogPath = 'CHANGELOG.md';
  const today = new Date().toISOString().split('T')[0];
  
  // Create changelog if it doesn't exist
  if (!fs.existsSync(changelogPath)) {
    const initialChangelog = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [${version}] - ${today}

### Added
- Initial release of Seed Store Desktop Application
- Inventory management system
- Point of sale (POS) functionality
- Customer management
- Supplier management
- Automatic updates via GitHub Releases
- Cross-platform desktop application (Windows, macOS, Linux)

### Changed
- N/A

### Deprecated
- N/A

### Removed
- N/A

### Fixed
- N/A

### Security
- N/A
`;
    fs.writeFileSync(changelogPath, initialChangelog);
    console.log(`✅ Created CHANGELOG.md for version ${version}`);
  } else {
    // Add new version entry to existing changelog
    const existingChangelog = fs.readFileSync(changelogPath, 'utf8');
    const newEntry = `
## [${version}] - ${today}

### Added
- 

### Changed
- 

### Fixed
- 

`;
    
    const lines = existingChangelog.split('\n');
    const insertIndex = lines.findIndex(line => line.startsWith('## ['));
    
    if (insertIndex !== -1) {
      lines.splice(insertIndex, 0, ...newEntry.split('\n'));
      fs.writeFileSync(changelogPath, lines.join('\n'));
      console.log(`✅ Added entry for version ${version} to CHANGELOG.md`);
      console.log('⚠️  Please edit CHANGELOG.md to add release notes before continuing');
    }
  }
}

function validateBuild() {
  console.log('🔍 Validating build...');
  
  // Check if all dependencies are installed
  ['client', 'server', 'electron'].forEach(dir => {
    const nodeModulesPath = path.join(dir, 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
      console.error(`❌ Dependencies not installed in ${dir}`);
      process.exit(1);
    }
  });
  
  // Run linting
  runCommand('npm run lint', 'Running linting checks');
  
  // Run tests
  runCommand('npm run test', 'Running tests');
  
  // Build all packages
  runCommand('npm run build', 'Building all packages');
  
  console.log('✅ Build validation completed');
}

function prepareRelease(versionType = 'patch', options = {}) {
  console.log('🚀 Starting release preparation...\n');
  
  // Check git status
  checkGitStatus();
  
  // Install dependencies
  runCommand('npm run install:all', 'Installing all dependencies');
  
  // Validate build
  if (!options.skipValidation) {
    validateBuild();
  }
  
  // Bump version
  const tagFlag = options.createTag ? '--tag' : '';
  runCommand(`node scripts/version-manager.js bump ${versionType} ${tagFlag}`, `Bumping version (${versionType})`);
  
  // Get new version
  const newVersion = execSync('node scripts/version-manager.js current', { encoding: 'utf8' }).trim();
  
  // Generate/update changelog
  generateChangelog(newVersion);
  
  // Build desktop app for release
  if (!options.skipBuild) {
    runCommand('npm run build:desktop', 'Building desktop application');
  }
  
  console.log(`\n🎉 Release preparation completed for version ${newVersion}`);
  
  if (options.createTag) {
    console.log(`📌 Git tag v${newVersion} has been created`);
    console.log(`🚀 Push the tag to trigger the release: git push origin v${newVersion}`);
  } else {
    console.log('📝 Next steps:');
    console.log('1. Review and edit CHANGELOG.md');
    console.log('2. Commit changes: git add . && git commit -m "chore: prepare release v' + newVersion + '"');
    console.log('3. Create tag: git tag -a v' + newVersion + ' -m "Release v' + newVersion + '"');
    console.log('4. Push tag: git push origin v' + newVersion);
  }
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'patch';
  
  const options = {
    skipValidation: args.includes('--skip-validation'),
    skipBuild: args.includes('--skip-build'),
    createTag: args.includes('--tag')
  };
  
  if (['--help', '-h'].includes(command)) {
    console.log(`
🚀 Seed Store Release Preparation

Usage:
  node scripts/prepare-release.js [version-type] [options]

Version Types:
  patch    Patch release (default): 1.0.0 -> 1.0.1
  minor    Minor release: 1.0.0 -> 1.1.0
  major    Major release: 1.0.0 -> 2.0.0
  x.y.z    Custom version: 1.2.3-beta.1

Options:
  --skip-validation    Skip lint and test validation
  --skip-build        Skip desktop build
  --tag               Create git tag automatically
  --help, -h          Show this help message

Examples:
  node scripts/prepare-release.js patch
  node scripts/prepare-release.js minor --tag
  node scripts/prepare-release.js 1.0.0-beta.1 --skip-validation
    `);
    return;
  }
  
  prepareRelease(command, options);
}

main();