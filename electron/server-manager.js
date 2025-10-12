const { spawn } = require('child_process');
const path = require('path');
const { app } = require('electron');
const config = require('./config');

class ServerManager {
  constructor() {
    this.serverProcess = null;
    this.isServerRunning = false;
    this.serverPort = config.current.serverPort || 3001;
  }

  async startServer() {
    if (this.isServerRunning || !config.current.useEmbeddedServer) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      try {
        const serverPath = config.current.serverPath;
        const isPackaged = app.isPackaged;
        console.log(`Is packaged: ${isPackaged}`);
        
        let command, args, options;

        if (isPackaged) {
          // In production, run the compiled server
          const serverExecutable = path.join(serverPath, 'src', 'main.js');
          command = 'node';
          args = [serverExecutable];
          options = {
            cwd: serverPath,
            env: {
              ...process.env,
              NODE_ENV: 'production',
              PORT: this.serverPort,
              CLIENT_URL: `file://${path.join(__dirname, 'index.html')}`,
              DATABASE_URL: `postgresql://postgres:1234@localhost:5432/seedstore`,
              NODE_PATH: path.join(serverPath, 'node_modules')
            },
            stdio: ['pipe', 'pipe', 'pipe'],
            shell: true // Important for Windows
          };
        } else {
          // In development, use npm run dev
          command = 'npm';
          args = ['run', 'dev'];
          options = {
            cwd: path.join(__dirname, '..', 'server'),
            env: {
              ...process.env,
              NODE_ENV: 'development',
              PORT: this.serverPort
            },
            stdio: ['pipe', 'pipe', 'pipe'],
            shell: true
          };
        }

        console.log('Starting server:', command, args, 'from:', options.cwd);
        this.serverProcess = spawn(command, args, options);

        // Handle server output
        this.serverProcess.stdout.on('data', (data) => {
          const output = data.toString();
          console.log('Server:', output);
          if (output.includes('Application is running') || output.includes('port')) {
            this.isServerRunning = true;
            resolve();
          }
        });

        this.serverProcess.stderr.on('data', (data) => {
          console.error('Server Error:', data.toString());
        });

        this.serverProcess.on('error', (error) => {
          console.error('Failed to start server:', error);
          reject(error);
        });

        this.serverProcess.on('exit', (code) => {
          console.log('Server process exited with code:', code);
          this.isServerRunning = false;
          this.serverProcess = null;
        });

        // Timeout for server startup
        setTimeout(() => {
          if (!this.isServerRunning) {
            console.log('Server startup timeout, continuing anyway...');
            resolve(); // Continue anyway, might be ready
          }
        }, 15000); // Increased timeout

      } catch (error) {
        console.error('Error starting server:', error);
        reject(error);
      }
    });
  }

  stopServer() {
    if (this.serverProcess) {
      console.log('Stopping server...');
      this.serverProcess.kill('SIGTERM');
      this.serverProcess = null;
      this.isServerRunning = false;
    }
  }

  getServerUrl() {
    return `http://localhost:${this.serverPort}`;
  }
}

module.exports = new ServerManager();
