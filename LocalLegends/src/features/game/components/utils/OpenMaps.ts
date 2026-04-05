import {Alert, Platform, Linking } from "react-native";
import { GameWithDetails } from '@/src/models/Game';

export const handleAddressPress = (selectedGame: GameWithDetails) => {
        const { latitude, longitude, locationName } = selectedGame;
        const scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
        const url = Platform.select({
            ios: `${scheme}0,0?q=${locationName}&ll=${latitude},${longitude}`,
            android: `${scheme}${latitude},${longitude}?q=${locationName}`
        });

        Alert.alert(
            "Open in Maps",
            "Choose your preferred maps provider",
            [
                {
                    text: "Apple Maps",
                    onPress: () => {
                        const appleUrl = `http://maps.apple.com/?q=${locationName}&ll=${latitude},${longitude}`;
                        Linking.openURL(appleUrl);
                    }
                },
                {
                    text: "Google Maps",
                    onPress: () => {
                        const googleUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
                        Linking.openURL(googleUrl);
                    }
                },
                {
                    text: "Cancel",
                    style: "cancel"
                }
            ]
        );
    };