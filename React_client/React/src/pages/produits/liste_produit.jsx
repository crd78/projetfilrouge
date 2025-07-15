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

  // Charger le panier depuis le localStorage au démarrage
  useEffect(() => {
    const panierLocal = localStorage.getItem(PANIER_KEY);
    if (panierLocal) {
      setPanier(JSON.parse(panierLocal));
    }
  }, []);

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

  const ajouterAuPanier = (produit) => {
    setPanier(prev => {
      const exist = prev.find(item => item.id === produit.id);
      if (exist) {
        return prev.map(item =>
          item.id === produit.id
            ? { ...item, quantite: item.quantite + 1 }
            : item
        );
      }
      return [...prev, { ...produit, quantite: 1 }];
    });
  };

  const envoyerDemandeDevis = async () => {
    try {
        const produitsIds = panier.map(item => item.id);
        const body = {
        IdClient: user?.id,
        MontantTotalHT: totalPanier,
        MontantTotalTTC: totalPanier * 1.2,
        produits: produitsIds
        };
        console.log("Payload envoyé à l'API :", body);
        // Correction de l'URL : pas de double slash, pas de slash final
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

  const totalPanier = panier.reduce((acc, item) => acc + item.prix * item.quantite, 0);

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
                <span className={produit.stock > 0 ? "stock-ok" : "stock-ko"}>
                  {produit.stock > 0 ? `${produit.stock} ${produit.unite}` : "Rupture"}
                </span>
              </div>
              <div className="produit-fournisseur">Fournisseur : {produit.fournisseur}</div>
              <button
                className="btn-panier"
                disabled={produit.stock === 0}
                onClick={() => ajouterAuPanier(produit)}
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
                        <td>{item.quantite}</td>
                        <td>{(item.prix * item.quantite).toFixed(2)} €</td>
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