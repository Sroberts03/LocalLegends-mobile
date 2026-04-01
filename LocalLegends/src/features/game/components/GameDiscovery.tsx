import Map from "@/src/features/game/components/Map";
import CreateGameButton from "@/src/features/game/components/CreateGameButton";
import { GameDiscoveryTheme } from "./themes/GameDiscoveryTheme";
import { View } from "react-native";

export default function GameDiscovery() {
    return (
        <View style={GameDiscoveryTheme.container}>
            <View style={GameDiscoveryTheme.map}>
                <Map />
            </View>
            <View style={GameDiscoveryTheme.createGameButton}>
                <CreateGameButton />
            </View>
        </View>
    );
}