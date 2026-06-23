# AirConCure

A React Native app for booking aircon cleaning and maintenance services. Built with Expo and Expo Router.

The codebase ships as **two app variants** from a single repo:

- **AirConCure** (client) — book cleaning and maintenance services
- **AirConCure Pro** (provider) — manage bookings and grow your business

## Features

### Client app (`EXPO_PUBLIC_APP_VARIANT=client`)
- Browse providers, view services, book appointments, track booking status
- Role selection welcome screen, then login/register

### Provider app (`EXPO_PUBLIC_APP_VARIANT=provider`)
- Dashboard, manage job requests, accept/decline bookings
- Goes straight to login (no shared role picker with client)
- Separate bundle ID, storage key, and PWA manifest

### Shared
- Mock data — frontend-only with in-memory state (no backend required)
- Shared UI components, theme, and stores in `src/`

## Tech Stack

- Expo SDK 54 + React Native
- TypeScript
- Expo Router (file-based routing)
- Zustand (state management)
- react-hook-form (forms)
- date-fns (date formatting)

## Getting Started

```bash
npm install
```

### Client app (default)

```bash
npm run start:client
# or web
npm run web:client
```

### Provider app

```bash
npm run start:provider
# or web
npm run web:provider
```

Scan the QR code with Expo Go, or press `a` for Android emulator / `i` for iOS simulator.

**Note:** Requires Node.js 20+.

## Web / PWA builds

```bash
npm run build:web:client
npm run build:web:provider
```

Output goes to `dist/`. Each variant gets its own manifest name and isolated auth storage.

## Vercel deployment

Use **two Vercel projects** pointing at the same repo:

| Project | Build Command | Environment Variable | Output Directory |
|---------|---------------|----------------------|------------------|
| Client site | `npm run build:web:client` | `EXPO_PUBLIC_APP_VARIANT=client` | `dist` |
| Provider site | `npm run build:web:provider` | `EXPO_PUBLIC_APP_VARIANT=provider` | `dist` |

Example URLs: `app.airconcure.com` (client) and `provider.airconcure.com` (provider).

## Project Structure

```
app/
  (auth)/       # Login, register, onboarding (role-select is client-only)
  (client)/     # Client tabs: home, bookings, profile
  (provider)/   # Provider tabs: dashboard, bookings, profile
src/
  constants/    # Theme, app variant, service types
  components/   # Shared UI components
  data/mock/    # Mock users, providers, bookings
  stores/       # Zustand stores (auth, bookings, services)
  types/        # TypeScript interfaces
scripts/
  prepare-pwa.js  # Writes variant-specific manifest before web export
```

## App variants

Variant is controlled by `EXPO_PUBLIC_APP_VARIANT` (`client` | `provider`). See `src/constants/appVariant.ts` for helpers used across auth, routing, and branding.

## Expo Account

Client slug: `airconcure`. Provider slug: `airconcure-provider`. Link to an Expo account via `eas init` when needed.
