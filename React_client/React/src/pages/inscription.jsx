<<<<<<< HEAD
import React, { useState } from 'react';
import './inscription.css';
import API_CONFIG from '../api.config.js';

const Inscription = () => {
  // État pour stocker les données du formulaire
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: '',
    societe: '',
    siret: ''
  });
  
  // État pour les messages d'erreur/succès et le chargement
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Fonction d'inscription qui correspond à votre endpoint
  const register = async (userData) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REGISTER}`, {
        method: 'POST',
        headers: API_CONFIG.DEFAULT_HEADERS,
        body: JSON.stringify(userData)
      });
      
      // On vérifie d'abord si le statut est un succès (200-299)
      if (response.ok) {
        // Si l'API renvoie un corps JSON, on le parse
        if (response.headers.get('content-type')?.includes('application/json')) {
          return { success: true, data: await response.json() };
        }
        // Sinon on retourne simplement un succès
        return { success: true };
      }
      
      // Traitement des erreurs avec corps JSON
      try {
        const errorData = await response.json();
        return { success: false, message: errorData.message || 'Erreur lors de l\'inscription' };
      } catch (e) {
        // Si l'erreur n'a pas de corps JSON
        return { success: false, message: `Erreur HTTP ${response.status}` };
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation basique
    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: 'Les mots de passe ne correspondent pas', type: 'error' });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await register({
        prenom: formData.prenom,
        nom: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
        password: formData.password,
        societe: formData.societe,
        siret: formData.siret
      });
      
      if (result.success) {
        setMessage({ text: 'Inscription réussie!', type: 'success' });
        // Réinitialiser le formulaire après inscription réussie
        setFormData({
          prenom: '',
          nom: '',
          email: '',
          telephone: '',
          password: '',
          confirmPassword: '',
          societe: '',
          siret: ''
        });
        // Vous pourriez ajouter ici une redirection
      } else {
        setMessage({ text: result.message || 'Erreur lors de l\'inscription', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Erreur de connexion au serveur', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="inscription-container">
      <div className="inscription-box">
        <h1 className="inscription-title">Inscrivez-vous</h1>
        
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
        
        <form className="inscription-form" onSubmit={handleSubmit}>
          {/* Colonne gauche */}
          <div className="form-column">
            <div className="form-group">
              <label className="form-label">Prénom</label>
              <input 
                type="text" 
                name="prenom"
                placeholder="Prénom" 
                className="form-input"
                value={formData.prenom}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                name="email"
                placeholder="Adresse e-mail" 
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Mot de Passe</label>
              <input 
                type="password" 
                name="password"
                placeholder="Mot de Passe" 
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Nom de société</label>
              <input 
                type="text" 
                name="societe"
                placeholder="Nom de société" 
                className="form-input"
                value={formData.societe}
                onChange={handleChange} 
              />
            </div>
          </div>

          {/* Colonne droite */}
          <div className="form-column">
            <div className="form-group">
              <label className="form-label">Nom de Famille</label>
              <input 
                type="text" 
                name="nom"
                placeholder="Nom de Famille" 
                className="form-input"
                value={formData.nom}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Téléphone</label>
              <input 
                type="tel" 
                name="telephone"
                placeholder="Numéro de téléphone" 
                className="form-input"
                value={formData.telephone}
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Confirmer Mot de Passe</label>
              <input 
                type="password" 
                name="confirmPassword"
                placeholder="Confirmer le mot de passe" 
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">SIRET</label>
              <input 
                type="text" 
                name="siret"
                placeholder="SIRET" 
                className="form-input"
                value={formData.siret}
                onChange={handleChange} 
              />
            </div>
          </div>

          {/* Bouton centré sur toute la largeur */}
          <div className="button-container">
            <button 
              type="submit" 
              className="form-button"
              disabled={isLoading}
            >
              {isLoading ? 'Inscription en cours...' : 'Inscription'} 
              {!isLoading && <span className="arrow">→</span>}
            </button>
=======
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./inscription.css";

export default function Inscription() {
  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    mail: "",
    telephone: "",
    motdepasse: "",
    confirm: "",
    siret: "",
    societe: "",
  });
  const [erreur, setErreur] = useState("");
  const { login, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const champsObligatoires = [
    "prenom", "nom", "mail", "motdepasse", "confirm", "siret", "societe"
  ];

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErreur(""); // Efface l'erreur en cas de modification
  };

  const handleInscription = (e) => {
    e.preventDefault();
    for (let champ of champsObligatoires) {
      if (!form[champ]) {
        setErreur("Un champ obligatoire est manquant.");
        return;
      }
    }
    if (form.motdepasse !== form.confirm) {
      setErreur("Les mots de passe ne correspondent pas.");
      return;
    }
    setUser({
      prenom: form.prenom,
      nom: form.nom,
      mail: form.mail,
      telephone: form.telephone,
      role: form.societe,
      siret: form.siret,
      avatar: "/avatar.jpg",
      identifiant: form.mail,
      motdepasse: form.motdepasse,
    });
    login();
    navigate("/accueil");
  };

  const mdpMatch = form.confirm.length > 0
    ? form.motdepasse === form.confirm
    : null;

  return (
    <div className="inscription-page">
      <h1 className="inscription-title">Inscrivez-vous</h1>
      <form className="inscription-form" onSubmit={handleInscription}>
        <div className="form-row">
          <div className="form-group">
            <label>
              Prénom <span className="asterisk">*</span>
            </label>
            <input name="prenom" value={form.prenom} onChange={handleChange} placeholder="Prénom" />
          </div>
          <div className="form-group">
            <label>
              Nom de Famille <span className="asterisk">*</span>
            </label>
            <input name="nom" value={form.nom} onChange={handleChange} placeholder="Nom de Famille" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>
              Email <span className="asterisk">*</span>
            </label>
            <input name="mail" value={form.mail} onChange={handleChange} placeholder="Adresse e-mail" type="email" />
>>>>>>> feat/reactfront
          </div>
          <div className="form-group">
            <label>
              Téléphone
            </label>
            <input name="telephone" value={form.telephone} onChange={handleChange} placeholder="Numéro de téléphone" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>
              Mot de Passe <span className="asterisk">*</span>
            </label>
            <input name="motdepasse" value={form.motdepasse} onChange={handleChange} placeholder="Mot de Passe" type="password" />
          </div>
          <div className="form-group">
            <label>
              Confirmer Mot de Passe <span className="asterisk">*</span>
            </label>
            <input name="confirm" value={form.confirm} onChange={handleChange} placeholder="Mot de Passe" type="password" />
            {form.confirm.length > 0 && (
              <div
                style={{
                  marginTop: "6px",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  fontSize: "0.97em",
                  color: mdpMatch ? "#217a3a" : "#b71c1c",
                  background: mdpMatch ? "#e6f4ea" : "#fdeaea",
                  border: `1.5px solid ${mdpMatch ? "#4caf50" : "#e53935"}`
                }}
              >
                {mdpMatch
                  ? "Les mots de passe correspondent"
                  : "Les mots de passe ne correspondent pas"}
              </div>
            )}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>
              Nom de société <span className="asterisk">*</span>
            </label>
            <input name="societe" value={form.societe} onChange={handleChange} placeholder="Nom de société" />
          </div>
          <div className="form-group">
            <label>
              SIRET <span className="asterisk">*</span>
            </label>
            <input name="siret" value={form.siret} onChange={handleChange} placeholder="SIRET" />
          </div>
        </div>
        {erreur && <div className="erreur">{erreur}</div>}
        <button type="submit" className="btn-inscription">Inscription &nbsp;→</button>
      </form>
    </div>
  );
};

export default Inscription;