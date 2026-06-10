export type UserRole = 'client' | 'provider';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
}

export interface Service {
  id: string;
  providerId: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  category: ServiceCategory;
}

export type ServiceCategory = 'deep_clean' | 'maintenance' | 'repair';

export interface Provider extends User {
  role: 'provider';
  rating: number;
  reviewCount: number;
  serviceArea: string;
  bio: string;
  services: Service[];
}

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface Booking {
  id: string;
  clientId: string;
  providerId: string;
  serviceId: string;
  scheduledAt: string;
  address: string;
  notes?: string;
  status: BookingStatus;
  totalPrice: number;
}

export interface OnboardingSlide {
  title: string;
  description: string;
  icon: string;
}
