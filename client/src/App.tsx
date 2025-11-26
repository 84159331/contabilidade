import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './firebase/AuthContext';
import PublicLayout from './components/PublicLayout';
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import ConnectPage from './pages/public/ConnectPage';
import WatchPage from './pages/public/WatchPage';
import GivePage from './pages/public/GivePage';
import LocationsPage from './pages/public/LocationsPage';
import BonsEstudosPage from './pages/public/BonsEstudosPage';
import BibliotecaPage from './pages/public/BibliotecaPage';
import EsbocosPage from './pages/public/EsbocosPage';
import EsbocoDetalhePage from './pages/public/EsbocoDetalhePage';
import Login from './pages/Login';
import Logout from './pages/Logout';
import LoginDebug from './pages/LoginDebug';
import { NotificationProvider } from './contexts/NotificationContext';
import TesourariaApp from './TesourariaApp';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
                </Route>
                <Route path="/login-debug" element={<LoginDebug />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/tesouraria/*" element={<TesourariaApp />} />
              </Routes>
            </Router>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
