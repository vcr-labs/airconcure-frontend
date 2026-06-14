import { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { mockProviders } from '@/src/data/mock';
import { useJobRequestStore } from '@/src/stores/jobRequestStore';
import { useServiceStore } from '@/src/stores/serviceStore';
import { EmptyState, ProviderCard, ScreenHeader } from '@/src/components';
import { getCategoryLabel } from '@/src/constants/serviceTypes';
import { getMatchingProviders } from '@/src/utils/matching';
import { colors, spacing } from '@/src/constants/theme';

export default function ChooseProviderScreen() {
  const router = useRouter();
  const draft = useJobRequestStore((s) => s.draft);
  const setProvider = useJobRequestStore((s) => s.setProvider);
  const services = useServiceStore((s) => s.services);

  const matchedProviders = useMemo(() => {
    if (!draft.category) return [];
    return getMatchingProviders(draft.category, mockProviders, services);
  }, [draft.category, services]);

  if (!draft.category || !draft.address || !draft.scheduledAt) {
    router.replace('/(client)');
    return null;
  }

  const handleSelectProvider = (providerId: string, serviceId: string) => {
    setProvider(providerId, serviceId);
    router.push('./confirm-booking');
  };

  if (matchedProviders.length === 0) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Choose Provider" />
        <EmptyState
          icon="people-outline"
          title="No providers available"
          message={`No providers found for ${getCategoryLabel(draft.category)}. Try a different service.`}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Choose Provider"
        subtitle={`${matchedProviders.length} provider(s) for ${getCategoryLabel(draft.category)}`}
      />

      <FlatList
        data={matchedProviders}
        keyExtractor={(item) => item.provider.id}
        renderItem={({ item }) => {
          const primaryService = item.matchingServices[0];
          return (
            <ProviderCard
              provider={item.provider}
              startingPrice={item.startingPrice}
              matchedServiceName={primaryService.name}
              onPress={() => handleSelectProvider(item.provider.id, primaryService.id)}
            />
          );
        }}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  list: { paddingBottom: spacing.xl },
});
