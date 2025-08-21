#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Seed Store Desktop Development Environment...\n');

// Function to start a process
function startProcess(name, command, args, cwd, env = {}) {
  console.log(`📦 Starting ${name}...`);
  
  const process = spawn(command, args, {
    cwd,
    env: { ...process.env, ...env },
    stdio: 'pipe',
    shell: true
  });

  process.stdout.on('data', (data) => {
    console.log(`[${name}] ${data.toString().trim()}`);
  });

  process.stderr.on('data', (data) => {
    console.error(`[${name}] ERROR: ${data.toString().trim()}`);
  });

  process.on('close', (code) => {
    console.log(`[${name}] Process exited with code ${code}`);
  });

  process.on('error', (error) => {
    console.error(`[${name}] Failed to start: ${error.message}`);
  });

  return process;
}

// Start the server
const serverProcess = startProcess(
  'Server',
  'npm',
  ['run', 'dev'],
  path.join(__dirname, '../server')
);

// Wait a bit for server to start, then start client
setTimeout(() => {
  const clientProcess = startProcess(
    'Client',
    'npm',
    ['run', 'dev'],
    path.join(__dirname, '../client')
  );

  // Wait for client to be ready, then start Electron
  setTimeout(() => {
    const electronProcess = startProcess(
      'Electron',
      'npm',
      ['run', 'dev'],
      path.join(__dirname, '../electron'),
      { NODE_ENV: 'development' }
    );

    // Handle cleanup on exit
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down development environment...');
      serverProcess.kill();
      clientProcess.kill();
      electronProcess.kill();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('\n🛑 Shutting down development environment...');
      serverProcess.kill();
      clientProcess.kill();
      electronProcess.kill();
      process.exit(0);
    });
  }, 5000); // Wait 5 seconds for client to start
}, 3000); // Wait 3 seconds for server to start

console.log('\n⏳ Waiting for services to start...');
console.log('📱 Electron app will launch automatically when ready');
console.log('🔄 Press Ctrl+C to stop all services\n');
