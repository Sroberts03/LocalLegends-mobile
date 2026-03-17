export class Profile {
    id: string;
    display_name: string;
    status: ProfileStatus;
    profile_image_url?: string;

    constructor(id: string, display_name: string, status: ProfileStatus, profile_image_url?: string) {
        this.id = id;
        this.display_name = display_name;
        this.status = status;
        this.profile_image_url = profile_image_url;
    }
}

export enum ProfileStatus {
    Banned = 'banned',
    GoodStanding = 'good_standing'
}