export interface Trip {
  id: string;
  title: string;
  description: string;
  startDate: string; // ISO Date
  endDate: string;   // ISO Date
  travelers: number;
  isTemplate: boolean;
  rating?: number | null;
  budget: number; // Decimal as string to match Prisma Decimal handling
  activities?: Activity[];

  destination?: Destination | null;
  Interest?: Interest | null;
}

export interface Destination {
  id: string;
  country: string;
  city: string;
  description: string;
  trip?: Trip[];
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  date: string; // ISO string
  time: string;
  latitude: number;
  longitude: number;
  location: string;
  budget: number; // Decimal as string
  trip?: Trip | null;
}

export interface Interest {
  id: string;
  name: string;
  icon: string;
  trip?: Trip[];
}