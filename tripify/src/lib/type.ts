export interface Trips {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    destinations: Destination[];
    rating: number|null;
    travelers: number;
    interests: Interest;
    budget: number;// calculated from destinations
}

export interface Destination {
    id: string;
    country: string;
    city: string;
    description: string;
    latitude: number;
    longitude: number;
    activities: Activity[];
    budget: number; // calculated from activities
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

export interface Interest {
    id: string;
    name: string;
    icon: string; // URL or icon name
}

// Database trip type (matches Prisma schema)
export interface DatabaseTrip {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    rating: number | null;
    travelers: number;
    budget: number;
    interestId: string | null;
    destinations: DatabaseDestination[];
    Interest: Interest | null;
}

export interface DatabaseDestination {
    id: string;
    country: string;
    city: string;
    description: string;
    latitude: number;
    longitude: number;
    budget: number;
    tripId: string;
    activities: Activity[];
}