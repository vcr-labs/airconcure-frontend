import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { mockProviders } from '@/src/data/mock';
import { useServiceStore } from '@/src/stores/serviceStore';
import { Avatar, Button, ServiceCard } from '@/src/components';
import { colors, spacing, typography } from '@/src/constants/theme';

export default function ProviderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const services = useServiceStore((s) => s.services);

  const provider = mockProviders.find((p) => p.id === id);
  const providerServices = services.filter((s) => s.providerId === id);

  if (!provider) {
    return (
      <View style={styles.center}>
        <Text>Provider not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Avatar name={provider.name} uri={provider.avatar} size={80} />
        <Text style={styles.name}>{provider.name}</Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={16} color="#F59E0B" />
          <Text style={styles.rating}>{provider.rating}</Text>
          <Text style={styles.reviews}>({provider.reviewCount} reviews)</Text>
        </View>
        <Text style={styles.area}>
          <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
          {' '}{provider.serviceArea}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.bio}>{provider.bio}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Services</Text>
        {providerServices.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </View>

      <Button
        title="Book Now"
        onPress={() => router.push(`/(client)/book/${provider.id}`)}
        style={styles.bookBtn}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: spacing.lg },
  name: { ...typography.h2, color: colors.text, marginTop: spacing.md },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.xs },
  rating: { ...typography.body, fontWeight: '600' },
  reviews: { ...typography.bodySmall, color: colors.textSecondary },
  area: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 4 },
  section: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.sm },
  bio: { ...typography.body, color: colors.textSecondary, lineHeight: 22 },
  bookBtn: { marginTop: spacing.md },
});
