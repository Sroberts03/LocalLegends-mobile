import BaseRequest from "../../BaseRequest";
import { GetProfileResponse } from "../profile.types";

export const ProfileApi = {
    async getMyProfile(): Promise<GetProfileResponse> {
        return await BaseRequest("GET", {}, "profile/my-profile");
    },
}