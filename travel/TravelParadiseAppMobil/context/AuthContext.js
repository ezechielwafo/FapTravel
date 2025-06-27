import React, { createContext, useState, useEffect, useContext } from 'react';
import * as authService from '../services/authService'; // Assure-toi que le chemin est correct

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Pour gérer l'état de chargement initial

  useEffect(() => {
    const bootstrapAsync = async () => {
      setIsLoading(true);
      try {
        const token = await authService.getToken();
        const user = await authService.getUserData();

        if (token) {
          setUserToken(token);
          setUserData(user);
          authService.setAuthToken(token);
        }
      } catch (e) {
        console.log('Erreur lors de l\'initialisation de l\'authentification:', e);
        setUserToken(null);
        setUserData(null);
      } finally {
        setIsLoading(false); // Fin du chargement initial
      }
    };

    bootstrapAsync();
  }, []);

  // Fonction de connexion
  const login = async (email, password) => {
    setIsLoading(true); // Marque le début du processus de connexion
    try {
      const response = await authService.loginUser(email, password);
      setUserToken(response.token);
      setUserData(response.user);
      return true; // Indique que la connexion a réussi
    } catch (error) {
      console.error("Erreur dans le contexte de connexion:", error.message);
      // L'erreur est déjà loggée dans authService, on peut juste retourner false
      return false; // Indique que la connexion a échoué
    } finally {
      setIsLoading(false); // Marque la fin du processus de connexion
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    await authService.logoutUser();
    setUserToken(null);
    setUserData(null);
  };

  // Valeurs fournies par le contexte
  const authContextValue = {
    userToken,
    userData,
    isLoading, // Utile pour afficher un écran de chargement
    login,
    logout,
    isAuthenticated: !!userToken, // Propriété pratique pour vérifier si l'utilisateur est connecté
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};