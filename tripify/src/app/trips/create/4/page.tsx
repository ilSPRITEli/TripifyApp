'use client';

import { mockInterests } from '@/lib/mockData';
import { Interest } from '@/lib/type';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTripCreate } from '../TripCreateContext';

export default function PreferenceStepPage() {
    const router = useRouter();
    const { selectedDestination, setAllowContinue, travlers, depatureDate, returnDate, interests, setInterests, budget, setBudget } = useTripCreate();

    useEffect(() => {
        if (!selectedDestination || !(depatureDate && returnDate) || !(travlers && travlers > 0)) {
        // If user navigates directly here, send them back to step 1
        console.log('No destination selected, redirecting to step 1');
        router.replace('/trips/create');
        }
    }, [selectedDestination, router, depatureDate, returnDate]);

    useEffect(() => {
        setAllowContinue && setAllowContinue(!!(interests) && !!(budget&&budget>=0));
    }, [setAllowContinue, interests, budget]);

    const handleInterestsChange = (intr:Interest) => {
        if (!setInterests) return;
        if (!interests) {
            setInterests(intr);
            return;
        }else if (interests.name === intr.name) {
            setInterests(null);
            return;
        }
    }

    const handleBudgetChange = (num: number) => {
        if (num < 0) {
        setBudget && setBudget(0);
        return;
        }
        setBudget && setBudget(num);
    }

    interface BudgetOption {
        label: string;
        icon: string;
        value: number;
        description: string;
    }

    const budgetOptions:BudgetOption[] = [
        { label: 'Economy', icon: '💸', value: 500, description: 'Up to ฿500' },
        { label: 'Standard', icon: '💰', value: 1500, description: 'Up to ฿1500' },
        { label: 'Premium', icon: '🤑', value: 3000, description: 'Up to ฿3000' },
        { label: 'Luxury', icon: '💎', value: 5000, description: 'Up to ฿5000' },
    ];

    return (
        <div className="flex flex-col gap-6">
        <div className="w-full flex flex-col items-start justify-start gap-2">
            <h1 className="text-lg font-bold">Trip preferences</h1>
            <p className="text-sm text-gray-500">
                Help us to tailor your trip plan.
            </p>
        </div>
        
            <div>
                <p className="text-base">
                What best describes your trip?
                </p>
                <div className='grid grid-cols-1 gap-4 mt-4'>
                {budgetOptions.map((option) => (
                    <button key={option.label} className={`px-4 flex flex-row items-center py-4 shadow-sm bg-white rounded-md text-sm text-start h-fit transition-all duration-150 ${budget === option.value ? 'border-2 border-primary' : 'border-2 border-primary/0'}`}
                    onClick={() => {
                        handleBudgetChange(option.value);
                    }}>
                        <p className='text-3xl font-bold text-primary overflow-visible'>{option.icon}</p>
                        <div className='ml-2 flex flex-col'>
                            <p className='text-base font-bold'>{option.label}</p>
                            <span className='text-xs text-gray-500'>{option.value}</span>
                        </div>
                    </button>
                ))}
                </div>
            </div>
            <div>
                <p className="text-base">
                What best describes your trip?
                </p>
                <div className='grid grid-cols-2 gap-4 mt-4'>
                {mockInterests.map((option) => (
                    <button
                    key={option.name}
                    className={`px-4 flex flex-row items-center py-4 shadow-sm bg-white rounded-md text-sm text-start h-fit transition-all duration-150 ${(interests && interests.name === option.name) ? 'border-2 border-primary' : 'border-2 border-primary/0'}`}
                    onClick={() => {
                    handleInterestsChange(option);
                    }}>
                        <p className='text-3xl font-bold text-primary overflow-visible'>{option.icon}</p>
                        <div className='ml-2 flex flex-col'>
                            <p className='text-base font-bold'>{option.name}</p>
                        </div>
                    </button>
                ))}
                </div>
            </div>
        </div>
    );
}

