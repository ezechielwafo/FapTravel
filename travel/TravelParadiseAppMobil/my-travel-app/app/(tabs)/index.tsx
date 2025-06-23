import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '../../constants/colors';
import TravelCard from '../components/TravelCard'; // Assure-toi que le chemin est correct
import { Travel } from '../types'; // Assure-toi que le chemin est correct
import { Ionicons } from '@expo/vector-icons';

// Données fictives pour l'instant
const mockTravels: Travel[] = [
  { id: 1, name: "Aventure en Amazonie", description: "Explorez la forêt tropicale luxuriante et découvrez sa biodiversité unique.", imageUrl: "https://images.unsplash.com/photo-1506929562872-bb421bda495e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80", location: "Brésil", price: 1200, duration: "7 jours" },
  { id: 2, name: "Safari au Kenya", description: "Vivez une expérience inoubliable en observant les grands animaux dans leur habitat naturel.", imageUrl: "https://images.unsplash.com/photo-1533104802787-73637073707f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80", location: "Kenya", price: 2500, duration: "10 jours" },
  { id: 3, name: "Plages des Maldives", description: "Détendez-vous sur des plages de sable blanc et nagez dans des eaux turquoise cristallines.", imageUrl: "https://images.unsplash.com/photo-1519046904884-53100b7797f5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80", location: "Maldives", price: 1800, duration: "5 jours" },
  { id: 4, name: "Randonnée dans les Alpes", description: "Parcourez des sentiers magnifiques avec des vues panoramiques sur les montagnes majestueuses.", imageUrl: "https://images.unsplash.com/photo-1506905925346-2199023f707c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80", location: "Suisse", price: 900, duration: "6 jours" },
];

export default function TravelsScreen() {
  const handlePress = (id: number) => {
    // Navigue vers la page de détail du voyage avec son ID
    router.push(`/travels/${id}`);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Découvrir le monde', headerStyle: { backgroundColor: colors.primary }, headerTintColor: '#fff' }} />

      <FlatList
        data={mockTravels}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <TravelCard travel={item} onPress={handlePress} />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingVertical: 10,
  },
  // Pas besoin de styles supplémentaires ici car TravelCard gère ses propres styles
});
