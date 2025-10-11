'use client';

import { DatePicker } from '@/components/custom/datePicker';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTripCreate } from '../TripCreateContext';

export default function DatesStepPage() {
  const router = useRouter();
  const { selectedDestination, depatureDate, setDepatureDate, returnDate, setReturnDate, allowContinue, setAllowContinue } = useTripCreate();

  useEffect(() => {
    if (!selectedDestination) {
      // If user navigates directly here, send them back to step 1
      console.log('No destination selected, redirecting to step 1');
      router.replace('/trips/create');
    }
    console.log('Welcome to Step 2: Dates' );
  }, [selectedDestination, router]);

  useEffect(() => {
    setAllowContinue && setAllowContinue(!!(depatureDate && returnDate));
  }, [depatureDate, returnDate, setAllowContinue]);


  if (!selectedDestination) return null;

  const handleSelectDepartureDate = (date: Date | undefined) => {
    if (date) {
      setDepatureDate(date);
      console.log('Selected departure date:', date);
    }
  }

  const handleSelectReturnDate = (date: Date | undefined) => {
    if (date) {
      setReturnDate && setReturnDate(date);
      console.log('Selected return date:', date);
    }
  }

  const isContinueDisabled = !depatureDate || !returnDate;

  return (
    <div className="flex flex-col gap-6">
      <div className="w-full flex flex-col items-start justify-start gap-2">
        <h1 className="text-lg font-bold">When are you traveling?</h1>
        <p className="text-sm text-gray-500">
          Selected destination: {selectedDestination.city}, {selectedDestination.country}
        </p>
      </div>
      <DatePicker label='Departure Date' className='w-full' value={depatureDate||undefined} onChange={handleSelectDepartureDate} />
      <DatePicker label='Return Date' className='w-full' value={returnDate||undefined} onChange={handleSelectReturnDate} />
      <div>
        <p className="text-base">
          Quick Options
        </p>
        <div className='grid grid-cols-2 gap-4 mt-4'>
          <button className='px-4 py-4 shadow-sm bg-white rounded-md text-sm h-fit' onClick={() => {
            if (depatureDate) {
              const returnDate = new Date(depatureDate);
              returnDate.setDate(returnDate.getDate() + 2);
              setReturnDate && setReturnDate(returnDate);
            }else{
              const today = new Date();
              setDepatureDate(today);
              const returnDate = new Date(today);
              returnDate.setDate(returnDate.getDate() + 2);
              setReturnDate && setReturnDate(returnDate);
            }
          }}>
            3 days
          </button>
          <button className='px-4 py-4 shadow-sm bg-white rounded-md text-sm h-fit' onClick={() => {
            if (depatureDate) {
              const returnDate = new Date(depatureDate);
              returnDate.setDate(returnDate.getDate() + 6);
              setReturnDate && setReturnDate(returnDate);
            }else{
              const today = new Date();
              setDepatureDate(today);
              const returnDate = new Date(today);
              returnDate.setDate(returnDate.getDate() + 6);
              setReturnDate && setReturnDate(returnDate);
            }
          }}>
            1 weeks
          </button>
          <button className='px-4 py-4 shadow-sm bg-white rounded-md text-sm h-fit' onClick={() => {
            if (depatureDate) {
              const returnDate = new Date(depatureDate);
              returnDate.setDate(returnDate.getDate() + 13);
              setReturnDate && setReturnDate(returnDate);
            }else{
              const today = new Date();
              setDepatureDate(today);
              const returnDate = new Date(today);
              returnDate.setDate(returnDate.getDate() + 13);
              setReturnDate && setReturnDate(returnDate);
            }
          }}>
            2 weeks
          </button>
          <button className='px-4 py-4 shadow-sm bg-white rounded-md text-sm h-fit' onClick={() => {
            if (depatureDate) {
              const returnDate = new Date(depatureDate);
              returnDate.setDate(returnDate.getDate() + 27);
              setReturnDate && setReturnDate(returnDate);
            }else{
              const today = new Date();
              setDepatureDate(today);
              const returnDate = new Date(today);
              returnDate.setDate(returnDate.getDate() + 27);
              setReturnDate && setReturnDate(returnDate);
            }
          }}>
            1 month
          </button>
        </div>
      </div>
    </div>
  );
}

