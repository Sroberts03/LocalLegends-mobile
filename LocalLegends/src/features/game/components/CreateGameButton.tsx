import { TouchableOpacity, Text } from "react-native";
import { CreateGameThemes } from "./themes/CreateGameThemes";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/src/themes/themes";

export default function CreateGameButton() {
    const handleCreateGame = () => {
        console.log("TODO: Implement create game functionality");
    };

    return (
        <TouchableOpacity onPress={handleCreateGame} style={CreateGameThemes.createGameButton}>
            <Ionicons name="add" size={24} color={COLORS.buttonText} />
        </TouchableOpacity>
    );
}