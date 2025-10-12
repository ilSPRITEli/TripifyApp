'use client';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { mockDestinations } from "@/lib/mockData";
import { Destination } from "@/lib/type";
import { MapPin, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useTripCreate } from "./TripCreateContext";

const CreateTripPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const { selectedDestination, setSelectedDestination, setAllowContinue } = useTripCreate();

    // Filter destinations based on search term
    const filteredDestinations = mockDestinations.filter(destination => 
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
