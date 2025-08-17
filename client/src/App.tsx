import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import { LoadingSpinner } from './components/ui';
import ProtectedRoute from './components/ProtectedRoute';
import ProductCategory from './pages/ProductCategory';
import Products from './pages/Products';
import Suppliers from './pages/Suppliers';
import Customers from './pages/Customers';
import Bills from './pages/Bills';

// Lazy loaded components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const POS = lazy(() => import('./pages/POS'));

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
        <Route path="/product-category" element={
          <Suspense fallback={<LoadingSpinner />}>
            <ProductCategory />
          </Suspense>
        } />
        <Route path="/products" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Products />
          </Suspense>
        } />
        <Route path="/suppliers" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Suppliers />
          </Suspense>
        } />
        <Route path="/customers" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Customers />
          </Suspense>
        } />
        <Route path="/bills" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Bills />
          </Suspense>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
