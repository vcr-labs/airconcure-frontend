import { create } from 'zustand';
import { Booking, BookingStatus } from '@/src/types';
import { mockBookings } from '@/src/data/mock';

interface CreateBookingInput {
  clientId: string;
  providerId: string;
  serviceId: string;
  scheduledAt: string;
  address: string;
  notes?: string;
  totalPrice: number;
}

interface BookingState {
  bookings: Booking[];
  initialize: () => void;
  createBooking: (input: CreateBookingInput) => Booking;
  updateStatus: (id: string, status: BookingStatus) => void;
  getByClient: (clientId: string) => Booking[];
  getByProvider: (providerId: string) => Booking[];
  getById: (id: string) => Booking | undefined;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],

  initialize: () => {
    if (get().bookings.length === 0) {
      set({ bookings: [...mockBookings] });
    }
  },

  createBooking: (input) => {
    const booking: Booking = {
      id: `booking-${Date.now()}`,
      ...input,
      status: 'pending',
    };
    set((state) => ({ bookings: [booking, ...state.bookings] }));
    return booking;
  },

  updateStatus: (id, status) => {
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === id ? { ...b, status } : b
      ),
    }));
  },

  getByClient: (clientId) =>
    get().bookings.filter((b) => b.clientId === clientId),

  getByProvider: (providerId) =>
    get().bookings.filter((b) => b.providerId === providerId),

  getById: (id) => get().bookings.find((b) => b.id === id),
}));
