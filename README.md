# AirConCure

A React Native mobile app for booking aircon cleaning and maintenance services. Built with Expo and Expo Router.

## Features

- **Dual role support** — Single app with Client and Provider experiences
- **Client** — Browse providers, view services, book appointments, track booking status
- **Provider** — Dashboard, manage services (CRUD), accept/decline bookings
- **Mock data** — Frontend-only with in-memory state (no backend required)

## Tech Stack

- Expo SDK 56 + React Native
- TypeScript
- Expo Router (file-based routing)
- Zustand (state management)
- react-hook-form (forms)
- date-fns (date formatting)

## Getting Started

```bash
npm install
npm start
```

Scan the QR code with Expo Go, or press `a` for Android emulator / `i` for iOS simulator.

**Note:** Requires Node.js 20+ for full Expo SDK 56 compatibility.

## Project Structure

```
app/
  (auth)/       # Login, register, role selection, onboarding
  (client)/     # Client tabs: home, bookings, profile
  (provider)/   # Provider tabs: dashboard, services, bookings, profile
src/
  components/   # Shared UI components
  constants/    # Theme, service types
  data/mock/    # Mock users, providers, bookings
  stores/       # Zustand stores (auth, bookings, services)
  types/        # TypeScript interfaces
```

## Expo Account

The app is configured with `slug: airconcure` and ready to link to an Expo account via `eas init` when needed.
