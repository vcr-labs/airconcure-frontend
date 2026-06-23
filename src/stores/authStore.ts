import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole } from '@/src/types';
import { defaultClient, defaultProvider } from '@/src/data/mock';
import { LOCKED_ROLE } from '@/src/constants/appVariant';

const AUTH_KEY = `airconcure_auth_${LOCKED_ROLE}`;

interface AuthState {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<User, 'name' | 'phone' | 'email'>>) => Promise<void>;
  logout: () => Promise<void>;
}

async function persistAuth(data: {
  user: User;
  role: UserRole;
  hasCompletedOnboarding: boolean;
}) {
  await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(data));
}

async function clearAuth() {
  await AsyncStorage.removeItem(AUTH_KEY);
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  role: null,
  isAuthenticated: false,
  hasCompletedOnboarding: false,
  isHydrated: false,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(AUTH_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data.role !== LOCKED_ROLE) {
          set({ isHydrated: true });
          return;
        }
        set({
          user: data.user,
          role: data.role,
          isAuthenticated: true,
          hasCompletedOnboarding: data.hasCompletedOnboarding ?? true,
          isHydrated: true,
        });
        return;
      }
    } catch {
      // ignore parse errors
    }
    set({ isHydrated: true });
  },

  login: async (email, _password) => {
    const role = LOCKED_ROLE;
    const user: User =
      role === 'provider'
        ? { ...defaultProvider, email: email || defaultProvider.email }
        : { ...defaultClient, email: email || defaultClient.email };

    set({
      user,
      role,
      isAuthenticated: true,
      hasCompletedOnboarding: false,
    });
    await persistAuth({ user, role, hasCompletedOnboarding: false });
  },

  register: async (name, email, phone, _password) => {
    const role = LOCKED_ROLE;
    const base = role === 'provider' ? defaultProvider : defaultClient;
    const user: User = { ...base, name, email, phone };

    set({
      user,
      role,
      isAuthenticated: true,
      hasCompletedOnboarding: false,
    });
    await persistAuth({ user, role, hasCompletedOnboarding: false });
  },

  completeOnboarding: async () => {
    const { user, role } = get();
    if (!user || !role) return;
    set({ hasCompletedOnboarding: true });
    await persistAuth({ user, role, hasCompletedOnboarding: true });
  },

  updateProfile: async (updates) => {
    const { user, role, hasCompletedOnboarding } = get();
    if (!user || !role) return;
    const updated = { ...user, ...updates };
    set({ user: updated });
    await persistAuth({ user: updated, role, hasCompletedOnboarding });
  },

  logout: async () => {
    await clearAuth();
    set({
      user: null,
      role: null,
      isAuthenticated: false,
      hasCompletedOnboarding: false,
    });
  },
}));
