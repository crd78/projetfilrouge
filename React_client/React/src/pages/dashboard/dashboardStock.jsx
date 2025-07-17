import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import API_CONFIG from '../../api.config.js';
import './dashboardStock.css';

const DashboardStock = () => {
  const { isLoggedIn, user, logout, getToken } = useAuth();
  const [produits, setProduits] = useState([]);
  const [entrepots, setEntrepots] = useState([]);
  const [mouvements, setMouvements] = useState([]);
  const [ajout, setAjout] = useState({ produit: '', entrepot: '', quantite: '' });
  const [retrait, setRetrait] = useState({ produit: '', entrepot: '', quantite: '' });
  const [message, setMessage] = useState('');

  // Fonction utilitaire pour générer les headers avec token
  const getAuthHeaders = () => {
    const token = getToken ? getToken() : localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  };

  useEffect(() => {
    const headers = getAuthHeaders();

    fetch(`${API_CONFIG.BASE_URL}api/produits`, { headers })
      .then(res => res.json())
      .then(setProduits);

    fetch(`${API_CONFIG.BASE_URL}api/entrepots`, { headers })
      .then(res => res.json())
      .then(setEntrepots);

    fetch(`${API_CONFIG.BASE_URL}api/stockmouvements`, { headers })
      .then(res => res.json())
      .then(setMouvements);
    // eslint-disable-next-line
  }, []);

  const getStockGlobalProduit = (produitId) => {
    return mouvements
      .filter(m => m.IdProduit === produitId)
      .reduce((total, m) => {
        if (["ENTREE", "RETOUR"].includes(m.TypeMouvement)) return total + m.Quantite;
        if (["SORTIE"].includes(m.TypeMouvement)) return total - m.Quantite;
        if (["INVENTAIRE"].includes(m.TypeMouvement)) return m.Quantite;
        return total;
      }, 0);
  };

  const getQuantiteDansEntrepot = (entrepotId, produitId) => {
    return mouvements
      .filter(m => m.IdEntrepot === entrepotId && m.IdProduit === produitId)
      .reduce((total, m) => {
        if (["ENTREE", "RETOUR"].includes(m.TypeMouvement)) return total + m.Quantite;
        if (["SORTIE"].includes(m.TypeMouvement)) return total - m.Quantite;
        if (["INVENTAIRE"].includes(m.TypeMouvement)) return m.Quantite;
        return total;
      }, 0);
  };

  const handleRetraitStock = async (e) => {
    e.preventDefault();
    setMessage('');
    const headers = getAuthHeaders();
    const res = await fetch(`${API_CONFIG.BASE_URL}api/stockmouvements`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        IdProduit: Number(ajout.produit),
        IdEntrepot: Number(ajout.entrepot),
        Quantite: Number(ajout.quantite),
        TypeMouvement: 'SORTIE'
      })
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('Stock retiré avec succès');
      setAjout({ produit: '', entrepot: '', quantite: '' });
    } else {
      setMessage('Erreur lors du retrait : ' + JSON.stringify(data));
    }
  };

  // Ajout d'une entrée de stock
  const handleAjoutStock = async (e) => {
    e.preventDefault();
    setMessage('');
    const headers = getAuthHeaders();
    const res = await fetch(`${API_CONFIG.BASE_URL}api/stockmouvements`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        IdProduit: Number(ajout.produit),
        IdEntrepot: Number(ajout.entrepot),
        Quantite: Number(ajout.quantite),
        TypeMouvement: 'ENTREE'
      })
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('Stock ajouté avec succès');
      setAjout({ produit: '', entrepot: '', quantite: '' });
    } else {
      setMessage('Erreur lors de l\'ajout : ' + JSON.stringify(data));
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard Stock</h1>

      {/* 1. Liste des produits et leur stock */}
      <section>
        <h2>Stocks produits</h2>
        <table>
          <thead>
            <tr>
              <th>Produit</th>
              <th>Stock global</th>
            </tr>
          </thead>
          <tbody>
            {produits.map(p => (
              <tr key={p.IdProduit}>
                <td>{p.NomProduit}</td>
                <td>{getStockGlobalProduit(p.IdProduit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 2. Liste des entrepôts et capacité */}
      <section>
        <h2>Entrepôts</h2>
        <table>
          <thead>
            <tr>
              <th>Localisation</th>
              <th>Capacité max</th>
              <th>Produit associé</th>
              <th>Quantité dans l'entrepôt</th>
            </tr>
          </thead>
          <tbody>
            {entrepots.map(e => (
              <tr key={e.IdEntrepot}>
                <td>{e.Localisation}</td>
                <td>{e.CapaciteStock}</td>
                <td>{e.IdProduit}</td>
                <td>
                  {getQuantiteDansEntrepot(e.IdEntrepot, e.IdProduit)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

   
     

      {/* 4. Ajouter du stock */}
      <section>
        <h2>Ajouter du stock</h2>
        <form onSubmit={handleAjoutStock}>
          <select value={ajout.produit} onChange={e => setAjout(a => ({ ...a, produit: e.target.value }))}>
            <option value="">Produit</option>
            {produits.map(p => (
              <option key={p.IdProduit} value={p.IdProduit}>
                {p.NomProduit}
              </option>
            ))}
          </select>
          <select value={ajout.entrepot} onChange={e => setAjout(a => ({ ...a, entrepot: e.target.value }))}>
            <option value="">Entrepôt</option>
            {entrepots.map(e => (
              <option key={e.IdEntrepot} value={e.IdEntrepot}>
                {e.Localisation}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            value={ajout.quantite}
            onChange={e => setAjout(a => ({ ...a, quantite: e.target.value }))}
            placeholder="Quantité"
          />
          <button type="submit">Ajouter</button>
        </form>
        {message && <div>{message}</div>}
      </section>

      <section>
        <h2>Retirer du stock</h2>
        <form onSubmit={handleRetraitStock}>
          <select value={ajout.produit} onChange={e => setAjout(a => ({ ...a, produit: e.target.value }))}>
            <option value="">Produit</option>
            {produits.map(p => (
              <option key={p.IdProduit} value={p.IdProduit}>
                {p.NomProduit}
              </option>
            ))}
          </select>
          <select value={ajout.entrepot} onChange={e => setAjout(a => ({ ...a, entrepot: e.target.value }))}>
            <option value="">Entrepôt</option>
            {entrepots.map(e => (
              <option key={e.IdEntrepot} value={e.IdEntrepot}>
                {e.Localisation}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            value={ajout.quantite}
            onChange={e => setAjout(a => ({ ...a, quantite: e.target.value }))}
            placeholder="Quantité"
          />
          <button type="submit">Retirer</button>
        </form>
      </section>


    </div>
  );
};

export default DashboardStock;