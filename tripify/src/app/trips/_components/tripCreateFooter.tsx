'use client';

import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const TripCreateFooter = () => {
    return (
        <header className="bg-white text-black shadow-md w-full px-5 pt-4 pb-8 fixed bottom-0 left-0 z-10 flex flex-row justify-start items-center">
        <button
                type="button"
                onClick={() => toast.success("Trip created successfully!")}
                className="focus:outline-none max-auto bg-primary text-secondary px-4 py-2 rounded-full w-full hover:bg-primary/90 transition"
                aria-label="Continue"
            >
                Continue
                <ArrowRight className="h-4 w-4 inline-block ml-2" />
        </button>
        </header>
    );
    }

export default TripCreateFooter;
