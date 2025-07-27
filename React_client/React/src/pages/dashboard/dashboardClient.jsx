import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import API_CONFIG from '../../api.config.js';
import './dashboard.css';

const DashboardClient = () => {
  const { getToken, user } = useAuth();
  const [devis, setDevis] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [notification, setNotification] = useState(null);
  const [statutFiltre, setStatutFiltre] = useState("tous");

  const fetchDevis = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}api/devis`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Réponse API devis :", data); // <-- LOG AJOUTÉ
        const filtered = (data.results || data).filter(
          d => d.idCommercial !== null && d.IdClient === user.id
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

  // Retourne le label du statut à afficher
  const getStatutLabel = (devis) => {
    if (devis.Approuver === true || devis.Approuver === 1) return "Traité";
    return devis.statut || "En attente";
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

  // Filtrage des devis selon le statut sélectionné
  const devisFiltres = devis.filter(d => {
    const statut = getStatutLabel(d);
    if (statutFiltre === "tous") return true;
    return statut === statutFiltre;
  });

  return (
    <div className="dashboard-client-bg">
      <div className="dashboard-client-container">
        <div className="dashboard-client-header">
          <h1 className="dashboard-client-title">Mes devis attribués</h1>
        </div>
        
        <div className="dashboard-client-content">
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
          {notification && (
            <div className={`notification ${notification.type}`}>
              {notification.message}
            </div>
          )}
          
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
                    <th>Remise</th> {/* Ajout colonne */}
                    <th>Statut</th>
                    <th>Commercial</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {devisFiltres.map((d) => {
                    let montantHT = 0;
                    let montantTTC = 0;
                    if (Array.isArray(d.produits)) {
                      d.produits.forEach(prod => {
                        montantHT += (parseFloat(prod.PrixHT) || 0) * (parseInt(prod.quantite) || 1);
                        montantTTC += (parseFloat(prod.PrixTTC) || 0) * (parseInt(prod.quantite) || 1);
                      });
                    } else {
                      montantHT = parseFloat(d.MontantTotalHT) || 0;
                      montantTTC = parseFloat(d.MontantTotalTTC) || 0;
                    }

                    return (
                      <tr key={d.IdDevis || d.id}>
                        <td data-label="ID">#{d.IdDevis || d.id}</td>
                        <td data-label="Date">
                          {d.date_creation ? new Date(d.date_creation).toLocaleDateString('fr-FR') : '-'}
                        </td>
                        <td data-label="Montant HT">
                          {montantHT.toFixed(2) + ' €'}
                        </td>
                        <td data-label="Montant TTC">
                          {montantTTC.toFixed(2) + ' €'}
                        </td>
                        <td data-label="Remise">
                          {d.remise != null && !isNaN(parseFloat(d.remise))
                            ? parseFloat(d.remise).toFixed(2) + ' €'
                            : '-'}
                        </td>
                        <td data-label="Statut">
                          <span className={getStatutClass(getStatutLabel(d))}>
                            {getStatutLabel(d)}
                          </span>
                        </td>
                        <td data-label="Commercial">
                          {d.idCommercial && d.idCommercial.nom
                            ? d.idCommercial.nom
                            : d.idCommercial || '-'}
                        </td>
                        <td data-label="Actions">
                          <div className="devis-actions">
                            <button 
                              className="btn-accepter"
                              onClick={() => accepterDevis(d.IdDevis || d.id)}
                              disabled={actionInProgress}
                            >
                              Accepter
                            </button>
                            <button 
                              className="btn-refuser"
                              onClick={() => refuserDevis(d.IdDevis || d.id)}
                              disabled={actionInProgress}
                            >
                              Refuser
                            </button>
                          </div>
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