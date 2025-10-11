'use client';
import { ChevronLeft } from "lucide-react";
import { useState } from "react";

const TripCreateHeader = () => {
    const [progress, setProgress] = useState(20)

    return (
        <header className="bg-white text-black shadow-md w-full px-5 py-4 fixed top-0 left-0 z-10 flex flex-row justify-start items-center">
        <div className="flex flex-row items-center gap-3">
            <button
                type="button"
                onClick={() => window.history.back()}
                className="focus:outline-none"
                aria-label="Go back"
            >
                <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            <div>
                <h1 className="text-base font-bold">Create new trip</h1>
                <p className="text-sm">step 1 of 5</p>
            </div>
        </div>
        </header>
    );
    }

export default TripCreateHeader;
