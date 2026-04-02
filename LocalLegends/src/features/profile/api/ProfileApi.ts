import BaseRequest from "../../BaseRequest";
import { EditFavoriteSportsRequest, EditFavoriteSportsResponse, EditProfileRequest, EditProfileResponse, GetProfileResponse } from "../profile.types";

export const ProfileApi = {
    async getMyProfile(): Promise<GetProfileResponse> {
        return await BaseRequest("GET", {}, "profile/my-profile");
    },

    async editProfile(data: EditProfileRequest): Promise<EditProfileResponse> {
        return await BaseRequest("PUT", data, "profile/my-profile");
    },

    async editFavoriteSports(data: EditFavoriteSportsRequest): Promise<EditFavoriteSportsResponse> {
        return await BaseRequest("PUT", data, "profile/my-profile/favorite-sports");
    }
}