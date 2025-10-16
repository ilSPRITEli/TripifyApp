'use client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Destination } from "@/lib/type";
import { MapPin, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useTripCreate } from "./TripCreateContext";

const CreateTripPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showingDestinations, setShowingDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { selectedDestination, setSelectedDestination, setAllowContinue } = useTripCreate();

    useEffect(() => {
        loadDest();
      }, []);

    const loadDest = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch('/api/destinations');
            if (!response.ok) {
              throw new Error('Failed to fetch trips');
            }
            const data = await response.json();
            setShowingDestinations(data.destinations || []);
            } catch (err) {
            console.error('Error fetching destinations:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
            setLoading(false);
        }
    }

    // Filter destinations based on search term
    const filteredDestinations = showingDestinations.filter(destination => 
        destination.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        destination.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        destination.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (selectedDestination) {
            const stillExists = filteredDestinations.some(dest => dest === selectedDestination);
            if (!stillExists) {
                setSelectedDestination(null);
            }
        }

    }
    , [searchTerm, filteredDestinations, selectedDestination, setSelectedDestination]);

    useEffect(() => {
        if (setAllowContinue) {
            setAllowContinue(!!selectedDestination);
        }
    }, [selectedDestination, setAllowContinue]);

    const handleSelectDestination = (dest:Destination) => {
        if (selectedDestination === dest) {
            setSelectedDestination(null);
            return;
        }
        setSelectedDestination(dest);
    }

    if (loading) {
        return <LoadingDest />;
        }
    
    if (error) {
    return (
        <div className="w-full h-dvh px-5 pb-30 gap-16 flex flex-col items-center justify-center">
        <div className="text-center">
            <h1 className="text-xl font-bold text-red-600 mb-2">Error Loading Interests</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={loadDest} variant="outline">
            Try Again
            </Button>
        </div>
        </div>
    )}
    
    return (
        <>
            <div className="w-full flex flex-col items-start justify-start gap-6">
                <div className="w-full flex flex-col items-start justify-start gap-2">
                    <h1 className="text-lg font-bold">Where do you want to go?</h1>
                    <p className="text-sm text-gray-500">Search for your dream desinations.</p>
                    <Input 
                        type="text" 
                        placeholder="Search for a city, place, address..." 
                        className="p-3 h-fit w-full bg-[#E6E6E6] ring-0"
                        icon={Search}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="w-full flex flex-col items-start justify-start gap-6">
                <div className="w-full flex flex-col items-start justify-start gap-2">
                    <p className="text-xs">
                        {searchTerm ? `Search results for "${searchTerm}"` : "Popular destinations"}
                    </p>
                    {filteredDestinations.length > 0 ? (
                        filteredDestinations.map((destination) => (
                            <button 
                                key={destination.id}
                                onClick={() => handleSelectDestination(destination)}
                                className={`w-full flex flex-row items-center justify-between p-4 rounded-2xl transition-all duration-150 cursor-pointer bg-white
                                    ${selectedDestination === destination ? "border-2 border-primary" : "border-2 border-primary/0"}`}
                            >
                                <div className="flex flex-row items-center gap-4">
                                    <MapPin className="h-4 w-4 text-gray-500" />
                                    <div className="flex flex-col text-start">
                                        <span className="font-bold">{destination.city}, {destination.country}</span>
                                        <span className="text-xs text-gray-500">{destination.country}</span>
                                    </div>
                                </div>
                                <Badge className="bg-secondary text-gray-700">popular</Badge>
                            </button>
                        ))
                    ) : (
                        <div className="w-full flex flex-col items-center justify-center p-8 bg-[#F5F5F5] rounded-lg text-center">
                            <p className="text-gray-500 text-sm">No destinations found matching your search.</p>
                            <p className="text-gray-400 text-xs mt-1">Try searching for a different city or country.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default CreateTripPage;

const LoadingDest = () => {
    return (
        <div className="w-full flex flex-col gap-6 animate-pulse py-8">
            <div className="flex flex-col gap-2">
                <div className="h-6 w-2/3 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-1/2 bg-gray-100 rounded" />
                <div className="h-10 w-full bg-gray-100 rounded mt-3" />
            </div>
            <div className="flex flex-col gap-4 mt-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="w-full flex items-center p-4 rounded-2xl bg-gray-100 border-2 border-gray-200 gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 mr-4" />
                        <div className="flex-1">
                            <div className="h-4 w-1/3 bg-gray-200 rounded mb-1" />
                            <div className="h-3 w-1/4 bg-gray-100 rounded" />
                        </div>
                        <div className="w-14 h-7 bg-gray-200 rounded-full ml-4" />
                    </div>
                ))}
            </div>
        </div>
    )
}