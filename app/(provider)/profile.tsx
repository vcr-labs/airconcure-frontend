import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { useAuthStore } from '@/src/stores/authStore';
import { defaultProvider } from '@/src/data/mock';
import { getAuthEntryRoute } from '@/src/constants/appVariant';
import { Avatar, Button, Card, Input, ScreenHeader } from '@/src/components';
import { colors, spacing, typography } from '@/src/constants/theme';

interface ProfileForm {
  name: string;
  email: string;
  phone: string;
  serviceArea: string;
  bio: string;
}

export default function ProviderProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const logout = useAuthStore((s) => s.logout);
  const [saving, setSaving] = useState(false);

  const providerData = user?.role === 'provider' ? { ...defaultProvider, ...user } : defaultProvider;

  const { control, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      serviceArea: providerData.serviceArea,
      bio: providerData.bio,
    },
  });

  const onSave = async (data: ProfileForm) => {
    setSaving(true);
    await updateProfile({ name: data.name, email: data.email, phone: data.phone });
    setSaving(false);
    Alert.alert('Saved', 'Profile updated successfully.');
  };

  const handleLogout = async () => {
    await logout();
    router.replace(getAuthEntryRoute());
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader title="Business Profile" />

      <Card style={styles.avatarCard}>
        <Avatar name={user?.name ?? 'Provider'} uri={user?.avatar} size={80} />
        <Text style={styles.roleBadge}>Provider Account</Text>
        <Text style={styles.rating}>★ {providerData.rating} ({providerData.reviewCount} reviews)</Text>
      </Card>

      <Controller control={control} name="name" rules={{ required: 'Name is required' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Business Name" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.name?.message} />
        )}
      />

      <Controller control={control} name="email" rules={{ required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Email" keyboardType="email-address" autoCapitalize="none" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.email?.message} />
        )}
      />

      <Controller control={control} name="phone" rules={{ required: 'Phone is required' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Phone" keyboardType="phone-pad" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.phone?.message} />
        )}
      />

      <Controller control={control} name="serviceArea"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Service Area" placeholder="e.g. Metro Manila" onBlur={onBlur} onChangeText={onChange} value={value} />
        )}
      />

      <Controller control={control} name="bio"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Bio" placeholder="Tell clients about your business..." multiline onBlur={onBlur} onChangeText={onChange} value={value} style={{ minHeight: 80, textAlignVertical: 'top' }} />
        )}
      />

      <Button title="Save Changes" onPress={handleSubmit(onSave)} loading={saving} style={styles.btn} />
      <Button title="Log Out" onPress={handleLogout} variant="danger" style={styles.btn} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  avatarCard: { alignItems: 'center', marginBottom: spacing.lg },
  roleBadge: { ...typography.bodySmall, color: colors.secondary, fontWeight: '600', marginTop: spacing.sm },
  rating: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 4 },
  btn: { marginTop: spacing.sm },
});
