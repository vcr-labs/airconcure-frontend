import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';
import { useAuthStore } from '@/src/stores/authStore';
import { useBookingStore } from '@/src/stores/bookingStore';
import { useServiceStore } from '@/src/stores/serviceStore';
import { useAuthRedirect } from '@/src/hooks/useAuthRedirect';
import { colors } from '@/src/constants/theme';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const hydrate = useAuthStore((s) => s.hydrate);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const initializeBookings = useBookingStore((s) => s.initialize);
  const initializeServices = useServiceStore((s) => s.initialize);

  useAuthRedirect();

  useEffect(() => {
    async function prepare() {
      await hydrate();
      initializeBookings();
      initializeServices();
      await SplashScreen.hideAsync();
    }
    prepare();
  }, []);

  if (!isHydrated) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(client)" />
        <Stack.Screen name="(provider)" />
      </Stack>
    </SafeAreaProvider>
  );
}
