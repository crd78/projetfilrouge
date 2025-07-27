import React, { useState, useEffect } from 'react';
import './liste_produit.css';
import { useAuth } from '../../context/AuthContext'; // si tu utilises AuthContext
import API_CONFIG from '../../api.config.js'; 

const PANIER_KEY = 'minotor_panier';

const ListeProduit = () => {
  const [produits, setProduits] = useState([]);
  const [panier, setPanier] = useState([]);
  const [showPanier, setShowPanier] = useState(false);
  const { user, getToken } = useAuth();
  const [quantites, setQuantites] = useState({});
  const [mouvements, setMouvements] = useState([]);

  // Charger le panier depuis le localStorage au démarrage
  useEffect(() => {
    fetch(`${API_CONFIG.BASE_URL}api/stockmouvements`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(setMouvements);
  }, [getToken]);
  // Sauvegarder le panier à chaque modification
  useEffect(() => {
    localStorage.setItem(PANIER_KEY, JSON.stringify(panier));
  }, [panier]);

  useEffect(() => {
    // Appel API pour récupérer les produits
    fetch(`${API_CONFIG.BASE_URL}api/produits`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        // Si l'API retourne un tableau direct
        setProduits(data);
        // Si l'API retourne {results: [...]}, utilise setProduits(data.results);
      })
      .catch(() => setProduits([]));
  }, [getToken]);

  const ajouterAuPanier = (produit, quantite) => {
    setPanier(prev => {
      const exist = prev.find(item => item.IdProduit === produit.IdProduit);
      if (exist) {
        return prev.map(item =>
          item.IdProduit === produit.IdProduit
            ? { ...item, quantite: item.quantite + quantite }
            : item
        );
      }
      // Ajoute le prix TTC dans l'objet du panier
      return [...prev, {
        id: produit.IdProduit,
        nom: produit.NomProduit,
        prix: produit.PrixTTC ? Number(produit.PrixTTC) : 0,
        quantite,
      }];
    });
  };

  const getStockProduit = (produitId) => {
  return mouvements
    .filter(m => m.IdProduit === produitId)
    .reduce((total, m) => {
      if (["ENTREE", "RETOUR"].includes(m.TypeMouvement)) return total + m.Quantite;
      if (["SORTIE"].includes(m.TypeMouvement)) return total - m.Quantite;
      if (["INVENTAIRE"].includes(m.TypeMouvement)) return m.Quantite;
      return total;
    }, 0);
};

  const envoyerDemandeDevis = async () => {
    try {
      // On envoie un tableau d'objets {id, quantite}
      const produitsPayload = panier.map(item => ({
        id: item.id,
        quantite: item.quantite
      }));

      const body = {
        IdClient: user?.id,
        idCommercial: null,
        MontantTotalHT: Number(totalPanier.toFixed(2)),      // <-- arrondi à 2 décimales
        MontantTotalTTC: Number((totalPanier * 1.2).toFixed(2)), // <-- arrondi à 2 décimales
        produits: produitsPayload
      };
      console.log("Payload envoyé à l'API :", body);

      const url = `${API_CONFIG.BASE_URL}api/devis`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...API_CONFIG.DEFAULT_HEADERS,
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      console.log('Réponse API:', data);
      if (response.ok) {
        alert('Votre demande de devis a été envoyée !');
        setShowPanier(false);
        setPanier([]);
        localStorage.removeItem(PANIER_KEY);
      } else {
        alert('Erreur lors de l\'envoi du devis');
      }
    } catch (err) {
      alert('Erreur réseau');
    }
  };

  const retirerDuPanier = (id) => {
    setPanier(prev => prev.filter(item => item.id !== id));
  };

  const totalPanier = panier.reduce(
    (acc, item) => acc + (Number(item.prix) || 0) * (Number(item.quantite) || 0),
    0
  );

  return (
    <div className="ecommerce-container">
      <h1 className="ecommerce-title">Nos produits</h1>
      <button className="btn-panier-navbar" onClick={() => setShowPanier(true)}>
        🛒 Voir le panier ({panier.length})
      </button>
      <div className="produits-grid">
        {produits.map(produit => (
          <div className="produit-card" key={produit.IdProduit}>
           
            <div className="produit-info">
              <h2 className="produit-nom">{produit.NomProduit}</h2>
              <div className="produit-categorie">{produit.TypeProduit}</div>
              <div className="produit-prix">{produit.PrixTTC ? Number(produit.PrixTTC).toFixed(2) : '0.00'} € TTC</div>
              <div className="produit-stock">
                <span>Stock : </span>
                <span className={getStockProduit(produit.IdProduit) > 0 ? "stock-ok" : "stock-ko"}>
                  {getStockProduit(produit.IdProduit) > 0 ? `${getStockProduit(produit.IdProduit)}` : "Rupture"}
                </span>
              </div>
              {/* Si tu as un champ fournisseur, adapte ici */}
              {produit.Fournisseur && (
                <div className="produit-fournisseur">Fournisseur : {produit.Fournisseur}</div>
              )}

              <input
                type="number"
                min="1"
                value={quantites[produit.IdProduit] || 1}
                onChange={e =>
                  setQuantites(q => ({ ...q, [produit.IdProduit]: parseInt(e.target.value) || 1 }))
                }
                style={{ width: 60, marginRight: 8 }}
              />
              <button
                className="btn-panier"
                disabled={getStockProduit(produit.IdProduit) === 0}
                onClick={() => {
                  if (getStockProduit(produit.IdProduit) > 0) {
                    ajouterAuPanier(produit, quantites[produit.IdProduit] || 1);
                  }
                }}
              >
                Ajouter au panier
              </button>
            </div>
          </div>
        ))}
      </div>
      {produits.length === 0 && (
        <div className="no-produits">Aucun produit disponible.</div>
      )}

      {/* Modal Panier */}
      {showPanier && (
      <div className="modal-panier-overlay" onClick={() => setShowPanier(false)}>
        <div className="modal-panier" onClick={e => e.stopPropagation()}>
            <h2>🛒 Mon panier</h2>
            {panier.length === 0 ? (
                <div className="panier-vide">Votre panier est vide.</div>
            ) : (
                <div>
                <table className="panier-table">
                    <thead>
                    <tr>
                        <th>Produit</th>
                        <th>Quantité</th>
                        <th>Prix</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {panier.map(item => (
                      <tr key={item.id}>
                        <td>{item.nom}</td>
                        <td>{item.quantite ?? 1}</td>
                        <td>
                          {item.prix && item.quantite
                            ? (Number(item.prix) * Number(item.quantite)).toFixed(2) + " €"
                            : "0.00 €"}
                        </td>
                        <td>
                          <button className="btn-retirer" onClick={() => retirerDuPanier(item.id)}>
                            Retirer
                          </button>
                        </td>
                      </tr>
                    ))}
                    </tbody>
                </table>
                <div className="panier-total">
                    Total : <strong>{totalPanier.toFixed(2)} €</strong>
                </div>
                <button
                className="btn-demander-devis"
                onClick={envoyerDemandeDevis}
                >
                📄 Demander un devis
                </button>
                </div>
            )}
            <button className="btn-fermer-panier" onClick={() => setShowPanier(false)}>
                Fermer
            </button>
            </div>
        </div>
        )}
    </div>
  );
};

export default ListeProduit;