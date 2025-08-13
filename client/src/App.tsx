import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import { LoadingSpinner } from './components/ui';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy loaded components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const POS = lazy(() => import('./pages/POS'));
const Inventory = lazy(() => import('./pages/Inventory'));

function App() {
  return (
    <Routes>
      <Route path="/login" element={
        <Suspense fallback={<LoadingSpinner />}>
          <Login />
        </Suspense>
      } />
      
      <Route element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route path="/" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Dashboard />
          </Suspense>
        } />
        <Route path="/pos" element={
          <Suspense fallback={<LoadingSpinner />}>
            <POS />
          </Suspense>
        } />
        <Route path="/inventory" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Inventory />
          </Suspense>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
