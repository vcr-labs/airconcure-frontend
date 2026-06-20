import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/src/stores/authStore';
import { colors, spacing, typography, borderRadius, shadows } from '@/src/constants/theme';
import { UserRole } from '@/src/types';

export default function RoleSelectScreen() {
  const router = useRouter();
  const setSelectedRole = useAuthStore((s) => s.setSelectedRole);

  const handleSelect = (role: UserRole) => {
    setSelectedRole(role);
    router.push('/(auth)/login');
  };

  return (
    <LinearGradient colors={[colors.background, colors.primaryLight]} style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="snow" size={48} color={colors.primary} />
        <Text style={styles.title}>Welcome to AirConCure</Text>
        <Text style={styles.subtitle}>How would you like to use the app?</Text>
      </View>

      <View style={styles.cards}>
        <Pressable onPress={() => handleSelect('client')} style={styles.cardWrapper}>
          <View style={styles.card}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="home" size={32} color={colors.primary} />
            </View>
            <Text style={styles.cardTitle}>I need cleaning</Text>
            <Text style={styles.cardDesc}>
              Find and book trusted aircon cleaning professionals near you.
            </Text>
          </View>
        </Pressable>

        <Pressable onPress={() => handleSelect('provider')} style={styles.cardWrapper}>
          <View style={styles.card}>
            <View style={[styles.iconCircle, { backgroundColor: '#DBEAFE' }]}>
              <Ionicons name="construct" size={32} color={colors.secondary} />
            </View>
            <Text style={styles.cardTitle}>I offer services</Text>
            <Text style={styles.cardDesc}>
              Accept bookings, manage your schedule, and grow your business.
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
