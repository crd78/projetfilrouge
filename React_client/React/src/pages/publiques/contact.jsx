import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './contact.css';
import API_CONFIG from '../../api.config.js';

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: ''
  });

  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const envoyerMessage = async (contactData) => {
    try {
      // ❌ ERREUR : Tu utilises BASE_URL + '/contacts/' au lieu de l'endpoint configuré
      // const response = await fetch(`${API_CONFIG.BASE_URL}/contacts/`, {
      
      // ✅ CORRECTION : Utilise BASE_URL + ENDPOINTS.CONTACTS
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONTACTS}`, {
        method: 'POST',
        headers: API_CONFIG.DEFAULT_HEADERS,
        body: JSON.stringify(contactData)
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data: data };
      }

      try {
        const errorData = await response.json();
        return { success: false, message: errorData.message || 'Erreur lors de l\'envoi du message' };
      } catch (e) {
        return { success: false, message: `Erreur HTTP ${response.status}` };
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await envoyerMessage(formData);

      if (result.success) {
        setMessage({ text: 'Votre message a été envoyé avec succès! Nous vous répondrons rapidement.', type: 'success' });
        setFormData({
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          sujet: '',
          message: ''
        });
        
        // Redirection vers la page d'accueil après 3 secondes
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setMessage({ text: result.message || 'Erreur lors de l\'envoi du message', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Erreur de connexion au serveur', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-box">
        <h1 className="contact-title">Nous contacter</h1>
        <p className="contact-subtitle">
          Une question ? Un projet ? N'hésitez pas à nous écrire !
        </p>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-columns">
            <div className="form-column">
              <div className="form-group">
                <label className="form-label">Prénom *</label>
                <input
                  type="text"
                  name="prenom"
                  placeholder="Votre prénom"
                  className="form-input"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="votre.email@exemple.com"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Sujet *</label>
                <input
                  type="text"
                  name="sujet"
                  placeholder="Objet de votre message"
                  className="form-input"
                  value={formData.sujet}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-column">
              <div className="form-group">
                <label className="form-label">Nom *</label>
                <input
                  type="text"
                  name="nom"
                  placeholder="Votre nom"
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
                  placeholder="06 12 34 56 78"
                  className="form-input"
                  value={formData.telephone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          <div className="form-group full-width">
            <label className="form-label">Message *</label>
            <textarea
              name="message"
              placeholder="Écrivez votre message ici..."
              className="form-textarea"
              value={formData.message}
              onChange={handleChange}
              rows="6"
              required
            />
          </div>

          <div className="button-container">
            <button
              type="submit"
              className="form-button"
              disabled={isLoading}
            >
              {isLoading ? 'Envoi en cours...' : 'Envoyer le message'}
              {!isLoading && <span className="arrow">✉</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;