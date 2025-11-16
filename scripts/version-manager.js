#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Version bump script for Seed Store monorepo
 * Manages version consistency across all packages
 */

const PACKAGES = [
  { name: 'root', path: '.' },
  { name: 'client', path: './client' },
  { name: 'server', path: './server' },
  { name: 'electron', path: './electron' }
];

function getCurrentVersion() {
  const rootPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  return rootPackage.version;
}

function updatePackageVersion(packagePath, newVersion) {
  const packageJsonPath = path.join(packagePath, 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    console.warn(`Warning: package.json not found in ${packagePath}`);
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  packageJson.version = newVersion;
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  console.log(`✅ Updated ${packagePath}/package.json to version ${newVersion}`);
}

function bumpVersion(type = 'patch') {
  const currentVersion = getCurrentVersion();
  console.log(`Current version: ${currentVersion}`);
  
  const [major, minor, patch] = currentVersion.split('.').map(Number);
  let newVersion;
  
  switch (type) {
    case 'major':
      newVersion = `${major + 1}.0.0`;
      break;
    case 'minor':
      newVersion = `${major}.${minor + 1}.0`;
      break;
    case 'patch':
      newVersion = `${major}.${minor}.${patch + 1}`;
      break;
    default:
      // Custom version (e.g., "1.2.3-beta.1")
      newVersion = type;
  }
  
  console.log(`New version: ${newVersion}`);
  
  // Update all packages
  PACKAGES.forEach(pkg => {
    updatePackageVersion(pkg.path, newVersion);
  });
  
  return newVersion;
}

function validateVersionConsistency() {
  const rootVersion = getCurrentVersion();
  let consistent = true;
  
  console.log('\n🔍 Checking version consistency...');
  
  PACKAGES.forEach(pkg => {
    const packageJsonPath = path.join(pkg.path, 'package.json');
    
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      if (packageJson.version !== rootVersion) {
        console.error(`❌ Version mismatch: ${pkg.name} has ${packageJson.version}, expected ${rootVersion}`);
        consistent = false;
      } else {
        console.log(`✅ ${pkg.name}: ${packageJson.version}`);
      }
    }
  });
  
  return consistent;
}

function createGitTag(version) {
  try {
    execSync(`git add .`, { stdio: 'inherit' });
    execSync(`git commit -m "chore: bump version to ${version}"`, { stdio: 'inherit' });
    execSync(`git tag -a v${version} -m "Release version ${version}"`, { stdio: 'inherit' });
    console.log(`✅ Created git tag v${version}`);
  } catch (error) {
    console.error('❌ Failed to create git tag:', error.message);
  }
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'bump':
      const bumpType = args[1] || 'patch';
      const newVersion = bumpVersion(bumpType);
      
      if (validateVersionConsistency()) {
        console.log('\n🎉 All versions updated successfully!');
        
        if (args.includes('--tag')) {
          createGitTag(newVersion);
        }
      } else {
        console.error('\n❌ Version consistency check failed!');
        process.exit(1);
      }
      break;
      
    case 'check':
      if (validateVersionConsistency()) {
        console.log('\n✅ All versions are consistent!');
      } else {
        console.error('\n❌ Version inconsistencies found!');
        process.exit(1);
      }
      break;
      
    case 'current':
      console.log(getCurrentVersion());
      break;
      
    default:
      console.log(`
🚀 Seed Store Version Manager

Usage:
  node scripts/version-manager.js bump [major|minor|patch|custom] [--tag]
  node scripts/version-manager.js check
  node scripts/version-manager.js current

Examples:
  node scripts/version-manager.js bump patch          # 1.0.0 -> 1.0.1
  node scripts/version-manager.js bump minor         # 1.0.0 -> 1.1.0
  node scripts/version-manager.js bump major         # 1.0.0 -> 2.0.0
  node scripts/version-manager.js bump 1.2.3-beta.1  # Custom version
  node scripts/version-manager.js bump patch --tag   # Bump and create git tag
  node scripts/version-manager.js check              # Check consistency
  node scripts/version-manager.js current            # Show current version
      `);
  }
}

main();