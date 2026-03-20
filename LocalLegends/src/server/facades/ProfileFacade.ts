import { ProfileInfo } from "@/src/models/Profile";

export default interface IProfileFacade {
    me(): Promise<ProfileInfo>;
    getUserProfile(userId: string): Promise<ProfileInfo>;
}