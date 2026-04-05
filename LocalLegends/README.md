# LocalLegends Mobile App

This directory contains the source code for the **LocalLegends** mobile application.

For a full overview of the project, features, and tech stack, please refer to the [Root README](../README.md).

## 🛠 Features in this package

- **Native Geospatial Maps**: Using Cluster-based Google Maps.
- **Real-time Messaging**: Built on Supabase Channels.
- **Expo Router**: Modern file-based routing.
- **Modular Architecture**: Feature-driven development in `src/features`.

## 📦 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Setup Env**:
   Add `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` to your `.env` file.

3. **Run App**:
   ```bash
   npx expo start
   ```

## 📂 Internal Structure

- `src/app/`: Navigation and page layouts.
- `src/features/`: Core business logic (auth, game, profile, search).
- `src/themes/`: Design system tokens (colors, spacing, typography).
- `src/lib/`: Third-party SDK initializations.
