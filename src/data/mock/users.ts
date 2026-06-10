import { User } from '@/src/types';

export const mockClients: User[] = [
  {
    id: 'client-1',
    name: 'Maria Santos',
    email: 'maria@example.com',
    phone: '+63 917 123 4567',
    role: 'client',
    avatar: 'https://i.pravatar.cc/150?u=maria',
  },
  {
    id: 'client-2',
    name: 'Juan Dela Cruz',
    email: 'juan@example.com',
    phone: '+63 918 234 5678',
    role: 'client',
    avatar: 'https://i.pravatar.cc/150?u=juan',
  },
];

export const defaultClient = mockClients[0];
