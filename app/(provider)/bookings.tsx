import { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { format, isSameDay } from 'date-fns';
import { useAuthStore } from '@/src/stores/authStore';
import { useBookingStore } from '@/src/stores/bookingStore';
import { useServiceStore } from '@/src/stores/serviceStore';
import { mockClients } from '@/src/data/mock';
import {
  BookingCalendar,
  EmptyState,
  ProviderJobRequestCard,
  ScreenHeader,
  ViewToggle,
} from '@/src/components';
import { colors, spacing, typography } from '@/src/constants/theme';

type ViewMode = 'calendar' | 'list';

const VIEW_OPTIONS: { key: ViewMode; label: string }[] = [
  { key: 'calendar', label: 'Calendar' },
  { key: 'list', label: 'List' },
];

export default function ProviderBookingsScreen() {
  const user = useAuthStore((s) => s.user);
  const bookings = useBookingStore((s) => s.bookings);
  const updateStatus = useBookingStore((s) => s.updateStatus);
  const services = useServiceStore((s) => s.services);

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const providerBookings = useMemo(
    () =>
      bookings
        .filter((b) => b.providerId === user?.id)
        .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()),
    [bookings, user]
  );

  const selectedDayBookings = useMemo(
    () =>
      providerBookings.filter((b) =>
        isSameDay(new Date(b.scheduledAt), selectedDate)
      ),
    [providerBookings, selectedDate]
  );

  const renderJobCard = (booking: (typeof providerBookings)[number]) => {
    const service = services.find((s) => s.id === booking.serviceId);
    const client = mockClients.find((c) => c.id === booking.clientId);
    return (
      <ProviderJobRequestCard
        key={booking.id}
        booking={booking}
        serviceName={service?.name ?? 'Service'}
        clientName={client?.name ?? 'Client'}
        onUpdateStatus={updateStatus}
      />
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Job Requests"
        subtitle={providerBookings.length > 0 ? `${providerBookings.length} total` : undefined}
      />
      <ViewToggle options={VIEW_OPTIONS} value={viewMode} onChange={setViewMode} />

      {viewMode === 'list' ? (
        providerBookings.length === 0 ? (
          <EmptyState
            icon="calendar-outline"
            title="No job requests yet"
            message="New job requests from clients will appear here."
          />
        ) : (
          <FlatList
            data={providerBookings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderJobCard(item)}
            contentContainerStyle={styles.list}
          />
        )
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          <BookingCalendar
            bookings={providerBookings}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
          <Text style={styles.dayTitle}>{format(selectedDate, 'EEE, MMM d, yyyy')}</Text>
          {selectedDayBookings.length === 0 ? (
            <Text style={styles.emptyDay}>No jobs on this date.</Text>
          ) : (
            selectedDayBookings.map((b) => renderJobCard(b))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  list: { paddingBottom: spacing.xl },
  dayTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.sm },
  emptyDay: { ...typography.bodySmall, color: colors.textMuted, fontStyle: 'italic' },
});
