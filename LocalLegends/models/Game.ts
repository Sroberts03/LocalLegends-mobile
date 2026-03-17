export default class Game {
    id: number;
    sport_id: number;
    creator_id: number;
    location_id: number;
    name: string;
    description: string;
    max_players: number;
    min_players: number;
    status: GameStatus;
    start_time: Date;
    end_time: Date;
    is_recurring: boolean;
    skill_level: SkillLevel;
    gender_preference: GenderPreference;
    current_player_count: number;

    constructor(
        id: number, 
        sport_id: number, 
        creator_id: number, 
        location_id: number, 
        name: string, description: 
        string, max_players: number, 
        min_players: number, 
        status: GameStatus, 
        start_time: Date, 
        end_time: Date, 
        is_recurring: boolean, 
        skill_level: SkillLevel, 
        gender_preference: GenderPreference, 
        current_player_count: number
    ) {
        this.id = id;
        this.sport_id = sport_id;
        this.creator_id = creator_id;
        this.location_id = location_id;
        this.name = name;
        this.description = description;
        this.max_players = max_players;
        this.min_players = min_players;
        this.status = status;
        this.start_time = start_time;
        this.end_time = end_time;
        this.is_recurring = is_recurring;
        this.skill_level = skill_level;
        this.gender_preference = gender_preference;
        this.current_player_count = current_player_count;
    }
}

export enum GameStatus {
    Draft = 'draft',
    Active = 'active',
    Finished = 'finished',
    Coordination = 'coordination',
    Canceled = 'canceled'
}

export enum SkillLevel {
    Beginner = 'beginner',
    Intermediate = 'intermediate',
    Advanced = 'advanced',
    All = 'all'
}

export enum GenderPreference {
    AllMale = 'all_male',
    AllFemale = 'all_female',
    Coed = 'coed',
    NoPreference = 'no_preference'
}
