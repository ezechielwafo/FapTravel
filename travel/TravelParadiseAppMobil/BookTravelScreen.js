import axios from 'axios';
import { API_BASE_URL } from '../apiConfig'; 


const handleConfirmBooking = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/reservations`, {
      travelId: travel.id, 
      fullName: name,
      email: email,
      numberOfPeople: parseInt(people, 10),
    });

    if (response.data.success) { 
      Alert.alert('Succès', 'Votre réservation a été confirmée !');
      router.push('/confirmation'); 
    } else {
      Alert.alert('Erreur', response.data.message || 'Une erreur est survenue.');
    }
  } catch (error) {
    console.error('Erreur lors de la réservation:', error);
    Alert.alert('Erreur', 'Impossible de se connecter au serveur.');
  }
};