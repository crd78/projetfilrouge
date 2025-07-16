import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './nouveau-devis.css';
import API_CONFIG from '../../api.config.js';
import { useAuth } from '../../context/AuthContext';

const NouveauDevis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const demande = location.state;
  const { getToken } = useAuth();
  const { user } = useAuth();
  const devisId = demande?.devisId;
  if (!devisId) {
    alert("Erreur : aucun devisId fourni !");
    return;
  }

  // On récupère les produits de la demande
  const [produits, setProduits] = useState(
    demande?.nomProduits?.map(prod => ({
      id: prod.id || '', // récupère l'id si dispo, sinon vide
      nom: prod.nom || prod, // prod peut être un string ou un objet
      prixHT: '',
      remise: 0
    })) || []
  );

  // Gestion du prix/remise par produit
  const handleChange = (idx, field, value) => {
    setProduits(prev =>
      prev.map((prod, i) =>
        i === idx ? { ...prod, [field]: value } : prod
      )
    );
  };

  // Calcul du prix TTC (exemple simple, à adapter selon TVA)
  const getPrixTTC = (prixHT, remise) => {
    const prixRemise = prixHT - (prixHT * (remise / 100));
    return (prixRemise * 1.2).toFixed(2); // TVA 20%
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Calcule le montant de la ristourne
  const montantRistourne = produits.reduce((acc, prod) => acc + ((parseFloat(prod.prixHT) || 0) * (parseFloat(prod.remise) || 0) / 100), 0);

  // Prépare le payload du devis
  const devisPayload = {
  IdClient: demande.clientId,
  idCommercial: user?.id, // <-- minuscule ici !
    produits: produits
      .map(prod => Number(prod.id))
      .filter(id => !!id),
    MontantTotalHT: produits.reduce((acc, prod) => acc + (parseFloat(prod.prixHT) || 0), 0),
    MontantTotalTTC: produits.reduce((acc, prod) => acc + (prod.prixHT ? parseFloat(getPrixTTC(prod.prixHT, prod.remise)) : 0), 0)
  };

  // Ajoute ce log pour voir le payload envoyé
  console.log('Payload envoyé pour update devis:', devisPayload);

  const devisResponse = await fetch(`${API_CONFIG.BASE_URL}api/devis/${devisId}/`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(devisPayload)
  });


    if (!devisResponse.ok) {
      const errorText = await devisResponse.text();
      console.error('Erreur création devis:', errorText);
      alert('Erreur création devis: ' + errorText);
      return;
    }

    const devisData = await devisResponse.json();

    // Si une ristourne est présente, crée la ristourne
    if (montantRistourne > 0) {
      const ristournePayload = {
        DateRistourne: new Date().toISOString().slice(0, 10),
        IdDevis: devisId, // <-- correction ici
        IdCommercial: demande.userId,
        MontantRistourne: Number(montantRistourne.toFixed(2)), // <-- correction ici
        Commentaire: "Ristourne appliquée"

      };

      const ristourneResponse = await fetch(`${API_CONFIG.BASE_URL}api/ristournes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ristournePayload)
      });

      if (!ristourneResponse.ok) {
        const errorText = await ristourneResponse.text();
        console.error('Erreur création ristourne:', errorText);
        alert('Erreur création ristourne: ' + errorText);
        return;
      }
    }

    alert('Devis créé !');
    navigate('/devis');
  };

  return (
    <div className="nouveau-devis-container">
      <h1>Créer un devis</h1>
      <h2>Client : {demande?.clientInfo?.societe} - {demande?.clientInfo?.prenom} {demande?.clientInfo?.nom}</h2>
      <form onSubmit={handleSubmit}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Produit</th>
              <th>Prix HT (€)</th>
              <th>Remise (%)</th>
              <th>Prix TTC (€)</th>
            </tr>
          </thead>
          <tbody>
            {produits.map((prod, idx) => (
              <tr key={idx}>
                <td>{prod.nom}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={prod.prixHT}
                    onChange={e => handleChange(idx, 'prixHT', parseFloat(e.target.value) || 0)}
                    required
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={prod.remise}
                    onChange={e => handleChange(idx, 'remise', parseFloat(e.target.value) || 0)}
                  />
                </td>
                <td>
                  {prod.prixHT ? getPrixTTC(prod.prixHT, prod.remise) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="submit" className="btn-creer-devis">Créer le devis</button>
      </form>
    </div>
  );
};

export default NouveauDevis;