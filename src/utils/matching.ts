import { Provider, Service, ServiceCategory } from '@/src/types';

export interface MatchedProvider {
  provider: Provider;
  matchingServices: Service[];
  startingPrice: number;
}

export function getMatchingProviders(
  category: ServiceCategory,
  providers: Provider[],
  services: Service[]
): MatchedProvider[] {
  return providers
    .map((provider) => {
      const providerServices = services.filter((s) => s.providerId === provider.id);
      const matchingServices = providerServices.filter((s) => s.category === category);
      if (matchingServices.length === 0) return null;

      const startingPrice = Math.min(...matchingServices.map((s) => s.price));
      return { provider, matchingServices, startingPrice };
    })
    .filter((item): item is MatchedProvider => item !== null)
    .sort((a, b) => b.provider.rating - a.provider.rating);
}

export function pickBestProvider(
  category: ServiceCategory,
  providers: Provider[],
  services: Service[]
): MatchedProvider | null {
  const matches = getMatchingProviders(category, providers, services);
  return matches[0] ?? null;
}
