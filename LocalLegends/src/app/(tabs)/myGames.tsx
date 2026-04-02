import { SafeAreaView } from "react-native-safe-area-context";
import MyGames from "@/src/features/game/components/MyGames";

export default function MyGamesScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MyGames />
    </SafeAreaView>
  );
}