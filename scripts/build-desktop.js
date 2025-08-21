#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🏗️  Building Seed Store Desktop Application...\n');

// Function to run commands
function runCommand(command, cwd, description) {
  console.log(`📦 ${description}...`);
  try {
    execSync(command, { 
      cwd, 
      stdio: 'inherit',
      shell: true 
    });
    console.log(`✅ ${description} completed successfully`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    process.exit(1);
  }
}

// Check if required directories exist
const clientDir = path.join(__dirname, '../client');
const serverDir = path.join(__dirname, '../server');
const electronDir = path.join(__dirname, '../electron');

if (!fs.existsSync(clientDir)) {
  console.error('❌ Client directory not found');
  process.exit(1);
}

if (!fs.existsSync(serverDir)) {
  console.error('❌ Server directory not found');
  process.exit(1);
}

if (!fs.existsSync(electronDir)) {
  console.error('❌ Electron directory not found');
  process.exit(1);
}

try {
  // Install dependencies if needed
  console.log('📦 Checking dependencies...');
  
  if (!fs.existsSync(path.join(clientDir, 'node_modules'))) {
    console.log('📦 Installing client dependencies...');
    runCommand('npm install', clientDir, 'Installing client dependencies');
  }
  
  if (!fs.existsSync(path.join(serverDir, 'node_modules'))) {
    console.log('📦 Installing server dependencies...');
    runCommand('npm install', serverDir, 'Installing server dependencies');
  }
  
  if (!fs.existsSync(path.join(electronDir, 'node_modules'))) {
    console.log('📦 Installing electron dependencies...');
    runCommand('npm install', electronDir, 'Installing electron dependencies');
  }

  // Build the client
  console.log('\n🏗️  Building client application...');
  runCommand('npm run build', clientDir, 'Building client application');

  // Build the server
  console.log('\n🏗️  Building server application...');
  runCommand('npm run build', serverDir, 'Building server application');

  // Build the desktop application
  console.log('\n🏗️  Building desktop application...');
  runCommand('npm run build', electronDir, 'Building desktop application');

  console.log('\n🎉 Desktop application built successfully!');
  console.log('📁 Output files are in: electron/dist/');
  console.log('🚀 You can now distribute the application to users.');

} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}
