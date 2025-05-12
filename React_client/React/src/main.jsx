import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Connexion from './pages/connexion';
import Inscription from './pages/inscription';
import Accueil from './pages/accueil';
import Historique from './pages/historique';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/accueil" element={<Accueil />} />
        <Route path="/historique" element={<Historique />} />
        {/* Tu peux rajouter d'autres routes ici */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
