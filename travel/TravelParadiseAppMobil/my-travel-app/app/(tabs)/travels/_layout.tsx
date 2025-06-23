import { Stack } from 'expo-router';

export default function TravelsLayout() {
  return (
    <Stack>
      {/* Tu peux définir des options communes pour toutes les routes dans ce dossier ici */}
      <Stack.Screen name="index" options={{ title: 'Nos Voyages' }} />
      <Stack.Screen name="[id]" options={{ title: 'Détails du Voyage' }} />
      {/* Si tu as un fichier explore.tsx, assure-toi qu'il exporte un composant par défaut */}
    </Stack>
  );
}
