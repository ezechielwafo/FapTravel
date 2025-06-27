import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './context/AuthContext'; // Assure-toi que le chemin est correct
import { ActivityIndicator, View, Text } from 'react-native';

// Importe tes écrans
import LoginScreen from './screens/LoginScreen'; // Crée ce fichier
import HomeScreen from './screens/HomeScreen';   // Crée ce fichier
// import OtherScreens...

const Stack = createNativeStackNavigator();

// Composant qui gère la logique de navigation basée sur l'authentification
function AppNavigator() {
  const { userToken, isLoading } = useAuth();

  // Affiche un écran de chargement pendant la vérification initiale du token
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userToken == null ? (
          // Si pas de token, afficher l'écran de connexion
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: 'Connexion', headerShown: false }} // Cache l'en-tête pour l'écran de login
          />
        ) : (
          // Si un token existe, afficher les écrans de l'application principale
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil' }} />
            {/* Ajoute ici tes autres écrans qui nécessitent une authentification */}
            {/* Exemple : <Stack.Screen name="Book" component={BookScreen} /> */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Composant principal de l'application
export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}