import { UserRole } from '@/src/types';

export type AppVariant = 'client' | 'provider';

export const APP_VARIANT: AppVariant =
  process.env.EXPO_PUBLIC_APP_VARIANT === 'provider' ? 'provider' : 'client';

export const isClientApp = APP_VARIANT === 'client';
export const isProviderApp = APP_VARIANT === 'provider';

export const LOCKED_ROLE: UserRole = APP_VARIANT;

export function getAuthEntryRoute(): '/(auth)/role-select' | '/(auth)/login' {
  return isProviderApp ? '/(auth)/login' : '/(auth)/role-select';
}

export function getHomeRoute(): '/(client)' | '/(provider)' {
  return isProviderApp ? '/(provider)' : '/(client)';
}

export function getAppDisplayName(): string {
  return isProviderApp ? 'AirConCure Pro' : 'AirConCure';
}

export function getSplashSubtitle(): string {
  return isProviderApp
    ? 'Manage bookings & grow your business'
    : 'Professional AC Cleaning & Maintenance';
}
