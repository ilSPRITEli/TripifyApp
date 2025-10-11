'use client';

import { ArrowRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useTripCreate } from "../../trips/create/TripCreateContext";

const TripCreateFooter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { selectedDestination, currentStep, setCurrentStep, depatureDate, returnDate, allowContinue } = useTripCreate();

  const handleContinue = () => {
    // Step-aware navigate
    if (currentStep && currentStep < 5) {
        if (allowContinue === false) {
            toast.error('Please complete the current step before continuing.');
            return;
        }
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        console.log(`Navigating to step ${nextStep}`);
        router.push(`/trips/create/${nextStep}`);
    } else {
        router.push('/trips/create');
    }
  };

  const disabled = !(allowContinue);

  return (
    <header className="bg-white text-black shadow-md w-full px-5 pt-4 pb-8 fixed bottom-0 left-0 z-10 flex flex-row justify-start items-center">
        <button
            type="button"
            onClick={handleContinue}
            disabled={disabled}
            className={`focus:outline-none max-auto px-4 py-2 rounded-full w-full transition ${
            disabled
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-primary text-secondary hover:bg-primary/90'
            }`}
            aria-label="Continue"
        >
            Continue
            <ArrowRight className="h-4 w-4 inline-block ml-2" />
        </button>
    </header>
  );
};

export default TripCreateFooter;
