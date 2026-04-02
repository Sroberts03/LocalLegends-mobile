import { Modal, View, Text, TouchableWithoutFeedback, Pressable } from "react-native";
import { CreateGameModalTheme } from "./themes/CreateGameModalThemes";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/src/themes/themes";
import CreateGameForm from "./form/CreateGameForm";

type CreateGameModalProps = {
    isVisible: boolean;
    setIsCreateGameModalVisible: (isVisible: boolean) => void;
};

export default function CreateGameModal({ isVisible, setIsCreateGameModalVisible }: CreateGameModalProps) {
    const handleClose = () => setIsCreateGameModalVisible(false);

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleClose}
        >
            <TouchableWithoutFeedback onPress={handleClose}>
                <View style={CreateGameModalTheme.container}>
                    <TouchableWithoutFeedback>
                        <View style={CreateGameModalTheme.content}>
                            <View style={CreateGameModalTheme.handle} />

                            <View style={CreateGameModalTheme.header}>
                                <Text style={CreateGameModalTheme.title}>Create Game</Text>
                                <Pressable onPress={handleClose}>
                                    <Ionicons name="close-circle" size={28} color="#cbd5e0" />
                                </Pressable>
                            </View>

                            <CreateGameForm setIsCreateGameModalVisible={setIsCreateGameModalVisible} />

                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}