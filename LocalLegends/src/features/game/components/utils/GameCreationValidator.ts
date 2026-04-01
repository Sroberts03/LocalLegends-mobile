import { GameCreation } from "@/src/models/Game";

export function validateGameCreation(
    name: string, 
    sportId: string,
    locationName: string,
    locationDescription: string,
    streetAddress: string,
    city: string,
    state: string,
    zipCode: string,
    country: string,
    latitude: number,
    longitude: number,
    maxPlayers: number,
    minPlayers: number,
    startTime: Date,
    endTime: Date,
    isRecurring: boolean,
    skillLevel: string,
    genderPreference: string,
    accessType: string,
    ): string | null {
    if (!name.trim() || 
        !sportId || 
        !locationName.trim() || 
        !streetAddress.trim() || 
        !city.trim() || 
        !state.trim() || 
        !zipCode.trim() || 
        !country.trim() || 
        latitude === undefined || latitude === null ||
        longitude === undefined || longitude === null ||
        !maxPlayers || 
        !minPlayers || 
        !startTime || 
        !endTime || 
        isRecurring === undefined || isRecurring === null ||
        !skillLevel || 
        !genderPreference || 
        !accessType) {
        return "Please fill in all required fields";
    }
    
    if (startTime > endTime) {
        return "Start time must be before end time";
    }
    
    if (minPlayers > maxPlayers) {
        return "Minimum players must be less than or equal to maximum players";
    }

    return null;
}
    