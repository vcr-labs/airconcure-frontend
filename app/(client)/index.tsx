import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useJobRequestStore } from '@/src/stores/jobRequestStore';
import { ScreenHeader, ServiceCategoryCard } from '@/src/components';
import { colors, spacing } from '@/src/constants/theme';
import { ServiceCategory } from '@/src/types';

const SERVICE_OPTIONS: ServiceCategory[] = ['deep_clean', 'maintenance', 'repair'];

export default function ClientHomeScreen() {
  const router = useRouter();
  const setCategory = useJobRequestStore((s) => s.setCategory);

  const handleSelectCategory = (category: ServiceCategory) => {
    setCategory(category);
    router.push('./post-job');
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="What do you need?"
        subtitle="Post a job and choose your provider"
      />

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
