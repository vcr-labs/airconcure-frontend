import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { ServiceCategory } from '@/src/types';
import { SERVICE_CATEGORIES } from '@/src/constants/serviceTypes';
import { colors, borderRadius, spacing, typography } from '@/src/constants/theme';

interface FilterChipsProps {
  selected: ServiceCategory | 'all';
  onSelect: (category: ServiceCategory | 'all') => void;
}

export function FilterChips({ selected, onSelect }: FilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {SERVICE_CATEGORIES.map((cat) => {
        const isActive = selected === cat.key;
        return (
          <Pressable
            key={cat.key}
            onPress={() => onSelect(cat.key)}
            style={[styles.chip, isActive && styles.chipActive]}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
              {cat.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm, paddingVertical: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: '500' },
  chipTextActive: { color: colors.white },
});
