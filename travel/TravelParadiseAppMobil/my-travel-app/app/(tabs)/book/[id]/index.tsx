import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { colors } from '../../../constants/colors'; // Ajuste le chemin
import { Ionicons } from '@expo/vector-icons';

// On peut récupérer le nom du voyage pour l'afficher, mais pour l'instant on utilise juste l'ID
// Dans une vraie app, on ferait un appel API pour récupérer les détails du voyage ici aussi.

export default function BookTravelScreen() {
  const { id } = useLocalSearchParams();
  const [numberOfPeople, setNumberOfPeople] = useState<string>('1');
  const [contactName, setContactName] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');

  const handleBookingConfirmation = () => {
    if (!contactName || !contactEmail || !numberOfPeople) {
      Alert.alert("Champs incomplets", "Veuillez remplir tous les champs pour continuer.");
      return;
    }
    if (isNaN(parseInt(numberOfPeople)) || parseInt(numberOfPeople) <= 0) {
      Alert.alert("Nombre invalide", "Le nombre de personnes doit être un entier positif.");
      return;
    }
    // Ici, on simule une confirmation. Dans une vraie app, on enverrait ces données au backend.
    Alert.alert(
      "Confirmation de réservation",
      `Merci ${contactName} !\nVotre réservation pour le voyage ID ${id} est presque terminée.\n${numberOfPeople} personne(s).\nNous vous contacterons à ${contactEmail}.`,
      [
        { text: "Retour à l'accueil", onPress: () => router.push('/') },
        { text: "OK", style: "cancel" }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: `Réserver le voyage ${id}`, headerStyle: { backgroundColor: colors.primary }, headerTintColor: '#fff' }} />

      <View style={styles.formContainer}>
        <Text style={styles.title}>Finalisez votre réservation</Text>
        <Text style={styles.subtitle}>Voyage ID: {id}</Text>

        <Text style={styles.inputLabel}>Nom complet</Text>
        <TextInput
          style={styles.input}
          placeholder="Votre nom et prénom"
          value={contactName}
          onChangeText={setContactName}
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="votre.email@example.com"
          value={contactEmail}
          onChangeText={setContactEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={styles.inputLabel}>Nombre de personnes</Text>
        <TextInput
          style={styles.input}
          placeholder="Combien de personnes ?"
          value={numberOfPeople}
          onChangeText={setNumberOfPeople}
          keyboardType="numeric"
          placeholderTextColor={colors.textSecondary}
        />

        <TouchableOpacity style={styles.confirmButton} onPress={handleBookingConfirmation}>
          <Text style={styles.confirmButtonText}>Confirmer la réservation</Text>
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
  formContainer: {
    flex: 1,
    padding: 25,
    backgroundColor: colors.cardBackground,
    borderRadius: 15,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderColor: '#E5E5EA', // Gris clair pour la bordure
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#F7F7F7', // Fond légèrement différent
    fontSize: 16,
    color: colors.textPrimary,
  },
  confirmButton: {
    backgroundColor: colors.accent, // Utilise le vert pour la confirmation
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});