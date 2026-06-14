import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Provider } from '@/src/types';
import { colors, spacing, typography } from '@/src/constants/theme';
import { Avatar } from './Avatar';
import { Card } from './Card';

interface ProviderCardProps {
  provider: Provider;
  startingPrice: number;
  matchedServiceName?: string;
  onPress: () => void;
}

export function ProviderCard({ provider, startingPrice, matchedServiceName, onPress }: ProviderCardProps) {
  return (
    <Pressable onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.row}>
          <Avatar name={provider.name} uri={provider.avatar} size={56} />
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>
              {provider.name}
            </Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.rating}>{provider.rating}</Text>
              <Text style={styles.reviews}>({provider.reviewCount} reviews)</Text>
            </View>
            <Text style={styles.area} numberOfLines={1}>
              <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
              {' '}{provider.serviceArea}
            </Text>
          </View>
        </View>
        <View style={styles.footer}>
          <View>
            <Text style={styles.price}>₱{startingPrice.toLocaleString()}</Text>
            {matchedServiceName && (
              <Text style={styles.serviceName}>{matchedServiceName}</Text>
            )}
          </View>
          <Text style={styles.cta}>Select Provider →</Text>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.md },
  row: { flexDirection: 'row', gap: spacing.md },
  info: { flex: 1 },
  name: { ...typography.h3, color: colors.text },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  rating: { ...typography.bodySmall, fontWeight: '600', color: colors.text },
  reviews: { ...typography.caption, color: colors.textSecondary },
  area: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  price: { ...typography.label, color: colors.primary },
  serviceName: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  cta: { ...typography.bodySmall, color: colors.secondary, fontWeight: '600' },
});
