import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ActivityIndicator,
    TouchableOpacity, // Importe TouchableOpacity
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router'; // Importe useRouter

// Définis une interface pour la structure de tes données de voyage
interface Travel {
    id: number; // Assure-toi que l'ID est bien un nombre ou une string selon ton API
    name: string;
    description: string;
    // Ajoute d'autres propriétés si ton API en renvoie
}

export default function TravelsScreen() {
    const [travels, setTravels] = useState<Travel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter(); // Initialise le routeur

    useEffect(() => {
        const fetchTravels = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get<Travel[]>('http://localhost:8000/api/travels');
                setTravels(response.data);
            } catch (err) {
                console.error("Erreur lors de la récupération des voyages:", err);
                setError("Impossible de charger la liste des voyages.");
            } finally {
                setLoading(false);
            }
        };

        fetchTravels();
    }, []);

    const renderTravelItem = ({ item }: { item: Travel }) => (
        <TouchableOpacity
            style={styles.visiteContainer}
            onPress={() => router.push(`/travels/${item.id}`)}
            activeOpacity={0.7} // Effet visuel au clic
        >
            <Text style={styles.visiteNom}>{item.name}</Text>
            <Text style={styles.visiteVille}>{item.description}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Chargement des voyages...</Text>
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
            <FlatList
                data={travels}
                renderItem={renderTravelItem}
                keyExtractor={(item) => item.id.toString()} // Assure-toi que l'ID est une string pour keyExtractor
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    listContent: {
        padding: 10,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    visiteContainer: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // Pour Android
    },
    visiteNom: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    visiteVille: {
        fontSize: 14,
        color: '#666',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
});