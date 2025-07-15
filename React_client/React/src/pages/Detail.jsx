import React from "react";
import "./Detail.css";
import { useNavigate, useLocation } from "react-router-dom";

export default function Detail() {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    return (
      <div className="detailcmd-page">
        <button
          className="btn-retour-historique"
          onClick={() => navigate("/historique")}
        >
          Retour à l'Historique
        </button>
        <h1 className="detailcmd-title">Détail de ma commande</h1>
        <div style={{textAlign: "center", marginTop: "100px", fontSize: "1.3rem"}}>
          Aucune commande sélectionnée.
        </div>
      </div>
    );
  }

  return (
    <div className="detailcmd-page">
      <button
        className="btn-retour-historique"
        onClick={() => navigate("/historique")}
      >
        Retour à l'Historique
      </button>
      <h1 className="detailcmd-title">Détail de ma commande</h1>
      <div className="detailcmd-content">
        <div className="detailcmd-table-container">
          <table className="detailcmd-table">
            <thead>
              <tr>
                <th>Article</th>
                <th>Quantité</th>
                <th>Prix Unitaire</th>
                <th>Total TTC</th>
              </tr>
            </thead>
            <tbody>
              {state.articles.map((art, i) => (
                <tr key={i}>
                  <td>{art.nom}</td>
                  <td>{art.quantite}</td>
                  <td>{art.prix}€</td>
                  <td>{art.total}€</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="detailcmd-side-total">
          <div className="detailcmd-client">
            <div style={{ fontWeight: "bold", textAlign: "right" }}>{state.client.nom}</div>
            <div style={{ textAlign: "right" }}>
              Etablissement : {state.client.etablissement}<br />
              <span style={{ fontStyle: "italic", fontWeight: "bold" }}>SIRET : {state.client.siret}</span><br />
              Adresse : <span dangerouslySetInnerHTML={{__html: state.client.adresse}} />
            </div>
          </div>
          <div className="detailcmd-total">
            <div className="total-row">
              <span>Sous-Total</span>
              <span style={{ fontWeight: "bold" }}>{state.sousTotal}€</span>
            </div>
            <div className="total-row">
              <span>Commission</span>
              <span>{state.commission}€</span>
            </div>
            <hr className="total-sep" />
            <div className="total-row total-final">
              <span>Total</span>
              <span className="total-amount">{state.total}€</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}