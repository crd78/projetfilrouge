import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, requiredRole = null, allowedRoles = null }) => {
  const { isLoggedIn, user } = useAuth();

  console.log('🔍 ProtectedRoute - Utilisateur:', user);
  console.log('🔍 ProtectedRoute - RequiredRole:', requiredRole);
  console.log('🔍 ProtectedRoute - AllowedRoles:', allowedRoles);

  // Vérifier si l'utilisateur est connecté
  if (!isLoggedIn) {
    return <Navigate to="/connexion" replace />;
  }

  // Vérifier le rôle si requis (un seul rôle)
  if (requiredRole !== null && user?.role !== requiredRole) {
    return <AccessDenied requiredRole={requiredRole} userRole={user?.role} />;
  }

  // Vérifier les rôles autorisés (plusieurs rôles possibles)
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <AccessDenied allowedRoles={allowedRoles} userRole={user?.role} />;
  }

  return children;
};

const AccessDenied = ({ requiredRole, allowedRoles, userRole }) => {
  const roleNames = {
    1: 'Client',
    2: 'Commercial',
    3: 'Collaborateur',
    4: 'Fournisseur',
    5: 'ChargéStock'
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      padding: '2rem',
      textAlign: 'center',
      background: '#f8f9fa'
    }}>
      <h2 style={{ color: '#dc3545', fontSize: '2rem', marginBottom: '1rem' }}>
        Accès refusé
      </h2>
      <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
        Vous n'avez pas les permissions nécessaires pour accéder à cette page.
      </p>
      
      {requiredRole && (
        <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
          Rôle requis : {roleNames[requiredRole] || `Rôle ${requiredRole}`}
        </p>
      )}
      
      {allowedRoles && (
        <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
          Rôles autorisés : {allowedRoles.map(role => roleNames[role]).join(', ')}
        </p>
      )}
      
      <p style={{ fontWeight: 'bold', color: '#333', fontSize: '1.1rem' }}>
        Votre rôle : {roleNames[userRole] || userRole || 'Aucun'}
      </p>

      <button 
        onClick={() => window.location.href = '/connexion'}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Retourner à la connexion
      </button>
    </div>
  );
};

export default ProtectedRoute;