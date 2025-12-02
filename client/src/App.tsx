import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './firebase/AuthContext';
import PublicLayout from './components/PublicLayout';
import { NotificationProvider } from './contexts/NotificationContext';
import TesourariaApp from './TesourariaApp';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';

// HomePage carregada imediatamente (primeira página)
import HomePage from './pages/public/HomePage';

// Páginas públicas com lazy loading (carregadas sob demanda)
const AboutPage = lazy(() => import('./pages/public/AboutPage'));
const ContactPage = lazy(() => import('./pages/public/ContactPage'));
const ConnectPage = lazy(() => import('./pages/public/ConnectPage'));
const WatchPage = lazy(() => import('./pages/public/WatchPage'));
const GivePage = lazy(() => import('./pages/public/GivePage'));
const LocationsPage = lazy(() => import('./pages/public/LocationsPage'));
const BonsEstudosPage = lazy(() => import('./pages/public/BonsEstudosPage'));
const BibliotecaPage = lazy(() => import('./pages/public/BibliotecaPage'));
const EsbocosPage = lazy(() => import('./pages/public/EsbocosPage'));
const EsbocoDetalhePage = lazy(() => import('./pages/public/EsbocoDetalhePage'));
const EventsPage = lazy(() => import('./pages/public/EventsPage'));
const Login = lazy(() => import('./pages/Login'));
const Logout = lazy(() => import('./pages/Logout'));
const LoginDebug = lazy(() => import('./pages/LoginDebug'));

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Suspense fallback={<LoadingSpinner />}>
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
                  </Route>
                  <Route path="/login-debug" element={<LoginDebug />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/logout" element={<Logout />} />
                  <Route path="/tesouraria/*" element={<TesourariaApp />} />
                </Routes>
              </Suspense>
            </Router>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
