import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Accueil from "./pages/accueil";
import Historique from "./pages/historique";
import Connexion from "./pages/connexion";
import Inscription from "./pages/inscription";
import Profil from "./pages/profil";
import Detail from "./pages/Detail";
import Layout from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";
import Produit from './pages/Produit';
import MdpOublié from "./pages/mdpOublié";
import Vehicule from './pages/Vehicule';
import VehiculeHistorique from './pages/VehiculeHistorique';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route element={<Layout />}>
            <Route index element={<Accueil />} />
            <Route path="/accueil" element={<Accueil />} />
            <Route path="/historique" element={<Historique />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/detail-cmd" element={<Detail />} />
            <Route path="/produit" element={<Produit />} />
            <Route path="/mdp-oublie" element={<MdpOublié />} />
            <Route path="/vehicule" element={<Vehicule />} />
            <Route path="/vehicule-historique" element={<VehiculeHistorique />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);