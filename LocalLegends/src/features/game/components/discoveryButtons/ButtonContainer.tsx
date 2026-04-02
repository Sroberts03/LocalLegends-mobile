import { View } from "react-native";
import RefreshButton from "./RefreshButton";
import RefocusButton from "./RefocusButton";
import { ButtonContainerStyles } from "../themes/ButtonContainerThemes";

type ButtonContainerProps = {
    onRefresh: () => void;
    onRefocus: () => void;
    isLoading: boolean;
};

export default function ButtonContainer({ onRefresh, onRefocus, isLoading }: ButtonContainerProps) {
    return (
        <View style={ButtonContainerStyles.container}>
            <View style={ButtonContainerStyles.buttonContainer}>
                <RefocusButton onRefocus={onRefocus} />
                <RefreshButton onRefresh={onRefresh} isLoading={isLoading} />
            </View>
        </View>
    );
}