import { useState } from 'react';
import { StyleSheet, Text, View, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { useAuthStore } from '@/src/stores/authStore';
import { isProviderApp } from '@/src/constants/appVariant';
import { Button, Input } from '@/src/components';
import { colors, spacing, typography } from '@/src/constants/theme';

interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export default function RegisterScreen() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    defaultValues: { name: '', email: '', phone: '', password: '' },
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      await register(data.name, data.email, data.phone, data.password);
      router.replace('/(auth)/onboarding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>
          Create {isProviderApp ? 'Provider' : 'Client'} Account
        </Text>
        <Text style={styles.subheading}>Fill in your details to get started.</Text>

        <Controller
          control={control}
          name="name"
          rules={{ required: 'Name is required', minLength: { value: 2, message: 'At least 2 characters' } }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Full Name" placeholder="John Doe" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.name?.message} />
          )}
        />

        <Controller
          control={control}
          name="email"
          rules={{
            required: 'Email is required',
            pattern: { value: /\S+@\S+\.\S+/, message: 'Enter a valid email' },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Email" placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.email?.message} />
          )}
        />

        <Controller
          control={control}
          name="phone"
          rules={{ required: 'Phone is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Phone" placeholder="+63 9XX XXX XXXX" keyboardType="phone-pad" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.phone?.message} />
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{
            required: 'Password is required',
            minLength: { value: 6, message: 'At least 6 characters' },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Password" placeholder="••••••••" secureTextEntry onBlur={onBlur} onChangeText={onChange} value={value} error={errors.password?.message} />
          )}
        />

        <Button title="Create Account" onPress={handleSubmit(onSubmit)} loading={loading} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.link}>Sign In</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, flexGrow: 1 },
  heading: { ...typography.h2, color: colors.text, marginBottom: spacing.xs },
  subheading: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.lg },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
  footerText: { ...typography.bodySmall, color: colors.textSecondary },
  link: { ...typography.bodySmall, color: colors.primary, fontWeight: '600' },
});
