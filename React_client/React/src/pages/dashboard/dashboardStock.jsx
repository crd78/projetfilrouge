import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';
import API_CONFIG from '../../api.config.js';
import { useAuth } from '../../context/AuthContext.jsx';

const DashboardStock = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout, getToken } = useAuth();
  
  const [stats, setStats] = useState({
    totalEntrepots: 0,
    totalProduits: 0,
    stockBas: 0,
    mouvementsJour: 0,
    valeurStock: 0,
    alertesStock: 0
  });
  
  const [recentMouvements, setRecentMouvements] = useState([]);
  const [alertesStock, setAlertesStock] = useState([]);
  const [entrepots, setEntrepots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/connexion');
      return;
    }
    
    fetchStockData();
  }, [isLoggedIn, navigate]);

  const fetchStockData = async () => {
    try {
      setIsLoading(true);
      
      // Headers avec token d'authentification
      const authHeaders = {
        ...API_CONFIG.DEFAULT_HEADERS,
        'Authorization': `Bearer ${getToken()}`
      };
      
      // Récupération des statistiques de stock
      try {
        const statsResponse = await fetch(`${API_CONFIG.BASE_URL}/api/stock/statistiques`, {
          headers: authHeaders
        });
        
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats({
            totalEntrepots: statsData.entrepots?.total || 5,
            totalProduits: statsData.produits?.total || 156,
            stockBas: statsData.alertes?.stock_bas || 12,
            mouvementsJour: statsData.mouvements?.aujourd_hui || 23,
            valeurStock: statsData.stock?.valeur_totale || 45000,
            alertesStock: statsData.alertes?.total || 8
          });
        } else {
          // Données fictives pour la démonstration
          setStats({
            totalEntrepots: 5,
            totalProduits: 156,
            stockBas: 12,
            mouvementsJour: 23,
            valeurStock: 45000,
            alertesStock: 8
          });
        }
      } catch (error) {
        console.warn('Erreur stats stock:', error);
        // Données fictives
        setStats({
          totalEntrepots: 5,
          totalProduits: 156,
          stockBas: 12,
          mouvementsJour: 23,
          valeurStock: 45000,
          alertesStock: 8
        });
      }

      // Récupération des mouvements récents
      try {
        const mouvementsResponse = await fetch(`${API_CONFIG.BASE_URL}/api/stock/mouvements?limit=5`, {
          headers: authHeaders
        });
        
        if (mouvementsResponse.ok) {
          const mouvementsData = await mouvementsResponse.json();
          setRecentMouvements(mouvementsData.results || mouvementsData);
        } else {
          // Données fictives
          setRecentMouvements([
            {
              IdMouvement: 1,
              produit: { nom: 'Farine T55', unite: 'kg' },
              entrepot: { NomEntrepot: 'Entrepôt Central' },
              TypeMouvement: 'Entrée',
              Quantite: 500,
              DateMouvement: new Date().toISOString(),
              Motif: 'Livraison fournisseur'
            },
            {
              IdMouvement: 2,
              produit: { nom: 'Levure fraîche', unite: 'kg' },
              entrepot: { NomEntrepot: 'Entrepôt Nord' },
              TypeMouvement: 'Sortie',
              Quantite: 25,
              DateMouvement: new Date(Date.now() - 3600000).toISOString(),
              Motif: 'Commande client'
            },
            {
              IdMouvement: 3,
              produit: { nom: 'Sel fin', unite: 'kg' },
              entrepot: { NomEntrepot: 'Entrepôt Sud' },
              TypeMouvement: 'Entrée',
              Quantite: 100,
              DateMouvement: new Date(Date.now() - 7200000).toISOString(),
              Motif: 'Réassort'
            }
          ]);
        }
      } catch (error) {
        console.warn('Erreur mouvements:', error);
        setRecentMouvements([]);
      }

      // Récupération des alertes de stock
      try {
        const alertesResponse = await fetch(`${API_CONFIG.BASE_URL}/api/stock/alertes`, {
          headers: authHeaders
        });
        
        if (alertesResponse.ok) {
          const alertesData = await alertesResponse.json();
          setAlertesStock(alertesData.results || alertesData);
        } else {
          // Données fictives
          setAlertesStock([
            {
              id: 1,
              produit: { nom: 'Farine T65', unite: 'kg' },
              entrepot: { NomEntrepot: 'Entrepôt Central' },
              QuantiteActuelle: 50,
              SeuilAlerte: 100,
              niveau: 'critique'
            },
            {
              id: 2,
              produit: { nom: 'Sucre blanc', unite: 'kg' },
              entrepot: { NomEntrepot: 'Entrepôt Nord' },
              QuantiteActuelle: 80,
              SeuilAlerte: 150,
              niveau: 'faible'
            },
            {
              id: 3,
              produit: { nom: 'Œufs frais', unite: 'boîte' },
              entrepot: { NomEntrepot: 'Entrepôt Sud' },
              QuantiteActuelle: 15,
              SeuilAlerte: 50,
              niveau: 'critique'
            }
          ]);
        }
      } catch (error) {
        console.warn('Erreur alertes:', error);
        setAlertesStock([]);
      }

      // Récupération des entrepôts
      try {
        const entrepotsResponse = await fetch(`${API_CONFIG.BASE_URL}/api/entrepots`, {
          headers: authHeaders
        });
        
        if (entrepotsResponse.ok) {
          const entrepotsData = await entrepotsResponse.json();
          setEntrepots(entrepotsData.results || entrepotsData);
        } else {
          // Données fictives
          setEntrepots([
            {
              IdEntrepot: 1,
              NomEntrepot: 'Entrepôt Central',
              Adresse: '123 Rue de la Minoterie, Paris',
              CapaciteMax: 10000,
              CapaciteActuelle: 7500,
              pourcentage: 75
            },
            {
              IdEntrepot: 2,
              NomEntrepot: 'Entrepôt Nord',
              Adresse: '456 Avenue du Blé, Lille',
              CapaciteMax: 5000,
              CapaciteActuelle: 3200,
              pourcentage: 64
            },
            {
              IdEntrepot: 3,
              NomEntrepot: 'Entrepôt Sud',
              Adresse: '789 Boulevard des Farines, Marseille',
              CapaciteMax: 8000,
              CapaciteActuelle: 2100,
              pourcentage: 26
            }
          ]);
        }
      } catch (error) {
        console.warn('Erreur entrepôts:', error);
        setEntrepots([]);
      }

    } catch (error) {
      console.error('Erreur lors du chargement des données de stock:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMouvementColor = (type) => {
    return type === 'Entrée' ? 'green' : 'orange';
  };

  const getAlerteColor = (niveau) => {
    switch(niveau?.toLowerCase()) {
      case 'critique': return '#dc3545';
      case 'faible': return '#ffc107';
      case 'normal': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getCapaciteColor = (pourcentage) => {
    if (pourcentage >= 90) return '#dc3545';
    if (pourcentage >= 70) return '#ffc107';
    return '#28a745';
  };

  const handleLogout = () => {
    logout();
    navigate('/connexion');
  };

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Chargement du dashboard stock...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <div>
            <h1 className="dashboard-title">
              Dashboard Stock - {user?.prenom || 'Gestionnaire'} ! 📦
            </h1>
            <p className="dashboard-subtitle">
              Gérez vos stocks, entrepôts et mouvements en temps réel
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

      {/* Cartes de statistiques stock */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🏭</div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.totalEntrepots}</h3>
            <p className="stat-label">Entrepôts</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.totalProduits}</h3>
            <p className="stat-label">Produits</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3 className="stat-number" style={{ color: '#dc3545' }}>{stats.stockBas}</h3>
            <p className="stat-label">Stock bas</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.mouvementsJour}</h3>
            <p className="stat-label">Mouvements/jour</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3 className="stat-number">{formatPrice(stats.valeurStock)}</h3>
            <p className="stat-label">Valeur stock</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚨</div>
          <div className="stat-content">
            <h3 className="stat-number" style={{ color: '#ffc107' }}>{stats.alertesStock}</h3>
            <p className="stat-label">Alertes actives</p>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="dashboard-content">
        {/* Mouvements récents */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Mouvements récents</h2>
            <button 
              className="view-all-btn"
              onClick={() => navigate('/stock/mouvements')}
            >
              Voir tout →
            </button>
          </div>
          
          <div className="commandes-list">
            {recentMouvements.length > 0 ? (
              recentMouvements.map((mouvement) => (
                <div key={mouvement.IdMouvement} className="commande-item">
                  <div className="commande-info">
                    <h4 className="commande-client">
                      {mouvement.produit?.nom}
                    </h4>
                    <p className="commande-date">
                      {mouvement.entrepot?.NomEntrepot} - {formatDate(mouvement.DateMouvement)}
                    </p>
                    <p className="commande-motif">{mouvement.Motif}</p>
                  </div>
                  <div className="commande-details">
                    <span className="commande-prix">
                      {mouvement.Quantite} {mouvement.produit?.unite}
                    </span>
                    <span 
                      className="commande-status"
                      style={{ color: getMouvementColor(mouvement.TypeMouvement) }}
                    >
                      {mouvement.TypeMouvement}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">Aucun mouvement récent</p>
            )}
          </div>
        </div>

        {/* Alertes de stock */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Alertes de stock</h2>
            <button 
              className="view-all-btn"
              onClick={() => navigate('/stock/alertes')}
            >
              Voir tout →
            </button>
          </div>
          
          <div className="contacts-list">
            {alertesStock.length > 0 ? (
              alertesStock.map((alerte) => (
                <div key={alerte.id} className="contact-item">
                  <div className="contact-info">
                    <h4 className="contact-name">
                      {alerte.produit?.nom}
                    </h4>
                    <p className="contact-subject">{alerte.entrepot?.NomEntrepot}</p>
                    <p className="contact-date">
                      Stock: {alerte.QuantiteActuelle} / Seuil: {alerte.SeuilAlerte} {alerte.produit?.unite}
                    </p>
                  </div>
                  <div className="contact-status">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getAlerteColor(alerte.niveau), color: 'white' }}
                    >
                      {alerte.niveau}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">Aucune alerte de stock</p>
            )}
          </div>
        </div>

        {/* État des entrepôts */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">État des entrepôts</h2>
            <button 
              className="view-all-btn"
              onClick={() => navigate('/entrepots')}
            >
              Gérer →
            </button>
          </div>
          
          <div className="contacts-list">
            {entrepots.length > 0 ? (
              entrepots.map((entrepot) => (
                <div key={entrepot.IdEntrepot} className="contact-item">
                  <div className="contact-info">
                    <h4 className="contact-name">
                      {entrepot.NomEntrepot}
                    </h4>
                    <p className="contact-subject">{entrepot.Adresse}</p>
                    <p className="contact-date">
                      Capacité: {entrepot.CapaciteActuelle} / {entrepot.CapaciteMax} m³
                    </p>
                    <div className="progress-bar" style={{ width: '100%', height: '8px', backgroundColor: '#e9ecef', borderRadius: '4px', marginTop: '5px' }}>
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${entrepot.pourcentage}%`, 
                          height: '100%', 
                          backgroundColor: getCapaciteColor(entrepot.pourcentage),
                          borderRadius: '4px',
                          transition: 'width 0.3s ease'
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="contact-status">
                    <span 
                      className="status-badge"
                      style={{ color: getCapaciteColor(entrepot.pourcentage) }}
                    >
                      {entrepot.pourcentage}%
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">Aucun entrepôt configuré</p>
            )}
          </div>
        </div>
      </div>

      {/* Actions rapides stock */}
      <div className="quick-actions">
        <h2 className="section-title">Actions rapides</h2>
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
          
          <button 
            className="action-btn"
            onClick={() => navigate('/produits/nouveau')}
          >
            <span className="action-icon">➕</span>
            Nouveau produit
          </button>

          <button 
            className="action-btn"
            onClick={() => navigate('/entrepots/nouveau')}
          >
            <span className="action-icon">🏭</span>
            Nouvel entrepôt
          </button>
          
          <button 
            className="action-btn"
            onClick={() => navigate('/stock/rapport')}
          >
            <span className="action-icon">📊</span>
            Rapports
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardStock;