import { GameWithDetails } from "@/src/models/Game";
import Profile from "@/src/models/Profile";
import Sport from "@/src/models/Sport";

export interface GetProfileResponse extends Profile {
    favoriteSports: Sport[];
    last5Games: GameWithDetails[];
    totalGamesHosted: number;
    totalGamesJoined: number;
}

export interface EditProfileRequest {
    displayName?: string;
    bio?: string;
    profilePicture?: string;
}

export interface EditProfileResponse extends Profile { 
    favoriteSports: Sport[];
    last5Games: GameWithDetails[];
    totalGamesHosted: number;
    totalGamesJoined: number;
}
    
