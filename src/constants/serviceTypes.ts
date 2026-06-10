import { ServiceCategory } from '@/src/types';

export const SERVICE_CATEGORIES: {
  key: ServiceCategory | 'all';
  label: string;
}[] = [
  { key: 'all', label: 'All' },
  { key: 'deep_clean', label: 'Deep Clean' },
  { key: 'maintenance', label: 'Maintenance' },
  { key: 'repair', label: 'Repair' },
];

export function getCategoryLabel(category: ServiceCategory): string {
  const found = SERVICE_CATEGORIES.find((c) => c.key === category);
  return found?.label ?? category;
}
