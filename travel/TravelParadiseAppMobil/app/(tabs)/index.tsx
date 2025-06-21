import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios'; // Importe axios

// --- MODIFICATION 1 : Ajuster l'URL ---
// L'URL de ton API Symfony. Assure-toi que ton serveur Symfony tourne
// et que tu peux y accéder depuis ton téléphone.

// CHOISIS L'UNE DES DEUX LIGNES CI-DESSOUS, SELON TON ENVIRONNEMENT :

// Si tu utilises un ÉMULATEUR ANDROID :
// const API_URL = 'http://10.0.2.2:8000/api/travels';

// Si tu utilises un SIMULATEUR IOS ou un APPAREIL PHYSIQUE sur le même Wi-Fi :
// (Utilise l'adresse IP de ton PC sur ton réseau local, par exemple 172.20.203.138)
const API_URL = 'http://localhost:8000/api/travels'; // <-- Assure-toi que c'est la bonne IP de ton PC

export default function TabIndex() {
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(true); // Remets loading à true pour afficher l'indicateur au début
  const [error, setError] = useState(null);

  const fetchTravels = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      setTravels(response.data);
      setLoading(false);
    } catch (err) {
      setError(`Erreur lors de la récupération des voyages: ${err.message}`);
      console.error("Erreur axios fetchTravels:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTravels(); // Appelle la fonction renommée
  }, []);
  // !!! SUPPRIME CE DEUXIÈME useEffect !!!
  /*
  useEffect(() => {
    setTravels([
      { id: 1, name: 'Voyage Test 1', description: 'Description test 1' },
      { id: 2, name: 'Voyage Test 2', description: 'Description test 2' },
    ]);
  }, []);
  */

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Chargement des voyages...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Nos Voyages</Text>
      {travels.length === 0 ? (
        <Text style={styles.centered}>Aucun voyage trouvé.</Text>
      ) : (
        <FlatList
          data={travels}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.visiteItem}>
              <Text style={styles.visiteNom}>{item.name}</Text>
              <Text style={styles.visiteVille}>{item.description}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

// Styles (restent les mêmes)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
  visiteItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  visiteNom: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  visiteVille: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
});