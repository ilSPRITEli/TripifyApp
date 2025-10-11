'use client';

import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';
import TripCreateFooter from '../_components/tripCreateFooter';
import TripCreateHeader from '../_components/tripCreateHeader';
import { TripCreateProvider, useTripCreate } from './TripCreateContext';

function CreateTripContent({ children }: { children: React.ReactNode }) {
  const { currentStep } = useTripCreate();

  const [progress, setProgress] = useState(20);
  useEffect(() => {
    if (currentStep) {
      setProgress((currentStep / 5) * 100);
    }
  }, [currentStep]);

  return (
    <div className="items-start flex justify-items-start min-h-dvh px-5 pb-20 gap-16 sm:p-20">
      <TripCreateHeader />
      <div className="flex flex-col w-full pt-24 gap-8 min-h-full">
        <Progress value={progress} className="w-full" />
        {children}
      </div>
      <TripCreateFooter />
    </div>
  );
}

export default function CreateTripLayout({ children }: { children: React.ReactNode }) {
  return (
    <TripCreateProvider>
      <CreateTripContent>{children}</CreateTripContent>
    </TripCreateProvider>
  );
}

