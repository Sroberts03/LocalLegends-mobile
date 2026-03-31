export default class Group {
    id: number;
    name: string;
    gameId: number;
    status: GroupStatus;
    systemMessageId: number;
    lastMessageId: number;
    createdAt: Date;

    constructor(
        id: number,
        name: string,
        gameId: number,
        status: GroupStatus,
        systemMessageId: number,
        lastMessageId: number,
        createdAt: Date
    ) {
        this.id = id;
        this.name = name;
        this.gameId = gameId;
        this.status = status;
        this.systemMessageId = systemMessageId;
        this.lastMessageId = lastMessageId;
        this.createdAt = createdAt;
    }
}

export enum GroupStatus {
    Active = 'active',
    Inactive = 'inactive',
    Archived = 'archived'
}