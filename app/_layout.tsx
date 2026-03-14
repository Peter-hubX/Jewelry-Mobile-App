// app/_layout.tsx
import { useEffect } from 'react';
import { I18nManager } from 'react-native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

// ── QueryClient ───────────────────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:   60_000,
      gcTime:      24 * 60 * 60 * 1000, // keep in cache 24h (v5: gcTime replaces cacheTime)
      retry:       2,
      networkMode: 'offlineFirst',       // serve cache when offline, skip immediate error
    },
  },
});

// ── AsyncStorage Persister ────────────────────────────────────────────────────
// Saves query cache to device storage → instant load on next open, works offline.
const asyncStoragePersister = createAsyncStoragePersister({
  storage:      AsyncStorage,
  key:          'michiel-query-cache',
  throttleTime: 1_000, // write to storage max once/sec
});

// ─────────────────────────────────────────────────────────────────────────────
export default function RootLayout() {
  if (!I18nManager.isRTL) {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
  }

  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => { if (error) throw error; }, [error]);
  useEffect(() => { if (loaded) SplashScreen.hideAsync(); }, [loaded]);

  if (!loaded) return null;

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: asyncStoragePersister,
        maxAge:    24 * 60 * 60 * 1000,
        buster:    '1', // bump to invalidate old cache on app update
      }}
    >
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="product/[id]"
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
      </Stack>
    </PersistQueryClientProvider>
  );
}
