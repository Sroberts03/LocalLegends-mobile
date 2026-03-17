export default class Game {
    id: number;
    sportId: number;
    creatorId: number;
    locationId: number;
    name: string;
    description: string;
    maxPlayers: number;
    minPlayers: number;
    status: GameStatus;
    startTime: Date;
    endTime: Date;
    isRecurring: boolean;
    skillLevel: SkillLevel;
    genderPreference: GenderPreference;
    currentPlayerCount: number;

    constructor(
        id: number, 
        sportId: number, 
        creatorId: number, 
        locationId: number, 
        name: string, description: 
        string, maxPlayers: number, 
        minPlayers: number, 
        status: GameStatus, 
        startTime: Date, 
        endTime: Date, 
        isRecurring: boolean, 
        skillLevel: SkillLevel, 
        genderPreference: GenderPreference, 
        currentPlayerCount: number
    ) {
        this.id = id;
        this.sportId = sportId;
        this.creatorId = creatorId;
        this.locationId = locationId;
        this.name = name;
        this.description = description;
        this.maxPlayers = maxPlayers;
        this.minPlayers = minPlayers;
        this.status = status;
        this.startTime = startTime;
        this.endTime = endTime;
        this.isRecurring = isRecurring;
        this.skillLevel = skillLevel;
        this.genderPreference = genderPreference;
        this.currentPlayerCount = currentPlayerCount;
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
    AllMale = 'all male',
    AllFemale = 'all female',
    Coed = 'coed',
    NoPreference = 'no preference'
}
