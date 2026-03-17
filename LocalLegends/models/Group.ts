export default class Group {
    id: number;
    name: string;
    game_id: number;
    status: GroupStatus;
    system_message_id: number;
    last_message_id: number;
    created_at: Date;

    constructor(
        id: number, 
        name: string, 
        game_id: number, 
        status: GroupStatus, 
        system_message_id: number, 
        last_message_id: number, 
        created_at: Date
    ) {
        this.id = id;
        this.name = name;
        this.game_id = game_id;
        this.status = status;
        this.system_message_id = system_message_id;
        this.last_message_id = last_message_id;
        this.created_at = created_at;
    }
}

export enum GroupStatus {
    Active = 'active',
    Inactive = 'inactive',
    Archived = 'archived'
}