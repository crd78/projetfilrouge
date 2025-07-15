import React from "react";
import "./historique.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faArrowUpRightFromSquare, faBell, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function Historique() {
  const navigate = useNavigate();

  // Toutes les commandes sous forme d'objets
  const commandes = [
    {
      numero: "XXX-YZ91",
      status: { label: "Livrée", color: "green" },
      dateCommande: "01-03-25",
      dateLivraison: "01-04-25",
      totalHT: "325,56",
      totalTTC: "449.99",
      articles: [
        { nom: "Farine de blé T55", quantite: 10, prix: 3, total: 30 },
        { nom: "Beurre Demi-sel 500g", quantite: 30, prix: 5, total: 150 },
        { nom: "Levure Chimique", quantite: 200, prix: 0.35, total: 70 },
        { nom: "Levure Boulangère", quantite: 100, prix: 0.5, total: 50 }
      ],
      sousTotal: 300,
      commission: 29.99,
      total: 329.99,
      client: {
        nom: "M. Valentin Faker",
        etablissement: "Boulangerie du Parc",
        siret: "548 697 120",
        adresse: "23 Rue du Parc<br />aux Lièvres<br />91000 Evry-Courcouronnes"
      }
    },
    {
      numero: "XXX-PQ91",
      status: { label: "En cours", color: "yellow" },
      dateCommande: "31-03-25",
      dateLivraison: "15-04-25",
      totalHT: "85,73",
      totalTTC: "99.99",
      articles: [
        { nom: "Levure Chimique", quantite: 100, prix: 0.35, total: 35 },
        { nom: "Levure Boulangère", quantite: 50, prix: 0.5, total: 25 },
        { nom: "Farine de blé T55", quantite: 5, prix: 3, total: 15 },
        { nom: "Beurre Demi-sel 500g", quantite: 5, prix: 5, total: 25 }
      ],
      sousTotal: 85,
      commission: 14.99,
      total: 99.99,
      client: {
        nom: "M. Valentin Faker",
        etablissement: "Boulangerie du Parc",
        siret: "548 697 120",
        adresse: "23 Rue du Parc<br />aux Lièvres<br />91000 Evry-Courcouronnes"
      }
    },
    {
      numero: "ZDF-DE75",
      status: { label: "Refusée", color: "red" },
      dateCommande: "21-02-25",
      dateLivraison: "N/A",
      totalHT: "651.38",
      totalTTC: "699.99",
      articles: [
        { nom: "Farine de blé T55", quantite: 100, prix: 3, total: 300 },
        { nom: "Beurre Demi-sel 500g", quantite: 50, prix: 5, total: 250 },
        { nom: "Levure Chimique", quantite: 200, prix: 0.35, total: 70 },
        { nom: "Levure Boulangère", quantite: 60, prix: 0.5, total: 30 }
      ],
      sousTotal: 651,
      commission: 48.99,
      total: 699.99,
      client: {
        nom: "M. Valentin Faker",
        etablissement: "Boulangerie du Parc",
        siret: "548 697 120",
        adresse: "23 Rue du Parc<br />aux Lièvres<br />91000 Evry-Courcouronnes"
      }
    },
    {
      numero: "ABC-YZ00",
      status: { label: "Annulée", color: "gray" },
      dateCommande: "01-01-25",
      dateLivraison: "N/A",
      totalHT: "253.81",
      totalTTC: "299.99",
      articles: [
        { nom: "Farine de blé T55", quantite: 20, prix: 3, total: 60 },
        { nom: "Beurre Demi-sel 500g", quantite: 10, prix: 5, total: 50 },
        { nom: "Levure Chimique", quantite: 100, prix: 0.35, total: 35 },
        { nom: "Levure Boulangère", quantite: 80, prix: 0.5, total: 40 }
      ],
      sousTotal: 253.81,
      commission: 46.18,
      total: 299.99,
      client: {
        nom: "M. Valentin Faker",
        etablissement: "Boulangerie du Parc",
        siret: "548 697 120",
        adresse: "23 Rue du Parc<br />aux Lièvres<br />91000 Evry-Courcouronnes"
      }
    },
    {
      numero: "LOL-PZ25",
      status: { label: "Livrée", color: "green" },
      dateCommande: "16-04-24",
      dateLivraison: "31-04-24",
      totalHT: "145,32",
      totalTTC: "199.99",
      articles: [
        { nom: "Farine de blé T55", quantite: 10, prix: 3, total: 30 },
        { nom: "Beurre Demi-sel 500g", quantite: 10, prix: 5, total: 50 },
        { nom: "Levure Chimique", quantite: 100, prix: 0.35, total: 35 },
        { nom: "Levure Boulangère", quantite: 60, prix: 0.5, total: 30 }
      ],
      sousTotal: 170,
      commission: 29.99,
      total: 199.99,
      client: {
        nom: "M. Valentin Faker",
        etablissement: "Boulangerie du Parc",
        siret: "548 697 120",
        adresse: "23 Rue du Parc<br />aux Lièvres<br />91000 Evry-Courcouronnes"
      }
    },
    {
      numero: "XYZ-RT12",
      status: { label: "En cours", color: "yellow" },
      dateCommande: "08-06-25",
      dateLivraison: "20-06-25",
      totalHT: "110.50",
      totalTTC: "132.60",
      articles: [
        { nom: "Farine de blé T55", quantite: 5, prix: 3, total: 15 },
        { nom: "Beurre Demi-sel 500g", quantite: 10, prix: 5, total: 50 },
        { nom: "Levure Chimique", quantite: 100, prix: 0.35, total: 35 },
        { nom: "Levure Boulangère", quantite: 30, prix: 0.5, total: 15.00 }
      ],
      sousTotal: 120,
      commission: 12.60,
      total: 132.60,
      client: {
        nom: "M. Valentin Faker",
        etablissement: "Boulangerie du Parc",
        siret: "548 697 120",
        adresse: "23 Rue du Parc<br />aux Lièvres<br />91000 Evry-Courcouronnes"
      }
    }
  ];

  return (
    <div>
      <nav className="header-bar">
        <ul className="nav-left">
          <li>Accueil</li>
          <li>
            Produits <FontAwesomeIcon icon={faChevronDown} style={{fontSize: "0.8em"}} />
          </li>
          <li className="active">
            Mes Commandes <FontAwesomeIcon icon={faChevronDown} style={{fontSize: "0.8em", color: "#d59e00"}} />
          </li>
          <li>Support</li>
        </ul>
        <div className="nav-right">
          <button className="icon-button">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
          <button className="icon-button">
            <FontAwesomeIcon icon={faBell} />
          </button>
          <div className="user-info">
            <img className="avatar" src="/avatar.jpg" alt="avatar" />
            <div className="user-text">
              <span className="user-name">Valentin Faker</span>
              <span className="user-role">Boulangerie du Parc</span>
            </div>
          </div>
        </div>
      </nav>
      <div className="historique-page">
        <div className="historique-container">
          <div className="page-title">Historique de mes commandes</div>
          {commandes.map((commande) => (
            <div className="commande-box" key={commande.numero}>
              <div className="commande-info">
                <div className="label">Numéro de Commande</div>
                <div className="value bold">{commande.numero}</div>
              </div>
              <div className="commande-info">
                <div className="label">Status</div>
                <span className={`badge ${commande.status.color}`}>{commande.status.label}</span>
              </div>
              <div className="commande-info">
                <div className="label">Date Commande</div>
                <div className="value">{commande.dateCommande}</div>
              </div>
              <div className="commande-info">
                <div className="label">Date Livraison</div>
                <div className="value">{commande.dateLivraison}</div>
              </div>
              <div className="commande-info">
                <div className="label">Total HT</div>
                <div className="value bold">{commande.totalHT}</div>
              </div>
              <div className="commande-info">
                <div className="label">Total TTC</div>
                <div className="value bold">{commande.totalTTC}</div>
              </div>
              <div className="commande-info">
                <div className="label" style={{opacity:0}}>_</div>
                <div
                  className="detail-link"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    navigate("/detail-cmd", { state: commande })
                  }
                >
                  Voir le détail <FontAwesomeIcon icon={faArrowUpRightFromSquare} style={{fontSize: "0.9em"}} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}