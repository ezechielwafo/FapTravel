import React from 'react';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { Stack } from 'expo-router'; // Assure-toi que c'est bien ton système de navigation

// --- Configuration du Thème (Optionnel mais recommandé) ---
const theme = extendTheme({
  colors: {
    // Ajoute tes couleurs personnalisées ici
    primary: {
      500: '#007bff', // Exemple : un bleu
    },
    secondary: {
      500: '#6c757d', // Exemple : un gris
    },
    // ... autres couleurs
  },
  // Tu peux aussi configurer les polices, les espacements, etc.
  // fonts: {
  //   heading: 'Inter',
  //   body: 'Inter',
  //   mono: 'Inconsolata',
  // },
});
// --- Fin Configuration du Thème ---


// Si tu utilises expo-router, ton fichier App.js doit juste rendre le composant racine de tes routes.
// Le composant <Stack /> (ou autre de expo-router) est généralement défini dans un fichier _layout.js
// à la racine du dossier app/.

// Si tu n'utilises pas expo-router, tu auras un composant <NavigationContainer> ici.

export default function App() {
  return (
    // Enveloppe toute ton application avec NativeBaseProvider
    <NativeBaseProvider theme={theme}>
      {/* Ici, tu rends le composant racine de tes routes expo-router */}
      {/* Si tu utilises expo-router, c'est souvent un composant qui gère le layout global */}
      {/* Par exemple, si tu as un dossier app/_layout.js qui contient <Stack /> */}
      {/* Tu peux simplement appeler ce layout ici, ou si App.js est ton point d'entrée principal pour les routes : */}

      {/* Si ton dossier app/ contient directement tes routes et que _layout.js n'existe pas encore */}
      {/* Tu peux mettre la structure de base ici : */}
      <Stack
        screenOptions={{
          // Options globales pour toutes les routes si nécessaire
          headerStyle: { backgroundColor: theme.colors.primary[500] }, // Utilise la couleur du thème
          headerTintColor: '#fff', // Couleur du texte de l'en-tête
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />

      {/* Si tu as déjà un fichier app/_layout.js qui contient la structure de tes routes, */}
      {/* tu n'as peut-être rien à mettre ici, ou juste un appel à ce layout. */}
      {/* Par exemple, si ton app/_layout.js contient : */}
      {/* export default function RootLayout() { return <Stack />; } */}
      {/* Alors tu n'as rien à ajouter ici, car le rendu de <Stack /> est déjà géré par app/_layout.js */}

    </NativeBaseProvider>
  );
}