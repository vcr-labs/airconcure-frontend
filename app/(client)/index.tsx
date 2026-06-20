import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useJobRequestStore } from '@/src/stores/jobRequestStore';
import { Button, ScreenHeader } from '@/src/components';
import { colors, spacing } from '@/src/constants/theme';

export default function ClientHomeScreen() {
  const router = useRouter();
  const setSelectionMode = useJobRequestStore((s) => s.setSelectionMode);

  const handleSelectPath = (mode: 'auto' | 'manual') => {
    setSelectionMode(mode);
    router.push('./select-service');
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Book a cleaning"
        subtitle="How would you like to find your cleaner?"
      />

      <View style={styles.actions}>
        <Button
          title="Find me a cleaner"
          onPress={() => handleSelectPath('auto')}
          style={styles.btn}
        />
        <Button
          title="I will select a provider"
          onPress={() => handleSelectPath('manual')}
          variant="outline"
          style={styles.btn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  actions: { gap: spacing.md, marginTop: spacing.sm },
  btn: { width: '100%' },
});
