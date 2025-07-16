import React, { useEffect, useState } from "react";
import API_CONFIG from "../../api.config.js";
import { useAuth } from "../../context/AuthContext";
import "./demandes-inscription.css";

const DemandesInscription = () => {
  const { getToken } = useAuth();
  const [demandes, setDemandes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDemandes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}api/clients?valider=0`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDemandes(data.results || data);
      } else {
        setDemandes([]);
      }
    } catch (error) {
      setDemandes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDemandes();
    // eslint-disable-next-line
  }, [getToken]);

  // Accepter : PATCH valider à 1
  const handleAccepter = async (id) => {
    await fetch(`${API_CONFIG.BASE_URL}api/clients/${id}/`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${getToken()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ valider: true })
    });
    fetchDemandes();
  };

  // Refuser : DELETE la ligne
  const handleRefuser = async (id) => {
    await fetch(`${API_CONFIG.BASE_URL}api/clients/${id}/`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${getToken()}` }
    });
    fetchDemandes();
  };

  return (
    <div className="demandes-inscription-container">
      <h1>Demandes d'inscription</h1>
      {isLoading ? (
        <div className="loader">Chargement...</div>
      ) : demandes.length === 0 ? (
        <div className="empty">Aucune demande d'inscription</div>
      ) : (
        <table className="demandes-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {demandes.map((d) => (
              <tr key={d.id || d.IdDemande}>
                <td>{d.nom}</td>
                <td>{d.prenom}</td>
                <td>{d.email}</td>
                <td>{d.date_creation ? new Date(d.date_creation).toLocaleDateString("fr-FR") : "-"}</td>
                <td>
                  <span className="statut en-attente">
                    En attente
                  </span>
                </td>
                <td>
                  <button className="btn-accepter" onClick={() => handleAccepter(d.id)}>Accepter</button>
                  <button className="btn-refuser" onClick={() => handleRefuser(d.id)}>Refuser</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DemandesInscription;