import React, { useContext } from "react";
import "./Vehicule.css";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

const vehicules = [
  {
    type: "Monocuve",
    plaque: "DE-544-AF",
    numero: "98876514",
    km: "235026",
    revision: "07-07-25",
    etat: "Correct",
    statut: "Disponible",
    historique: [
      { date: "07-07-25", operation: "Révision", km: "235026", commentaire: "RAS" },
      { date: "01-06-25", operation: "Nettoyage", km: "230000", commentaire: "Nettoyage complet" },
      { date: "15-05-25", operation: "Changement filtre", km: "228000", commentaire: "Filtre changé" }
    ]
  },
  {
    type: "Porteur",
    plaque: "EZ-249-UY",
    numero: "13698754",
    km: "598702",
    revision: "03-05-25",
    etat: "Critique",
    statut: "Indisponible",
    historique: [
      { date: "03-05-25", operation: "Révision", km: "598702", commentaire: "Problème moteur détecté" },
      { date: "10-04-25", operation: "Réparation", km: "590000", commentaire: "Remplacement courroie" }
    ]
  },
  {
    type: "Porteur",
    plaque: "AK-915-BF",
    numero: "41236804",
    km: "50324",
    revision: "01-04-25",
    etat: "A Réviser",
    statut: "Indisponible",
    historique: [
      { date: "01-04-25", operation: "Révision", km: "50324", commentaire: "A prévoir : vidange" },
      { date: "15-03-25", operation: "Nettoyage", km: "50000", commentaire: "Nettoyage cabine" }
    ]
  },
  {
    type: "Monocuve",
    plaque: "QS-451-MD",
    numero: "31258794",
    km: "145897",
    revision: "25-07-25",
    etat: "A Nettoyer",
    statut: "Indisponible",
    historique: [
      { date: "25-07-25", operation: "Révision", km: "145897", commentaire: "RAS" },
      { date: "10-07-25", operation: "Nettoyage", km: "145000", commentaire: "Nettoyage partiel" }
    ]
  },
  {
    type: "Monocuve",
    plaque: "KI-325-TG",
    numero: "54017625",
    km: "314798",
    revision: "15-07-25",
    etat: "Correct",
    statut: "Disponible",
    historique: [
      { date: "15-07-25", operation: "Révision", km: "314798", commentaire: "RAS" },
      { date: "01-07-25", operation: "Changement pneus", km: "312000", commentaire: "Pneus neufs" }
    ]
  },
];

export default function Vehicule() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Vérifie le rôle
  if (!user || (user.role !== "Commercial" && user.role !== "Administrateur")) {
    return (
      <div style={{ padding: "60px", textAlign: "center", fontSize: "1.3rem" }}>
        Accès réservé aux commerciaux.
      </div>
    );
  }

  return (
    <div className="vehicule-page">
      <h1 className="vehicule-title">Maintenance des véhicules</h1>
      <div className="vehicule-list">
        {vehicules.map((v, idx) => (
          <div className="vehicule-card" key={idx}>
            <div className="vehicule-table">
              <div className="vehicule-row vehicule-header">
                <span>Type Véhicule</span>
                <span>Plaque Immatriculation</span>
                <span>Numéro Véhicule</span>
                <span>Nombre KM</span>
                <span>Dernière Révision</span>
                <span>Etat Véhicule</span>
                <span>Statut</span>
                <span></span>
              </div>
              <div className="vehicule-row vehicule-data">
                <span style={{ fontWeight: "bold" }}>{v.type}</span>
                <span style={{ fontWeight: "bold" }}>{v.plaque}</span>
                <span style={{ fontWeight: "bold" }}>{v.numero}</span>
                <span>{v.km} km</span>
                <span>{v.revision}</span>
                <span>{v.etat}</span>
                <span>
                  <span
                    className={
                      v.statut === "Disponible"
                        ? "vehicule-status disponible"
                        : "vehicule-status indisponible"
                    }
                  >
                    {v.statut}
                  </span>
                </span>
                <span>
                  <button
                    className="vehicule-detail-btn"
                    onClick={() => navigate("/vehicule-historique", { state: v })}
                  >
                    Voir le détail <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                  </button>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}