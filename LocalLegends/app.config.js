import 'dotenv/config';
export default {
  expo: {
    name: "LocalLegends",
    slug: "LocalLegends",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/localLegendsIcon.png",
    scheme: "locallegends",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.srober03.locallegends",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSLocationWhenInUseUsageDescription: "LocalLegends uses your location to show nearby places.",
        NSLocationAlwaysAndWhenInUseUsageDescription: "LocalLegends uses your location to show nearby places.",
        NSLocationAlwaysUsageDescription: "LocalLegends uses your location to show nearby places."
      },
      config: {
        googleMapsApiKey: process.env.IOS_GOOGLE_API_KEY
      }
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/localLegendsIcon.png"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false
    },
    web: {
      output: "static",
      favicon: "./assets/images/localLegendsIcon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/localLegendsIcon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000"
          }
        }
      ],
      [
        "expo-location",
        {
          locationWhenInUsePermission: "LocalLegends uses your location to show nearby places.",
          locationAlwaysAndWhenInUsePermission: "LocalLegends uses your location to show nearby places."
        }
      ]
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true
    },
    extra: {
      router: {},
      googlePlacesApiKey: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
      eas: {
        projectId: "726eb7f8-d91f-4510-84cc-0c95548c5dbc"
      }
    }
  }
}