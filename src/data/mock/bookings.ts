import { Booking } from '@/src/types';

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(10, 0, 0, 0);

const nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 7);
nextWeek.setHours(14, 0, 0, 0);

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
yesterday.setHours(9, 0, 0, 0);

const lastWeek = new Date();
lastWeek.setDate(lastWeek.getDate() - 7);
lastWeek.setHours(11, 0, 0, 0);

export const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    clientId: 'client-1',
    providerId: 'provider-1',
    serviceId: 'svc-1',
    scheduledAt: tomorrow.toISOString(),
    address: '123 Ayala Ave, Makati City',
    notes: '2 split-type units in living room and bedroom',
    status: 'pending',
    totalPrice: 1500,
  },
  {
    id: 'booking-2',
    clientId: 'client-1',
    providerId: 'provider-3',
    serviceId: 'svc-6',
    scheduledAt: nextWeek.toISOString(),
    address: '456 BGC, Taguig City',
    status: 'confirmed',
    totalPrice: 2000,
  },
  {
    id: 'booking-3',
    clientId: 'client-1',
    providerId: 'provider-2',
    serviceId: 'svc-3',
    scheduledAt: yesterday.toISOString(),
    address: '789 QC Circle, Quezon City',
    status: 'completed',
    totalPrice: 600,
  },
  {
    id: 'booking-4',
    clientId: 'client-2',
    providerId: 'provider-1',
    serviceId: 'svc-2',
    scheduledAt: tomorrow.toISOString(),
    address: '321 Ortigas Center, Pasig City',
    status: 'pending',
    totalPrice: 800,
  },
  {
    id: 'booking-5',
    clientId: 'client-2',
    providerId: 'provider-4',
    serviceId: 'svc-8',
    scheduledAt: lastWeek.toISOString(),
    address: '654 Caloocan North',
    status: 'cancelled',
    totalPrice: 450,
  },
  {
    id: 'booking-6',
    clientId: 'client-1',
    providerId: 'provider-5',
    serviceId: 'svc-10',
    scheduledAt: new Date().toISOString(),
    address: '100 Aguinaldo Hwy, Cavite',
    notes: 'Gate code: 1234',
    status: 'in_progress',
    totalPrice: 1700,
  },
  {
    id: 'booking-7',
    clientId: 'client-2',
    providerId: 'provider-3',
    serviceId: 'svc-7',
    scheduledAt: nextWeek.toISOString(),
    address: '200 Alabang, Muntinlupa',
    status: 'confirmed',
    totalPrice: 500,
  },
  {
    id: 'booking-8',
    clientId: 'client-1',
    providerId: 'provider-2',
    serviceId: 'svc-4',
    scheduledAt: lastWeek.toISOString(),
    address: '555 Marikina Heights',
    status: 'completed',
    totalPrice: 1200,
  },
];
