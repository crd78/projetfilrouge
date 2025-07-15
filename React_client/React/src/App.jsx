import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Accueil from './pages/publiques/accueil';
import Historique from './pages/publiques/historique';
import Connexion from './pages/auth/connexion';
import Inscription from './pages/publiques/inscription';
import Contact from './pages/publiques/contact';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/mes-commandes" element={<Historique />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}