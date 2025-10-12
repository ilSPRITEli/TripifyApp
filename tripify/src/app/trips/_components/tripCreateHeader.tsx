'use client';
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTripCreate } from "../create/TripCreateContext";

const TripCreateHeader = () => {

    const { currentStep, setCurrentStep } = useTripCreate();

    const router = useRouter();

    const handleGoBack = () => {
        if (currentStep && currentStep > 1) {
            const tempStep = currentStep-1;
            if(tempStep == 1){
                setCurrentStep(1);
                router.push(`/trips/create`);
                return;
            }
            setCurrentStep(currentStep - 1);
            router.push(`/trips/create/${currentStep - 1}`);
        }else{
            router.push('/');
        }
    }
    return (
        <header className="bg-white text-black shadow-md w-full px-5 py-4 fixed top-0 left-0 z-10 flex flex-row justify-start items-center">
        <div className="flex flex-row items-center gap-3">
            <button
                type="button"
                onClick={() => handleGoBack()}
                className="focus:outline-none"
                aria-label="Go back"
            >
                <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            <div>
                <h1 className="text-base font-bold">Create new trip</h1>
                <p className="text-sm">step {currentStep} of 5</p>
            </div>
        </div>
        </header>
    );
    }

export default TripCreateHeader;
