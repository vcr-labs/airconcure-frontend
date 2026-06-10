import { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useAuthStore } from '@/src/stores/authStore';
import { useBookingStore } from '@/src/stores/bookingStore';
import { useServiceStore } from '@/src/stores/serviceStore';
import { mockProviders } from '@/src/data/mock';
import { BookingCard, EmptyState, ScreenHeader } from '@/src/components';
import { colors, spacing, typography } from '@/src/constants/theme';
import { BookingStatus } from '@/src/types';

const STATUS_ORDER: BookingStatus[] = ['in_progress', 'pending', 'confirmed', 'completed', 'cancelled'];

export default function ClientBookingsScreen() {
  const user = useAuthStore((s) => s.user);
  const bookings = useBookingStore((s) => s.bookings);
  const services = useServiceStore((s) => s.services);

  const clientBookings = useMemo(() => {
    if (!user) return [];
    return bookings
      .filter((b) => b.clientId === user.id)
      .sort((a, b) => {
        const statusDiff = STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status);
        if (statusDiff !== 0) return statusDiff;
        return new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime();
      });
  }, [bookings, user]);

  const grouped = useMemo(() => {
    const groups: Record<string, typeof clientBookings> = {};
    for (const status of STATUS_ORDER) {
      const items = clientBookings.filter((b) => b.status === status);
      if (items.length > 0) groups[status] = items;
    }
    return groups;
  }, [clientBookings]);

  if (clientBookings.length === 0) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="My Bookings" />
        <EmptyState
          icon="calendar-outline"
          title="No bookings yet"
          message="Browse providers and book your first aircon cleaning service."
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="My Bookings" subtitle={`${clientBookings.length} booking(s)`} />
      <FlatList
        data={Object.entries(grouped)}
        keyExtractor={([status]) => status}
        renderItem={({ item: [status, items] }) => (
          <View style={styles.group}>
            <Text style={styles.groupTitle}>{status.replace('_', ' ').toUpperCase()}</Text>
            {items.map((booking) => {
              const service = services.find((s) => s.id === booking.serviceId);
              const provider = mockProviders.find((p) => p.id === booking.providerId);
              return (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  serviceName={service?.name ?? 'Service'}
                  otherPartyName={provider?.name ?? 'Provider'}
                />
              );
            })}
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  list: { paddingBottom: spacing.xl },
  group: { marginBottom: spacing.lg },
  groupTitle: { ...typography.caption, color: colors.textMuted, fontWeight: '700', marginBottom: spacing.sm, letterSpacing: 1 },
});
