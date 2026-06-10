import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { useAuthStore } from '@/src/stores/authStore';
import { Avatar, Button, Card, Input, ScreenHeader } from '@/src/components';
import { colors, spacing, typography } from '@/src/constants/theme';

interface ProfileForm {
  name: string;
  email: string;
  phone: string;
}

export default function ClientProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const logout = useAuthStore((s) => s.logout);
  const [saving, setSaving] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
    },
  });

  const onSave = async (data: ProfileForm) => {
    setSaving(true);
    await updateProfile(data);
    setSaving(false);
    Alert.alert('Saved', 'Profile updated successfully.');
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/role-select');
  };

  const handleSwitchRole = async () => {
    await logout();
    router.replace('/(auth)/role-select');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader title="Profile" />

      <Card style={styles.avatarCard}>
        <Avatar name={user?.name ?? 'User'} uri={user?.avatar} size={80} />
        <Text style={styles.roleBadge}>Client Account</Text>
      </Card>

      <Controller
        control={control}
        name="name"
        rules={{ required: 'Name is required' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Full Name" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.name?.message} />
        )}
      />

      <Controller
        control={control}
        name="email"
        rules={{
          required: 'Email is required',
          pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Email" keyboardType="email-address" autoCapitalize="none" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.email?.message} />
        )}
      />

      <Controller
        control={control}
        name="phone"
        rules={{ required: 'Phone is required' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Phone" keyboardType="phone-pad" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.phone?.message} />
        )}
      />

      <Button title="Save Changes" onPress={handleSubmit(onSave)} loading={saving} style={styles.btn} />
      <Button title="Switch Role" onPress={handleSwitchRole} variant="outline" style={styles.btn} />
      <Button title="Log Out" onPress={handleLogout} variant="danger" style={styles.btn} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  avatarCard: { alignItems: 'center', marginBottom: spacing.lg },
  roleBadge: { ...typography.bodySmall, color: colors.primary, fontWeight: '600', marginTop: spacing.sm },
  btn: { marginTop: spacing.sm },
});
