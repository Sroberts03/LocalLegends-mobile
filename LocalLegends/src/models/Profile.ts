export default class Profile {
    id: string;
    displayName: string;
    status: ProfileStatus;
    profileImageUrl?: string;

    constructor(id: string, displayName: string, status: ProfileStatus, profileImageUrl?: string) {
        this.id = id;
        this.displayName = displayName;
        this.status = status;
        this.profileImageUrl = profileImageUrl;
    }
}

export enum ProfileStatus {
    Banned = 'banned',
    GoodStanding = 'good_standing'
}