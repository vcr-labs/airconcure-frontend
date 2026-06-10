import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { format, addDays } from 'date-fns';
import { mockProviders } from '@/src/data/mock';
import { useAuthStore } from '@/src/stores/authStore';
import { useBookingStore } from '@/src/stores/bookingStore';
import { useServiceStore } from '@/src/stores/serviceStore';
import { Button, Input, ServiceCard } from '@/src/components';
import { colors, spacing, typography } from '@/src/constants/theme';

interface BookForm {
  address: string;
  notes: string;
}

const DATE_OPTIONS = [1, 2, 3, 5, 7].map((d) => addDays(new Date(), d));
const TIME_SLOTS = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

export default function BookServiceScreen() {
  const { providerId } = useLocalSearchParams<{ providerId: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const createBooking = useBookingStore((s) => s.createBooking);
  const services = useServiceStore((s) => s.services);

  const provider = mockProviders.find((p) => p.id === providerId);
  const providerServices = services.filter((s) => s.providerId === providerId);

  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    providerServices[0]?.id ?? null
  );
  const [selectedDate, setSelectedDate] = useState(DATE_OPTIONS[0]);
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[0]);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<BookForm>({
    defaultValues: { address: '', notes: '' },
  });

  const selectedService = providerServices.find((s) => s.id === selectedServiceId);

  const onSubmit = async (data: BookForm) => {
    if (!selectedService || !user) return;

    setLoading(true);
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const scheduled = new Date(selectedDate);
    scheduled.setHours(hours, minutes, 0, 0);

    createBooking({
      clientId: user.id,
      providerId: providerId!,
      serviceId: selectedService.id,
      scheduledAt: scheduled.toISOString(),
      address: data.address,
      notes: data.notes || undefined,
      totalPrice: selectedService.price,
    });

    setLoading(false);
    Alert.alert('Booking Confirmed', 'Your service has been booked successfully!', [
      { text: 'View Bookings', onPress: () => router.replace('/(client)/bookings') },
    ]);
  };

  if (!provider) {
    return (
      <View style={styles.center}>
        <Text>Provider not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.heading}>Book with {provider.name}</Text>

      <Text style={styles.label}>Select Service</Text>
      {providerServices.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          selected={selectedServiceId === service.id}
          onPress={() => setSelectedServiceId(service.id)}
        />
      ))}

      <Text style={styles.label}>Select Date</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
        {DATE_OPTIONS.map((date) => (
          <Button
            key={date.toISOString()}
            title={format(date, 'MMM d')}
            onPress={() => setSelectedDate(date)}
            variant={selectedDate === date ? 'primary' : 'outline'}
            style={styles.chipBtn}
          />
        ))}
      </ScrollView>

      <Text style={styles.label}>Select Time</Text>
      <View style={styles.timeGrid}>
        {TIME_SLOTS.map((time) => (
          <Button
            key={time}
            title={time}
            onPress={() => setSelectedTime(time)}
            variant={selectedTime === time ? 'primary' : 'outline'}
            style={styles.timeBtn}
          />
        ))}
      </View>

      <Controller
        control={control}
        name="address"
        rules={{ required: 'Address is required' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Service Address" placeholder="Enter your address" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.address?.message} />
        )}
      />

      <Controller
        control={control}
        name="notes"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Notes (optional)" placeholder="e.g. 2 units, gate code..." multiline onBlur={onBlur} onChangeText={onChange} value={value} style={{ minHeight: 80, textAlignVertical: 'top' }} />
        )}
      />

      {selectedService && (
        <View style={styles.summary}>
          <Text style={styles.summaryLabel}>Total</Text>
          <Text style={styles.summaryPrice}>₱{selectedService.price.toLocaleString()}</Text>
        </View>
      )}

      <Button title="Confirm Booking" onPress={handleSubmit(onSubmit)} loading={loading} disabled={!selectedServiceId} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  heading: { ...typography.h2, color: colors.text, marginBottom: spacing.lg },
  label: { ...typography.label, color: colors.text, marginBottom: spacing.sm, marginTop: spacing.md },
  row: { marginBottom: spacing.sm },
  chipBtn: { marginRight: spacing.sm, paddingHorizontal: spacing.md, minHeight: 40 },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  timeBtn: { paddingHorizontal: spacing.md, minHeight: 40, flex: 0 },
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
