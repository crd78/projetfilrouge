import React, { useContext } from "react";
import "./accueil.css";
import { AuthContext } from "../context/AuthContext";

export default function Accueil() {
  const { isLoggedIn, login, logout } = useContext(AuthContext);

  return (
    <div className="accueil-container">
      {/* Bouton de connexion rapide pour test */}
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

      <img className="accueil-image" src="/AccueilB.jpg" alt="Boulangerie" />
    </div>
  );
}