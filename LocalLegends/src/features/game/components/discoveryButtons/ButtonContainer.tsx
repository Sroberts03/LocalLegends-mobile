import { View } from "react-native";
import RefreshButton from "./RefreshButton";
import RefocusButton from "./RefocusButton";
import { ButtonContainerStyles } from "../themes/ButtonContainerThemes";
import SetFilterButton from "./SetFilterButton";

type ButtonContainerProps = {
    onRefresh: () => void;
    onRefocus: () => void;
    isLoading: boolean;
    setIsFilterModalVisible: (isVisible: boolean) => void;
};

export default function ButtonContainer({ onRefresh, onRefocus, isLoading, setIsFilterModalVisible }: ButtonContainerProps) {
    return (
        <View style={ButtonContainerStyles.container}>
            <View style={ButtonContainerStyles.buttonContainer}>
                <SetFilterButton setIsFilterModalVisible={setIsFilterModalVisible} />
                <RefocusButton onRefocus={onRefocus} />
                <RefreshButton onRefresh={onRefresh} isLoading={isLoading} />
            </View>
        </View>
    );
}