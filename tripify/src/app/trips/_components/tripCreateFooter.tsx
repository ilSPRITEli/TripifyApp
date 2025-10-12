'use client';

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTripCreate } from "../../trips/create/TripCreateContext";

const TripCreateFooter = () => {
  const router = useRouter();
  const [ buttonText, setButtonText ] = useState('Continue');
  const [ isCreating, setIsCreating ] = useState(false);
  const { 
    currentStep, 
    setCurrentStep, 
    allowContinue,
    selectedDestination,
    depatureDate,
    returnDate,
    travlers,
    budget,
    interests,
    name
  } = useTripCreate();

  const handleContinue = async () => {
    // Step-aware navigate
    if (currentStep && currentStep < 5) {
        if (allowContinue === false) {
            toast.error('Please complete the current step before continuing.');
            return;
        }
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        router.push(`/trips/create/${nextStep}`);
    } else if (currentStep === 5) {
        // Create trip in database
        await createTrip();
    } else {
        router.push('/trips/create');
    }
  };

  const createTrip = async () => {
    if (isCreating) return;
    
    setIsCreating(true);
    setButtonText('Creating...');

    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          selectedDestination,
          depatureDate,
          returnDate,
          travlers,
          budget,
          interests
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create trip');
      }

      console.log('Created trip data' + await response.json());

      toast.success('Trip created successfully!');
      router.push('/');
    } catch (error) {
      console.error('Error creating trip:', error);
      toast.error('Failed to create trip. Please try again.');
    } finally {
      setIsCreating(false);
      setButtonText('Create Trip');
    }
  };

  useEffect(() => {
    if (currentStep === 5) {
        setButtonText('Create Trip');
    } else {
        setButtonText('Continue');
    }
  }, [currentStep]);

  const disabled = !(allowContinue) || isCreating;

  return (
    <header className="bg-white text-black shadow-md w-full px-5 pt-4 pb-8 fixed bottom-0 left-0 z-10 flex flex-row justify-start items-center">
        <button
            type="button"
            onClick={handleContinue}
            disabled={disabled}
            className={`focus:outline-none mx-auto px-4 py-2 rounded-full w-full transition ${
            disabled
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-primary text-secondary hover:bg-primary/90'
            }
            ${ currentStep === 5 ? 'hidden' : 'block' }    
            `}
            aria-label="Continue"
        >
            {buttonText}
            <ArrowRight className={`h-4 w-4 ml-2 inline-block`} />
        </button>
        <button
            type="button"
            onClick={handleContinue}
            disabled={disabled}
            className={`focus:outline-none mx-auto px-4 py-2 rounded-full w-full transition ${
            disabled
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-primary text-secondary hover:bg-primary/90'
            }
            ${ currentStep === 5 ? 'block' : 'hidden' }    
            `}
            aria-label="Continue"
        >
            {buttonText}
        </button>
    </header>
  );
};

export default TripCreateFooter;
