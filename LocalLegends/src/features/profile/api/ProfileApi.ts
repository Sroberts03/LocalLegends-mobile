import BaseRequest from "../../BaseRequest";
import { EditProfileRequest, EditProfileResponse, GetProfileResponse } from "../profile.types";

export const ProfileApi = {
    async getMyProfile(): Promise<GetProfileResponse> {
        return await BaseRequest("GET", {}, "profile/my-profile");
    },

    async editProfile(data: EditProfileRequest): Promise<EditProfileResponse> {
        return await BaseRequest("PUT", data, "profile/my-profile");
    }
}