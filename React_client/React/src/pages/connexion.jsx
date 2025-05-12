import React from "react";
import "./connexion.css";

const Connexion = () => {
  return (
    <div className="connexion-container">
      <nav className="navbar">
        <a href="/connexion" className="nav-link">Connexion</a>
        <a href="/inscription" className="nav-link">Inscription</a>
      </nav>

      <div className="content">
        <div className="left-side">
          <h1>Connectez - Vous</h1>
          <p>Vous pouvez également nous suivre sur les différents réseaux sociaux</p>
          <div className="social-icons">
            <i className="fab fa-facebook-f"></i>
            <i className="fab fa-instagram"></i>
            <i className="fab fa-x-twitter"></i>
            <i className="fab fa-linkedin-in"></i>
          </div>
        </div>

        <div className="right-side">
          <form className="login-form">
            <label>Email</label>
            <input type="text" placeholder="John Trangely" />
            <label>Mot de Passe</label>
            <input type="password" placeholder="hello@nrs.com" />
            <button type="submit">Send Message →</button>
          </form>
        </div>
      </div>

      <div className="images-container">
        {/* Tu peux remplacer les src par tes vraies images */}
        <img src="/img1.jpg" alt="boulangerie1" />
        <img src="/img2.jpg" alt="boulangerie2" />
        <img src="/img3.jpg" alt="boulangerie3" />
        <img src="/img4.jpg" alt="boulangerie4" />
      </div>
    </div>
  );
};

export default Connexion;
