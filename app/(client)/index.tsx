import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { mockProviders } from '@/src/data/mock';
import { useServiceStore } from '@/src/stores/serviceStore';
import { FilterChips, ProviderCard, ScreenHeader } from '@/src/components';
import { colors, spacing, borderRadius } from '@/src/constants/theme';
import { ServiceCategory } from '@/src/types';

export default function ClientHomeScreen() {
  const router = useRouter();
  const services = useServiceStore((s) => s.services);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ServiceCategory | 'all'>('all');

  const providers = useMemo(() => {
    return mockProviders
      .map((provider) => {
        const providerServices = services.filter((s) => s.providerId === provider.id);
        const startingPrice = providerServices.length
          ? Math.min(...providerServices.map((s) => s.price))
          : 0;
        return { ...provider, services: providerServices, startingPrice };
      })
      .filter((p) => {
        const matchesSearch =
          !search ||
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.serviceArea.toLowerCase().includes(search.toLowerCase());
        const matchesCategory =
          category === 'all' || p.services.some((s) => s.category === category);
        return matchesSearch && matchesCategory;
      });
  }, [search, category, services]);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Find Cleaners" subtitle="Book trusted aircon professionals" />

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or area..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FilterChips selected={category} onSelect={setCategory} />

      <FlatList
        data={providers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProviderCard
            provider={item}
            startingPrice={item.startingPrice}
            onPress={() => router.push(`/(client)/provider/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  searchIcon: { marginRight: spacing.sm },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 16, color: colors.text },
  list: { paddingBottom: spacing.xl },
});
