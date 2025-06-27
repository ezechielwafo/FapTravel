import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Box, Text, Input, Button, VStack, Heading, ScrollView } from 'native-base';
import axios from 'axios';
import { API_BASE_URL } from '../../../apiConfig' // Assure-toi que le chemin est correct
export default function BookTravelScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); 

  const [travelDetails, setTravelDetails] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [people, setPeople] = useState('1');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTravelDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/travels/${id}`);
        setTravelDetails(response.data); // Assure-toi que la réponse contient les détails du voyage
      } catch (error) {
        console.error('Erreur lors de la récupération des détails du voyage:', error);
        Alert.alert('Erreur', 'Impossible de charger les détails du voyage.');
        router.back(); // Retourne à l'écran précédent en cas d'erreur
      }
    };

    fetchTravelDetails();
  }, [id]);

  const handleConfirmBooking = async () => {
    if (!name || !email || !people) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/reservations`, {
        travelId: id, // Utilise l'ID récupéré
        fullName: name,
        email: email,
        numberOfPeople: parseInt(people, 10),
      });

      // Adapte la structure de la réponse JSON de ton API Symfony
      // Par exemple, si ton API renvoie { success: true, message: '...' } ou { error: true, message: '...' }
      if (response.data.success) {
        Alert.alert('Succès', response.data.message || 'Votre réservation a été confirmée !');
        router.push('/confirmation'); // Redirige vers l'écran de confirmation
      } else {
        Alert.alert('Erreur de réservation', response.data.message || 'Une erreur est survenue lors de la réservation.');
      }
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
      // Gère les erreurs réseau ou les erreurs serveur non gérées par la réponse JSON
      let errorMessage = 'Une erreur réseau est survenue.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message; // Essaye de récupérer un message d'erreur de l'API
      }
      Alert.alert('Erreur', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!travelDetails) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Text>Chargement...</Text>
      </Box>
    );
  }

  return (
    <ScrollView>
      <Box p={5}>
        <Heading mb={4}>Réserver pour : {travelDetails.name}</Heading> {/* Assure-toi que travelDetails a une propriété 'name' */}

        <VStack space={3}>
          <Input
            placeholder="Votre nom complet"
            value={name}
            onChangeText={setName}
            size="lg"
          />
          <Input
            placeholder="Votre email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            size="lg"
          />
          <Input
            placeholder="Nombre de personnes"
            value={people}
            onChangeText={setPeople}
            keyboardType="numeric"
            size="lg"
          />

          <Button
            onPress={handleConfirmBooking}
            isLoading={isLoading}
            size="lg"
            colorScheme="primary" // Utilise une couleur définie dans ton thème
          >
            Confirmer la réservation
          </Button>
        </VStack>
      </Box>
    </ScrollView>
  );
}