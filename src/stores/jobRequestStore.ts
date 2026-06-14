import { create } from 'zustand';
import { JobRequestDraft, ServiceCategory } from '@/src/types';

interface JobRequestState {
  draft: Partial<JobRequestDraft>;
  setCategory: (category: ServiceCategory) => void;
  setDetails: (details: {
    address: string;
    notes?: string;
    scheduledAt: string;
  }) => void;
  setProvider: (providerId: string, serviceId: string) => void;
  reset: () => void;
}

export const useJobRequestStore = create<JobRequestState>((set) => ({
  draft: {},

  setCategory: (category) =>
    set((state) => ({ draft: { ...state.draft, category } })),

  setDetails: (details) =>
    set((state) => ({ draft: { ...state.draft, ...details } })),

  setProvider: (providerId, serviceId) =>
    set((state) => ({ draft: { ...state.draft, providerId, serviceId } })),

  reset: () => set({ draft: {} }),
}));
