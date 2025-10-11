'use client';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { mockDestinations } from "@/lib/mockData";
import { Destination } from "@/lib/type";
import { MapPin, Search } from "lucide-react";
import { useEffect, useState } from "react";
import TripCreateFooter from "../_components/tripCreateFooter";
import TripCreateHeader from "../_components/tripCreateHeader";

const CreateTripPage = () => {
    const [progress, setProgress] = useState(20)
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

    // Filter destinations based on search term
    const filteredDestinations = mockDestinations.filter(destination => 
        destination.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        destination.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        destination.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        // Reset selected destination if it no longer matches the search
        if (selectedDestination) {
            const stillExists = filteredDestinations.some(dest => dest === selectedDestination);
            if (!stillExists) {
                setSelectedDestination(null);
            }
            console.log(selectedDestination);
        }

    }
    , [searchTerm, filteredDestinations, selectedDestination]);

    const handleSelectDestination = (dest:Destination) => {
        if (selectedDestination === dest) {
            setSelectedDestination(null);
            return;
        }
        setSelectedDestination(dest);
    }
    return (
        <div className="items-start flex justify-items-start min-h-dvh px-5 pb-20 gap-16 sm:p-20">
            <TripCreateHeader />
            <TripCreateFooter />
            <div className="flex flex-col w-full pt-24 gap-8 min-h-full">
                <div className="w-full flex flex-col items-start justify-start gap-6">
                    <Progress value={progress} className="w-full" />
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
                                    className={`w-full flex flex-row items-center justify-between p-4 rounded-2xl cursor-pointer bg-white transition-colors
                                        ${selectedDestination === destination ? "border-2 border-primary" : " hover:bg-gray-200"}`}
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
            </div>
        </div>
    );
}

export default CreateTripPage;