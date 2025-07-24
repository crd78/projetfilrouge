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
    setProduits([
      {
        id: 1,
        nom: 'Farine T55',
        categorie: 'Farines',
        stock: 1200,
        unite: 'kg',
        prix: 0.85,
        fournisseur: 'Minoterie Dupont',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80'
      },
      {
        id: 2,
        nom: 'Levure fraîche',
        categorie: 'Ingrédients',
        stock: 80,
        unite: 'kg',
        prix: 2.10,
        fournisseur: 'Levures Martin',
        image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80'
      },
      {
        id: 3,
        nom: 'Sucre blanc',
        categorie: 'Ingrédients',
        stock: 350,
        unite: 'kg',
        prix: 1.20,
        fournisseur: 'Sucrerie Centrale',
        image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80'
      },
      {
        id: 4,
        nom: 'Beurre doux',
        categorie: 'Produits laitiers',
        stock: 60,
        unite: 'kg',
        prix: 5.50,
        fournisseur: 'Laiterie des Alpes',
        image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80'
      }
    ]);
  }, []);

  const ajouterAuPanier = (produit, quantite) => {
    setPanier(prev => {
      const exist = prev.find(item => item.id === produit.id);
      if (exist) {
        return prev.map(item =>
          item.id === produit.id
            ? { ...item, quantite: item.quantite + quantite }
            : item
        );
      }
      return [...prev, { ...produit, quantite }];
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
          <div className="produit-card" key={produit.id}>
            <img src={produit.image} alt={produit.nom} className="produit-image" />
            <div className="produit-info">
              <h2 className="produit-nom">{produit.nom}</h2>
              <div className="produit-categorie">{produit.categorie}</div>
              <div className="produit-prix">{produit.prix.toFixed(2)} € / {produit.unite}</div>
              <div className="produit-stock">
                <span>Stock : </span>
                <span className={getStockProduit(produit.id) > 0 ? "stock-ok" : "stock-ko"}>
                  {getStockProduit(produit.id) > 0 ? `${getStockProduit(produit.id)} ${produit.unite}` : "Rupture"}
                </span>
              </div>
              <div className="produit-fournisseur">Fournisseur : {produit.fournisseur}</div>

              <input
                type="number"
                min="1"
                value={quantites[produit.id] || 1}
                onChange={e =>
                  setQuantites(q => ({ ...q, [produit.id]: parseInt(e.target.value) || 1 }))
                }
                style={{ width: 60, marginRight: 8 }}
              />
              <button
                className="btn-panier"
                disabled={produit.stock === 0}
                onClick={() => {
                  if (produit.stock > 0) {
                    ajouterAuPanier(produit, quantites[produit.id] || 1);
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