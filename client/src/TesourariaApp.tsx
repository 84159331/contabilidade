import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './firebase/AuthContext';
import { useCacheInvalidation } from './hooks/useRouteRefresh';
import LoginFirebase from './pages/LoginFirebase';
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
const BooksManagement = lazy(() => import('./pages/BooksManagement'));
const Events = lazy(() => import('./pages/Events'));
const EsbocosAdminPage = lazy(() => import('./pages/EsbocosAdminPage'));

function TesourariaApp() {
  const { user, loading } = useAuth();
  
  // Invalidar cache quando a rota muda
  useCacheInvalidation();

  // Limpar cache quando componente monta ou usuário muda
  useEffect(() => {
    // Limpar caches antigos para forçar recarregamento
    try {
      const cacheKeys = [
        'dashboard_cache',
        'transactions_cache',
        'members_cache',
        'categories_cache',
      ];
      
      // Limpar cache antigo (mais de 2 minutos) para garantir dados frescos
      const now = Date.now();
      const MAX_CACHE_AGE = 120000; // 2 minutos
      
      cacheKeys.forEach(key => {
        const cached = sessionStorage.getItem(key);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (parsed.lastFetch && (now - parsed.lastFetch) > MAX_CACHE_AGE) {
              sessionStorage.removeItem(key);
              console.log('🧹 Cache antigo removido:', key);
            }
          } catch (e) {
            // Se não conseguir parsear, remove
            sessionStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.warn('Erro ao limpar cache:', error);
    }
  }, [user]);

  console.log('🏦 TesourariaApp renderizado - user:', user, 'loading:', loading);

  if (loading) {
    console.log('⏳ Mostrando LoadingSpinner');
    return <LoadingSpinner />;
  }

  if (!user) {
    console.log('❌ Usuário não logado, redirecionando para login');
    return (
      <Routes>
        <Route path="login" element={<LoginFirebase />} />
        <Route path="*" element={<Navigate to="login" replace />} />
      </Routes>
    );
  }

  console.log('✅ Usuário logado, mostrando dashboard');
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
            <Route path="books" element={<BooksManagement />} />
            <Route path="events" element={<Events />} />
            <Route path="esbocos" element={<EsbocosAdminPage />} />
            <Route path="*" element={<Navigate to="/tesouraria/dashboard" replace />} />
          </Routes>
        </SmartLoading>
      </Suspense>
    </Layout>
  );
}

export default TesourariaApp;
