import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './firebase/AuthContext';
import { useCacheInvalidation } from './hooks/useRouteRefresh';
import LoginFirebase from './pages/LoginFirebase';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import PageSkeleton from './components/PageSkeleton';
import SmartLoading from './components/SmartLoading';
import ErrorBoundary from './components/ErrorBoundary';
import PageErrorFallback from './components/PageErrorFallback';
import { lazyWithRetry } from './utils/lazyWithRetry';

// Lazy loading com retry para componentes pesados (previne páginas brancas)
const Dashboard = lazyWithRetry(() => import('./pages/Dashboard'));
const Members = lazyWithRetry(() => import('./pages/Members'));
const Transactions = lazyWithRetry(() => import('./pages/Transactions'));
const Reports = lazyWithRetry(() => import('./pages/Reports'));
const Categories = lazyWithRetry(() => import('./pages/Categories'));
const CellGroupsAdmin = lazyWithRetry(() => import('./pages/CellGroupsAdmin'));
const WhatsAppPage = lazyWithRetry(() => import('./pages/WhatsAppPage'));
const BooksManagement = lazyWithRetry(() => import('./pages/BooksManagement'));
const Events = lazyWithRetry(() => import('./pages/Events'));
const EsbocosAdminPage = lazyWithRetry(() => import('./pages/EsbocosAdminPage'));
const FeriasPastores = lazyWithRetry(() => import('./pages/FeriasPastores'));
const CadastroMembro = lazyWithRetry(() => import('./pages/CadastroMembro'));

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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <Routes>
        <Route path="login" element={<LoginFirebase />} />
        <Route path="*" element={<Navigate to="login" replace />} />
      </Routes>
    );
  }

  // Validação apenas em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    if (!Layout || !ErrorBoundary || !PageErrorFallback || !PageSkeleton || !SmartLoading) {
      console.error('❌ Componente crítico não encontrado!');
      return <div>Erro: Componente não encontrado</div>;
    }
  }
  
  return (
    <Layout>
      <ErrorBoundary fallback={<PageErrorFallback />}>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <PageSkeleton type="dashboard" />
          </div>
        }>
          <SmartLoading>
            <Routes>
            <Route path="/" element={<Navigate to="/tesouraria/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="members" element={<Members />} />
            <Route path="members/new" element={<CadastroMembro />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="reports" element={<Reports />} />
            <Route path="categories" element={<Categories />} />
            <Route path="cell-groups" element={<CellGroupsAdmin />} />
            <Route path="whatsapp" element={<WhatsAppPage />} />
            <Route path="books" element={<BooksManagement />} />
            <Route path="events" element={<Events />} />
            <Route path="esbocos" element={<EsbocosAdminPage />} />
            <Route path="ferias-pastores" element={<FeriasPastores />} />
            <Route path="*" element={<Navigate to="/tesouraria/dashboard" replace />} />
            </Routes>
          </SmartLoading>
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
}

export default TesourariaApp;
