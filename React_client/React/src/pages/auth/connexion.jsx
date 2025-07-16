import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./connexion.css";
import API_CONFIG from "../../api.config.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faXTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Connexion = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Utilise le hook useAuth
  
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
   const loginAPI = async (credentials) => {
    try {
      const finalUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`;
      console.log('🔗 URL de connexion:', finalUrl);
      console.log('📤 Données envoyées:', credentials);
      
      const response = await fetch(finalUrl, {
        method: 'POST',
        headers: API_CONFIG.DEFAULT_HEADERS,
        body: JSON.stringify(credentials)
      });
      
      console.log('📡 Status de la réponse:', response.status);
      
      // Traitement de la réponse
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Données reçues:', data);
        return { success: true, data };
      }
      
      // Gestion des erreurs
      try {
        const errorData = await response.json();
        console.log('❌ Erreur reçue:', errorData);
        return { success: false, message: errorData.message || 'Identifiants incorrects' };
      } catch (e) {
        console.log('❌ Erreur de parsing:', e);
        return { success: false, message: `Erreur lors de la connexion (${response.status})` };
      }
    } catch (error) {
      console.error("❌ Erreur réseau:", error);
      throw error;
    }
  };

  // Gestion de la soumission du formulaire
    const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setMessage({ text: 'Veuillez remplir tous les champs', type: 'error' });
      return;
    }
    
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      const result = await loginAPI({
        email: formData.email,
        password: formData.password
      });
      
      console.log('🔍 Résultat complet de l\'API:', result);
      
      if (result.success) {
  
        const userData = {
          id: result.data.user?.id || Date.now(),
          prenom: result.data.user?.prenom || 'Utilisateur',
          nom: result.data.user?.nom || '',
          email: result.data.user?.email || formData.email,
          telephone: result.data.user?.telephone || '',
          societe: result.data.user?.societe || '',
          siret: result.data.user?.siret || '',
          role: result.data.user?.role || result.data.role || 1 // ✅ Récupérer le rôle
        };
        
        console.log('🔍 Données utilisateur préparées:', userData);
        
        const token = result.data.access;
        
        if (token) {
          login(userData, token);
          setMessage({ text: 'Connexion réussie! Redirection...', type: 'success' });
          
          setTimeout(() => {
            // Redirection conditionnelle selon le rôle
            if (userData.role === 2) { // Commercial
              navigate('/dashboard/Commercial');
            } else if (userData.role === 5) { // ChargéStock
              navigate('/stock');
            } else {
              navigate('/profil'); // ou une autre page pour les clients
            }
          }, 1500);
        } else {
          setMessage({ text: 'Token manquant dans la réponse', type: 'error' });
        }
      } else {
        setMessage({ text: result.message || 'Erreur de connexion', type: 'error' });
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessage({ text: 'Erreur de connexion au serveur', type: 'error' });
    } finally {
      setIsLoading(false);
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
        <img src="/src/assets/image/B1.jpg" alt="boulangerie1" />
        <img src="/src/assets/image/B2.jpg" alt="boulangerie2" />
        <img src="/src/assets/image/B3.jpg" alt="boulangerie3" />
        <img src="/src/assets/image/B4.jpg" alt="boulangerie4" />
      </div>
    </div>
  );
};

export default Connexion;