import Map from "@/src/features/game/components/Map";
import CreateGameButton from "@/src/features/game/components/CreateGameButton";
import { GameDiscoveryTheme } from "./themes/GameDiscoveryTheme";
import { View } from "react-native";
import { useState } from "react";
import CreateGameModal from "./CreateGameModal";

export default function GameDiscovery() {
    const [isCreateGameModalVisible, setIsCreateGameModalVisible] = useState(false);

    return (
        <View style={GameDiscoveryTheme.container}>
            <View style={GameDiscoveryTheme.map}>
                <Map />
            </View>
            <View style={GameDiscoveryTheme.createGameButton}>
                <CreateGameButton 
                    setIsCreateGameModalVisible={setIsCreateGameModalVisible} 
                />
            </View>
            <CreateGameModal 
                isVisible={isCreateGameModalVisible} 
                setIsCreateGameModalVisible={setIsCreateGameModalVisible} 
            />
        </View>
    );
}