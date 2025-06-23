import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* Tu peux ajouter d'autres écrans ici si nécessaire */}
    </Stack>
  );
}