import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';
import API_CONFIG from '../api.config.js';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout, getToken } = useAuth();
  
  const [stats, setStats] = useState({
    totalCommandes: 0,
    commandesEnCours: 0
 
  });
  
  const [recentCommandes, setRecentCommandes] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/connexion');
      return;
    }
    
    fetchDashboardData();
  }, [isLoggedIn, navigate]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Headers avec token d'authentification
      const authHeaders = {
        ...API_CONFIG.DEFAULT_HEADERS,
        'Authorization': `Bearer ${getToken()}`
      };
      
      // Récupération des statistiques
      try {
        const statsResponse = await fetch(`${API_CONFIG.BASE_URL}/api/stats`, {
          headers: authHeaders
        });
        
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        } else {
          console.warn('Impossible de charger les statistiques');
          // Données fictives pour la démonstration
          setStats({
            totalCommandes: 127,
            commandesEnCours: 15
          });
        }
      } catch (error) {
        console.warn('Erreur stats:', error);
        // Données fictives
        setStats({
          totalCommandes: 127,
          commandesEnCours: 15
        });
      }

      // Récupération des commandes récentes
      try {
        const commandesResponse = await fetch(`${API_CONFIG.BASE_URL}/api/commandes?limit=5`, {
          headers: authHeaders
        });
        
        if (commandesResponse.ok) {
          const commandesData = await commandesResponse.json();
          setRecentCommandes(commandesData.results || commandesData);
        } else {
          console.warn('Impossible de charger les commandes');
          // Données fictives
          setRecentCommandes([
            {
              id: 1,
              client: { prenom: 'Marie', nom: 'Dupont' },
              total: 45.80,
              statut: 'en_cours',
              date_creation: new Date().toISOString()
            },
            {
              id: 2,
              client: { prenom: 'Jean', nom: 'Martin' },
              total: 32.50,
              statut: 'livree',
              date_creation: new Date(Date.now() - 86400000).toISOString()
            }
          ]);
        }
      } catch (error) {
        console.warn('Erreur commandes:', error);
        setRecentCommandes([]);
      }

      // Récupération des contacts récents
      try {
        const contactsResponse = await fetch(`${API_CONFIG.BASE_URL}/api/contacts/?limit=3`, {
          headers: authHeaders
        });
        
        if (contactsResponse.ok) {
          const contactsData = await contactsResponse.json();
          setContacts(contactsData.results || contactsData);
        } else {
          console.warn('Impossible de charger les contacts');
          // Données fictives
          setContacts([
            {
              id: 1,
              prenom: 'Sophie',
              nom: 'Lefebvre',
              sujet: 'Commande pour événement',
              traite: false,
              date_creation: new Date().toISOString()
            },
            {
              id: 2,
              prenom: 'Paul',
              nom: 'Durand',
              sujet: 'Question sur les horaires',
              traite: true,
              date_creation: new Date(Date.now() - 3600000).toISOString()
            }
          ]);
        }
      } catch (error) {
        console.warn('Erreur contacts:', error);
        setContacts([]);
      }

    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
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
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const handleLogout = () => {
    logout();
    navigate('/connexion');
  };

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Chargement du dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <div>
            <h1 className="dashboard-title">
              Bonjour {user?.prenom || 'Boulanger'} ! 👋
            </h1>
            <p className="dashboard-subtitle">
              Voici un aperçu de votre activité aujourd'hui
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

      {/* Cartes de statistiques */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.totalCommandes}</h3>
            <p className="stat-label">Commandes totales</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚀</div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.commandesEnCours}</h3>
            <p className="stat-label">En cours</p>
          </div>
        </div>

      </div>

      {/* Contenu principal */}
      <div className="dashboard-content">
        {/* Commandes récentes */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Commandes récentes</h2>
            <button 
              className="view-all-btn"
              onClick={() => navigate('/commandes')}
            >
              Voir tout →
            </button>
          </div>
          
          <div className="commandes-list">
            {recentCommandes.length > 0 ? (
              recentCommandes.map((commande) => (
                <div key={commande.id} className="commande-item">
                  <div className="commande-info">
                    <h4 className="commande-client">
                      {commande.client?.prenom} {commande.client?.nom}
                    </h4>
                    <p className="commande-date">{formatDate(commande.date_creation)}</p>
                  </div>
                  <div className="commande-details">
                    <span className="commande-prix">{formatPrice(commande.total)}</span>
                    <span className={`commande-status status-${commande.statut?.toLowerCase()}`}>
                      {commande.statut}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">Aucune commande récente</p>
            )}
          </div>
        </div>

        {/* Messages de contact */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Messages récents</h2>
            <button 
              className="view-all-btn"
              onClick={() => navigate('/contacts')}
            >
              Voir tout →
            </button>
          </div>
          
          <div className="contacts-list">
            {contacts.length > 0 ? (
              contacts.map((contact) => (
                <div key={contact.id} className="contact-item">
                  <div className="contact-info">
                    <h4 className="contact-name">
                      {contact.prenom} {contact.nom}
                    </h4>
                    <p className="contact-subject">{contact.sujet}</p>
                    <p className="contact-date">{formatDate(contact.date_creation)}</p>
                  </div>
                  <div className="contact-status">
                    <span className={`status-badge ${contact.traite ? 'traite' : 'non-traite'}`}>
                      {contact.traite ? 'Traité' : 'Nouveau'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">Aucun message récent</p>
            )}
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="quick-actions">
        <h2 className="section-title">Actions rapides</h2>
        <div className="actions-grid">
          <button 
            className="action-btn"
            onClick={() => navigate('/commandes/nouvelle')}
          >
            <span className="action-icon">➕</span>
            Nouvelle commande
          </button>
          
          <button 
            className="action-btn"
            onClick={() => navigate('/produits')}
          >
            <span className="action-icon">🥖</span>
            Gérer produits
          </button>
          <button 
            className="action-btn"
            onClick={() => navigate('/contact')}
          >
            <span className="action-icon">📧</span>
            Demande de contact
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;