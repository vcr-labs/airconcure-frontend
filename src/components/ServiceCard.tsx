import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Service } from '@/src/types';
import { getCategoryLabel } from '@/src/constants/serviceTypes';
import { colors, spacing, typography } from '@/src/constants/theme';
import { Card } from './Card';

interface ServiceCardProps {
  service: Service;
  selected?: boolean;
  onPress?: () => void;
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ServiceCard({
  service,
  selected,
  onPress,
  showActions,
  onEdit,
  onDelete,
}: ServiceCardProps) {
  const content = (
    <Card style={[styles.card, selected && styles.selected]}>
      <View style={styles.header}>
        <Text style={styles.name}>{service.name}</Text>
        <Text style={styles.price}>₱{service.price.toLocaleString()}</Text>
      </View>
      <Text style={styles.category}>{getCategoryLabel(service.category)}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {service.description}
      </Text>
      <View style={styles.meta}>
        <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
        <Text style={styles.duration}>{service.durationMinutes} min</Text>
      </View>
      {showActions && (
        <View style={styles.actions}>
          <Pressable onPress={onEdit} style={styles.actionBtn}>
            <Ionicons name="pencil" size={18} color={colors.secondary} />
            <Text style={styles.actionText}>Edit</Text>
          </Pressable>
          <Pressable onPress={onDelete} style={styles.actionBtn}>
            <Ionicons name="trash" size={18} color={colors.error} />
            <Text style={[styles.actionText, { color: colors.error }]}>Delete</Text>
          </Pressable>
        </View>
      )}
    </Card>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }
  return content;
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.sm },
  selected: { borderWidth: 2, borderColor: colors.primary },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { ...typography.h3, color: colors.text, flex: 1 },
  price: { ...typography.label, color: colors.primary },
  category: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: '600',
    marginTop: 4,
  },
  description: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.sm },
  duration: { ...typography.caption, color: colors.textSecondary },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionText: { ...typography.bodySmall, color: colors.secondary, fontWeight: '600' },
});
