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
    const [newProduct, setNewProduct] = useState({
    NomProduit: '',
    TypeProduit: 'Farines',
    PrixHT: ''
  });
  const [addProductLoading, setAddProductLoading] = useState(false);
  const [addProductError, setAddProductError] = useState('');
  const [addProductSuccess, setAddProductSuccess] = useState('');
  const [products, setProducts] = useState([]);

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

      // Récupération des produits
      try {
        const productsResponse = await fetch(`${API_CONFIG.BASE_URL}api/produits`, {
          headers: {
            ...API_CONFIG.DEFAULT_HEADERS,
            'Authorization': `Bearer ${getToken()}`
          }
        });
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setProducts(productsData.results || productsData);
        } else {
          setProducts([]);
        }
      } catch (error) {
        setProducts([]);
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

  
          try {
            const ristournesResponse = await fetch(
              `${API_CONFIG.BASE_URL}api/ristournes?limit=5`,
              { headers: authHeaders }
            );
            if (ristournesResponse.ok) {
              const ristournesData = await ristournesResponse.json();
              setRistournes(ristournesData.results || ristournesData);
            } else {
              setRistournes([]);
            }
          } catch (error) {
            console.warn('Erreur ristournes:', error);
            setRistournes([]);
          }
    
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

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setAddProductLoading(true);
    setAddProductError('');
    setAddProductSuccess('');
    try {
      const authHeaders = {
        ...API_CONFIG.DEFAULT_HEADERS,
        'Authorization': `Bearer ${getToken()}`
      };
      const response = await fetch(`${API_CONFIG.BASE_URL}api/produits`, {
        method: 'POST',
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          NomProduit: newProduct.NomProduit,
          TypeProduit: newProduct.TypeProduit,
          PrixHT: parseFloat(newProduct.PrixHT)
        })
      });
      if (response.ok) {
        setAddProductSuccess('Produit ajouté !');
        setNewProduct({ NomProduit: '', TypeProduit: 'Farines', PrixHT: '' });
      } else {
        setAddProductError('Erreur lors de l\'ajout');
      }
    } catch (err) {
      setAddProductError('Erreur réseau');
    }
    setAddProductLoading(false);
  };

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
      
        {/* Ristournes récentes */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Ristournes accordées</h2>
            <button 
              className="view-all-btn"
              onClick={() => navigate('/dashboard/commercial')}
            >
          
            </button>
          </div>
          
          <div className="contacts-list">
            {ristournes.length > 0 ? (
              ristournes.map((ristourne) => (
                <div key={ristourne.id} className="contact-item">
                  <div className="contact-info">
                     <h4 className="contact-name">
                      Devis #{ristourne.IdDevis_id || "-"}
                    </h4>
                    <p className="contact-subject">{ristourne.Commentaire || "-"}</p>
                    <p className="contact-date">{formatDate(ristourne.DateRistourne)}</p>
                    <span className="status-badge ristourne">
                      {ristourne.MontantRistourne != null ? `${ristourne.MontantRistourne} €` : "-"}
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

      <div className="dashboard-section">
        <h2>Ajouter un produit</h2>
        <form onSubmit={handleAddProduct} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Nom du produit"
            value={newProduct.NomProduit}
            onChange={e => setNewProduct({ ...newProduct, NomProduit: e.target.value })}
            required
          />
          <select
            value={newProduct.TypeProduit}
            onChange={e => setNewProduct({ ...newProduct, TypeProduit: e.target.value })}
          >
            <option value="Ingrédient">Ingrédient</option>
            <option value="Produits laitiers">Produits laitiers</option>
            <option value="Farines">Farines</option>
            <option value="AUTRE">Autre</option>
          </select>
          <input
            type="number"
            placeholder="Prix HT"
            value={newProduct.PrixHT}
            onChange={e => setNewProduct({ ...newProduct, PrixHT: e.target.value })}
            required
            min="0"
            step="0.01"
          />
          <button type="submit" disabled={addProductLoading}>Ajouter</button>
        </form>
        {addProductError && <p style={{ color: 'red' }}>{addProductError}</p>}
        {addProductSuccess && <p style={{ color: 'green' }}>{addProductSuccess}</p>}
      </div>

      <div className="dashboard-section">
        <h2>Liste des produits</h2>
        {products.length === 0 ? (
          <p>Aucun produit</p>
        ) : (
          <ul>
            {products.map(product => (
              <li key={product.IdProduit} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span>{product.NomProduit} ({product.TypeProduit}) - {product.PrixHT} € HT</span>
                <button
                  onClick={async () => {
                    if (window.confirm('Supprimer ce produit ?')) {
                      await fetch(`${API_CONFIG.BASE_URL}api/produits/${product.IdProduit}/`, {
                        method: 'DELETE',
                        headers: {
                          ...API_CONFIG.DEFAULT_HEADERS,
                          'Authorization': `Bearer ${getToken()}`
                        }
                      });
                      setProducts(products.filter(p => p.IdProduit !== product.IdProduit));
                    }
                  }}
                  style={{ color: 'white', background: 'red', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer' }}
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Actions rapides commerciales */}
      <div className="quick-actions">
        <h2 className="section-title">Actions rapides</h2>
        <div className="actions-grid">
        
          <button 
            className="action-btn"
            onClick={() => navigate('/devis/demandes-devis')}
          >
            <span className="action-icon">🔔</span>
            Voir demandes ({stats.demandesEnAttente})
          </button>
          
         <button 
            className="action-btn"
            onClick={() => navigate('/demandes-inscription')}
          >
            <span className="action-icon">📝</span>
            Voir demandes d'inscription
          </button>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;