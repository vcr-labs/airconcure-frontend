import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/src/stores/authStore';
import { getAppDisplayName, getAuthEntryRoute, getHomeRoute, getSplashSubtitle } from '@/src/constants/appVariant';
import { colors, typography } from '@/src/constants/theme';

export default function SplashScreen() {
  const router = useRouter();
  const { isHydrated, isAuthenticated, hasCompletedOnboarding } = useAuthStore();

  useEffect(() => {
    useAuthStore.getState().hydrate();
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.replace(getAuthEntryRoute());
      } else if (!hasCompletedOnboarding) {
        router.replace('/(auth)/onboarding');
      } else {
        router.replace(getHomeRoute());
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [isHydrated, isAuthenticated, hasCompletedOnboarding]);

  return (
    <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.container}>
      <View style={styles.logoContainer}>
        <Ionicons name="snow" size={64} color={colors.white} />
        <Text style={styles.title}>{getAppDisplayName()}</Text>
        <Text style={styles.subtitle}>{getSplashSubtitle()}</Text>
      </View>
      <ActivityIndicator size="large" color={colors.white} style={styles.loader} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoContainer: { alignItems: 'center' },
  title: { ...typography.h1, color: colors.white, marginTop: 16, fontSize: 36 },
  subtitle: { ...typography.bodySmall, color: 'rgba(255,255,255,0.85)', marginTop: 8 },
  loader: { position: 'absolute', bottom: 80 },
});
