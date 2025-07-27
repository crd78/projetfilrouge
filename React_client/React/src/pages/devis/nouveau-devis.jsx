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
    demande?.produits?.map(prod => ({
      id: prod.id,
      nom: prod.nom,
      prixHT: prod.PrixHT || prod.prixHT || 0,
      prixTTC: prod.PrixTTC || prod.prixTTC || 0,
      quantite: prod.quantite || prod.Quantite || 1,
      remise: 0
    })) || []
  );

  // Gestion de la remise uniquement
  const handleRemiseChange = (idx, value) => {
    setProduits(prev =>
      prev.map((prod, i) =>
        i === idx ? { ...prod, remise: value } : prod
      )
    );
  };

  // Calcul du prix TTC avec remise
  const getPrixTTC = (prixTTC, remise) => {
    const prixRemise = prixTTC - (prixTTC * (remise / 100));
    return Number(prixRemise).toFixed(2);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Calcule le montant de la ristourne
  const montantRistourne = produits.reduce(
    (acc, prod) => acc + (((parseFloat(prod.prixHT) || 0) * (parseInt(prod.quantite) || 1)) * (parseFloat(prod.remise) || 0) / 100),
    0
  );

  // Prépare le payload du devis
  const devisPayload = {
    IdClient: demande.clientId,
    idCommercial: user?.id,
    produits: produits
      .filter(prod => !!prod.id)
      .map(prod => ({
        id: Number(prod.id),
        quantite: parseInt(prod.quantite) || 1,
        prixHT: Number(((parseFloat(prod.prixHT) || 0) * (parseInt(prod.quantite) || 1)).toFixed(2)),
        prixTTC: Number((((parseFloat(prod.prixHT) || 0) * (parseInt(prod.quantite) || 1)) * 1.05).toFixed(2))
      })),
    MontantTotalHT: Number(
      produits.reduce(
        (acc, prod) => acc + ((parseFloat(prod.prixHT) || 0) * (parseInt(prod.quantite) || 1)),
        0
      ).toFixed(2)
    ),
    MontantTotalTTC: Number(
      produits.reduce(
        (acc, prod) => acc + (((parseFloat(prod.prixHT) || 0) * (parseInt(prod.quantite) || 1)) * 1.05),
        0
      ).toFixed(2)
    )
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
              <th>Quantité</th>
              <th>Prix HT (€)</th>
              <th>Prix TTC (€)</th>
              <th>Remise (%)</th>
              <th>Prix TTC avec remise (€)</th>
            </tr>
          </thead>
          <tbody>
            {produits.map((prod, idx) => {
              const prixHTTotal = (parseFloat(prod.prixHT) || 0) * (parseInt(prod.quantite) || 1);
              const prixTTCTotal = (parseFloat(prod.prixTTC) || 0) * (parseInt(prod.quantite) || 1);
              const remise = parseFloat(prod.remise) || 0;
              const prixTTCAvecRemise = prixTTCTotal - (prixTTCTotal * remise / 100);

              return (
                <tr key={idx}>
                  <td>{prod.nom}</td>
                  <td>{prod.quantite}</td>
                  <td>{prixHTTotal.toFixed(2)}</td>
                  <td>{prixTTCTotal.toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={prod.remise}
                      onChange={e => handleRemiseChange(idx, parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td>{prixTTCAvecRemise.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <button type="submit" className="btn-creer-devis">Créer le devis</button>
      </form>
    </div>
  );
};

export default NouveauDevis;