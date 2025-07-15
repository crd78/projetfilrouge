/**
 * Configuration des paramètres de l'API
 * Ce fichier centralise toutes les URLs et configurations liées à l'API
 */

const API_CONFIG = {
  // URL de base de l'API
  BASE_URL: 'http://localhost:8000/',
  
  // Endpoints spécifiques
  ENDPOINTS: {
    LOGIN: 'api/client/connexion ',
    REGISTER: 'api/client/inscription',  
    USERS: 'api/users',
    CONTACTS: 'api/contacts/',
  },
  
  // Headers par défaut
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

export default API_CONFIG;