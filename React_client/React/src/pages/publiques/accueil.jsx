import React, { useContext, useEffect } from "react";
import "./accueil.css";
import { AuthContext } from "../../context/AuthContext";
import API_CONFIG from "../../api.config";
import AccueilImg from "../../assets/Image/AccueilB.jpg";

export default function Accueil() {
  const { isLoggedIn, login, logout } = useContext(AuthContext);

  useEffect(() => {
    const enregistrerVisite = async () => {
      try {
        await fetch(`${API_CONFIG.BASE_URL}api/stats`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ page_name: "accueil" })
        });
      } catch (error) {
        console.log("Erreur enregistrement stats:", error);
      }
    };
    enregistrerVisite();
  }, []);

  return (
    <div className="accueil-container">
      <button onClick={isLoggedIn ? logout : login} style={{ position: "absolute", top: 20, right: 20, zIndex: 1000 }}>
        {isLoggedIn ? "Déconnexion" : "Connexion rapide"}
      </button>

      <header className="header">
        <h1 className="header-title">
          Pour nos artisans boulangers,<br />
          changeons les codes
        </h1>
        <div className="header-buttons">
          <button className="btn-discover">Nous découvrir</button>
          <button className="btn-contact">Nous contacter →</button>
        </div>
      </header>

      <img className="accueil-image" src={AccueilImg} alt="Boulangerie" />
    </div>
  );
}