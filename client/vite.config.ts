import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server:{
    host: true,
    port: 3000,
  },
  base: './', // Use relative paths for Electron compatibility
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Ensure proper file references for Electron
    rollupOptions: {
      output: {
        // Use relative imports
        format: 'es'
      }
    }
  }
})
