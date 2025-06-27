import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext'; // Assure-toi que le chemin est correct

const HomeScreen = () => {
  const { userData, logout } = useAuth(); // Récupère les données utilisateur et la fonction logout

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Bonjour, {userData ? userData.firstName : 'Utilisateur'} !</Text>
      <Text>Bienvenue sur l'application.</Text>
      {/* Affiche d'autres informations utilisateur si nécessaire */}
      {/* <Text>Email: {userData ? userData.email : ''}</Text> */}

      <View style={styles.buttonContainer}>
        <Button title="Se déconnecter" onPress={logout} color="#ff6347" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 30,
    width: '60%',
  },
});

export default HomeScreen;