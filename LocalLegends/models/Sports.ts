export default class Sports {
    id: number;
    name: string;
    category: SportCategory;
    slug: string;
    image_url: string;
    status: string;

    constructor(id: number, name: string, category: SportCategory, slug: string, image_url: string, status: string) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.slug = slug;
        this.image_url = image_url;
        this.status = status;
    }
}

export enum SportCategory {
    Indoor = 'indoor',
    Outdoor = 'outdoor',
    Water = 'water',
    Winter = 'winter',
    Extreme = 'extreme',
    Other = 'other'
}

export enum SportStatus {
    Active = 'active',
    Inactive = 'inactive'
}