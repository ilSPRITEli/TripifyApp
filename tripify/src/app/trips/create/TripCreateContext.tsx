'use client';

import type { Destination } from '@/lib/type';
import React, { createContext, useContext, useState } from 'react';

type TripCreateContextType = {
  selectedDestination: Destination | null;
  setSelectedDestination: (d: Destination | null) => void;
  currentStep?: number;
  setCurrentStep: (step: number) => void;
  depatureDate: Date | null;
  setDepatureDate: (date: Date | null) => void;
  returnDate?: Date | null;
  setReturnDate?: (date: Date | null) => void;
  allowContinue?: boolean;
  setAllowContinue?: (allow: boolean) => void;
};

const TripCreateContext = createContext<TripCreateContextType | undefined>(undefined);

export const TripCreateProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [depatureDate, setDepatureDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [allowContinue, setAllowContinue] = useState(false);

  return (
    <TripCreateContext.Provider 
      value={{ 
        selectedDestination, 
        setSelectedDestination, 
        currentStep, 
        setCurrentStep, 
        depatureDate, 
        setDepatureDate,
        returnDate,
        setReturnDate,
        allowContinue,
        setAllowContinue
      }}>
      {children}
    </TripCreateContext.Provider>
  );
};

export const useTripCreate = () => {
  const ctx = useContext(TripCreateContext);
  if (!ctx) throw new Error('useTripCreate must be used within TripCreateProvider');
  return ctx;
};

