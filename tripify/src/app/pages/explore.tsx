'use client'
import TripCard from "@/components/custom/tripCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatabaseTrip, Interest } from "@/lib/type";
import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Explore(){
    const [trips, setTrips] = useState<DatabaseTrip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [interestTerm, setInterestTerm] = useState("All");
    const [interests, setInterests] = useState<Interest[]>([]);

    useEffect(() => {
        showTrip();
        showInterests();
      }, []);
    
    const showTrip = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch('/api/trips');
            if (!response.ok) {
            throw new Error('Failed to fetch trips');
            }
            
            const data = await response.json();
            setTrips(data.trips || []);
        } catch (err) {
            console.error('Error fetching trips:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const showInterests = async () => {
        try {
            const response = await fetch('/api/interests');
            if (!response.ok) {
                throw new Error('Failed to fetch interests');
            }
            const data = await response.json();
            setInterests(Array.isArray(data.interests) ? data.interests : []);
        } catch (err) {
            console.error('Error fetching interests:', err);
            // Not fatal for the page; keep silent UI.
        }
    };

    // Derived filtered list based on search + interest
    const filteredTrips = trips.filter((trip) => {
        const q = searchTerm.trim().toLowerCase();
        const interestFilter = (interestTerm && interestTerm !== "All")
            ? (trip.Interest?.name?.toLowerCase().includes(interestTerm.toLowerCase()) ?? false)
            : true;

        if (!q) return interestFilter;

        const fields: string[] = [];
        fields.push(trip.title || "");
        fields.push(trip.description || "");
        if (trip.Interest?.name) fields.push(trip.Interest.name);
        if (Array.isArray(trip.destinations)) {
            for (const d of trip.destinations) {
                if (d?.city) fields.push(d.city);
                if (d?.country) fields.push(d.country);
                if (d?.description) fields.push(d.description);
            }
        }

        const matches = fields.some((f) => f.toLowerCase().includes(q));
        return matches && interestFilter;
    });

    if (loading) {
        return <LoadingTrips />;
    }
    if (error) {
        return (
          <div className="w-full h-dvh px-5 pb-30 gap-16 flex flex-col items-center justify-center">
            <div className="text-center">
              <h1 className="text-xl font-bold text-red-600 mb-2">Error Loading Trips</h1>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={showTrip} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        );
    }
    if (trips.length === 0) {
        return <NoTrips />;
    }

    return (
        <main className="flex flex-col items-center sm:items-start w-full gap-2">
            <div
              className="w-full flex flex-col gap-4 h-96 items-start justify-end p-5 pb-10"
              style={{
                backgroundImage: 'url("/images/exploreHeader.png")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                overflow: "hidden"
              }}
            >
                <h1 className="text-xl text-white font-bold">
                    Discover amazing destinations around the world!
                </h1>
                <Link href={"/"} className="text-xs text-secondary underline" >
                    how it works
                </Link>
                <Input
                    type="text"
                    placeholder="Search destinations, interests..."
                    value={searchTerm}
                    icon={Search}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white/30 text-white font-medium py-2 h-fit rounded-full "
                />
            </div>
            <div className="w-full flex flex-col gap-8 px-5 pb-30">
                <div className="flex flex-row gap-2 w-full overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-thumb-rounded-md py-2 px-1">
                    {["All", ...interests.map((i) => i.name)].map((interest) => (
                        <button 
                            key={interest}
                            onClick={() => {
                                // Toggle off goes back to "All"; avoid setting "All" twice
                                if (interest === "All") setInterestTerm("All");
                                else if (interestTerm === interest) setInterestTerm("All");
                                else setInterestTerm(interest);
                            }}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-150
                                ${interestTerm === interest ? "bg-primary text-secondary" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}
                            `}
                        >
                            {interest}
                        </button>
                    ))}
                </div>
                <div className="grid grid-cols-1 gap-0 w-full">
                    <h1 className='text-xl font-bold'>Trending Trips.</h1>
                    <div className="w-full">
                        <div className="flex flex-row gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-thumb-rounded-md py-2 px-1">
                                {filteredTrips.map((trip) => {
                                const destination = trip.destinations?.[0];
                                const location = destination
                                    ? `${destination.city}, ${destination.country}`
                                    : "Unknown Location";

                                return (
                                    <div className="min-w-[320px] max-w-xs flex-shrink-0" key={trip.id}>
                                    <TripCard
                                        title={trip.title}
                                        location={location}
                                        startDate={trip.startDate}
                                        endDate={trip.endDate}
                                        travelers={trip.travelers}
                                        className="py-0 w-full"
                                        imageUrl="/images/tripImage.png"
                                        showAction = {false}
                                        onAction={() => {
                                        console.log("View trip:", trip.id);
                                        }}
                                    />
                                    </div>
                                );
                                })}
                                {filteredTrips.length === 0 && (
                                  <div className="text-sm text-gray-500 py-4">No trips match your filters.</div>
                                )}
                            </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-0 w-full">
                    <h1 className='text-xl font-bold'>Recommended by Tripify.</h1>
                    <div className="w-full">
                        <div className="flex flex-row gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-thumb-rounded-md py-2 px-1">
                            {filteredTrips.map((trip) => {
                            const destination = trip.destinations?.[0];
                            const location = destination
                                ? `${destination.city}, ${destination.country}`
                                : "Unknown Location";

                            return (
                                <div className="min-w-[320px] max-w-xs flex-shrink-0" key={trip.id}>
                                <TripCard
                                    title={trip.title}
                                    location={location}
                                    startDate={trip.startDate}
                                    endDate={trip.endDate}
                                    travelers={trip.travelers}
                                    className="py-0 w-full"
                                    imageUrl="/images/tripImage.png"
                                    showAction = {false}
                                    onAction={() => {
                                    console.log("View trip:", trip.id);
                                    }}
                                />
                                </div>
                            );
                            })}
                            {filteredTrips.length === 0 && (
                              <div className="text-sm text-gray-500 py-4">No trips match your filters.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export function LoadingTrips() {
    return (
      <div className="w-full h-dvh px-5 pb-30 gap-16 flex flex-col items-center justify-center">
        <div className="w-[90%] mx-auto animate-pulse">
          <div className="h-48 bg-gray-200 rounded-md mb-4"></div>
          <div className="h-6 bg-gray-200 rounded-md mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded-md mb-2 w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded-md mb-2 w-1/3"></div>
        </div>
      </div>
    );
}

export function NoTrips() {
    return (
        <div className="w-full h-dvh px-5 pb-30 gap-16 flex flex-col items-center justify-center">
        <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">No Trips Available</h1>
            <p className="text-gray-600 mb-4">There are no trips scheduled. Be the first!</p>
            <Link href="/trips/create" passHref>
                <Button className='!w-fit !h-fit mt-2 mx-auto bg-primary rounded-full text-secondary hover:bg-primary/80 !px-6 !py-4'>
                    Start planning now <ArrowRight className='ml-2' size={16} />
                </Button>
            </Link>
        </div>
        </div>
    );
}
