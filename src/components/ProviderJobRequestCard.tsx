import { Alert, StyleSheet, Text, View } from 'react-native';
import { Booking, BookingStatus } from '@/src/types';
import { Button } from './Button';
import { Card } from './Card';
import { StatusBadge } from './StatusBadge';
import { colors, spacing, typography } from '@/src/constants/theme';

interface ProviderJobRequestCardProps {
  booking: Booking;
  serviceName: string;
  clientName: string;
  onUpdateStatus: (id: string, status: BookingStatus) => void;
}

export function ProviderJobRequestCard({
  booking,
  serviceName,
  clientName,
  onUpdateStatus,
}: ProviderJobRequestCardProps) {
  const handleAction = (action: string, newStatus: BookingStatus) => {
    Alert.alert(action, `Are you sure you want to ${action.toLowerCase()} this booking?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: () => onUpdateStatus(booking.id, newStatus) },
    ]);
  };

  const renderActions = () => {
    switch (booking.status) {
      case 'pending':
        return (
          <View style={styles.actions}>
            <Button
              title="Accept"
              onPress={() => handleAction('Accept', 'confirmed')}
              style={styles.actionBtn}
            />
            <Button
              title="Decline"
              onPress={() => handleAction('Decline', 'cancelled')}
              variant="danger"
              style={styles.actionBtn}
            />
          </View>
        );
      case 'confirmed':
        return (
          <Button
            title="Start Job"
            onPress={() => onUpdateStatus(booking.id, 'in_progress')}
            style={styles.fullBtn}
          />
        );
      case 'in_progress':
        return (
          <Button
            title="Mark Complete"
            onPress={() => handleAction('Complete', 'completed')}
            style={styles.fullBtn}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.serviceName}>{serviceName}</Text>
        <StatusBadge status={booking.status} />
      </View>
      <Text style={styles.clientName}>{clientName}</Text>
      <Text style={styles.address}>{booking.address}</Text>
      {booking.notes && <Text style={styles.notes}>Note: {booking.notes}</Text>}
      <Text style={styles.price}>₱{booking.totalPrice.toLocaleString()}</Text>
      {renderActions()}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.md },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  serviceName: { ...typography.h3, color: colors.text, flex: 1 },
  clientName: { ...typography.bodySmall, color: colors.textSecondary },
  address: { ...typography.bodySmall, color: colors.text, marginTop: 4 },
  notes: { ...typography.caption, color: colors.textMuted, marginTop: 4, fontStyle: 'italic' },
  price: { ...typography.label, color: colors.primary, marginTop: spacing.sm, marginBottom: spacing.sm },
  actions: { flexDirection: 'row', gap: spacing.sm },
  actionBtn: { flex: 1 },
  fullBtn: { marginTop: spacing.xs },
});
