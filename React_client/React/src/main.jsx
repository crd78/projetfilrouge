import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Accueil from "./pages/publiques/accueil";
import Historique from "./pages/publiques/historique";
import Connexion from "./pages/auth/connexion";
import Inscription from "./pages/publiques/inscription";
import Contact from "./pages/publiques/contact";
import Profil from "./pages/publiques/profil";
import Layout from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/dashboard/dashboardCommercial";
import ProtectedRoute from "./context/ProtectedRoute"; 
import DemandesDevis from "./pages/devis/demandes-devis";
import ListeProduit from "./pages/produits/liste_produit";
import NouveauDevis from "./pages/devis/nouveau-devis";
import DashboardClient from "./pages/dashboard/dashboardClient";
import DemandesInscription from "./pages/auth/demandes-inscription";
import DashboardStock from "./pages/dashboard/dashboardStock";
import DashboardCollaborateur from "./pages/dashboard/dashboardCollaborateur";


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
            path="/dashboard/commercial" 
            element={
              <ProtectedRoute requiredRole={2}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/devis/demandes-devis" 
            element={
              <ProtectedRoute requiredRole={2}>
                <DemandesDevis />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/demandes-inscription" 
            element={
              <ProtectedRoute requiredRole={2}>
                <DemandesInscription />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/devis/nouveau" 
            element={
              <ProtectedRoute requiredRole={2}>
                <NouveauDevis />
              </ProtectedRoute>
            }
          />
          
          {/* Route protégée pour la gestion des stocks - ROLE CHARGÉ STOCK (5) REQUIS */}
          <Route
            path="/dashboard/stock"
            element={
              <ProtectedRoute requiredRole={5}>
                <DashboardStock />
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

          {/* Route protégée pour le dashboard - ROLE COLLABORATEUR (3) REQUIS */}
          <Route 
            path="/dashboard/collaborateur" 
            element={
              <ProtectedRoute requiredRole={3}>
                <DashboardCollaborateur />
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
            {/* PRODUITS accessible à tous */}
            <Route path="/produits" element={<ListeProduit />} />
            {/* Dashboard client accessible UNIQUEMENT au rôle 1 */}
            <Route 
              path="/dashboard/client" 
              element={
                <ProtectedRoute requiredRole={1}>
                  <DashboardClient />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);