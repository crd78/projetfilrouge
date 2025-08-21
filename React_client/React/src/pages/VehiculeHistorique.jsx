import React from "react";
import "./VehiculeHistorique.css";
import { useLocation, useNavigate } from "react-router-dom";

export default function VehiculeHistorique() {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    return (
      <div className="vehicule-historique-page">
        <button
          className="vehicule-historique-retour"
          onClick={() => navigate("/vehicule")}
        >
          Retour à la liste des véhicules
        </button>
        <h1 className="vehicule-historique-title">Détail du véhicule</h1>
        <div style={{textAlign: "center", marginTop: "100px", fontSize: "1.3rem"}}>
          Aucun véhicule sélectionné.
        </div>
      </div>
    );
  }

  return (
    <div className="vehicule-historique-page">
      <button
        className="vehicule-historique-retour"
        onClick={() => navigate("/vehicule")}
      >
        Retour à la liste des véhicules
      </button>
      <h1 className="vehicule-historique-title">Détail du véhicule</h1>
      <div className="vehicule-historique-content">
        <div className="vehicule-historique-table-container">
          <table className="vehicule-historique-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Opération</th>
                <th>KM</th>
                <th>Commentaire</th>
              </tr>
            </thead>
            <tbody>
              {(state.historique || []).map((item, i) => (
                <tr key={i}>
                  <td>{item.date}</td>
                  <td>{item.operation}</td>
                  <td>{item.km}</td>
                  <td>{item.commentaire}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="vehicule-historique-side">
          <div className="vehicule-historique-info">
            <div><strong>Type :</strong> {state.type}</div>
            <div><strong>Plaque :</strong> {state.plaque}</div>
            <div><strong>Numéro :</strong> {state.numero}</div>
            <div><strong>Etat :</strong> {state.etat}</div>
            <div><strong>Statut :</strong> {state.statut}</div>
          </div>
        </div>
      </div>
    </div>
  );
}