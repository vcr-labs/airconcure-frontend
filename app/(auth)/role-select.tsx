import { useEffect } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { isProviderApp } from '@/src/constants/appVariant';
import { colors, spacing, typography, borderRadius, shadows } from '@/src/constants/theme';

export default function RoleSelectScreen() {
  const router = useRouter();

  useEffect(() => {
    if (isProviderApp) {
      router.replace('/(auth)/login');
    }
  }, []);

  const handleSelectClient = () => {
    router.push('/(auth)/login');
  };

  if (isProviderApp) {
    return null;
  }

  return (
    <LinearGradient colors={[colors.background, colors.primaryLight]} style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="snow" size={48} color={colors.primary} />
        <Text style={styles.title}>Welcome to AirConCure</Text>
        <Text style={styles.subtitle}>Book trusted aircon cleaning professionals near you.</Text>
      </View>

      <View style={styles.cards}>
        <Pressable onPress={handleSelectClient} style={styles.cardWrapper}>
          <View style={styles.card}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="home" size={32} color={colors.primary} />
            </View>
            <Text style={styles.cardTitle}>Get Started</Text>
            <Text style={styles.cardDesc}>
              Find and book trusted aircon cleaning professionals near you.
            </Text>
          </View>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  title: { ...typography.h1, color: colors.text, marginTop: spacing.md, textAlign: 'center' },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.sm, textAlign: 'center' },
  cards: { gap: spacing.md },
  cardWrapper: { ...shadows.md },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: { ...typography.h2, color: colors.text },
  cardDesc: { ...typography.bodySmall, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm },
});
