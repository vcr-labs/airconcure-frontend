import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@/src/stores/authStore';

export function useAuthRedirect() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, hasCompletedOnboarding, role, isHydrated } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;

    const segmentList = segments as string[];
    const inAuthGroup = segmentList[0] === '(auth)';
    const inClientGroup = segmentList[0] === '(client)';
    const inProviderGroup = segmentList[0] === '(provider)';
    const onSplash = segmentList.length === 0;

    if (!isAuthenticated) {
      if (!inAuthGroup && !onSplash) {
        router.replace('/(auth)/role-select');
      }
      return;
    }

    if (!hasCompletedOnboarding) {
      if (segmentList[1] !== 'onboarding') {
        router.replace('/(auth)/onboarding');
      }
      return;
    }

    if (role === 'client' && !inClientGroup) {
      router.replace('/(client)');
    } else if (role === 'provider' && !inProviderGroup) {
      router.replace('/(provider)');
    }
  }, [isAuthenticated, hasCompletedOnboarding, role, isHydrated, segments]);
}
