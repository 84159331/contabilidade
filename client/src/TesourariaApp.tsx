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
import { PinProvider } from './contexts/PinContext';
import PinProtectedRoute from './components/PinProtectedRoute';
import { EventsAlertsProvider } from './contexts/EventsAlertsContext';
import { useUserRole } from './hooks/useUserRole';

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
const Ministries = lazyWithRetry(() => import('./pages/Ministries'));
const Scales = lazyWithRetry(() => import('./pages/Scales'));
const MyScales = lazyWithRetry(() => import('./pages/MyScales'));
const NotificationsPage = lazyWithRetry(() => import('./pages/NotificationsPage'));
const ScaleReports = lazyWithRetry(() => import('./pages/ScaleReports'));
const People = lazyWithRetry(() => import('./pages/People'));
const PinAccess = lazyWithRetry(() => import('./pages/PinAccess'));
const Welcome = lazyWithRetry(() => import('./pages/Welcome'));
const FinanceAccessAdmin = lazyWithRetry(() => import('./pages/FinanceAccessAdmin'));
const AdminsAdmin = lazyWithRetry(() => import('./pages/AdminsAdmin'));
const DevocionalHoje = lazyWithRetry(() => import('./pages/DevocionalHoje'));
const DevocionalHistorico = lazyWithRetry(() => import('./pages/DevocionalHistorico'));
const DevocionalAdmin = lazyWithRetry(() => import('./pages/DevocionalAdmin'));

function TesourariaApp() {
  const { user, loading } = useAuth();
  const { role, loading: roleLoading, isAdmin, isLider, isSecretaria, isTesouraria, isMidia } = useUserRole();
  
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
              console.log('ðŸ§¹ Cache antigo removido:', key);
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

  if (loading || roleLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <Routes>
        <Route path="login" element={<LoginFirebase />} />
        <Route path="*" element={<Navigate to="/tesouraria/login" replace />} />
      </Routes>
    );
  }

  const lazyComponents = {Dashboard,Members,Transactions,Reports,Categories,CellGroupsAdmin,WhatsAppPage,BooksManagement,Events,EsbocosAdminPage,FeriasPastores,CadastroMembro};
  const lazyComponentStatus = Object.entries(lazyComponents).map(([name,comp])=>({name,isUndefined:comp===undefined,type:typeof comp})).reduce((acc,{name,isUndefined,type})=>({...acc,[name]:{isUndefined,type}}),{});
  // Validação apenas em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    if (!Layout || !ErrorBoundary || !PageErrorFallback || !PageSkeleton || !SmartLoading) {
      console.error('❌ Componente crítico não encontrado!');
      return <div>Erro: Componente não encontrado</div>;
    }
  }
  
  const RoleProtectedRoute: React.FC<{ allow: Array<string>; children: React.ReactNode }> = ({ allow, children }) => {
    if (isAdmin) return <>{children}</>;
    if (allow.includes(role)) return <>{children}</>;
    return <Navigate to="/tesouraria/welcome" replace />;
  };

  const canSeeFinance = isAdmin || isLider || isTesouraria;
  const canSeePeople = isAdmin || isLider || isSecretaria;
  const canSeeMembers = isAdmin || isLider || isSecretaria;
  const canSeeEvents = isAdmin || isLider || isMidia;
  const canSeeScales = isAdmin || isLider || isSecretaria || isMidia;
  const canSeePastorsVacations = isAdmin || isSecretaria;

  return (
    <EventsAlertsProvider>
      <PinProvider>
        <Layout>
          <ErrorBoundary fallback={<PageErrorFallback />}>
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-[400px]">
                <PageSkeleton type="dashboard" />
              </div>
            }>
            <SmartLoading>
              <Routes>
              <Route path="/" element={<Navigate to="/tesouraria/welcome" replace />} />

              <Route path="welcome" element={<Welcome />} />

              <Route path="pin" element={<PinAccess />} />

              <Route
                path="dashboard"
                element={
                  <RoleProtectedRoute allow={canSeeFinance ? ['admin', 'lider', 'tesouraria'] : ['admin']}>
                    <PinProtectedRoute>
                      <Dashboard />
                    </PinProtectedRoute>
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="people"
                element={
                  <RoleProtectedRoute allow={canSeePeople ? ['admin', 'lider', 'secretaria'] : ['admin']}>
                    <People />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="members"
                element={
                  <RoleProtectedRoute allow={canSeeMembers ? ['admin', 'lider', 'secretaria'] : ['admin']}>
                    <Members />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="members/new"
                element={
                  <RoleProtectedRoute allow={canSeeMembers ? ['admin', 'lider', 'secretaria'] : ['admin']}>
                    <CadastroMembro />
                  </RoleProtectedRoute>
                }
              />
              <Route path="devocional" element={<DevocionalHoje />} />
              <Route path="devocional/historico" element={<DevocionalHistorico />} />
              <Route path="admin/devocional" element={<DevocionalAdmin />} />
              <Route path="admin/finance-access" element={<FinanceAccessAdmin />} />
              <Route path="admin/admins" element={<AdminsAdmin />} />
              <Route
                path="transactions"
                element={
                  <RoleProtectedRoute allow={canSeeFinance ? ['admin', 'lider', 'tesouraria'] : ['admin']}>
                    <PinProtectedRoute>
                      <Transactions />
                    </PinProtectedRoute>
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="reports"
                element={
                  <RoleProtectedRoute allow={canSeeFinance ? ['admin', 'lider', 'tesouraria'] : ['admin']}>
                    <PinProtectedRoute>
                      <Reports />
                    </PinProtectedRoute>
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="categories"
                element={
                  <RoleProtectedRoute allow={['admin']}>
                    <Categories />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="cell-groups"
                element={
                  <RoleProtectedRoute allow={['admin']}>
                    <CellGroupsAdmin />
                  </RoleProtectedRoute>
                }
              />
              <Route path="whatsapp" element={<WhatsAppPage />} />
              <Route
                path="books"
                element={
                  <RoleProtectedRoute allow={['admin']}>
                    <BooksManagement />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="events"
                element={
                  <RoleProtectedRoute allow={canSeeEvents ? ['admin', 'lider', 'midia'] : ['admin']}>
                    <Events />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="esbocos"
                element={
                  <RoleProtectedRoute allow={['admin']}>
                    <EsbocosAdminPage />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="ferias-pastores"
                element={
                  <RoleProtectedRoute allow={canSeePastorsVacations ? ['admin', 'secretaria'] : ['admin']}>
                    <FeriasPastores />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="ministries"
                element={
                  <RoleProtectedRoute allow={canSeeScales ? ['admin', 'lider', 'secretaria', 'midia'] : ['admin']}>
                    <Ministries />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="scales"
                element={
                  <RoleProtectedRoute allow={canSeeScales ? ['admin', 'lider', 'secretaria', 'midia'] : ['admin']}>
                    <Scales />
                  </RoleProtectedRoute>
                }
              />
              <Route path="my-scales" element={<MyScales />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route
                path="scale-reports"
                element={
                  <RoleProtectedRoute allow={canSeeScales ? ['admin', 'lider', 'secretaria', 'midia'] : ['admin']}>
                    <ScaleReports />
                  </RoleProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/tesouraria/welcome" replace />} />
              </Routes>
            </SmartLoading>
          </Suspense>
          </ErrorBoundary>
        </Layout>
      </PinProvider>
    </EventsAlertsProvider>
  );
}

export default TesourariaApp;
