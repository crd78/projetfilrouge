import React, { useState, useContext } from "react";
import "./connexion.css";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faXTwitter, faLinkedin } from "@fortawesome/free-brands-svg-icons";

export default function Connexion() {
  const [identifiant, setIdentifiant] = useState("");
  const [motdepasse, setMotdepasse] = useState("");
  const [erreur, setErreur] = useState("");
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleConnexion = (e) => {
    e.preventDefault();
    if (
      identifiant === user.identifiant &&
      motdepasse === user.motdepasse
    ) {
      login();
      navigate("/accueil");
    } else {
      setErreur("Identifiant ou mot de passe incorrect");
    }
  };

  return (
    <div className="connexion-container">
      <div className="content">
        <div className="left-side">
          <h1>Connectez&nbsp;–&nbsp;Vous</h1>
          <p>
            Vous pouvez également nous suivre sur les différents réseaux sociaux
          </p>
          <div className="social-icons">
            <a href="#"><FontAwesomeIcon icon={faFacebook} /></a>
            <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
            <a href="#"><FontAwesomeIcon icon={faXTwitter} /></a>
            <a href="#"><FontAwesomeIcon icon={faLinkedin} /></a>
          </div>
        </div>
        <div className="right-side">
          <form className="login-form" onSubmit={handleConnexion}>
            <label>Identifiant</label>
            <input
              type="text"
              value={identifiant}
              onChange={e => setIdentifiant(e.target.value)}
              placeholder="Votre identifiant"
              autoComplete="username"
            />
            <label>Mot de Passe</label>
            <input
              type="password"
              value={motdepasse}
              onChange={e => setMotdepasse(e.target.value)}
              placeholder="Votre mot de passe"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="mdp-oublie-link"
              style={{
                background: "none",
                border: "none",
                color: "#b0893f",
                textAlign: "left",
                margin: "8px 0 0 0",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: 500,
                padding: 0,
                textDecoration: "underline"
              }}
              onClick={() => navigate("/mdp-oublie")}
            >
              Mot de passe oublié ?
            </button>
            {erreur && (
              <div style={{ color: "red", marginBottom: "10px" }}>{erreur}</div>
            )}
            <button type="submit">
              Se connecter <span style={{ marginLeft: 8 }}>→</span>
            </button>
          </form>
        </div>
      </div>
      <div className="images-container">
        <img src="/B1.jpg" alt="boulangerie1" />
        <img src="/B2.jpg" alt="boulangerie2" />
        <img src="/B3.jpg" alt="boulangerie3" />
        <img src="/B4.jpg" alt="boulangerie4" />
      </div>
    </div>
  );
}