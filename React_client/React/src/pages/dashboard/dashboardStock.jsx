import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';
import { useAuth } from '../../context/AuthContext.jsx';

const DashboardStock = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/connexion');
    }
    // eslint-disable-next-line
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/connexion');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <div>
            <h1 className="dashboard-title">
              Dashboard Stock - {user?.prenom || 'Gestionnaire'} ! 📦
            </h1>
            <p className="dashboard-subtitle">
              Gérez vos produits, mouvements et entrepôts
            </p>
          </div>
          <div className="header-actions">
            <button 
              className="logout-btn"
              onClick={handleLogout}
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Gestion des produits */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Produits</h2>
            <button 
              className="view-all-btn"
              onClick={() => navigate('/produits')}
            >
              Voir tous les produits →
            </button>
          </div>
          <div className="actions-grid">
            <button 
              className="action-btn"
              onClick={() => navigate('/produits/nouveau')}
            >
              <span className="action-icon">➕</span>
              Nouveau produit
            </button>
          </div>
        </div>

        {/* Gestion des mouvements de stock */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Mouvements de stock</h2>
            <button 
              className="view-all-btn"
              onClick={() => navigate('/stock/mouvements')}
            >
              Voir tous les mouvements →
            </button>
          </div>
          <div className="actions-grid">
            <button 
              className="action-btn"
              onClick={() => navigate('/stock/entree')}
            >
              <span className="action-icon">📥</span>
              Entrée stock
            </button>
            <button 
              className="action-btn"
              onClick={() => navigate('/stock/sortie')}
            >
              <span className="action-icon">📤</span>
              Sortie stock
            </button>
            <button 
              className="action-btn"
              onClick={() => navigate('/stock/inventaire')}
            >
              <span className="action-icon">📋</span>
              Inventaire
            </button>
          </div>
        </div>

        {/* Gestion des entrepôts */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Entrepôts</h2>
            <button 
              className="view-all-btn"
              onClick={() => navigate('/entrepots')}
            >
              Voir tous les entrepôts →
            </button>
          </div>
          <div className="actions-grid">
            <button 
              className="action-btn"
              onClick={() => navigate('/entrepots/nouveau')}
            >
              <span className="action-icon">🏭</span>
              Nouvel entrepôt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStock;