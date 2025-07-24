import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('authToken') ? true : false;
  });
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('userData');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Fonction de connexion
  const login = (userData, token) => {
    setIsLoggedIn(true);
    setUser(userData);
    
    // Sauvegarder dans localStorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  // Fonction de déconnexion
  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    
    // Nettoyer localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  };

  // Fonction pour mettre à jour l'utilisateur
  const updateUser = (newUserData) => {
    const updatedUser = { ...user, ...newUserData };
    setUser(updatedUser);
    localStorage.setItem('userData', JSON.stringify(updatedUser));
  };

  // Fonction utilitaire pour obtenir le token
  const getToken = () => {
    return localStorage.getItem('authToken');
  };

  // Fonction pour vérifier si l'utilisateur a un rôle
   // Fonction pour vérifier si l'utilisateur a un rôle
  const hasRole = (role) => {
    return user && user.role === role;
  };

  // Fonctions utilitaires pour les rôles
  const isCommercial = () => hasRole(2);
  const isChargeStock = () => hasRole(5);
  const isFournisseur = () => hasRole(4);
  const isClient = () => hasRole(1);
  const isCollaborateur = () => hasRole(3);

  // Fonction pour vérifier si l'utilisateur peut gérer les stocks
  const canManageStock = () => {
    return isChargeStock() || isCommercial(); // Commercial peut aussi gérer
  };

  const value = {
    isLoggedIn,
    user,
    login,
    logout,
    updateUser,
    getToken,
    hasRole,
    isCommercial,
    isChargeStock,
    isFournisseur,
    isClient,
    isCollaborateur,
    canManageStock
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};