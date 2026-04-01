export interface ParsedAddress {
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    latitude: number;
    longitude: number;
    locationName: string;
    googlePlaceId: string;
    locationDescription: string;
}

export function parseGoogleAddress(data: any, details: any): ParsedAddress {
    const addressComponents = details?.address_components || [];
    
    const getComponent = (types: string[]) => {
        const component = addressComponents.find((c: any) => 
            types.every(type => c.types.includes(type))
        );
        return component ? component.long_name : "";
    };

    const getShortComponent = (types: string[]) => {
        const component = addressComponents.find((c: any) => 
            types.every(type => c.types.includes(type))
        );
        return component ? component.short_name : "";
    };

    // Extract street number and route for full street address
    const streetNumber = getComponent(["street_number"]);
    const route = getComponent(["route"]);
    const intersection = getComponent(["intersection"]);
    
    let streetAddress = `${streetNumber} ${route}`.trim();

    // FALLBACK: If standard street number + route is missing or looks incomplete,
    // use the formatted address to extract intersections or descriptive names
    if (!streetAddress || (streetAddress === route && !streetNumber)) {
        const formatted = details?.formatted_address || "";
        if (formatted) {
            // Take everything before the first comma (usually the street or intersection)
            const firstPart = formatted.split(',')[0].trim();
            // Don't use it if it's identical to the city name (to avoid "Provo, Provo")
            const cityName = getComponent(["locality"]) || getComponent(["sublocality"]);
            if (firstPart && firstPart.toLowerCase() !== cityName.toLowerCase()) {
                streetAddress = firstPart;
            } else if (route) {
                streetAddress = route; // Fallback to just route if it exists
            }
        } else if (intersection) {
            streetAddress = intersection;
        } else if (route) {
            streetAddress = route;
        }
    }

    return {
        streetAddress,
        city: getComponent(["locality"]) || getComponent(["sublocality"]),
        state: getShortComponent(["administrative_area_level_1"]),
        zipCode: getComponent(["postal_code"]),
        country: getComponent(["country"]),
        latitude: details?.geometry?.location?.lat || 0,
        longitude: details?.geometry?.location?.lng || 0,
        locationName: data.structured_formatting?.main_text || details?.name || "",
        googlePlaceId: details?.place_id || data.place_id || "",
        locationDescription: details?.editorial_summary?.overview || "",
    };
}
