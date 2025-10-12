const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building Seed Store Desktop Application...');

function runCommand(command, cwd = process.cwd()) {
  console.log(`Running: ${command}`);
  try {
    execSync(command, { 
      cwd, 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    });
  } catch (error) {
    console.error(`Failed to run: ${command}`);
    process.exit(1);
  }
}

function ensureDirectory(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Step 1: Install dependencies
console.log('\n📦 Installing dependencies...');
runCommand('npm run install:all', path.join(__dirname, '..'));

// Step 2: Build server
console.log('\n🔧 Building server...');
runCommand('npm run build', path.join(__dirname, '..', 'server'));

// Step 3: Build client
console.log('\n⚛️ Building client...');
runCommand('npm run build', path.join(__dirname, '..', 'client'));

// Step 4: Prepare server for packaging
console.log('\n📋 Preparing server for packaging...');
const serverDistPath = path.join(__dirname, '..', 'server', 'dist');
const serverNodeModulesPath = path.join(__dirname, '..', 'server', 'node_modules');
const serverPackageJsonPath = path.join(__dirname, '..', 'server', 'package.json');

// Verify server build exists
if (!fs.existsSync(serverDistPath)) {
  console.error('❌ Server build not found!');
  process.exit(1);
}

if (!fs.existsSync(serverNodeModulesPath)) {
  console.error('❌ Server node_modules not found!');
  process.exit(1);
}

if (!fs.existsSync(serverPackageJsonPath)) {
  console.error('❌ Server package.json not found!');
  process.exit(1);
}

// Step 5: Build Electron app
console.log('\n🖥️ Building Electron application...');
runCommand('npm run build', path.join(__dirname));

console.log('\n✅ Build completed successfully!');
console.log('\n📁 Find your distributable in: electron/dist/');
console.log('\n🎉 Your standalone Seed Store application is ready!')
