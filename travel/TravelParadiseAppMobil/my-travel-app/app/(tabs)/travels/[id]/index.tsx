import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { colors } from '../../../../constants/colors'; // Ajuste le chemin
import { Travel } from '../../../../types'; // Ajuste le chemin
import { Ionicons } from '@expo/vector-icons';

// Données fictives (pourrait être récupéré via une API plus tard)
const mockTravelsData: { [key: string]: Travel } = {
  '1': { id: 1, name: "Aventure en Amazonie", description: "Explorez la forêt tropicale luxuriante et découvrez sa biodiversité unique. Marchez sur des ponts suspendus, naviguez sur le fleuve Amazone et rencontrez des communautés locales.", imageUrl: "https://images.unsplash.com/photo-1506929562872-bb421bda495e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80", location: "Brésil", price: 1200, duration: "7 jours" },
  '2': { id: 2, name: "Safari au Kenya", description: "Vivez une expérience inoubliable en observant les grands animaux dans leur habitat naturel. Parcourez la savane, admirez le coucher de soleil et dormez dans des lodges confortables.", imageUrl: "https://images.unsplash.com/photo-153310480278707f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80", location: "Kenya", price: 2500, duration: "10 jours" },
  '3': { id: 3, name: "Plages des Maldives", description: "Détendez-vous sur des plages de sable blanc et nagez dans des eaux turquoise cristallines. Profitez de sports nautiques, de dîners romantiques et de couchers de soleil spectaculaires.", imageUrl: "https://images.unsplash.com/photo-1519046904884-53100b7797f5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80", location: "Maldives", price: 1800, duration: "5 jours" },
  '4': { id: 4, name: "Randonnée dans les Alpes", description: "Parcourez des sentiers magnifiques avec des vues panoramiques sur les montagnes majestueuses. Découvrez des lacs d'altitude et des villages de montagne pittoresques.", imageUrl: "https://images.unsplash.com/photo-1506905925346-2199023f707c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80", location: "Suisse", price: 900, duration: "6 jours" },
};

export default function TravelDetailScreen() {
  const { id } = useLocalSearchParams();
  const travel = mockTravelsData[id as string]; // Récupère les données fictives

  const handleBookPress = () => {
    router.push(`/book/${id}`); // Navigue vers l'écran de réservation
  };

  // Pour l'instant, on ne gère pas les favoris, mais on peut ajouter l'icône
  const handleFavoritePress = () => {
    // Logique de favori à implémenter plus tard
    alert("Fonctionnalité favori à venir !");
  };

  if (!travel) {
    return (
      <View style={styles.centered}>
        <Text>Voyage non trouvé.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: travel.name, headerStyle: { backgroundColor: colors.primary }, headerTintColor: '#fff' }} />

      <Image source={{ uri: travel.imageUrl }} style={styles.image} />

      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{travel.name}</Text>
          <TouchableOpacity onPress={handleFavoritePress} style={styles.favoriteButton}>
            <Ionicons name="heart-outline" size={28} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.detailsContainer}>
          {travel.location && (
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={22} color={colors.textSecondary} />
              <Text style={styles.detailText}>{travel.location}</Text>
            </View>
          )}
          {travel.duration && (
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={22} color={colors.textSecondary} />
              <Text style={styles.detailText}>{travel.duration}</Text>
            </View>
          )}
          {travel.price !== undefined && (
            <View style={styles.detailRow}>
              <Ionicons name="cash-outline" size={22} color={colors.textSecondary} />
              <Text style={styles.detailText}>{travel.price} €</Text>
            </View>
          )}
        </View>

        <Text style={styles.description}>{travel.description}</Text>

        <TouchableOpacity style={styles.bookButton} onPress={handleBookPress}>
          <Text style={styles.bookButtonText}>Réserver ce voyage</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 20,
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20, // Superpose légèrement sur l'image
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1, // Permet au titre de prendre l'espace disponible
    marginRight: 10,
  },
  favoriteButton: {
    padding: 8,
    backgroundColor: colors.background,
    borderRadius: 20,
  },
  detailsContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f0f0f0', // Gris très clair pour les détails
    borderRadius: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 12,
  },
  description: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 30,
  },
  bookButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});