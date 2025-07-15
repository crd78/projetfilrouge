import React from "react";
import "./historique.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faArrowUpRightFromSquare, faBell, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function Historique() {
  return (
    <div>
      {/* Barre de navigation */}
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

      {/* Contenu principal */}
      <div className="historique-page">
        <div className="historique-container">
          <div className="page-title">Historique de mes commandes</div>

          {/* Commande 1 */}
          <div className="commande-box">
            <div className="commande-info">
              <div className="label">Numéro de Commande</div>
              <div className="value bold">XXX-YZ91</div>
            </div>
            <div className="commande-info">
              <div className="label">Status</div>
              <span className="badge green">Livrée</span>
            </div>
            <div className="commande-info">
              <div className="label">Date Commande</div>
              <div className="value">01-03-25</div>
            </div>
            <div className="commande-info">
              <div className="label">Date Livraison</div>
              <div className="value">01-04-25</div>
            </div>
            <div className="commande-info">
              <div className="label">Total HT</div>
              <div className="value bold">325,56</div>
            </div>
            <div className="commande-info">
              <div className="label">Total TTC</div>
              <div className="value bold">449.99</div>
            </div>
            <div className="commande-info">
              <div className="label" style={{opacity:0}}>_</div>
              <div className="detail-link">
                Voir le détail <FontAwesomeIcon icon={faArrowUpRightFromSquare} style={{fontSize: "0.9em"}} />
              </div>
            </div>
          </div>

          {/* Commande 2 */}
          <div className="commande-box">
            <div className="commande-info">
              <div className="label">Numéro de Commande</div>
              <div className="value bold">XXX-PQ91</div>
            </div>
            <div className="commande-info">
              <div className="label">Status</div>
              <span className="badge yellow">En cours</span>
            </div>
            <div className="commande-info">
              <div className="label">Date Commande</div>
              <div className="value">31-03-25</div>
            </div>
            <div className="commande-info">
              <div className="label">Date Livraison</div>
              <div className="value">15-04-25</div>
            </div>
            <div className="commande-info">
              <div className="label">Total HT</div>
              <div className="value bold">85,73</div>
            </div>
            <div className="commande-info">
              <div className="label">Total TTC</div>
              <div className="value bold">99.99</div>
            </div>
            <div className="commande-info">
              <div className="label" style={{opacity:0}}>_</div>
              <div className="detail-link">
                Voir le détail <FontAwesomeIcon icon={faArrowUpRightFromSquare} style={{fontSize: "0.9em"}} />
              </div>
            </div>
          </div>

          {/* Commande 3 */}
          <div className="commande-box">
            <div className="commande-info">
              <div className="label">Numéro de Commande</div>
              <div className="value bold">ZDF-DE75</div>
            </div>
            <div className="commande-info">
              <div className="label">Status</div>
              <span className="badge red">Refusée</span>
            </div>
            <div className="commande-info">
              <div className="label">Date Commande</div>
              <div className="value">21-02-25</div>
            </div>
            <div className="commande-info">
              <div className="label">Date Livraison</div>
              <div className="value">N/A</div>
            </div>
            <div className="commande-info">
              <div className="label">Total HT</div>
              <div className="value bold">651.38</div>
            </div>
            <div className="commande-info">
              <div className="label">Total TTC</div>
              <div className="value bold">699.99</div>
            </div>
            <div className="commande-info">
              <div className="label" style={{opacity:0}}>_</div>
              <div className="detail-link">
                Voir le détail <FontAwesomeIcon icon={faArrowUpRightFromSquare} style={{fontSize: "0.9em"}} />
              </div>
            </div>
          </div>

          {/* Commande 4 */}
          <div className="commande-box">
            <div className="commande-info">
              <div className="label">Numéro de Commande</div>
              <div className="value bold">ABC-YZ00</div>
            </div>
            <div className="commande-info">
              <div className="label">Status</div>
              <span className="badge gray">Annulée</span>
            </div>
            <div className="commande-info">
              <div className="label">Date Commande</div>
              <div className="value">01-01-25</div>
            </div>
            <div className="commande-info">
              <div className="label">Date Livraison</div>
              <div className="value">N/A</div>
            </div>
            <div className="commande-info">
              <div className="label">Total HT</div>
              <div className="value bold">253.81</div>
            </div>
            <div className="commande-info">
              <div className="label">Total TTC</div>
              <div className="value bold">299.99</div>
            </div>
            <div className="commande-info">
              <div className="label" style={{opacity:0}}>_</div>
              <div className="detail-link">
                Voir le détail <FontAwesomeIcon icon={faArrowUpRightFromSquare} style={{fontSize: "0.9em"}} />
              </div>
            </div>
          </div>

          {/* Commande 5 */}
          <div className="commande-box">
            <div className="commande-info">
              <div className="label">Numéro de Commande</div>
              <div className="value bold">LOL-PZ25</div>
            </div>
            <div className="commande-info">
              <div className="label">Status</div>
              <span className="badge green">Livrée</span>
            </div>
            <div className="commande-info">
              <div className="label">Date Commande</div>
              <div className="value">16-04-24</div>
            </div>
            <div className="commande-info">
              <div className="label">Date Livraison</div>
              <div className="value">31-04-24</div>
            </div>
            <div className="commande-info">
              <div className="label">Total HT</div>
              <div className="value bold">145,32</div>
            </div>
            <div className="commande-info">
              <div className="label">Total TTC</div>
              <div className="value bold">199.99</div>
            </div>
            <div className="commande-info">
              <div className="label" style={{opacity:0}}>_</div>
              <div className="detail-link">
                Voir le détail <FontAwesomeIcon icon={faArrowUpRightFromSquare} style={{fontSize: "0.9em"}} />
              </div>
            </div>
          </div>
          {/* Commande 6 */}
<div className="commande-box">
  <div className="commande-info">
    <div className="label">Numéro de Commande</div>
    <div className="value bold">XYZ-RT12</div>
  </div>
  <div className="commande-info">
    <div className="label">Status</div>
    <span className="badge yellow">En cours</span>
  </div>
  <div className="commande-info">
    <div className="label">Date Commande</div>
    <div className="value">08-06-25</div>
  </div>
  <div className="commande-info">
    <div className="label">Date Livraison</div>
    <div className="value">20-06-25</div>
  </div>
  <div className="commande-info">
    <div className="label">Total HT</div>
    <div className="value bold">110.50</div>
  </div>
  <div className="commande-info">
    <div className="label">Total TTC</div>
    <div className="value bold">132.60</div>
  </div>
  <div className="commande-info">
    <div className="label" style={{opacity:0}}>_</div>
    <div className="detail-link">
      Voir le détail <FontAwesomeIcon icon={faArrowUpRightFromSquare} style={{fontSize: "0.9em"}} />
    </div>
  </div>
</div>
        </div>
      </div>
    </div>
  );
}