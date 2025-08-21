#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Seed Store Desktop Setup...\n');

const checks = [
  {
    name: 'Root package.json',
    path: 'package.json',
    required: true
  },
  {
    name: 'Client directory',
    path: 'client',
    required: true
  },
  {
    name: 'Server directory',
    path: 'server',
    required: true
  },
  {
    name: 'Electron directory',
    path: 'electron',
    required: true
  },
  {
    name: 'Client package.json',
    path: 'client/package.json',
    required: true
  },
  {
    name: 'Server package.json',
    path: 'server/package.json',
    required: true
  },
  {
    name: 'Electron package.json',
    path: 'electron/package.json',
    required: true
  },
  {
    name: 'Electron main.js',
    path: 'electron/main.js',
    required: true
  },
  {
    name: 'Electron preload.js',
    path: 'electron/preload.js',
    required: true
  },
  {
    name: 'Electron config.js',
    path: 'electron/config.js',
    required: true
  },
  {
    name: 'Development scripts',
    path: 'scripts/dev-desktop.js',
    required: true
  },
  {
    name: 'Build scripts',
    path: 'scripts/build-desktop.js',
    required: true
  }
];

let allPassed = true;

checks.forEach(check => {
  const fullPath = path.join(__dirname, '..', check.path);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    console.log(`✅ ${check.name}: Found`);
  } else if (check.required) {
    console.log(`❌ ${check.name}: Missing (REQUIRED)`);
    allPassed = false;
  } else {
    console.log(`⚠️  ${check.name}: Missing (optional)`);
  }
});

console.log('\n📋 Package Scripts Check:');
const rootPackage = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
const scripts = rootPackage.scripts || {};

const requiredScripts = [
  'dev:desktop',
  'build:desktop',
  'install:all'
];

requiredScripts.forEach(script => {
  if (scripts[script]) {
    console.log(`✅ ${script}: Available`);
  } else {
    console.log(`❌ ${script}: Missing`);
    allPassed = false;
  }
});

console.log('\n📋 Electron Scripts Check:');
const electronPackage = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'electron/package.json'), 'utf8'));
const electronScripts = electronPackage.scripts || {};

const requiredElectronScripts = [
  'start',
  'dev',
  'build'
];

requiredElectronScripts.forEach(script => {
  if (electronScripts[script]) {
    console.log(`✅ ${script}: Available`);
  } else {
    console.log(`❌ ${script}: Missing`);
    allPassed = false;
  }
});

console.log('\n📋 Dependencies Check:');
const dependencies = rootPackage.devDependencies || {};
if (dependencies.concurrently) {
  console.log('✅ concurrently: Available');
} else {
  console.log('❌ concurrently: Missing');
  allPassed = false;
}

if (dependencies['wait-on']) {
  console.log('✅ wait-on: Available');
} else {
  console.log('❌ wait-on: Missing');
  allPassed = false;
}

console.log('\n' + '='.repeat(50));

if (allPassed) {
  console.log('🎉 All checks passed! Your setup is ready.');
  console.log('\n🚀 To start development:');
  console.log('   npm run dev:desktop');
  console.log('\n🏗️  To build for production:');
  console.log('   npm run build:desktop');
} else {
  console.log('❌ Some checks failed. Please fix the issues above.');
  process.exit(1);
}
