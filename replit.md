# Mobile Inventory System

A mobile-first inventory management app for shops, built with Expo + React Native (web preview supported).

## Run & Operate

- **Start (web):** `npx --no-install expo start --web --port 5000`
- **Required env vars:** Firebase config (see `src/` for Firebase usage)

## Stack

- Expo ~54 / React Native 0.81
- React 19 + TypeScript
- Firebase / Firestore (`@react-native-firebase/app`, `firebase`)
- React Navigation (bottom tabs + native stack)
- PapaParse (CSV import/export)

## Where things live

- `App.tsx` — entry point, mounts `AppNavigator`
- `src/navigation/` — navigation setup
- `src/` — screens, services, and business logic
- `components/` — shared UI components
- `constants/` — app-wide constants
- `hooks/` — custom React hooks
- `assets/` — images and static assets

## Architecture decisions

- Expo managed workflow for cross-platform (iOS, Android, Web)
- Firebase Firestore as the backend database
- React Navigation with bottom tabs as primary nav pattern
- Port 5000 used for web preview in Replit

## Product

Dashboard with four modules: Sales (new sale + history), Inventory (stock & products), Customers (manage customer data), and Reports (sales & stock reports). Supports barcode/SKU product search and CSV import/export.

## User preferences

_Populate as you build_

## Gotchas

- Run `npm install` before starting if `node_modules` is missing
- Firebase stats will show "Loading..." if Firestore credentials are not configured

## Pointers

- Expo skill: `.local/skills/expo/SKILL.md`
