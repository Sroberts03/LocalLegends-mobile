import { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";

export function getSportIcon(sportName: string): ComponentProps<typeof Ionicons>['name'] {
    switch (sportName) {
        case "Basketball":
            return "basketball";
        case "Soccer":
            return "football";
        case "Football":
            return "american-football";
        default:
            return "football";
    }
}