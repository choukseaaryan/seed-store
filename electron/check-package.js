const fs = require('fs');
const path = require('path');

// Check if server files are properly packaged
const electronDistPath = path.join(__dirname, 'dist', 'win-unpacked');
const serverPath = path.join(electronDistPath, 'resources', 'server');

console.log('🔍 Checking packaged server files...\n');

// Check main executable
const mainExe = path.join(electronDistPath, 'Seed Store.exe');
console.log('Main executable:', fs.existsSync(mainExe) ? '✅ Found' : '❌ Missing');

// Check server directory
console.log('Server directory:', fs.existsSync(serverPath) ? '✅ Found' : '❌ Missing');

if (fs.existsSync(serverPath)) {
  // Check server main file
  const serverMain = path.join(serverPath, 'src', 'main.js');
  console.log('Server main.js:', fs.existsSync(serverMain) ? '✅ Found' : '❌ Missing');
  
  // Check node_modules
  const nodeModules = path.join(serverPath, 'node_modules');
  console.log('Node modules:', fs.existsSync(nodeModules) ? '✅ Found' : '❌ Missing');
  
  // Check prisma
  const prisma = path.join(serverPath, 'prisma');
  console.log('Prisma schema:', fs.existsSync(prisma) ? '✅ Found' : '❌ Missing');
  
  // Check package.json
  const packageJson = path.join(serverPath, 'package.json');
  console.log('Package.json:', fs.existsSync(packageJson) ? '✅ Found' : '❌ Missing');
  
  // List server directory contents
  console.log('\n📁 Server directory contents:');
  try {
    const contents = fs.readdirSync(serverPath);
    contents.forEach(item => {
      const itemPath = path.join(serverPath, item);
      const isDir = fs.statSync(itemPath).isDirectory();
      console.log(`  ${isDir ? '📁' : '📄'} ${item}`);
    });
  } catch (error) {
    console.log('  ❌ Could not read directory');
  }
}

// Check client files
const appAsar = path.join(electronDistPath, 'resources', 'app.asar');
console.log('\nClient app.asar:', fs.existsSync(appAsar) ? '✅ Found' : '❌ Missing');

console.log('\n✨ Package verification complete!');
