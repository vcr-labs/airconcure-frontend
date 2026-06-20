import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useJobRequestStore } from '@/src/stores/jobRequestStore';
import { ScreenHeader, ServiceCategoryCard } from '@/src/components';
import { colors, spacing } from '@/src/constants/theme';
import { ServiceCategory } from '@/src/types';

const SERVICE_OPTIONS: ServiceCategory[] = ['deep_clean', 'maintenance', 'repair'];

export default function SelectServiceScreen() {
  const router = useRouter();
  const selectionMode = useJobRequestStore((s) => s.selectionMode);
  const setCategory = useJobRequestStore((s) => s.setCategory);

  if (!selectionMode) {
    router.replace('/(client)');
    return null;
  }

  const subtitle =
    selectionMode === 'auto'
      ? "We'll match you with the best available cleaner"
      : 'Choose your preferred provider next';

  const handleSelectCategory = (category: ServiceCategory) => {
    setCategory(category);
    router.push('./post-job');
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="What do you need?" subtitle={subtitle} />

      {SERVICE_OPTIONS.map((category) => (
        <ServiceCategoryCard
          key={category}
          category={category}
          onPress={() => handleSelectCategory(category)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
});
