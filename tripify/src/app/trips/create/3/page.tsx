'use client';

import { Minus, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTripCreate } from '../TripCreateContext';

export default function TravelerStepPage() {
    const router = useRouter();
    const { selectedDestination, setAllowContinue, travlers, setTravlers, depatureDate, returnDate } = useTripCreate();

    useEffect(() => {
    if (!selectedDestination || !(depatureDate && returnDate)) {
        // If user navigates directly here, send them back to step 1
        console.log('No destination selected, redirecting to step 1');
        router.replace('/trips/create');
    }
    console.log('Welcome to Step 2: Dates' );
    }, [selectedDestination, router, depatureDate, returnDate]);

    useEffect(() => {
    setAllowContinue && setAllowContinue(!!(travlers && travlers > 0));
    }, [setAllowContinue, travlers, depatureDate, returnDate]);

    const handleTravelersChange = (num: number) => {
    if (num < 1) {
        setTravlers && setTravlers(1);
        return;
    }
    setTravlers && setTravlers(num);
    }

    const quickOptions = [
    { label: 'Just Me', icon: '👤', value: 1, description: 'solo trip' },
    { label: 'Duo', icon: '🧑‍🤝‍🧑', value: 2, description: '2 people' },
    { label: 'Small Group', icon: '👨‍👨‍👧‍👦', value: 4, description: '4 people' },
    { label: 'Large Group', icon: '🎉', value: 8, description: '8 people' },
    ];

    return (
    <div className="flex flex-col gap-6">
        <div className="w-full flex flex-col items-start justify-start gap-2">
        <h1 className="text-lg font-bold">How many traveler</h1>
        <p className="text-sm text-gray-500">
            Including yourself.
        </p>
        </div>
        <div className='w-full flex flex-row items-center justify-center gap-8'>
        <button className='text-3xl font-bold text-secondary w-10 h-10 aspect-square bg-primary rounded-full' onClick={() => {
            handleTravelersChange((travlers||1) - 1);
        }}><Minus className='w-4 h-4 mx-auto'/></button>
        <div className='w-fit flex flex-col items-center justify-center gap-2'>
            <input type="number" min={1} className='text-center h-fit overflow w-full max-w-32 font-bold bg-transparent text-6xl text-primary ring-0' value={travlers||1} onChange={(e) => {
                const val = parseInt(e.target.value);
                handleTravelersChange(val);
            }} />
            <p className='text-sm text-gray-500'>
                travelers
            </p>
        </div>
        <button className='text-3xl font-bold text-secondary w-10 h-10 aspect-square bg-primary rounded-full' onClick={() => {
            handleTravelersChange((travlers||1) + 1);
        }}><Plus className='w-4 h-4 mx-auto'/></button>
    </div>
        <div>
        <div className='grid grid-cols-1 gap-4 mt-4'>
            {quickOptions.map((option) => (
            <button key={option.value} className={`px-4 flex flex-row items-center py-4 shadow-sm bg-white rounded-md text-sm text-start h-fit ${travlers === option.value ? 'border-2 border-primary' : 'border-2 border-primary/0'}`}
            onClick={() => {
                handleTravelersChange(option.value);
            }}>
                <p className='text-3xl font-bold text-primary min-w-12 text-center'>{option.icon}</p>
                <div className='ml-2 flex flex-col'>
                    <p className='text-base font-bold'>{option.label}</p>
                    <span className='text-xs text-gray-500'>{option.description}</span>
                </div>
            </button>
        ))}
        </div>
        </div>
    </div>
    );
}

