import { Pressable, StyleSheet, Text, View } from 'react-native';
import { format } from 'date-fns';
import { Booking } from '@/src/types';
import { colors, spacing, typography } from '@/src/constants/theme';
import { StatusBadge } from './StatusBadge';
import { Card } from './Card';

interface BookingCardProps {
  booking: Booking;
  serviceName: string;
  otherPartyName: string;
  statusHint?: string;
  onPress?: () => void;
}

export function BookingCard({
  booking,
  serviceName,
  otherPartyName,
  statusHint,
  onPress,
}: BookingCardProps) {
  const content = (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.service}>{serviceName}</Text>
        <StatusBadge status={booking.status} />
      </View>
      <Text style={styles.party}>{otherPartyName}</Text>
      {statusHint && <Text style={styles.hint}>{statusHint}</Text>}
      <Text style={styles.date}>
        {format(new Date(booking.scheduledAt), 'EEE, MMM d, yyyy · h:mm a')}
      </Text>
      <Text style={styles.address} numberOfLines={1}>
        {booking.address}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.price}>₱{booking.totalPrice.toLocaleString()}</Text>
      </View>
    </Card>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }
  return content;
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.md },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  service: { ...typography.h3, color: colors.text, flex: 1, marginRight: spacing.sm },
  party: { ...typography.bodySmall, color: colors.textSecondary },
  hint: { ...typography.caption, color: colors.textMuted, fontStyle: 'italic', marginTop: 2 },
  date: { ...typography.bodySmall, color: colors.text, marginTop: 4, fontWeight: '500' },
  address: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  footer: { marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  price: { ...typography.label, color: colors.primary },
});
