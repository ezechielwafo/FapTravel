import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../constants/colors';
import { Travel } from '../types'; // Assure-toi que le chemin est correct

interface TravelCardProps {
  travel: Travel;
  onPress: (id: number) => void;
}

const TravelCard: React.FC<TravelCardProps> = ({ travel, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(travel.id)} style={styles.card}>
      <Image source={{ uri: travel.imageUrl || 'https://via.placeholder.com/150' }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{travel.name}</Text>
        {travel.location && (
          <Text style={styles.location}>
            <Ionicons name="location-outline" size={16} color={colors.textSecondary} /> {travel.location}
          </Text>
        )}
        {travel.price !== undefined && (
          <Text style={styles.price}>{travel.price} €</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

// Importez Ionicons si vous l'utilisez dans le composant
import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    marginHorizontal: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Pour Android
    overflow: 'hidden', // Pour que l'image respecte les bords arrondis
    flexDirection: 'row', // Pour mettre l'image à côté du texte
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    marginRight: 15,
  },
  content: {
    flex: 1, // Prend l'espace restant
    paddingVertical: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
});

export default TravelCard;