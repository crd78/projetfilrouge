import React, { useState } from "react";
import "./connexion.css";
import API_CONFIG from "../api.config.js";

const Connexion = () => {
  // États pour gérer le formulaire, le chargement et les messages
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Gestion des changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Fonction d'appel à l'API de connexion
  const login = async (credentials) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: API_CONFIG.DEFAULT_HEADERS,
        body: JSON.stringify(credentials)
      });
      
      // Traitement de la réponse
      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      }
      
      // Gestion des erreurs
      try {
        const errorData = await response.json();
        return { success: false, message: errorData.message || 'Identifiants incorrects' };
      } catch (e) {
        return { success: false, message: `Erreur lors de la connexion (${response.status})` };
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      throw error;
    }
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation basique
    if (!formData.email || !formData.password) {
      setMessage({ text: 'Veuillez remplir tous les champs', type: 'error' });
      return;
    }
    
    // Début de la tentative de connexion
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      const result = await login({
        email: formData.email,
        password: formData.password
      });
      
      if (result.success) {
        // Sauvegarde du token dans le localStorage si présent dans la réponse
        if (result.data.token) {
          localStorage.setItem('authToken', result.data.token);
        }
        
        setMessage({ text: 'Connexion réussie!', type: 'success' });
        
        // Redirection après connexion réussie (après un court délai)
        setTimeout(() => {
          window.location.href = '/dashboard'; // ou toute autre page après connexion
        }, 1500);
      } else {
        setMessage({ text: result.message, type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Erreur de connexion au serveur', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

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
          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}
          
          <form className="login-form" onSubmit={handleSubmit}>
            <label>Email</label>
            <input 
              type="email" 
              name="email"
              placeholder="votre@email.com" 
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            <label>Mot de Passe</label>
            <input 
              type="password" 
              name="password"
              placeholder="Votre mot de passe" 
              value={formData.password}
              onChange={handleChange}
              required
            />
            
            <button 
              type="submit" 
              disabled={isLoading}
              className={isLoading ? 'loading-btn' : ''}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'} {!isLoading && '→'}
            </button>
          </form>
        </div>
      </div>

      <div className="images-container">
        <img src="/img1.jpg" alt="boulangerie1" />
        <img src="/img2.jpg" alt="boulangerie2" />
        <img src="/img3.jpg" alt="boulangerie3" />
        <img src="/img4.jpg" alt="boulangerie4" />
      </div>
    </div>
  );
};

export default Connexion;