import { useState } from 'react';
import { Alert, FlatList, Modal, ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useAuthStore } from '@/src/stores/authStore';
import { useServiceStore } from '@/src/stores/serviceStore';
import { Button, EmptyState, Input, ScreenHeader, ServiceCard } from '@/src/components';
import { SERVICE_CATEGORIES } from '@/src/constants/serviceTypes';
import { colors, spacing, typography, borderRadius } from '@/src/constants/theme';
import { Service, ServiceCategory } from '@/src/types';

interface ServiceForm {
  name: string;
  description: string;
  price: string;
  durationMinutes: string;
  category: ServiceCategory;
}

export default function ProviderServicesScreen() {
  const user = useAuthStore((s) => s.user);
  const services = useServiceStore((s) => s.services);
  const addService = useServiceStore((s) => s.addService);
  const updateService = useServiceStore((s) => s.updateService);
  const deleteService = useServiceStore((s) => s.deleteService);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const providerServices = services.filter((s) => s.providerId === user?.id);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ServiceForm>({
    defaultValues: { name: '', description: '', price: '', durationMinutes: '60', category: 'deep_clean' },
  });

  const openAdd = () => {
    setEditingId(null);
    reset({ name: '', description: '', price: '', durationMinutes: '60', category: 'deep_clean' });
    setModalVisible(true);
  };

  const openEdit = (service: Service) => {
    setEditingId(service.id);
    reset({
      name: service.name,
      description: service.description,
      price: String(service.price),
      durationMinutes: String(service.durationMinutes),
      category: service.category,
    });
    setModalVisible(true);
  };

  const onSubmit = (data: ServiceForm) => {
    const payload = {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      durationMinutes: Number(data.durationMinutes),
      category: data.category,
      providerId: user!.id,
    };

    if (editingId) {
      updateService(editingId, payload);
    } else {
      addService(payload);
    }
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Service', 'Are you sure you want to delete this service?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteService(id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="My Services" subtitle="Manage your offerings" />
      <Button title="+ Add Service" onPress={openAdd} style={styles.addBtn} />

      {providerServices.length === 0 ? (
        <EmptyState icon="construct-outline" title="No services yet" message="Add your first service to start receiving bookings." />
      ) : (
        <FlatList
          data={providerServices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ServiceCard
              service={item}
              showActions
              onEdit={() => openEdit(item)}
              onDelete={() => handleDelete(item.id)}
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <ScrollView style={styles.modal} contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
          <Text style={styles.modalTitle}>{editingId ? 'Edit Service' : 'Add Service'}</Text>

          <Controller control={control} name="name" rules={{ required: 'Name is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Service Name" placeholder="e.g. Deep Cleaning" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.name?.message} />
            )}
          />

          <Controller control={control} name="description" rules={{ required: 'Description is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Description" placeholder="Describe the service..." multiline onBlur={onBlur} onChangeText={onChange} value={value} error={errors.description?.message} style={{ minHeight: 80, textAlignVertical: 'top' }} />
            )}
          />

          <Controller control={control} name="price" rules={{ required: 'Price is required', pattern: { value: /^\d+$/, message: 'Enter a valid number' } }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Price (₱)" keyboardType="numeric" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.price?.message} />
            )}
          />

          <Controller control={control} name="durationMinutes" rules={{ required: 'Duration is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Duration (minutes)" keyboardType="numeric" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.durationMinutes?.message} />
            )}
          />

          <Text style={styles.label}>Category</Text>
          <Controller control={control} name="category"
            render={({ field: { onChange, value } }) => (
              <View style={styles.categoryRow}>
                {SERVICE_CATEGORIES.filter((c) => c.key !== 'all').map((cat) => (
                  <Pressable
                    key={cat.key}
                    onPress={() => onChange(cat.key as ServiceCategory)}
                    style={[styles.categoryChip, value === cat.key && styles.categoryChipActive]}
                  >
                    <Text style={[styles.categoryText, value === cat.key && styles.categoryTextActive]}>{cat.label}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          />

          <Button title={editingId ? 'Save Changes' : 'Add Service'} onPress={handleSubmit(onSubmit)} style={styles.modalBtn} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} variant="outline" />
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  addBtn: { marginBottom: spacing.md },
  list: { paddingBottom: spacing.xl },
  modal: { flex: 1, backgroundColor: colors.background },
  modalContent: { padding: spacing.lg, paddingBottom: spacing.xxl },
  modalTitle: { ...typography.h2, color: colors.text, marginBottom: spacing.lg },
  label: { ...typography.label, color: colors.text, marginBottom: spacing.sm },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  categoryChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full, borderWidth: 1, borderColor: colors.border },
  categoryChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  categoryText: { ...typography.bodySmall, color: colors.textSecondary },
  categoryTextActive: { color: colors.white },
  modalBtn: { marginBottom: spacing.sm },
});
