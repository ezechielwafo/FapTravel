import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, TextInput, Button, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';

// Réutilise la même interface Travel pour la cohérence
interface Travel {
    id: number;
    name: string;
    description: string;
    imageUrl?: string;
    location?: string;
    price?: number;
    duration?: string;
}

export default function BookTravelScreen() {
    const { id } = useLocalSearchParams();
    const [travel, setTravel] = useState<Travel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Champs pour le formulaire de réservation
    const [numberOfPeople, setNumberOfPeople] = useState<string>('1');
    const [contactName, setContactName] = useState<string>('');
    const [contactEmail, setContactEmail] = useState<string>('');

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
                setError("Impossible de charger les détails du voyage.");
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

    const handleBooking = () => {
        // Validation simple des champs
        if (!contactName || !contactEmail || !numberOfPeople) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs.");
            return;
        }
        if (isNaN(parseInt(numberOfPeople)) || parseInt(numberOfPeople) <= 0) {
            Alert.alert("Erreur", "Le nombre de personnes doit être un nombre valide.");
            return;
        }
        if (!travel) {
            Alert.alert("Erreur", "Aucun détail de voyage disponible.");
            return;
        }

        // Ici, tu ferais un appel à une API pour enregistrer la réservation
        // Pour l'instant, on affiche juste une alerte de succès
        Alert.alert(
            "Réservation réussie !",
            `Votre réservation pour "${travel.name}" est confirmée.\nNom: ${contactName}\nEmail: ${contactEmail}\nPersonnes: ${numberOfPeople}`,
            [{ text: "OK" }]
        );

        // Optionnellement, tu peux naviguer vers un écran de confirmation ou revenir à la liste
        // router.push('/confirmation'); // Si tu as un écran de confirmation
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

                <Button
                    title="Confirmer la réservation"
                    onPress={handleBooking}
                    color="#007AFF"
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
        height: 150, // Légèrement plus petit pour laisser place au formulaire
        borderRadius: 8,
        marginBottom: 15,
        resizeMode: 'cover',
    },
    title: {
        fontSize: 22, // Un peu plus petit que sur la page de détail
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
        justifyContent: 'space-between', // Pour aligner prix à droite
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