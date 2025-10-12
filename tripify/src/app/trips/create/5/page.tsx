'use client';

import { Input } from '@/components/ui/input';
import animationData from '@public/lotties/almostDone.json';
import Lottie from 'lottie-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTripCreate } from '../TripCreateContext';

export default function NameStepPage() {
    const router = useRouter();
    const { selectedDestination, setAllowContinue, travlers, depatureDate, returnDate, interests, budget, name, setName } = useTripCreate();

    useEffect(() => {
        if (!selectedDestination || !(depatureDate && returnDate) || !(travlers && travlers > 0) || !(interests) || !(budget&&budget>=0)) {
        // If user navigates directly here, send them back to step 1
        console.log('No destination selected, redirecting to step 1');
        router.replace('/trips/create');
        }
    }, [selectedDestination, router, depatureDate, returnDate]);

    useEffect(() => {
        setAllowContinue && setAllowContinue(!!(name && name.length > 0));
    }, [setAllowContinue, name]);
    
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName && setName(e.target.value);
    }

    return (
        <div className="flex flex-col gap-6">
        <div className="w-full flex flex-col items-center justify-center gap-2">
            <Lottie
                animationData={animationData}
                loop
                autoplay
                className="w-full mx-auto"
            />
            <h1 className="text-lg font-bold">Almost There!</h1>
            <p className="text-sm text-gray-500">
                Just a few more details to personalize your trip.
            </p>
        </div>
        <Input type="text" placeholder="Trip Name" className="p-3 h-fit w-full bg-white ring-0" 
            value={name||''} onChange={handleNameChange}
        />
        </div>
    );
}

