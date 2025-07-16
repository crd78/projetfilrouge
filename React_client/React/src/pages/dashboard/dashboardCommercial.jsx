import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';
import API_CONFIG from '../../api.config.js';
import { useAuth } from '../../context/AuthContext.jsx';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout, getToken } = useAuth();
  
  const [stats, setStats] = useState({
    totalDevis: 0,
    devisEnAttente: 0,
    devisAcceptes: 0,
    demandesEnAttente: 0, // ✅ Nouvelles demandes
    nouveauxClients: 0,
    ristournesAccordees: 0
  });
  
  const [recentDevis, setRecentDevis] = useState([]);
  const [demandesDevis, setDemandesDevis] = useState([]); // ✅ Demandes de devis
  const [recentClients, setRecentClients] = useState([]);
  const [ristournes, setRistournes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/connexion');
      return;
    }
    
    fetchCommercialData();
  }, [isLoggedIn, navigate]);

  const fetchCommercialData = async () => {
    try {
      setIsLoading(true);
      
      // Headers avec token d'authentification
      const authHeaders = {
        ...API_CONFIG.DEFAULT_HEADERS,
        'Authorization': `Bearer ${getToken()}`
      };
      
      // Récupération des statistiques commerciales
      try {
        const statsResponse = await fetch(`${API_CONFIG.BASE_URL}/api/statistiques/performances`, {
          headers: authHeaders
        });
        
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats({
            totalDevis: statsData.devis?.total || 45,
            devisEnAttente: statsData.devis?.en_attente || 12,
            devisAcceptes: statsData.devis?.acceptes || 28,
            demandesEnAttente: statsData.demandes?.en_attente || 8, // ✅ Nouvelles demandes
            nouveauxClients: statsData.clients?.nouveaux || 8,
            ristournesAccordees: statsData.ristournes?.total || 15
          });
        } else {
          // Données fictives pour la démonstration
          setStats({
            totalDevis: 45,
            devisEnAttente: 12,
            devisAcceptes: 28,
            demandesEnAttente: 8, // ✅ Nouvelles demandes
            nouveauxClients: 8,
            ristournesAccordees: 15
          });
        }
      } catch (error) {
        console.warn('Erreur stats commerciales:', error);
        // Données fictives
        setStats({
          totalDevis: 45,
          devisEnAttente: 12,
          devisAcceptes: 28,
          demandesEnAttente: 8,
          nouveauxClients: 8,
          ristournesAccordees: 15
        });
      }

      // Récupération des demandes de devis non approuvées (Approuver = false)
      try {
        const demandesResponse = await fetch(
          `${API_CONFIG.BASE_URL}api/devis?Approuver=false&limit=5`,
          { headers: authHeaders }
        );
       if (demandesResponse.ok) {
        const demandesData = await demandesResponse.json();
        console.log('Réponse API demandes devis:', demandesData); // <-- Ajout du log
        setDemandesDevis(demandesData.results || demandesData);
      } else {
        setDemandesDevis([]);
      }
      } catch (error) {
        console.warn('Erreur demandes devis:', error);
        setDemandesDevis([]);
      }

      // Récupération des devis approuvés (Approuver = true)
      try {
        const devisResponse = await fetch(
          `${API_CONFIG.BASE_URL}api/devis?Approuver=true&limit=5`,
          { headers: authHeaders }
        );
        if (devisResponse.ok) {
          const devisData = await devisResponse.json();
          setRecentDevis(devisData.results || devisData);
        } else {
          setRecentDevis([]);
        }
      } catch (error) {
        console.warn('Erreur devis:', error);
        setRecentDevis([]);
      }

      // ...clients et ristournes...
    } catch (error) {
      console.error('Erreur lors du chargement des données commerciales:', error);
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

  const getStatutColor = (statut) => {
    switch(statut?.toLowerCase()) {
      case 'en_attente': return 'orange';
      case 'accepte': return 'green';
      case 'refuse': return 'red';
      case 'brouillon': return 'gray';
      default: return 'blue';
    }
  };

 
  const handleOuvrirDemande = (demande) => {
    console.log('demande envoyée à nouveau-devis:', demande);
    navigate(`/devis/nouveau`, {
      state: {
        devisId: demande.IdDevis || demande.id, // Prend IdDevis si dispo, sinon id
        clientId: demande.client?.id,
        clientInfo: demande.client,
        demandeId: demande.id,
        sujet: demande.sujet,
        description: demande.description,
        nomProduits: demande.nomProduits // si tu veux pré-remplir les produits
      }
    });
  };

  // ✅ Fonction pour ouvrir un devis existant
  const handleOuvrirDevis = (devis) => {
    navigate(`/devis/${devis.IdDevis}`);
  };

  // ✅ Fonction pour obtenir la couleur selon la priorité
  const getPrioriteColor = (priorite) => {
    switch(priorite?.toLowerCase()) {
      case 'urgente': return '#dc3545';
      case 'normale': return '#28a745';
      case 'faible': return '#6c757d';
      default: return '#007bff';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/connexion');
  };

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Chargement du dashboard commercial...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <div>
            <h1 className="dashboard-title">
              Dashboard Commercial - {user?.prenom || 'Commercial'} ! 🎯
            </h1>
            <p className="dashboard-subtitle">
              Gérez vos demandes de devis, clients et ristournes en temps réel
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

      {/* Cartes de statistiques commerciales */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.totalDevis}</h3>
            <p className="stat-label">Total devis</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.devisEnAttente}</h3>
            <p className="stat-label">Devis en attente</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔔</div>
          <div className="stat-content">
            <h3 className="stat-number" style={{ color: '#dc3545' }}>{stats.demandesEnAttente}</h3>
            <p className="stat-label">Nouvelles demandes</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.devisAcceptes}</h3>
            <p className="stat-label">Acceptés</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.nouveauxClients}</h3>
            <p className="stat-label">Nouveaux clients</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎁</div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.ristournesAccordees}</h3>
            <p className="stat-label">Ristournes</p>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="dashboard-content">
        {/* ✅ Nouvelles demandes de devis */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">🔔 Demandes de devis ({demandesDevis.length})</h2>
            <button 
              className="view-all-btn"
              onClick={() => navigate('/devis/demandes-devis')}
            >
              Voir tout →
            </button>
          </div>
          
         <div className="commandes-list">
            {demandesDevis.length > 0 ? (
              demandesDevis.map((demande) => (
                <div 
                  key={demande.IdDevis} 
                  className="commande-item demande-item"
                  onClick={() => handleOuvrirDemande(demande)}
                  style={{ cursor: 'pointer', border: '2px solid #e9ecef' }}
                >
                  <div className="commande-info">
                    <h4>
                      {demande.client?.prenom} {demande.client?.nom}
                    </h4>
                    <p>
                      Montant HT : {demande.MontantTotalHT} € / Montant TTC : {demande.MontantTotalTTC} €
                    </p>
                  </div>
                 
                </div>
              ))
            ) : (
              <p className="no-data">Aucune nouvelle demande</p>
            )}
          </div>
        </div>

      

        {/* Nouveaux clients */}
      

        {/* Ristournes récentes */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Ristournes accordées</h2>
            <button 
              className="view-all-btn"
              onClick={() => navigate('/ristournes')}
            >
              Voir tout →
            </button>
          </div>
          
          <div className="contacts-list">
            {ristournes.length > 0 ? (
              ristournes.map((ristourne) => (
                <div key={ristourne.id} className="contact-item">
                  <div className="contact-info">
                    <h4 className="contact-name">
                      Devis #{ristourne.devis?.IdDevis}
                    </h4>
                    <p className="contact-subject">{ristourne.devis?.client}</p>
                    <p className="contact-date">{formatDate(ristourne.DateRistourne)}</p>
                  </div>
                  <div className="contact-status">
                    <span className="status-badge ristourne">
                      {ristourne.Pourcentage}% - {formatPrice(ristourne.Montant)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">Aucune ristourne récente</p>
            )}
          </div>
        </div>
      </div>

      {/* Actions rapides commerciales */}
      <div className="quick-actions">
        <h2 className="section-title">Actions rapides</h2>
        <div className="actions-grid">
          <button 
            className="action-btn"
            onClick={() => navigate('/devis/nouveau')}
          >
            <span className="action-icon">📋</span>
            Nouveau devis
          </button>
          
          <button 
            className="action-btn"
            onClick={() => navigate('/devis/demandes-devis')}
          >
            <span className="action-icon">🔔</span>
            Voir demandes ({stats.demandesEnAttente})
          </button>

          <button 
            className="action-btn"
            onClick={() => navigate('/clients/nouveau')}
          >
            <span className="action-icon">👤</span>
            Ajouter client
          </button>

          <button 
            className="action-btn"
            onClick={() => navigate('/fournisseurs/nouveau')}
          >
            <span className="action-icon">🏭</span>
            Ajouter minoterie
          </button>
          
          <button 
            className="action-btn"
            onClick={() => navigate('/ristournes/nouvelle')}
          >
            <span className="action-icon">🎁</span>
            Accorder ristourne
          </button>

          <button 
            className="action-btn"
            onClick={() => navigate('/statistiques')}
          >
            <span className="action-icon">📊</span>
            Voir statistiques
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;