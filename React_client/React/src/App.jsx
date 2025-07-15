import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Accueil from './pages/accueil';
import Historique from './pages/historique';
import Connexion from './pages/connexion';
import Inscription from './pages/inscription';
import Detail from './pages/Detail';
import Produit from './pages/Produit';
import MdpOublié from './pages/mdpOublié';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/mes-commandes" element={<Historique />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/detail" element={<Detail />} />
          <Route path="/produit" element={<Produit />} />
          <Route path="/mdp-oublie" element={<MdpOublié />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}