import React, { useState } from 'react';
import './historique.css';
import { useNavigate } from 'react-router-dom';

export default function Historique() {
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  const commandes = [
    { numero: 'XXX-YZ91', status: 'Livrée', dateCommande: '01-03-25', dateLivraison: '01-04-25', ht: '325,56', ttc: '449.99' },
    { numero: 'XXX-PQ91', status: 'En cours', dateCommande: '31-03-25', dateLivraison: '15-04-25', ht: '85,73', ttc: '99.99' },
    { numero: 'ZDF-DE75', status: 'Refusée', dateCommande: '21-02-25', dateLivraison: 'N/A', ht: '651.38', ttc: '699.99' },
    { numero: 'ABC-YZ00', status: 'Annulée', dateCommande: '01-01-25', dateLivraison: 'N/A', ht: '253.81', ttc: '299.99' },
    { numero: 'LOL-PZ25', status: 'Livrée', dateCommande: '16-04-24', dateLivraison: '31-04-24', ht: '145,32', ttc: '199.99' },
    { numero: 'AAA-BB12', status: 'Livrée', dateCommande: '02-02-25', dateLivraison: '05-02-25', ht: '980,00', ttc: '1099.99' },
    { numero: 'BBB-CC34', status: 'En cours', dateCommande: '18-03-25', dateLivraison: '25-03-25', ht: '120,00', ttc: '143.99' },
    { numero: 'CCC-DD56', status: 'Refusée', dateCommande: '12-02-25', dateLivraison: 'N/A', ht: '760,00', ttc: '888.00' },
  ];

  const getBadgeClass = (status) => {
    switch (status) {
      case 'Livrée': return 'badge green';
      case 'En cours': return 'badge yellow';
      case 'Refusée': return 'badge red';
      case 'Annulée': return 'badge gray';
      default: return 'badge';
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">
        <ul className="nav-left">
          <li onClick={() => navigate('/accueil')}>Accueil</li>
          <li onClick={() => navigate('/produits')}>Produits</li>
          <li className="active" onClick={() => navigate('/historique')}>Mes Commandes</li>
          <li onClick={() => navigate('/support')}>Support</li>
        </ul>

        <div className="nav-right">
          <button onClick={() => setShowSearch(!showSearch)} className="search-icon">🔍</button>
          {showSearch && <input type="text" className="search-input" placeholder="Rechercher..." />}
          <div className="icon" title="Notifications">🔔</div>
          <img
            src="/avatar.jpg"
            alt="Profil"
            className="avatar"
            onClick={() => navigate('/profil')}
            title="Voir profil"
          />
        </div>
      </nav>

      {/* CONTENU */}
      <div className="historique-container">
        <h1 className="page-title">Historique de mes commandes</h1>

        {commandes.map((cmd, index) => (
          <div className="commande-box" key={index}>
            <div className="commande-info">
              <span className="label">Numéro de Commande</span>
              <span className="value bold">{cmd.numero}</span>
            </div>
            <div className="commande-info">
              <span className="label">Status</span>
              <span className={getBadgeClass(cmd.status)}>{cmd.status}</span>
            </div>
            <div className="commande-info">
              <span className="label">Date Commande</span>
              <span className="value">{cmd.dateCommande}</span>
            </div>
            <div className="commande-info">
              <span className="label">Date Livraison</span>
              <span className="value">{cmd.dateLivraison}</span>
            </div>
            <div className="commande-info">
              <span className="label">Total HT</span>
              <span className="value">{cmd.ht}</span>
            </div>
            <div className="commande-info">
              <span className="label">Total TTC</span>
              <span className="value">{cmd.ttc}</span>
            </div>
            <div className="commande-info">
              <span className="detail-link">Voir le détail ↗</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
