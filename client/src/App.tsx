import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './firebase/AuthContext';
import PublicLayout from './components/PublicLayout';
import { NotificationProvider } from './contexts/NotificationContext';
import TesourariaApp from './TesourariaApp';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import PageErrorFallback from './components/PageErrorFallback';
import SwipeNavigation from './components/SwipeNavigation';
import SplashOverlay from './components/SplashOverlay';
import { lazyWithRetry } from './utils/lazyWithRetry';
import { firebaseConfigStatus } from './firebase/config';

// HomePage carregada imediatamente (primeira página)
import HomePage from './pages/public/HomePage';

// Páginas públicas com lazy loading e retry (carregadas sob demanda)
const AboutPage = lazyWithRetry(() => import('./pages/public/AboutPage'));
const ContactPage = lazyWithRetry(() => import('./pages/public/ContactPage'));
const ConnectPage = lazyWithRetry(() => import('./pages/public/ConnectPage'));
const WatchPage = lazyWithRetry(() => import('./pages/public/WatchPage'));
const GivePage = lazyWithRetry(() => import('./pages/public/GivePage'));
const LocationsPage = lazyWithRetry(() => import('./pages/public/LocationsPage'));
const BonsEstudosPage = lazyWithRetry(() => import('./pages/public/BonsEstudosPage'));
const BibliotecaPage = lazyWithRetry(() => import('./pages/public/BibliotecaPage'));
const EsbocosPage = lazyWithRetry(() => import('./pages/public/EsbocosPage'));
const EsbocoDetalhePage = lazyWithRetry(() => import('./pages/public/EsbocoDetalhePage'));
const EventsPage = lazyWithRetry(() => import('./pages/public/EventsPage'));
const CadastroPublicoPage = lazyWithRetry(() => import('./pages/public/CadastroPublicoPage'));
const AgradecimentoPage = lazyWithRetry(() => import('./pages/public/AgradecimentoPage'));
const Login = lazyWithRetry(() => import('./pages/Login'));
const Logout = lazyWithRetry(() => import('./pages/Logout'));
const LoginDebug = lazyWithRetry(() => import('./pages/LoginDebug'));

function BootSplash() {
  const location = useLocation();
  const [show, setShow] = useState(false);

  const shouldConsider = useMemo(() => {
    return location.pathname === '/';
  }, [location.pathname]);

  useEffect(() => {
    if (!shouldConsider) {
      setShow(false);
      return;
    }

    try {
      const alreadyShown = sessionStorage.getItem('boot_splash_shown_v1') === '1';
      if (alreadyShown) {
        setShow(false);
        return;
      }

      sessionStorage.setItem('boot_splash_shown_v1', '1');
      setShow(true);
      return;
    } catch {
      setShow(true);
    }
  }, [shouldConsider]);

  if (!show) return null;

  return (
    <SplashOverlay
      mediaSrc="/img/INTRO-LOGO.gif"
      durationMs={6000}
      backgroundColor="#000000"
      animation="none"
    />
  );
}

function App() {
  if (!firebaseConfigStatus.ok) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Não foi possível iniciar o app
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            A configuração do Firebase está incompleta. Recarregue a página ou tente novamente mais tarde.
          </p>

          {process.env.NODE_ENV === 'development' && firebaseConfigStatus.missing?.length > 0 && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-left">
              <p className="text-xs text-red-700 dark:text-red-300 break-all">
                Faltando: {firebaseConfigStatus.missing.join(', ')}
              </p>
            </div>
          )}

          <button
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Recarregar
          </button>
        </div>
      </div>
    );
  }

  // Validação apenas em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    if (!ErrorBoundary || !PageErrorFallback || !LoadingSpinner || !PublicLayout) {
      console.error('❌ Componente crítico não encontrado!');
      return <div>Erro: Componente não encontrado</div>;
    }
  }

  const lazyComponents = {AboutPage,ContactPage,ConnectPage,WatchPage,GivePage,LocationsPage,BonsEstudosPage,BibliotecaPage,EsbocosPage,EsbocoDetalhePage,EventsPage,CadastroPublicoPage,AgradecimentoPage,Login,Logout,LoginDebug};
  const lazyComponentStatus = Object.entries(lazyComponents).map(([name,comp])=>({name,isUndefined:comp===undefined,type:typeof comp})).reduce((acc,{name,isUndefined,type})=>({...acc,[name]:{isUndefined,type}}),{});

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <BootSplash />
              <ErrorBoundary fallback={<PageErrorFallback />}>
                <SwipeNavigation>
                  <Suspense fallback={
                    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                      <LoadingSpinner size="lg" text="Carregando página..." />
                    </div>
                  }>
                  <Routes>
                  <Route element={<PublicLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/sobre" element={<AboutPage />} />
                    <Route path="/contato" element={<ContactPage />} />
                    <Route path="/conecte" element={<ConnectPage />} />
                    <Route path="/assista" element={<WatchPage />} />
                    <Route path="/contribua" element={<GivePage />} />
                    <Route path="/localizacoes" element={<LocationsPage />} />
                    <Route path="/bons-estudos" element={<BonsEstudosPage />} />
                    <Route path="/biblioteca" element={<BibliotecaPage />} />
                    <Route path="/esbocos" element={<EsbocosPage />} />
                    <Route path="/esbocos/:id" element={<EsbocoDetalhePage />} />
                    <Route path="/eventos" element={<EventsPage />} />
                    <Route path="/cadastro" element={<CadastroPublicoPage />} />
                    <Route path="/cadastro/obrigado" element={<AgradecimentoPage />} />
                  </Route>
                  <Route path="/login-debug" element={<LoginDebug />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/logout" element={<Logout />} />
                  <Route path="/tesouraria/*" element={<TesourariaApp />} />
                  </Routes>
                  </Suspense>
                </SwipeNavigation>
              </ErrorBoundary>
            </Router>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
