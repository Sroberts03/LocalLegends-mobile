export default class Message {
    id: number
    group_id: number;
    sender_id: string;
    content: string;
    type: MessageType;
    sent_at: Date;
    is_pinned: boolean;

    constructor(
        id: number, 
        group_id: number, 
        sender_id: string, 
        content: string,
        type: MessageType,
        sent_at: Date,
        is_pinned: boolean
    ) {
        this.id = id;
        this.group_id = group_id;
        this.sender_id = sender_id;
        this.content = content;
        this.type = type;
        this.sent_at = sent_at;
        this.is_pinned = is_pinned;
    }
}

export enum MessageType {
    Text = 'text',
    Image = 'image',
    System = 'system'
}