import { TouchableOpacity, Text } from "react-native";
import { CreateGameThemes } from "../themes/CreateGameThemes";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/src/themes/themes";

type CreateGameButtonProps = {
    setIsCreateGameModalVisible: (isVisible: boolean) => void;
};

export default function CreateGameButton({ setIsCreateGameModalVisible }: CreateGameButtonProps) {
    
    const handleCreateGame = () => {
        setIsCreateGameModalVisible(true);
    };

    return (
        <TouchableOpacity onPress={handleCreateGame} style={CreateGameThemes.createGameButton}>
            <Ionicons name="add" size={32} color={COLORS.buttonText} />
        </TouchableOpacity>
    );
}