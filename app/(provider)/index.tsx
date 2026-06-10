import { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { isToday } from 'date-fns';
import { useAuthStore } from '@/src/stores/authStore';
import { useBookingStore } from '@/src/stores/bookingStore';
import { useServiceStore } from '@/src/stores/serviceStore';
import { mockClients } from '@/src/data/mock';
import { BookingCard, Card, ScreenHeader } from '@/src/components';
import { colors, spacing, typography } from '@/src/constants/theme';

export default function ProviderDashboardScreen() {
  const user = useAuthStore((s) => s.user);
  const bookings = useBookingStore((s) => s.bookings);
  const services = useServiceStore((s) => s.services);

  const providerBookings = useMemo(
    () => bookings.filter((b) => b.providerId === user?.id),
    [bookings, user]
  );

  const stats = useMemo(() => ({
    pending: providerBookings.filter((b) => b.status === 'pending').length,
    today: providerBookings.filter(
      (b) => isToday(new Date(b.scheduledAt)) && b.status !== 'cancelled'
    ).length,
    completed: providerBookings.filter((b) => b.status === 'completed').length,
  }), [providerBookings]);

  const upcoming = useMemo(
    () =>
      providerBookings
        .filter((b) => ['pending', 'confirmed', 'in_progress'].includes(b.status))
        .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
        .slice(0, 5),
    [providerBookings]
  );

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={`Hello, ${user?.name?.split(' ')[0] ?? 'Provider'}`}
        subtitle="Here's your business overview"
      />

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{stats.pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{stats.today}</Text>
          <Text style={styles.statLabel}>Today</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </Card>
      </View>

      <Text style={styles.sectionTitle}>Upcoming Bookings</Text>
      <FlatList
        data={upcoming}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const service = services.find((s) => s.id === item.serviceId);
          const client = mockClients.find((c) => c.id === item.clientId);
          return (
            <BookingCard
              booking={item}
              serviceName={service?.name ?? 'Service'}
              otherPartyName={client?.name ?? 'Client'}
            />
          );
        }}
        ListEmptyComponent={
          <Card>
            <Text style={styles.emptyText}>No upcoming bookings</Text>
          </Card>
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
  statValue: { ...typography.h1, color: colors.primary, fontSize: 28 },
  statLabel: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
  sectionTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.sm },
  list: { paddingBottom: spacing.xl },
  emptyText: { ...typography.bodySmall, color: colors.textSecondary, textAlign: 'center' },
});
