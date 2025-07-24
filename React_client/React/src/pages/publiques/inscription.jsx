import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './inscription.css';
import API_CONFIG from '../../api.config.js';

const Inscription = () => {
  const navigate = useNavigate();
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

  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const register = async (userData) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REGISTER}`, {
        method: 'POST',
        headers: API_CONFIG.DEFAULT_HEADERS,
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        if (response.headers.get('content-type')?.includes('application/json')) {
          return { success: true, data: await response.json() };
        }
        return { success: true };
      }

      try {
        const errorData = await response.json();
        return { success: false, message: errorData.message || 'Erreur lors de l\'inscription' };
      } catch (e) {
        return { success: false, message: `Erreur HTTP ${response.status}` };
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        setMessage({ text: 'Demande d inscription réussie! Redirection...', type: 'success' });
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
        
        // Redirection vers la page d'accueil après 2 secondes
        setTimeout(() => {
          navigate('/');
        }, 2000);
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
          <div className="form-columns">
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
          </div>
          <div className="button-container">
            <button
              type="submit"
              className="form-button"
              disabled={isLoading}
            >
              {isLoading ? 'Inscription en cours...' : 'Inscription'}
              {!isLoading && <span className="arrow">→</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Inscription;