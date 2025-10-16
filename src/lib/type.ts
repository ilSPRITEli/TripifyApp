export interface Trip {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number; // calculated from destinations
  destinations?: Destination;
  Interest?: Interest;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  totalDays: number;
  budget: number;
  rating: number | null; // 0..5, can be null
  destinations?: Destination;
  Interest?: Interest;
}

export interface Destination {
  id: string;
  country: string;
  city: string;
  description: string;
  budget: number; // calculated from activities
  trip?: Trip[];
  template?: Template[];
  activities?: Activity[];
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  date: string; // ISO string
  time: string; // "HH:mm" or "HH:mm:ss"
  latitude: number;
  longitude: number;
  location: string;
  budget: number;
  destinationId?: string;
  destination?: Destination;
}

export interface Interest {
  id: string;
  name: string;
  icon: string;
  Trip?: Trip[];
  Template?: Template[];
}