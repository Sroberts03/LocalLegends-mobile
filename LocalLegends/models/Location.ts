export class location {
    id: number;
    google_place_id: string;
    name: string;
    description?: string;
    street_address: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    latitude: number;
    longitude: number;

    constructor(
        id: number, 
        google_place_id: string, 
        name: string, 
        street_address: string, 
        city: string, 
        state: string,
        zip_code: string,
        country: string,
        latitude: number,
        longitude: number,
        description?: string
    ) {
        this.id = id;
        this.google_place_id = google_place_id;
        this.name = name;
        this.street_address = street_address;
        this.city = city;
        this.state = state;
        this.zip_code = zip_code;
        this.country = country;
        this.latitude = latitude;
        this.longitude = longitude;
        this.description = description;
    }
}