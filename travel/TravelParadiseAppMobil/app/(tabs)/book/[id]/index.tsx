import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, TextInput, Button, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router'; // Importe useRouter
import axios from 'axios';

// Réutilise la même interface Travel pour la cohérence
interface Travel {
    id: number;
    name: string;
    description: string;
    imageUrl?: string;
    location?: string;
    price?: number; // Assure-toi que le prix est bien un nombre
    duration?: string;
}

export default function BookTravelScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter(); // Pour la navigation
    const [travel, setTravel] = useState<Travel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Champs pour le formulaire de réservation
    const [numberOfPeople, setNumberOfPeople] = useState<string>('1');
    const [contactName, setContactName] = useState<string>('');
    const [contactEmail, setContactEmail] = useState<string>('');
    const [bookingError, setBookingError] = useState<string | null>(null); // Pour les erreurs de réservation

    useEffect(() => {
        const fetchTravelDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                // On récupère les détails du voyage pour les afficher
                const response = await axios.get<Travel>(`http://localhost:8000/api/travels/${id}`);
                setTravel(response.data);
            } catch (err) {
                console.error("Erreur lors de la récupération des détails du voyage pour la réservation:", err);
                if (err.response) {
                    setError(`Erreur ${err.response.status}: ${err.response.data.message || 'Impossible de charger les détails du voyage.'}`);
                } else if (err.request) {
                    setError("Pas de réponse du serveur. Vérifiez que le backend tourne.");
                } else {
                    setError("Erreur lors de la configuration de la requête.");
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchTravelDetails();
        } else {
            setError("Aucun ID de voyage fourni.");
            setLoading(false);
        }
    }, [id]);

    // Calcul du prix total
    const calculateTotalPrice = () => {
        const numPeople = parseInt(numberOfPeople, 10);
        if (travel && travel.price !== undefined && !isNaN(numPeople) && numPeople > 0) {
            return travel.price * numPeople;
        }
        return 0;
    };

    const handleBooking = async () => { // Rendre la fonction asynchrone
        // Validation simple des champs
        if (!contactName || !contactEmail || !numberOfPeople) {
            setBookingError("Veuillez remplir tous les champs.");
            return;
        }
        const numPeople = parseInt(numberOfPeople, 10);
        if (isNaN(numPeople) || numPeople <= 0) {
            setBookingError("Le nombre de personnes doit être un nombre valide et supérieur à 0.");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contactEmail)) {
            setBookingError("Veuillez entrer une adresse email valide.");
            return;
        }
        if (!travel) {
            setBookingError("Aucun détail de voyage disponible.");
            return;
        }

        setBookingError(''); // Réinitialise l'erreur de réservation

        // Préparation des données pour l'API
        const reservationData = {
            travelId: parseInt(id as string), // Assure-toi que c'est un nombre
            fullName: contactName,
            email: contactEmail,
            numberOfPeople: numPeople,
        };

        try {
            // Appel à l'API Symfony pour créer la réservation
            const response = await axios.post('http://localhost:8000/api/reservations', reservationData);

            if (response.data.success) {
                Alert.alert("Succès", response.data.message);
                // Réinitialiser le formulaire
                setContactName('');
                setContactEmail('');
                setNumberOfPeople('1');
                // Rediriger vers une page de confirmation ou la liste des voyages
                router.push('/(tabs)/home'); // Exemple de redirection
            } else {
                // Si le backend renvoie une erreur spécifique dans le JSON
                setBookingError(response.data.message || "Une erreur est survenue lors de la réservation.");
            }
        } catch (err) {
            console.error("Erreur lors de l'envoi de la réservation:", err);
            if (err.response && err.response.data && err.response.data.message) {
                setBookingError(err.response.data.message);
            } else if (err.response && err.response.data && err.response.data.errors) {
                // Si le backend renvoie un tableau d'erreurs de validation
                setBookingError(err.response.data.errors.join('\n'));
            } else {
                setBookingError("Erreur de connexion au serveur. Veuillez réessayer.");
            }
        }
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Chargement des détails du voyage...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error}</Text>
                {/* Optionnel : ajouter un bouton pour réessayer */}
                <Button title="Réessayer" onPress={() => { /* Logique pour réessayer */ }} />
            </View>
        );
    }

    if (!travel) {
        return (
            <View style={styles.centered}>
                <Text>Aucun détail trouvé pour ce voyage.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Réserver : {travel.name}</Text>

            {travel.imageUrl && (
                <Image source={{ uri: travel.imageUrl }} style={styles.image} />
            )}

            <Text style={styles.description}>{travel.description}</Text>

            {travel.price !== undefined && (
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Prix par personne :</Text>
                    <Text style={styles.value}>{travel.price} €</Text>
                </View>
            )}

            {/* Affichage du prix total calculé */}
            <View style={styles.detailRow}>
                <Text style={styles.label}>Prix total :</Text>
                <Text style={styles.value}>{calculateTotalPrice()} €</Text>
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.formTitle}>Vos informations</Text>

                <Text style={styles.inputLabel}>Nom complet</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Votre nom"
                    value={contactName}
                    onChangeText={setContactName}
                />

                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="votre.email@example.com"
                    value={contactEmail}
                    onChangeText={setContactEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Text style={styles.inputLabel}>Nombre de personnes</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Combien de personnes ?"
                    value={numberOfPeople}
                    onChangeText={setNumberOfPeople}
                    keyboardType="numeric"
                />

                {/* Affichage des erreurs de réservation */}
                {bookingError ? <Text style={styles.errorText}>{bookingError}</Text> : null}

                <Button
                    title="Confirmer la réservation"
                    onPress={handleBooking}
                    color="#007AFF"
                    disabled={loading} // Désactive le bouton pendant le chargement ou l'envoi
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginBottom: 15,
        resizeMode: 'cover',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
        textAlign: 'center',
    },
    description: {
        fontSize: 15,
        color: '#555',
        lineHeight: 22,
        marginBottom: 20,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 10,
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    value: {
        fontSize: 16,
        color: '#555',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
    },
    formContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    formTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
        textAlign: 'center',
    },
    inputLabel: {
        fontSize: 14,
        color: '#555',
        marginBottom: 5,
        fontWeight: '500',
    },
    input: {
        height: 45,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        fontSize: 16,
    },
});