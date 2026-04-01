import BaseRequest from "../BaseRequest";
import { GetProfileInfoRes } from "./Profile.types";

export const ProfileApi = {
    /**
     * Fetches the profile info for a given user ID from the mobile backend.
     * Includes profile details, favorite sports, and recent games.
     */
    async getProfileInfo(userId: string): Promise<GetProfileInfoRes> {
        return await BaseRequest("GET", { userId }, "profile");
    }
};
