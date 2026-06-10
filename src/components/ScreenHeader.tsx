import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '@/src/constants/theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
}

export function ScreenHeader({ title, subtitle }: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  title: { ...typography.h1, color: colors.text },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 4 },
});
