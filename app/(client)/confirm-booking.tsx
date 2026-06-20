import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { mockProviders } from '@/src/data/mock';
import { useAuthStore } from '@/src/stores/authStore';
import { useBookingStore } from '@/src/stores/bookingStore';
import { useJobRequestStore } from '@/src/stores/jobRequestStore';
import { useServiceStore } from '@/src/stores/serviceStore';
import { Avatar, Button, ServiceCard } from '@/src/components';
import { getCategoryLabel } from '@/src/constants/serviceTypes';
import { colors, spacing, typography } from '@/src/constants/theme';

export default function ConfirmBookingScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const draft = useJobRequestStore((s) => s.draft);
  const selectionMode = useJobRequestStore((s) => s.selectionMode);
  const reset = useJobRequestStore((s) => s.reset);
  const setProvider = useJobRequestStore((s) => s.setProvider);
  const createBooking = useBookingStore((s) => s.createBooking);
  const services = useServiceStore((s) => s.services);

  const [loading, setLoading] = useState(false);

  if (!draft.category || !draft.address || !draft.scheduledAt || !draft.providerId) {
    router.replace('/(client)');
    return null;
  }

  const provider = mockProviders.find((p) => p.id === draft.providerId);
  const matchingServices = services.filter(
    (s) => s.providerId === draft.providerId && s.category === draft.category
  );
  const selectedService = matchingServices.find((s) => s.id === draft.serviceId) ?? matchingServices[0];

  const handleServiceSelect = (serviceId: string) => {
    if (draft.providerId) {
      setProvider(draft.providerId, serviceId);
    }
  };

  const handleConfirm = async () => {
    if (!user || !selectedService || !draft.providerId) return;

    setLoading(true);
    createBooking({
      clientId: user.id,
      providerId: draft.providerId,
      serviceId: selectedService.id,
      scheduledAt: draft.scheduledAt!,
      address: draft.address!,
      notes: draft.notes,
      totalPrice: selectedService.price,
    });
    setLoading(false);
    reset();

    Alert.alert(
      'Request Sent',
      'Waiting for provider to accept your booking.',
      [{ text: 'View Bookings', onPress: () => router.replace('/(client)/bookings') }]
    );
  };

  if (!provider || !selectedService) {
    return (
      <View style={styles.center}>
        <Text>Provider or service not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Confirm Booking</Text>

      {selectionMode === 'auto' && (
        <Text style={styles.matchedLabel}>Matched cleaner for you</Text>
      )}

      <View style={styles.providerRow}>
        <Avatar name={provider.name} uri={provider.avatar} size={48} />
        <View style={styles.providerInfo}>
          <Text style={styles.providerName}>{provider.name}</Text>
          <Text style={styles.providerArea}>{provider.serviceArea}</Text>
        </View>
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.label}>Service Type</Text>
        <Text style={styles.value}>{getCategoryLabel(draft.category)}</Text>
      </View>

      {matchingServices.length > 1 && (
        <>
          <Text style={styles.label}>Select Service</Text>
          {matchingServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              selected={selectedService.id === service.id}
              onPress={() => handleServiceSelect(service.id)}
            />
          ))}
        </>
      )}

      {matchingServices.length === 1 && (
        <View style={styles.detailSection}>
          <Text style={styles.label}>Service</Text>
          <Text style={styles.value}>{selectedService.name}</Text>
        </View>
      )}

      <View style={styles.detailSection}>
        <Text style={styles.label}>Date & Time</Text>
        <Text style={styles.value}>
          {format(new Date(draft.scheduledAt), 'EEE, MMM d, yyyy · h:mm a')}
        </Text>
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.label}>Address</Text>
        <Text style={styles.value}>{draft.address}</Text>
      </View>

      {draft.notes && (
        <View style={styles.detailSection}>
          <Text style={styles.label}>Notes</Text>
          <Text style={styles.value}>{draft.notes}</Text>
        </View>
      )}

      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>Total</Text>
        <Text style={styles.summaryPrice}>₱{selectedService.price.toLocaleString()}</Text>
      </View>

      <Button title="Request Booking" onPress={handleConfirm} loading={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  heading: { ...typography.h2, color: colors.text, marginBottom: spacing.lg },
  matchedLabel: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.sm,
    marginTop: -spacing.sm,
  },
  providerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
  providerInfo: { flex: 1 },
  providerName: { ...typography.h3, color: colors.text },
  providerArea: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  detailSection: { marginBottom: spacing.md },
  label: { ...typography.label, color: colors.text, marginBottom: spacing.xs, marginTop: spacing.sm },
  value: { ...typography.bodySmall, color: colors.text },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    padding: spacing.md,
    borderRadius: 12,
    marginVertical: spacing.md,
  },
  summaryLabel: { ...typography.h3, color: colors.primaryDark },
  summaryPrice: { ...typography.h2, color: colors.primary },
});
