import { View } from "react-native";
import RefreshButton from "./RefreshButton";
import { ButtonContainerStyles } from "../themes/ButtonContainerThemes";

type ButtonContainerProps = {
    onRefresh: () => void;
    isLoading: boolean;
};

export default function ButtonContainer({ onRefresh, isLoading }: ButtonContainerProps) {
    return (
        <View style={ButtonContainerStyles.container}>
            <RefreshButton onRefresh={onRefresh} isLoading={isLoading} />
        </View>
    );
}