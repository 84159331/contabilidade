import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import PublicLayout from './components/PublicLayout';
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import EventsPage from './pages/public/EventsPage';
import ContactPage from './pages/public/ContactPage';
import ConnectPage from './pages/public/ConnectPage';
import WatchPage from './pages/public/WatchPage';
import GivePage from './pages/public/GivePage';
import LocationsPage from './pages/public/LocationsPage';
import BonsEstudosPage from './pages/public/BonsEstudosPage';
import BibliotecaPage from './pages/public/BibliotecaPage';
import LoginDebug from './pages/LoginDebug';
import { NotificationProvider } from './contexts/NotificationContext';
import TesourariaApp from './TesourariaApp';

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/sobre" element={<AboutPage />} />
              <Route path="/eventos" element={<EventsPage />} />
              <Route path="/contato" element={<ContactPage />} />
              <Route path="/conecte" element={<ConnectPage />} />
              <Route path="/assista" element={<WatchPage />} />
              <Route path="/contribua" element={<GivePage />} />
              <Route path="/localizacoes" element={<LocationsPage />} />
              <Route path="/bons-estudos" element={<BonsEstudosPage />} />
            <Route path="/biblioteca" element={<BibliotecaPage />} />
            </Route>
            <Route path="/login-debug" element={<LoginDebug />} />
            <Route path="/tesouraria/*" element={<TesourariaApp />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
