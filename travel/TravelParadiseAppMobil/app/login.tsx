import { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../utils/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await api.post('/login_check', {
        username: email,
        password,
      });
      await AsyncStorage.setItem('token', res.data.token);
      router.replace('/(tabs)/travels');
    } catch (err) {
      Alert.alert('Erreur', 'Identifiants invalides');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" />
      <Text>Mot de passe</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Connexion" onPress={handleLogin} />
    </View>
  );
}
