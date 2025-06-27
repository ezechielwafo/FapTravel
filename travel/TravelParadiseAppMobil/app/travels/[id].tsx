export const unstable_settings = {
  initialRouteName: 'travel-details',
};

export default function TravelLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: 'Détails du Voyage', // Titre par défaut pour les écrans dans ce layout
        headerBackTitleVisible: false, // Cache le texte du bouton retour sur iOS
      }}>
      <Stack.Screen
        name="travel-details" // Le nom du fichier (sans l'extension)
        options={{
          title: 'Informations Voyage', // Titre spécifique pour cet écran
          // Tu peux ajouter d'autres options ici, comme un bouton right
          // headerRight: () => <Button title="Réserver" onPress={() => {}} />,
        }}
      />
      {/* Autres écrans liés à un voyage spécifique */}
    </Stack>
  );
}