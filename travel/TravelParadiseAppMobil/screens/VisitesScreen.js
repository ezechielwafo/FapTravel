import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
// Importe la fonction pour récupérer les données de Supabase (que nous allons créer)
// import { getVisites } from '../utils/supabaseClient'; // On décommentera ça plus tard

export default function VisitesScreen() {
  const [visites, setVisites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour récupérer les données (on va la remplir bientôt)
  const fetchVisites = async () => {
    setLoading(true);
    setError(null);
    try {
      // Ici, on appellera notre fonction Supabase pour récupérer les visites
      // const data = await getVisites();
      // setVisites(data);

      // Pour l'instant, on simule des données pour tester l'affichage
      setTimeout(() => {
        setVisites([
          { id: '1', nom: 'Tour Eiffel', ville: 'Paris' },
          { id: '2', nom: 'Colisée', ville: 'Rome' },
          { id: '3', nom: 'Statue de la Liberté', ville: 'New York' },
        ]);
        setLoading(false);
      }, 1500); // Simule un délai de chargement de 1.5 secondes

    } catch (err) {
      setError("Erreur lors du chargement des visites.");
      console.error("Erreur fetchVisites:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisites();
  }, []); // Le tableau vide signifie que cet effet ne s'exécute qu'une fois au montage du composant

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
}

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