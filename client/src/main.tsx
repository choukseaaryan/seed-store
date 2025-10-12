import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { initDB } from './utils/db'
import { AuthProvider } from './context/AuthContext'
import { KeyboardProvider } from './context/KeyboardContext'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { Toaster } from 'react-hot-toast'

// Initialize IndexedDB
initDB().catch(console.error);

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

// Use HashRouter for Electron, BrowserRouter for web
const isElectron = (window as any).electronAPI !== undefined;
const Router = isElectron ? HashRouter : BrowserRouter;

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <KeyboardProvider>
              <Toaster position='top-right'/>
              <App />
            </KeyboardProvider>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </StrictMode>
  </ErrorBoundary>
)
