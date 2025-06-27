import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

// --- Configuration ---
// Remplace par l'URL de ton API Symfony.
// Si tu utilises un émulateur Android ou un appareil physique, utilise l'adresse IP de ta machine.
// Exemple : 'http://192.168.1.10:8000'
const API_URL = 'http://localhost:8000'; // Adapte cette URL !


/**
 * Tente de connecter l'utilisateur à l'API.
 * @param {string} email - L'email de l'utilisateur.
 * @param {string} password - Le mot de passe de l'utilisateur.
 * @returns {Promise<object>} - Promesse résolue avec les données utilisateur et le token.
 * @throws {Error} - Lance une erreur en cas d'échec de connexion.
 */
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/login`, {
      email: email,
      password: password,
    });

    // Vérifie si le token JWT est présent dans la réponse
    if (response.data && response.data.token) {
      const token = response.data.token;
      const user = response.data.user; // Assure-toi que ton API retourne bien les infos utilisateur

      // Stocke le token et les données utilisateur de manière sécurisée
      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('userData', JSON.stringify(user));

      // Configure axios pour inclure le token dans les futures requêtes
      setAuthToken(token);

      return { token, user };
    } else {
      // Si le token n'est pas reçu, c'est un problème côté API ou configuration
      throw new Error('Token JWT non reçu de l\'API.');
    }
  } catch (error) {
    console.error("Erreur lors de la connexion API:", error.response?.data || error.message);

    // Essaye de retourner un message d'erreur plus spécifique si possible
    let errorMessage = 'Une erreur est survenue lors de la connexion.';
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message; // Message d'erreur de l'API
    } else if (error.response && error.response.status === 401) {
      errorMessage = 'Identifiants invalides.';
    }
    throw new Error(errorMessage); // Relance l'erreur pour la gérer dans le composant appelant
  }
};

/**
 * Supprime le token et les données utilisateur du stockage sécurisé.
 */
export const logoutUser = async () => {
  await SecureStore.deleteItemAsync('userToken');
  await SecureStore.deleteItemAsync('userData');
  // Supprime l'en-tête d'authentification d'axios
  setAuthToken(null);
};

/**
 * Récupère le token JWT stocké.
 * @returns {Promise<string|null>} - Le token JWT ou null s'il n'est pas trouvé.
 */
export const getToken = async () => {
  return await SecureStore.getItemAsync('userToken');
};

/**
 * Récupère les données utilisateur stockées.
 * @returns {Promise<object|null>} - Les données utilisateur ou null.
 */
export const getUserData = async () => {
  const userDataJson = await SecureStore.getItemAsync('userData');
  return userDataJson ? JSON.parse(userDataJson) : null;
};

/**
 * Configure l'en-tête d'authentification pour axios.
 * @param {string|null} token - Le token JWT à ajouter, ou null pour le supprimer.
 */
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};


export const initializeAuth = async () => {
  const token = await getToken();
  if (token) {
    setAuthToken(token);
  
  }
};