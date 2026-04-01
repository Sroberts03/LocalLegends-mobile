import Game from "@/src/models/Game";
import Profile from "@/src/models/Profile";

export interface GetProfileInfoRes {
    profile: Profile,
    favoriteSports: string[],
    mostRecentGames: Game[],
}

