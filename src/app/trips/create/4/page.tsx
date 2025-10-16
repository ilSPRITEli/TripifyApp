'use client';

import { Button } from '@/components/ui/button';
import { Interest } from '@/lib/type';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTripCreate } from '../TripCreateContext';

export default function PreferenceStepPage() {
    const router = useRouter();
    const [showingInterest, setShowingInterest] = useState<Interest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { selectedDestination, setAllowContinue, travlers, depatureDate, returnDate, interest, setInterest, budget, setBudget } = useTripCreate();

    useEffect(() => {
        showInterest();
      }, []);
    
    useEffect(() => {
        if (!selectedDestination || !(depatureDate && returnDate) || !(travlers && travlers > 0)) {
        // If user navigates directly here, send them back to step 1
        console.log('No destination selected, redirecting to step 1');
        router.replace('/trips/create');
        }
    }, [selectedDestination, router, depatureDate, returnDate, travlers]);

    useEffect(() => {
        if (setAllowContinue) {
            setAllowContinue(!!(interest) && !!(budget && budget >= 0));
        }
    }, [setAllowContinue, interest, budget]);

    const showInterest = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const response = await fetch('/api/interests');
          if (!response.ok) {
            throw new Error('Failed to fetch trips');
          }
          
          const data = await response.json();
          setShowingInterest(data.interests || []);
        } catch (err) {
          console.error('Error fetching interests:', err);
          setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
          setLoading(false);
        }
      };
    
    if (loading) {
    return <LoadingInterests />;
    }

    if (error) {
    return (
        <div className="w-full h-dvh px-5 pb-30 gap-16 flex flex-col items-center justify-center">
        <div className="text-center">
            <h1 className="text-xl font-bold text-red-600 mb-2">Error Loading Interests</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={showInterest} variant="outline">
            Try Again
            </Button>
        </div>
        </div>
    )}

    const handleInterestsChange = (intr:Interest) => {
        if (!setInterest) return;
        if (!interest || interest.name != intr.name) {
            setInterest(intr);
            return;
        }else if (interest.name === intr.name) {
            setInterest(null);
            return;
        }
    }

    const handleBudgetChange = (num: number) => {
        if (num < 0) {
        if (setBudget) setBudget(0);
        return;
        }
        if (setBudget) setBudget(num);
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
                {showingInterest.map((option) => (
                    <button
                    key={option.name}
                    className={`px-4 flex flex-row items-center py-4 shadow-sm bg-white rounded-md text-sm text-start h-fit transition-all duration-150 ${(interest && interest.name === option.name) ? 'border-2 border-primary' : 'border-2 border-primary/0'}`}
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

const LoadingInterests = () => {
    return (
        <div className="w-full flex flex-col gap-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="grid grid-cols-1 gap-4 mt-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex flex-row items-center px-4 py-4 bg-gray-100 rounded-md">
                        <div className="w-10 h-10 bg-gray-300 rounded-full mr-4" />
                        <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                            <div className="h-3 bg-gray-200 rounded w-1/6" />
                        </div>
                    </div>
                ))}
            </div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mt-6" />
            <div className="grid grid-cols-2 gap-4 mt-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex flex-row items-center px-4 py-4 bg-gray-100 rounded-md">
                        <div className="w-10 h-10 bg-gray-300 rounded-full mr-4" />
                        <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-1/4" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}