import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons'; // Pour l'icône de cœur

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

export default function TravelDetailScreen() {
    const { id } = useLocalSearchParams();
    const [travel, setTravel] = useState<Travel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFavorite, setIsFavorite] = useState<boolean>(false); // État pour le favori

    useEffect(() => {
        const fetchTravelDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get<Travel>(`http://localhost:8000/api/travels/${id}`);
                setTravel(response.data);
                // Ici, tu pourrais charger l'état 'isFavorite' depuis le stockage local ou une API
                // Pour l'instant, on le met à false par défaut
                setIsFavorite(false);
            } catch (err) {
                console.error("Erreur lors de la récupération des détails du voyage:", err);
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

    const handleBookPress = () => {
        router.push(`/book/${id}`); // Navigue vers l'écran de réservation
    };

    const toggleFavorite = () => {
        // Ici, tu ajouterais la logique pour sauvegarder/supprimer des favoris
        // Par exemple, utiliser AsyncStorage ou une API
        setIsFavorite(prevState => !prevState);
        if (!isFavorite) {
            Alert.alert("Favori ajouté", `"${travel?.name}" a été ajouté à vos favoris !`);
        } else {
            Alert.alert("Favori retiré", `"${travel?.name}" a été retiré de vos favoris.`);
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
            {/* Configuration de la barre de navigation pour cet écran */}
            <Stack.Screen
                options={{
                    title: travel.name, // Titre de la barre de navigation
                    headerRight: () => (
                        <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
                            <Ionicons
                                name={isFavorite ? "heart" : "heart-outline"} // Change l'icône si favori
                                size={24}
                                color={isFavorite ? "red" : "gray"}
                            />
                        </TouchableOpacity>
                    ),
                }}
            />

            <Image source={{ uri: travel.imageUrl }} style={styles.image} />

            <Text style={styles.title}>{travel.name}</Text>

            <View style={styles.detailsContainer}>
                {travel.location && (
                    <View style={styles.detailRow}>
                        <Ionicons name="location-outline" size={20} color="#555" />
                        <Text style={styles.detailText}>{travel.location}</Text>
                    </View>
                )}
                {travel.duration && (
                    <View style={styles.detailRow}>
                        <Ionicons name="time-outline" size={20} color="#555" />
                        <Text style={styles.detailText}>{travel.duration}</Text>
                    </View>
                )}
                {travel.price !== undefined && (
                    <View style={styles.detailRow}>
                        <Ionicons name="cash-outline" size={20} color="#555" />
                        <Text style={styles.detailText}>{travel.price} €</Text>
                    </View>
                )}
            </View>

            <Text style={styles.description}>{travel.description}</Text>

            <TouchableOpacity style={styles.bookButton} onPress={handleBookPress}>
                <Text style={styles.bookButtonText}>Réserver ce voyage</Text>
            </TouchableOpacity>
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
        height: 200,
        borderRadius: 8,
        marginBottom: 15,
        resizeMode: 'cover',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
        textAlign: 'center',
    },
    detailsContainer: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#eee',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailText: {
        fontSize: 16,
        color: '#555',
        marginLeft: 10,
    },
    description: {
        fontSize: 15,
        color: '#555',
        lineHeight: 22,
        marginBottom: 30, // Plus d'espace avant le bouton
    },
    bookButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 'auto', // Pousse le bouton vers le bas
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
    favoriteButton: {
        padding: 10, // Ajoute un padding pour faciliter le clic
    },
});
