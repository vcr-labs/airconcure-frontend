import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@/src/stores/authStore';
import {
  getAuthEntryRoute,
  getHomeRoute,
  isClientApp,
  isProviderApp,
} from '@/src/constants/appVariant';

export function useAuthRedirect() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, hasCompletedOnboarding, isHydrated } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;

    const segmentList = segments as string[];
    const inAuthGroup = segmentList[0] === '(auth)';
    const inClientGroup = segmentList[0] === '(client)';
    const inProviderGroup = segmentList[0] === '(provider)';
    const onSplash = segmentList.length === 0;
    const homeRoute = getHomeRoute();
    const authEntryRoute = getAuthEntryRoute();

    if (!isAuthenticated) {
      if (!inAuthGroup && !onSplash) {
        router.replace(authEntryRoute);
      }
      return;
    }

    if (!hasCompletedOnboarding) {
      if (segmentList[1] !== 'onboarding') {
        router.replace('/(auth)/onboarding');
      }
      return;
    }

    if (isClientApp && (inProviderGroup || !inClientGroup)) {
      router.replace(homeRoute);
    } else if (isProviderApp && (inClientGroup || !inProviderGroup)) {
      router.replace(homeRoute);
    }
  }, [isAuthenticated, hasCompletedOnboarding, isHydrated, segments]);
}
