import React from 'react';
import './inscription.css';

export default function Inscription() {
  return (
    <div className="inscription-container">
      <div className="inscription-box">
        <h1 className="inscription-title">Inscrivez-vous</h1>
        <form className="inscription-form">
          {/* Colonne gauche */}
          <div className="form-column">
            <div className="form-group">
              <label className="form-label">Prénom</label>
              <input type="text" placeholder="Prénom" className="form-input" />
            </div>
            
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" placeholder="Adresse e-mail" className="form-input" />
            </div>
            
            <div className="form-group">
              <label className="form-label">Mot de Passe</label>
              <input type="password" placeholder="Mot de Passe" className="form-input" />
            </div>
            
            <div className="form-group">
              <label className="form-label">Nom de société</label>
              <input type="text" placeholder="Nom de société" className="form-input" />
            </div>
          </div>

          {/* Colonne droite */}
          <div className="form-column">
            <div className="form-group">
              <label className="form-label">Nom de Famille</label>
              <input type="text" placeholder="Nom de Famille" className="form-input" />
            </div>
            
            <div className="form-group">
              <label className="form-label">Téléphone</label>
              <input type="tel" placeholder="Numéro de téléphone" className="form-input" />
            </div>
            
            <div className="form-group">
              <label className="form-label">Confirmer Mot de Passe</label>
              <input type="password" placeholder="Mot de Passe" className="form-input" />
            </div>
            
            <div className="form-group">
              <label className="form-label">SIRET</label>
              <input type="text" placeholder="SIRET" className="form-input" />
            </div>
          </div>

          {/* Bouton centré sur toute la largeur */}
          <div className="button-container">
            <button type="submit" className="form-button">
              Inscription <span className="arrow">→</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}