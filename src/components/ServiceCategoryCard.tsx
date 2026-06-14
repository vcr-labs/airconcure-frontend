import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ServiceCategory } from '@/src/types';
import { getCategoryLabel } from '@/src/constants/serviceTypes';
import { colors, spacing, typography } from '@/src/constants/theme';
import { Card } from './Card';

const CATEGORY_ICONS: Record<ServiceCategory, keyof typeof Ionicons.glyphMap> = {
  deep_clean: 'water-outline',
  maintenance: 'construct-outline',
  repair: 'build-outline',
};

const CATEGORY_DESCRIPTIONS: Record<ServiceCategory, string> = {
  deep_clean: 'Full chemical wash and deep sanitization',
  maintenance: 'Filter cleaning and performance check',
  repair: 'Diagnose and fix AC issues',
};

interface ServiceCategoryCardProps {
  category: ServiceCategory;
  onPress: () => void;
}

export function ServiceCategoryCard({ category, onPress }: ServiceCategoryCardProps) {
  return (
    <Pressable onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.iconContainer}>
          <Ionicons name={CATEGORY_ICONS[category]} size={28} color={colors.primary} />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{getCategoryLabel(category)}</Text>
          <Text style={styles.description}>{CATEGORY_DESCRIPTIONS[category]}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  name: { ...typography.h3, color: colors.text },
  description: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
});
