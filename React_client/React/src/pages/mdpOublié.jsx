import React, { useState } from "react";
import "./mdpOublié.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { faFacebook, faInstagram, faXTwitter, faLinkedin } from "@fortawesome/free-brands-svg-icons";

export default function MdpOublié() {
  const [email, setEmail] = useState("");
  const [envoye, setEnvoye] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnvoye(true);
  };

  return (
    <div className="mdpoublie-page">
      <div className="mdpoublie-container">
        <div className="mdpoublie-header">
          <h1>Mot de Passe Oublié</h1>
          <form className="mdpoublie-form" onSubmit={handleSubmit}>
            <div className="mdpoublie-input-row">
              <div className="mdpoublie-input-icon">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <input
                type="email"
                placeholder="Entrez votre adresse e-mail"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <button className="mdpoublie-btn" type="submit">
              Recevoir mon lien <FontAwesomeIcon icon={faArrowRight} style={{marginLeft: 8}} />
            </button>
          </form>
        </div>
        <div className="mdpoublie-desc">
          Entrez votre adresse e-mail afin de recevoir un mail pour réinitialiser votre mot de passe.
        </div>
      </div>
      {envoye && (
        <div className="mdpoublie-info">
          Un lien pour réinitialiser votre mot de passe a été envoyé. Veuillez vérifier votre boîte mail.
        </div>
      )}

      <footer className="mdpoublie-footer">
        <div className="footer-content">
          <div className="footer-logo">Mino<span style={{color:"#b0893f"}}>Tor</span></div>
          <div className="footer-links">
            <span onClick={() => navigate("/accueil")}>Accueil</span>
            <span>Nos Prestations</span>
            <span onClick={() => navigate("/produit")}>Nos Produits</span>
            <span>A Propos</span>
            <span>Nous Contacter</span>
          </div>
          <div className="footer-socials">
            <a href="#"><FontAwesomeIcon icon={faFacebook} /></a>
            <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
            <a href="#"><FontAwesomeIcon icon={faXTwitter} /></a>
            <a href="#"><FontAwesomeIcon icon={faLinkedin} /></a>
          </div>
        </div>
        <div className="footer-bottom">
          <hr />
          <div className="footer-copy">
            © Minot'Or 2025 Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}