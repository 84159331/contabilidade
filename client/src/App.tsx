import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './components/PublicLayout';
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import EventsPage from './pages/public/EventsPage';
import ContactPage from './pages/public/ContactPage';
import VisitPage from './pages/public/VisitPage';
import ConnectPage from './pages/public/ConnectPage';
import WatchPage from './pages/public/WatchPage';
import GivePage from './pages/public/GivePage';
import LocationsPage from './pages/public/LocationsPage';
import TesourariaApp from './TesourariaApp';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="/eventos" element={<EventsPage />} />
          <Route path="/contato" element={<ContactPage />} />
          <Route path="/visite" element={<VisitPage />} />
          <Route path="/conecte" element={<ConnectPage />} />
          <Route path="/assista" element={<WatchPage />} />
          <Route path="/contribua" element={<GivePage />} />
          <Route path="/localizacoes" element={<LocationsPage />} />
        </Route>
        <Route path="/tesouraria/*" element={<TesourariaApp />} />
      </Routes>
    </Router>
  );
}

export default App;
