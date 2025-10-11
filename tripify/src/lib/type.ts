export interface Trips {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    destinations: Destination[];
    rating: number;
    travelers: number;
    budget: number;
}

export interface Destination {
    id: string;
    country: string;
    city: string;
    description: string;
    latitude: number;
    longitude: number;
    activities: Activity[];
    budget: number;
}

export interface Activity {
    id: string;
    name: string;
    description: string;
    date: string;
    time: string;
    location: string;
    budget: number;
}