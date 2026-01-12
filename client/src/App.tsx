import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './firebase/AuthContext';
import PublicLayout from './components/PublicLayout';
import { NotificationProvider } from './contexts/NotificationContext';
import TesourariaApp from './TesourariaApp';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import PageErrorFallback from './components/PageErrorFallback';
import { lazyWithRetry } from './utils/lazyWithRetry';

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

function App() {
  // Validação apenas em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    if (!ErrorBoundary || !PageErrorFallback || !LoadingSpinner || !PublicLayout) {
      console.error('❌ Componente crítico não encontrado!');
      return <div>Erro: Componente não encontrado</div>;
    }
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <ErrorBoundary fallback={<PageErrorFallback />}>
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
              </ErrorBoundary>
            </Router>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
