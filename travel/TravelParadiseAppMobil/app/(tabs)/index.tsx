import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
// Assure-toi que le chemin d'accès est correct pour ton projet
// Si VisitesScreen est dans screens/VisitesScreen.js, le chemin est :
import VisitesScreen from '../../screens/VisitesScreen';

// Si tu veux mettre le contenu directement ici pour tester, tu peux le faire :
/*
const VisitesScreenContent = () => {
  const [visites, setVisites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVisites = async () => {
    setLoading(true);
    setError(null);
    try {
      setTimeout(() => {
        setVisites([
          { id: '1', nom: 'Tour Eiffel', ville: 'Paris' },
          { id: '2', nom: 'Colisée', ville: 'Rome' },
          { id: '3', nom: 'Statue de la Liberté', ville: 'New York' },
        ]);
        setLoading(false);
      }, 1500);
    } catch (err) {
      setError("Erreur lors du chargement des visites.");
      console.error("Erreur fetchVisites:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisites();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Chargement des visites...</Text>
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
      <Text style={styles.header}>Nos Visites</Text>
      {visites.length === 0 ? (
        <Text style={styles.centered}>Aucune visite trouvée.</Text>
      ) : (
        <FlatList
          data={visites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.visiteItem}>
              <Text style={styles.visiteNom}>{item.nom}</Text>
              <Text style={styles.visiteVille}>{item.ville}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

// Styles pour le contenu de VisitesScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
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

export default VisitesScreenContent;
*/

// Si tu as bien créé le fichier screens/VisitesScreen.js avec le code précédent,
// utilise cet import et affiche le composant :
export default function TabIndex() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TravelParadise</Text>
      <VisitesScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50, // Espace en haut pour la barre d'état
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});