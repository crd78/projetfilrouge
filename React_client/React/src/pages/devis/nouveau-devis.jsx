import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './nouveau-devis.css';

const NouveauDevis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const demande = location.state;

  console.log("Données reçues dans NouveauDevis :", demande);

  // On récupère les produits de la demande
  const [produits, setProduits] = useState(
    demande?.nomProduits?.map(nom => ({
      nom,
      prixHT: '', // à remplir par le commercial
      remise: 0   // en %
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

  // Soumission du devis
  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici, tu envoies le devis à l'API
    // ...
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