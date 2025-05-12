import React from 'react';
import './accueil.css';

export default function Accueil() {
  return (
    <div className="accueil-container">
      <nav className="navbar">
        <div className="logo" onClick={() => window.location.href = '/'}>MinoTor</div>
        <ul className="nav-links">
          <li className="active">Accueil</li>
          <li className="dropdown">
            Nos Prestations
            <ul className="dropdown-content">
              <li>Test 1</li>
              <li>Test 2</li>
            </ul>
          </li>
          <li className="dropdown">
            Nos Produits
            <ul className="dropdown-content">
              <li>Test 3</li>
              <li>Test 4</li>
            </ul>
          </li>
          <li onClick={() => window.location.href = '/contact'}>Contact</li>
        </ul>
        <div className="actions">
          <button onClick={() => window.location.href = '/connexion'} className="btn-link">Se Connecter</button>
          <button onClick={() => window.location.href = '/inscription'} className="btn-inscription">S’inscrire</button>
        </div>
      </nav>

      <header className="header">
        <h1>Pour nos artisans boulangers,<br />changeons les codes</h1>
        <div className="header-buttons">
          <button onClick={() => window.location.href = '/decouvrir'} className="btn-discover">Nous découvrir</button>
          <button onClick={() => window.location.href = '/contact'} className="btn-contact">
            Nous contacter <span>→</span>
          </button>
        </div>
      </header>

      <img className="bakery-img" src="/bakery.jpg" alt="Boulangerie" />
    </div>
  );
}
