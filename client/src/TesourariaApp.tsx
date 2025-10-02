import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import PageSkeleton from './components/PageSkeleton';
import SmartLoading from './components/SmartLoading';

// Lazy loading para componentes pesados
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Members = lazy(() => import('./pages/Members'));
const Transactions = lazy(() => import('./pages/Transactions'));
const Reports = lazy(() => import('./pages/Reports'));
const Categories = lazy(() => import('./pages/Categories'));
const CellGroupsAdmin = lazy(() => import('./pages/CellGroupsAdmin'));
const Users = lazy(() => import('./pages/Users'));
const WhatsAppPage = lazy(() => import('./pages/WhatsAppPage'));

function TesourariaApp() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="*" element={<Navigate to="login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Suspense fallback={<PageSkeleton type="dashboard" />}>
        <SmartLoading>
          <Routes>
            <Route path="/" element={<Navigate to="/tesouraria/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="members" element={<Members />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="reports" element={<Reports />} />
            <Route path="categories" element={<Categories />} />
            <Route path="cell-groups" element={<CellGroupsAdmin />} />
            <Route path="users" element={<Users />} />
            <Route path="whatsapp" element={<WhatsAppPage />} />
            <Route path="*" element={<Navigate to="/tesouraria/dashboard" replace />} />
          </Routes>
        </SmartLoading>
      </Suspense>
    </Layout>
  );
}

export default TesourariaApp;
