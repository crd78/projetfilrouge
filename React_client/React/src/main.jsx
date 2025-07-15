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
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);