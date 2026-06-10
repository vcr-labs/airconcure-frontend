import { create } from 'zustand';
import { Service } from '@/src/types';
import { mockProviders } from '@/src/data/mock';

interface ServiceState {
  services: Service[];
  initialize: () => void;
  getByProvider: (providerId: string) => Service[];
  addService: (service: Omit<Service, 'id'>) => Service;
  updateService: (id: string, updates: Partial<Omit<Service, 'id' | 'providerId'>>) => void;
  deleteService: (id: string) => void;
}

export const useServiceStore = create<ServiceState>((set, get) => ({
  services: [],

  initialize: () => {
    if (get().services.length === 0) {
      const allServices = mockProviders.flatMap((p) => p.services);
      set({ services: allServices });
    }
  },

  getByProvider: (providerId) =>
    get().services.filter((s) => s.providerId === providerId),

  addService: (service) => {
    const newService: Service = {
      ...service,
      id: `svc-${Date.now()}`,
    };
    set((state) => ({ services: [...state.services, newService] }));
    return newService;
  },

  updateService: (id, updates) => {
    set((state) => ({
      services: state.services.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    }));
  },

  deleteService: (id) => {
    set((state) => ({
      services: state.services.filter((s) => s.id !== id),
    }));
  },
}));
