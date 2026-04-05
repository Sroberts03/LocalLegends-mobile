# 🏆 LocalLegends

**Real-time coordination platform for pickup sports.** 

LocalLegends connects athletes with local games, bringing the "legend" status back to the neighborhood court. Engineered for high-performance, real-time coordination, and a premium native mobile experience.

---

## ⚡ Key Features

-   **📍 Geospatial Discovery**: Find games in real-time using a cluster-based map interface.
-   **🤝 Seamless Coordination**: Join games with a single tap and transition to dedicated group chats once attendance thresholds are met.
-   **💬 Live Chat**: Coordinate timing, location, and rules with other players in real-time.
-   **📈 Legend Stats**: Track your attendance, participation, and favorite sports to build your local reputation.
-   **⚡ Real-time Sync**: Powered by Supabase for instantaneous updates on game status, messaging, and player joins.

---

## 🛠 Tech Stack

### Core
-   **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) (SDK 54)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
-   **Icons**: [Lucide React Native](https://lucide.dev/)

### Backend & Services
-   **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + PostGIS)
-   **Maps**: [Google Maps API](https://developers.google.com/maps) & `react-native-maps`
-   **Infrastructure**: [EAS (Expo Application Services)](https://expo.dev/eas)

---

## 🚀 Getting Started

### Prerequisites
-   Node.js (LTS)
-   npm or yarn
-   Expo Go (for physical testing) or iOS/Android Simulator

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Sroberts03/LocalLegends-mobile.git
    cd LocalLegends-mobile/LocalLegends
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the `LocalLegends` directory with:
    - `EXPO_PUBLIC_SUPABASE_URL`
    - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
    - `EXPO_PUBLIC_GOOGLE_PLACES_API_KEY`

4.  **Start the development server:**
    ```bash
    npx expo start
    ```

---

## 📁 Project Structure

```text
LocalLegends/
├── src/
│   ├── app/           # Expo Router entry points and layout
│   ├── features/      # Feature-based modular logic
│   │   ├── auth/      # Authentication flows
│   │   ├── game/      # Game creation, joining, and details
│   │   ├── profile/   # User profiles, settings, and stats
│   │   └── search/    # Map-based game discovery
│   ├── lib/           # Third-party service initializations (Supabase)
│   ├── models/        # TypeScript type definitions
│   ├── themes/        # Design system and style constants
│   └── utils/         # Shared helper functions
└── assets/            # Static images, fonts, and icons
```

---

## 📸 How It Works

1.  **Find a Game**: Spot a local pickup game on the interactive map.
2.  **View Details**: Check the players, time, and specific location requirements.
3.  **Join Up**: Hit join to secure your spot. Once the minimum player count is reached, the squad is locked in.
4.  **Coordinate**: Use the live chat to finalize details.
5.  **Play**: Show up, play hard, and build your attendance score.

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
