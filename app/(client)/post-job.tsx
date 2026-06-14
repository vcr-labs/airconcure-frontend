import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { format, addDays } from 'date-fns';
import { useJobRequestStore } from '@/src/stores/jobRequestStore';
import { Button, Input } from '@/src/components';
import { getCategoryLabel } from '@/src/constants/serviceTypes';
import { colors, spacing, typography } from '@/src/constants/theme';

interface PostJobForm {
  address: string;
  notes: string;
}

const DATE_OPTIONS = [1, 2, 3, 5, 7].map((d) => addDays(new Date(), d));
const TIME_SLOTS = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

export default function PostJobScreen() {
  const router = useRouter();
  const draft = useJobRequestStore((s) => s.draft);
  const setDetails = useJobRequestStore((s) => s.setDetails);

  const [selectedDate, setSelectedDate] = useState(DATE_OPTIONS[0]);
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[0]);

  const { control, handleSubmit, formState: { errors } } = useForm<PostJobForm>({
    defaultValues: { address: draft.address ?? '', notes: draft.notes ?? '' },
  });

  if (!draft.category) {
    router.replace('/(client)');
    return null;
  }

  const onSubmit = (data: PostJobForm) => {
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const scheduled = new Date(selectedDate);
    scheduled.setHours(hours, minutes, 0, 0);

    setDetails({
      address: data.address,
      notes: data.notes || undefined,
      scheduledAt: scheduled.toISOString(),
    });

    router.push('./choose-provider');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.heading}>Post a Job</Text>
      <Text style={styles.subheading}>{getCategoryLabel(draft.category)}</Text>

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
          <Input
            label="Service Address"
            placeholder="Enter your address"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.address?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="notes"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Notes (optional)"
            placeholder="e.g. 2 units, gate code..."
            multiline
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={{ minHeight: 80, textAlignVertical: 'top' }}
          />
        )}
      />

      <Button title="Find Providers" onPress={handleSubmit(onSubmit)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  heading: { ...typography.h2, color: colors.text },
  subheading: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.lg },
  label: { ...typography.label, color: colors.text, marginBottom: spacing.sm, marginTop: spacing.md },
  row: { marginBottom: spacing.sm },
  chipBtn: { marginRight: spacing.sm, paddingHorizontal: spacing.md, minHeight: 40 },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  timeBtn: { paddingHorizontal: spacing.md, minHeight: 40, flex: 0 },
});
