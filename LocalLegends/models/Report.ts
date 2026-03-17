export default class Report {
    id: number;
    reporter_id: string;
    reported_user_id: string;
    reason: string;
    group_id?: number;
    created_at: Date;

    constructor(
        id: number,
        reporter_id: string,
        reported_user_id: string,
        reason: string,
        group_id: number | undefined,
        created_at: Date
    ) {
        this.id = id;
        this.reporter_id = reporter_id;
        this.reported_user_id = reported_user_id;
        this.reason = reason;
        this.group_id = group_id;
        this.created_at = created_at;
    }
}