import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API_CONFIG from '../../api.config.js';
import './demandes-devis.css';

const DemandesDevis = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, getToken } = useAuth();
  
  const [demandes, setDemandes] = useState([]);
  const [filteredDemandes, setFilteredDemandes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // États pour les filtres
  const [filters, setFilters] = useState({
    statut: 'tous',
    priorite: 'tous',
    dateDebut: '',
    dateFin: '',
    recherche: ''
  });

  // États pour les modales
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/connexion');
      return;
    }
    fetchDemandes();
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    applyFilters();
  }, [demandes, filters]);

  const fetchDemandes = async () => {
    try {
        setIsLoading(true);
        setError(null);

        // Ajoute le filtre Approuver=0 à l'URL
        const response = await fetch(`${API_CONFIG.BASE_URL}api/devis?Approuver=false`, {
        headers: {
            ...API_CONFIG.DEFAULT_HEADERS,
            'Authorization': `Bearer ${getToken()}`
        }
        });

        if (response.ok) {
        const result = await response.json();
        console.log('Réponse API devis:', result); // <-- Ajoute ce log ici
        setDemandes(result.results || result);
        } else {
        setDemandes([]);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des demandes:', error);
        setError('Erreur lors du chargement des demandes');
    } finally {
        setIsLoading(false);
    }
    };

  const applyFilters = () => {
    let filtered = [...demandes];

    // Filtre par statut
    if (filters.statut !== 'tous') {
      filtered = filtered.filter(d => d.statut === filters.statut);
    }

    // Filtre par priorité
    if (filters.priorite !== 'tous') {
      filtered = filtered.filter(d => d.priorite === filters.priorite);
    }

    // Filtre par recherche
    if (filters.recherche) {
      const search = filters.recherche.toLowerCase();
      filtered = filtered.filter(d => 
        d.client?.societe?.toLowerCase().includes(search) ||
        d.client?.nom?.toLowerCase().includes(search) ||
        d.sujet?.toLowerCase().includes(search) ||
        d.description?.toLowerCase().includes(search)
      );
    }

    // Filtre par date
    if (filters.dateDebut) {
      filtered = filtered.filter(d => 
        new Date(d.date_demande) >= new Date(filters.dateDebut)
      );
    }
    if (filters.dateFin) {
      filtered = filtered.filter(d => 
        new Date(d.date_demande) <= new Date(filters.dateFin)
      );
    }

    setFilteredDemandes(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date)) return '';
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

  const getPrioriteColor = (priorite) => {
    switch(priorite?.toLowerCase()) {
      case 'urgente': return '#dc3545';
      case 'normale': return '#28a745';
      case 'faible': return '#6c757d';
      default: return '#007bff';
    }
  };

  const getStatutColor = (statut) => {
    switch(statut?.toLowerCase()) {
      case 'en_attente': return '#ffc107';
      case 'en_cours': return '#007bff';
      case 'traitee': return '#28a745';
      case 'refusee': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatutLabel = (statut) => {
    switch(statut?.toLowerCase()) {
      case 'en_attente': return 'En attente';
      case 'en_cours': return 'En cours';
      case 'traitee': return 'Traitée';
      case 'refusee': return 'Refusée';
      default: return statut;
    }
  };

  const handleCreerDevis = (demande) => {
    navigate('/devis/nouveau', {
        state: {
        clientId: demande.client?.id,
        clientInfo: demande.client,
        demandeId: demande.id,
        sujet: demande.sujet,
        description: demande.description,
        nomProduits: demande.nomProduits // <-- ajoute cette ligne !
        }
    });
    };

  const handleVoirDetail = (demande) => {
    setSelectedDemande(demande);
    setShowDetailModal(true);
  };

  const handleMarquerTraitee = async (demandeId) => {
    // Ici tu peux ajouter la logique API pour marquer comme traitée
    setDemandes(prev => 
      prev.map(d => 
        d.id === demandeId 
          ? { ...d, statut: 'traitee' }
          : d
      )
    );
  };

  if (isLoading) {
    return (
      <div className="demandes-container">
        <div className="loading">Chargement des demandes de devis...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="demandes-container">
        <div className="error">Erreur: {error}</div>
      </div>
    );
  }

  

  return (
    <div className="demandes-container">
      {/* Header */}
      <div className="demandes-header">
        <div className="header-content">
          <h1 className="page-title">
            📬 Demandes de devis ({filteredDemandes.length})
          </h1>
          <p className="page-subtitle">
            Gérez les demandes de devis reçues de vos clients
          </p>
        </div>
        <button 
          className="btn-retour"
          onClick={() => navigate('/dashboard')}
        >
          ← Retour au dashboard
        </button>
      </div>

      {/* Filtres */}
      <div className="filtres-section">
        <div className="filtres-row">
          <div className="filtre-group">
            <label>Statut :</label>
            <select 
              value={filters.statut}
              onChange={(e) => handleFilterChange('statut', e.target.value)}
            >
              <option value="tous">Tous les statuts</option>
              <option value="en_attente">En attente</option>
              <option value="en_cours">En cours</option>
              <option value="traitee">Traitée</option>
              <option value="refusee">Refusée</option>
            </select>
          </div>

          <div className="filtre-group">
            <label>Priorité :</label>
            <select 
              value={filters.priorite}
              onChange={(e) => handleFilterChange('priorite', e.target.value)}
            >
              <option value="tous">Toutes les priorités</option>
              <option value="urgente">Urgente</option>
              <option value="normale">Normale</option>
              <option value="faible">Faible</option>
            </select>
          </div>

          <div className="filtre-group">
            <label>Recherche :</label>
            <input 
              type="text"
              placeholder="Client, sujet..."
              value={filters.recherche}
              onChange={(e) => handleFilterChange('recherche', e.target.value)}
            />
          </div>
        </div>

        <div className="filtres-row">
          <div className="filtre-group">
            <label>Du :</label>
            <input 
              type="date"
              value={filters.dateDebut}
              onChange={(e) => handleFilterChange('dateDebut', e.target.value)}
            />
          </div>

          <div className="filtre-group">
            <label>Au :</label>
            <input 
              type="date"
              value={filters.dateFin}
              onChange={(e) => handleFilterChange('dateFin', e.target.value)}
            />
          </div>

          <button 
            className="btn-reset-filtres"
            onClick={() => setFilters({
              statut: 'tous',
              priorite: 'tous',
              dateDebut: '',
              dateFin: '',
              recherche: ''
            })}
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Liste des demandes */}
      <div className="demandes-list">
        {filteredDemandes.length > 0 ? (
          filteredDemandes.map((demande) => (
            <div key={demande.id} className="demande-card">
              <div className="demande-header">
                <div className="demande-info">
                  <h3 className="demande-sujet">{demande.sujet}</h3>
                  <div className="demande-meta">
                    <span className="demande-client">
                      {demande.client?.societe} - {demande.client?.prenom} {demande.client?.nom}
                    </span>
                    <span className="demande-date">{formatDate(demande.date_demande)}</span>
                  </div>
                </div>
                <div className="demande-badges">
                  <span 
                    className="badge priorite"
                    style={{ backgroundColor: getPrioriteColor(demande.priorite) }}
                  >
                    {demande.priorite?.toUpperCase()}
                  </span>
                  <span 
                    className="badge statut"
                    style={{ backgroundColor: getStatutColor(demande.statut) }}
                  >
                    {getStatutLabel(demande.statut)}
                  </span>
                </div>
              </div>

              <div className="demande-description">
                <p>{demande.description?.substring(0, 200)}...</p>
              </div>

              <div className="demande-contact">
                <span>📧 {demande.client?.email}</span>
                {demande.client?.telephone && (
                  <span>📞 {demande.client?.telephone}</span>
                )}
              </div>

              <div className="demande-actions">
                <button 
                  className="btn-action btn-voir"
                  onClick={() => handleVoirDetail(demande)}
                >
                  👁️ Voir détail
                </button>
                
                {demande.statut === 'en_attente' && (
                  <button 
                    className="btn-action btn-creer"
                    onClick={() => handleCreerDevis(demande)}
                  >
                    📋 Créer devis
                  </button>
                )}

                {demande.statut !== 'traitee' && (
                  <button 
                    className="btn-action btn-traiter"
                    onClick={() => handleMarquerTraitee(demande.id)}
                  >
                    ✅ Marquer traitée
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-demandes">
            <div className="no-data-icon">📭</div>
            <h3>Aucune demande trouvée</h3>
            <p>Il n'y a aucune demande de devis correspondant à vos critères.</p>
          </div>
        )}
      </div>

      {/* Modal de détail */}
      {showDetailModal && selectedDemande && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Détail de la demande</h2>
              <button 
                className="modal-close"
                onClick={() => setShowDetailModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>Client</h3>
                <p><strong>Société :</strong> {selectedDemande.client?.societe}</p>
                <p><strong>Contact :</strong> {selectedDemande.client?.prenom} {selectedDemande.client?.nom}</p>
                <p><strong>Email :</strong> {selectedDemande.client?.email}</p>
                <p><strong>Téléphone :</strong> {selectedDemande.client?.telephone}</p>
              </div>

              <div className="detail-section">
                <h3>Produits du devis</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr>
                        <th style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>Produit</th>
                        <th style={{ textAlign: 'right', borderBottom: '1px solid #eee' }}>Prix HT (€)</th>
                        <th style={{ textAlign: 'right', borderBottom: '1px solid #eee' }}>Prix TTC (€)</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>
                        {selectedDemande.nomProduits && selectedDemande.nomProduits.length > 0
                            ? selectedDemande.nomProduits.join(', ')
                            : '-'}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                        {selectedDemande.MontantTotalHT || '-'}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                        {selectedDemande.MontantTotalTTC || '-'}
                        </td>
                    </tr>
                    </tbody>
                </table>
                </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-modal btn-creer"
                onClick={() => {
                  setShowDetailModal(false);
                  handleCreerDevis(selectedDemande);
                }}
              >
                📋 Créer devis
              </button>
              <button 
                className="btn-modal btn-fermer"
                onClick={() => setShowDetailModal(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DemandesDevis;