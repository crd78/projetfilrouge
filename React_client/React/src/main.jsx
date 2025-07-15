import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Accueil from "./pages/accueil";
import Historique from "./pages/historique";
import Connexion from "./pages/connexion";
import Inscription from "./pages/inscription";
import Contact from "./pages/contact";
import Profil from "./pages/profil";
import Layout from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/dashboard";
import ProtectedRoute from "./context/ProtectedRoute"; // ✅ Correction : context au lieu de components

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Sans navbar */}
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/inscription" element={<Inscription />} />
          
          {/* Route protégée pour le dashboard - ROLE COMMERCIAL (2) REQUIS */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute requiredRole={2}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Route protégée pour la gestion des stocks - ROLE CHARGÉ STOCK (5) REQUIS */}
          <Route 
            path="/stock" 
            element={
              <ProtectedRoute requiredRole={5}>
                <div>Page de gestion des stocks (à créer)</div>
              </ProtectedRoute>
            } 
          />
          
          {/* Route accessible aux commerciaux ET chargés de stock */}
          <Route 
            path="/entrepots" 
            element={
              <ProtectedRoute allowedRoles={[2, 5]}>
                <div>Page de gestion des entrepôts (à créer)</div>
              </ProtectedRoute>
            } 
          />
          
          {/* Avec navbar */}
          <Route element={<Layout />}>
            <Route index element={<Accueil />} />
            <Route path="/accueil" element={<Accueil />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/historique" element={<Historique />} />
            <Route path="/profil" element={<Profil />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);