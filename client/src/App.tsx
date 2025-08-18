import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import AppLayout from './components/layout/AppLayout';
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
        <Suspense fallback={
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <CircularProgress />
          </Box>
        }>
          <Login />
        </Suspense>
      } />
      
      <Route element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route path="/" element={
          <Suspense fallback={
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
              <CircularProgress />
            </Box>
          }>
            <Dashboard />
          </Suspense>
        } />
        <Route path="/pos" element={
          <Suspense fallback={
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
              <CircularProgress />
            </Box>
          }>
            <POS />
          </Suspense>
        } />
        <Route path="/product-category" element={
          <Suspense fallback={
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
              <CircularProgress />
            </Box>
          }>
            <ProductCategory />
          </Suspense>
        } />
        <Route path="/products" element={
          <Suspense fallback={
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
              <CircularProgress />
            </Box>
          }>
            <Products />
          </Suspense>
        } />
        <Route path="/suppliers" element={
          <Suspense fallback={
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
              <CircularProgress />
            </Box>
          }>
            <Suppliers />
          </Suspense>
        } />
        <Route path="/customers" element={
          <Suspense fallback={
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
              <CircularProgress />
            </Box>
          }>
            <Customers />
          </Suspense>
        } />
        <Route path="/bills" element={
          <Suspense fallback={
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
              <CircularProgress />
          </Box>
          }>
            <Bills />
          </Suspense>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
