import { useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/src/stores/authStore';
import { clientOnboardingSlides, providerOnboardingSlides } from '@/src/constants/onboarding';
import { Button } from '@/src/components';
import { colors, spacing, typography } from '@/src/constants/theme';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const role = useAuthStore((s) => s.role);
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);
  const [step, setStep] = useState(0);

  const slides = role === 'provider' ? providerOnboardingSlides : clientOnboardingSlides;
  const current = slides[step];
  const isLast = step === slides.length - 1;

  const handleNext = async () => {
    if (isLast) {
      await completeOnboarding();
      if (role === 'provider') {
        router.replace('/(provider)');
      } else {
        router.replace('/(client)');
      }
    } else {
      setStep(step + 1);
    }
  };

  return (
    <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name={current.icon as keyof typeof Ionicons.glyphMap} size={48} color={colors.primary} />
        </View>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.description}>{current.description}</Text>
      </View>

      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.footer}>
        <Button
          title={isLast ? 'Get Started' : 'Next'}
          onPress={handleNext}
          variant="outline"
          style={styles.button}
        />
        {!isLast && (
          <Button
            title="Skip"
            onPress={async () => {
              await completeOnboarding();
              router.replace(role === 'provider' ? '/(provider)' : '/(client)');
            }}
            variant="outline"
            style={styles.skipButton}
          />
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, justifyContent: 'space-between' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: { ...typography.h1, color: colors.white, textAlign: 'center', marginBottom: spacing.md },
  description: { ...typography.body, color: 'rgba(255,255,255,0.9)', textAlign: 'center', lineHeight: 24 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: spacing.lg },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.4)' },
  dotActive: { backgroundColor: colors.white, width: 24 },
  footer: { gap: spacing.sm, paddingBottom: spacing.lg },
  button: { backgroundColor: colors.white, borderColor: colors.white },
  skipButton: { backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,0.8)' },
});
