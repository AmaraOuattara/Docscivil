import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { ThemeProvider } from '../src/providers/ThemeProvider';
import { initI18n } from '../src/i18n/i18n';

export default function RootLayout() {
  useEffect(() => {
    initI18n();
  }, []);

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}