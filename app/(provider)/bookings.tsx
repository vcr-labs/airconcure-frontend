import { useMemo } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { useAuthStore } from '@/src/stores/authStore';
import { useBookingStore } from '@/src/stores/bookingStore';
import { useServiceStore } from '@/src/stores/serviceStore';
import { mockClients } from '@/src/data/mock';
import { Button, EmptyState, Card, ScreenHeader, StatusBadge } from '@/src/components';
import { colors, spacing, typography } from '@/src/constants/theme';
import { Booking, BookingStatus } from '@/src/types';

export default function ProviderBookingsScreen() {
  const user = useAuthStore((s) => s.user);
  const bookings = useBookingStore((s) => s.bookings);
  const updateStatus = useBookingStore((s) => s.updateStatus);
  const services = useServiceStore((s) => s.services);

  const providerBookings = useMemo(
    () =>
      bookings
        .filter((b) => b.providerId === user?.id)
        .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()),
    [bookings, user]
  );

  const handleAction = (booking: Booking, action: string, newStatus: BookingStatus) => {
    Alert.alert(action, `Are you sure you want to ${action.toLowerCase()} this booking?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: () => updateStatus(booking.id, newStatus) },
    ]);
  };

  const renderActions = (booking: Booking) => {
    switch (booking.status) {
      case 'pending':
        return (
          <View style={styles.actions}>
            <Button title="Accept" onPress={() => handleAction(booking, 'Accept', 'confirmed')} style={styles.actionBtn} />
            <Button title="Decline" onPress={() => handleAction(booking, 'Decline', 'cancelled')} variant="danger" style={styles.actionBtn} />
          </View>
        );
      case 'confirmed':
        return (
          <Button title="Start Job" onPress={() => updateStatus(booking.id, 'in_progress')} style={styles.fullBtn} />
        );
      case 'in_progress':
        return (
          <Button title="Mark Complete" onPress={() => handleAction(booking, 'Complete', 'completed')} style={styles.fullBtn} />
        );
      default:
        return null;
    }
  };

  if (providerBookings.length === 0) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Job Requests" />
        <EmptyState icon="calendar-outline" title="No job requests yet" message="New job requests from clients will appear here." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Job Requests" subtitle={`${providerBookings.length} total`} />
      <FlatList
        data={providerBookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const service = services.find((s) => s.id === item.serviceId);
          const client = mockClients.find((c) => c.id === item.clientId);
          return (
            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.serviceName}>{service?.name ?? 'Service'}</Text>
                <StatusBadge status={item.status} />
              </View>
              <Text style={styles.clientName}>{client?.name ?? 'Client'}</Text>
              <Text style={styles.address}>{item.address}</Text>
              {item.notes && <Text style={styles.notes}>Note: {item.notes}</Text>}
              <Text style={styles.price}>₱{item.totalPrice.toLocaleString()}</Text>
              {renderActions(item)}
            </Card>
          );
        }}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  list: { paddingBottom: spacing.xl },
  card: { marginBottom: spacing.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  serviceName: { ...typography.h3, color: colors.text, flex: 1 },
  clientName: { ...typography.bodySmall, color: colors.textSecondary },
  address: { ...typography.bodySmall, color: colors.text, marginTop: 4 },
  notes: { ...typography.caption, color: colors.textMuted, marginTop: 4, fontStyle: 'italic' },
  price: { ...typography.label, color: colors.primary, marginTop: spacing.sm, marginBottom: spacing.sm },
  actions: { flexDirection: 'row', gap: spacing.sm },
  actionBtn: { flex: 1 },
  fullBtn: { marginTop: spacing.xs },
});
