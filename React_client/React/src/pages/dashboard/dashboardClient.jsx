import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import API_CONFIG from '../../api.config.js';
import './dashboard.css';

// Composant pour gérer la modification de la date de livraison
const LivraisonDateCell = ({ livraison, updateLivraisonDate, actionInProgress }) => {
  const [datePrevue, setDatePrevue] = useState(livraison?.DatePrevue?.split('T')[0] || '');

  useEffect(() => {
    setDatePrevue(livraison?.DatePrevue?.split('T')[0] || '');
  }, [livraison?.DatePrevue]);

  if (!livraison) return "Pas de livraison prévue";

  return (
    <>
      <input
        type="date"
        value={datePrevue}
        onChange={e => setDatePrevue(e.target.value)}
      />
      <button
        className="btn-modifier-livraison"
        onClick={() => updateLivraisonDate(livraison.IdLivraison, datePrevue)}
        disabled={actionInProgress || !datePrevue}
      >
        Modifier
      </button>
    </>
  );
};

const DashboardClient = () => {
  const { getToken, user } = useAuth();
  const [devis, setDevis] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [notification, setNotification] = useState(null);
  const [statutFiltre, setStatutFiltre] = useState("tous");
  const [commandes, setCommandes] = useState([]);
  const [activeTab, setActiveTab] = useState('devis'); // 'devis' ou 'commandes'

  const fetchDevis = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}api/devis`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Réponse API devis :", data);
        const filtered = (data.results || data).filter(
          d =>
            d.idCommercial !== null &&
            (
              d.IdClient === user.id ||
              (d.client && (d.client.id === user.id || d.client.IdClient === user.id))
            )
        );
        setDevis(filtered);
      } else {
        setDevis([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des devis:", error);
      setDevis([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDevis();
  }, [getToken, user.id]);

  const getStatutLabel = (devis) => {
    if (devis.Approuver === true || devis.Approuver === 1) return "Traité";
    return devis.statut || "En attente";
  };

  const fetchCommandes = async () => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}api/commandes?client=${user.id}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCommandes(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des commandes:", error);
    }
  };

  const updateLivraisonDate = async (livraisonId, newDate) => {
    setActionInProgress(true);
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}api/livraisons/${livraisonId}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ DatePrevue: newDate })
      });
      if (res.ok) {
        fetchCommandes(); // Rafraîchir les données
        setNotification({ type: 'success', message: 'Date de livraison mise à jour' });
      } else {
        setNotification({ type: 'error', message: 'Erreur lors de la mise à jour' });
      }
    } catch (error) {
      console.error("Erreur:", error);
      setNotification({ type: 'error', message: 'Erreur lors de la mise à jour' });
    } finally {
      setActionInProgress(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const getStatutClass = (statut) => {
    return `statut ${(statut || '').toLowerCase()}`;
  };

  const accepterDevis = async (devisId) => {
    if (actionInProgress) return;
    setActionInProgress(true);

    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}api/devis/${devisId}/`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Approuver: true })
      });

      if (res.ok) {
        setNotification({ type: 'success', message: 'Devis accepté avec succès' });
        fetchDevis();
      } else {
        const errorText = await res.text();
        console.error(`Erreur ${res.status}:`, errorText);
        setNotification({ type: 'error', message: 'Erreur lors de l\'acceptation du devis' });
      }
    } catch (error) {
      console.error("Erreur lors de l'acceptation du devis:", error);
      setNotification({ type: 'error', message: 'Erreur lors de l\'acceptation du devis' });
    } finally {
      setActionInProgress(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const refuserDevis = async (devisId) => {
    if (actionInProgress) return;
    setActionInProgress(true);
    
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}api/devis/${devisId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });

      if (res.ok) {
        setNotification({ type: 'success', message: 'Devis refusé et supprimé' });
        setDevis(devis.filter(d => (d.IdDevis || d.id) !== devisId));
      } else {
        setNotification({ type: 'error', message: 'Erreur lors du refus du devis' });
      }
    } catch (error) {
      console.error("Erreur lors du refus du devis:", error);
      setNotification({ type: 'error', message: 'Erreur lors du refus du devis' });
    } finally {
      setActionInProgress(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const devisFiltres = devis.filter(d => {
    const statut = getStatutLabel(d);
    if (statutFiltre === "tous") return true;
    return statut === statutFiltre;
  });

  return (
    <div className="dashboard-client-bg">
      <div className="dashboard-client-container">
        <div className="dashboard-client-header">
          <h1 className="dashboard-client-title">Mon espace client</h1>
        </div>
        
        {/* Onglets de navigation */}
        <div className="tabs-navigation">
          <button 
            className={activeTab === 'devis' ? 'active' : ''} 
            onClick={() => setActiveTab('devis')}
          >
            Mes devis
          </button>
          <button 
            className={activeTab === 'commandes' ? 'active' : ''} 
            onClick={() => {
              setActiveTab('commandes');
              fetchCommandes();
            }}
          >
            Mes commandes
          </button>
        </div>
        
        {notification && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}
        
        <div className="dashboard-client-content">
          {activeTab === 'devis' ? (
            // Contenu existant pour les devis
            <>
              <div style={{ marginBottom: "1rem" }}>
                <label>Filtrer par statut : </label>
                <select value={statutFiltre} onChange={e => setStatutFiltre(e.target.value)}>
                  <option value="tous">Tous</option>
                  <option value="En attente">En attente</option>
                  <option value="Traité">Traité</option>
                  <option value="accepte">Accepté</option>
                  <option value="refuse">Refusé</option>
                </select>
              </div>
              
              {isLoading ? (
                <div className="dashboard-client-loader">
                  Chargement de vos devis...
                </div>
              ) : devisFiltres.length === 0 ? (
                <div className="dashboard-client-empty">
                  <svg className="dashboard-client-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>Aucun devis attribué pour le moment</p>
                </div>
              ) : (
                <div className="dashboard-client-table-wrapper">
                  <table className="dashboard-client-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Montant HT</th>
                        <th>Montant TTC</th>
                        <th>Remise</th>
                        <th>Statut</th>
                        <th>Commercial</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {devisFiltres.map((d) => (
                        <tr key={d.IdDevis || d.id}>
                          <td>{d.IdDevis || d.id}</td>
                          <td>{new Date(d.DateCreation).toLocaleDateString()}</td>
                          <td>{d.MontantTotalHT} €</td>
                          <td>{d.MontantTotalTTC} €</td>
                          <td>{d.remise} €</td>
                          <td>{getStatutLabel(d)}</td>
                          <td>{d.client?.nom} {d.client?.prenom}</td>
                          <td>
                            <button onClick={() => accepterDevis(d.IdDevis || d.id)} disabled={actionInProgress}>
                              Accepter
                            </button>
                            <button onClick={() => refuserDevis(d.IdDevis || d.id)} disabled={actionInProgress}>
                              Refuser
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <div className="commandes-section">
              <h2>Mes commandes</h2>
              <table className="dashboard-client-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Statut</th>
                    <th>Montant TTC</th>
                    <th>Date livraison</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {commandes.map(cmd => {
                    const livraison = cmd.livraisons?.[0];
                    return (
                      <tr key={cmd.IdCommande}>
                        <td data-label="ID">#{cmd.IdCommande}</td>
                        <td data-label="Date">{new Date(cmd.DateCommande).toLocaleDateString()}</td>
                        <td data-label="Statut">{cmd.Statut}</td>
                        <td data-label="Montant TTC">{cmd.MontantTotalTTC} €</td>
                        <td data-label="Date livraison">
                          <LivraisonDateCell
                            livraison={livraison}
                            updateLivraisonDate={updateLivraisonDate}
                            actionInProgress={actionInProgress}
                          />
                        </td>
                        <td data-label="Actions">
                          {/* Actions supplémentaires si nécessaires */}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardClient;