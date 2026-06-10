import { StyleSheet, Text, View } from 'react-native';
import { BookingStatus } from '@/src/types';
import { borderRadius, typography } from '@/src/constants/theme';

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; bg: string; text: string }
> = {
  pending: { label: 'Pending', bg: '#FEF3C7', text: '#D97706' },
  confirmed: { label: 'Confirmed', bg: '#DBEAFE', text: '#2563EB' },
  in_progress: { label: 'In Progress', bg: '#E0E7FF', text: '#4F46E5' },
  completed: { label: 'Completed', bg: '#DCFCE7', text: '#16A34A' },
  cancelled: { label: 'Cancelled', bg: '#FEE2E2', text: '#DC2626' },
};

interface StatusBadgeProps {
  status: BookingStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.text }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  text: { ...typography.caption, fontWeight: '600' },
});
