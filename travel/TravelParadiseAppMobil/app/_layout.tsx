import { NativeBaseProvider, extendTheme } from 'native-base';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font'; 

const theme = extendTheme({
  colors: {
    primary: {
      500: '#007bff', 
    },
  },
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!fontsLoaded && !fontError) {
    return null; 
  }

  return (
    <NativeBaseProvider theme={theme}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="(tabs)/travels" options={{ headerShown: false }} />
        <Stack.Screen name="travels/[id]/book" options={{ title: 'Réserver' }} />
      </Stack>
    </NativeBaseProvider>
  );
}





























