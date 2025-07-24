import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

export default function CommandeBox({ numero, status, dateCommande, dateLivraison, totalHT, totalTTC }) {
  const getBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case "livrée": return "green";
      case "en cours": return "yellow";
      case "refusée": return "red";
      default: return "gray";
    }
  };

  return (
    <div className="commande-box">
      <div className="commande-info">
        <div className="label">Numéro de Commande</div>
        <div className="value bold">{numero}</div>
      </div>
      <div className="commande-info">
        <div className="label">Status</div>
        <span className={`badge ${getBadgeClass(status)}`}>{status}</span>
      </div>
      <div className="commande-info">
        <div className="label">Date Commande</div>
        <div className="value">{dateCommande}</div>
      </div>
      <div className="commande-info">
        <div className="label">Date Livraison</div>
        <div className="value">{dateLivraison}</div>
      </div>
      <div className="commande-info">
        <div className="label">Total HT</div>
        <div className="value bold">{totalHT}</div>
      </div>
      <div className="commande-info">
        <div className="label">Total TTC</div>
        <div className="value bold">{totalTTC}</div>
      </div>
      <div className="commande-info">
        <div className="label" style={{ opacity: 0 }}>_</div>
        <div className="detail-link">
          Voir le détail <FontAwesomeIcon icon={faArrowUpRightFromSquare} style={{ fontSize: "0.9em" }} />
        </div>
      </div>
    </div>
  );
}
