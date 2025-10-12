'use client';

import TripCard from '@/components/custom/tripCard';
import { Button } from '@/components/ui/button';
import { DatabaseTrip } from '@/lib/type';
import animationData from '@public/lotties/noTrip.json';
import Lottie from 'lottie-react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [trips, setTrips] = useState<DatabaseTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    showTrip();
  }, []);

  const showTrip = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/trips');
      if (!response.ok) {
        throw new Error('Failed to fetch trips');
      }
      
      const data = await response.json();
      setTrips(data.trips || []);
    } catch (err) {
      console.error('Error fetching trips:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingTrips />;
  }

  if (error) {
    return (
      <div className="w-full h-dvh px-5 pb-30 gap-16 flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-red-600 mb-2">Error Loading Trips</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={showTrip} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (trips.length === 0) {
    return <NoTrips />;
  }

  return (
    <div className="w-full h-dvh gap-10 flex flex-col items-center justify-center">
      <div className="grid grid-cols-1 gap-2 w-full">
        <h1 className='text-xl font-bold'>Next Trip</h1>
        {(() => {
          const sortedTrips = [...trips].sort(
            (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          );
          const nextTrip = sortedTrips[0];
          if (!nextTrip) return null;
          const destination = nextTrip.destinations?.[0];
          const location = destination
            ? `${destination.city}, ${destination.country}`
            : "Unknown Location";

          return (
            <TripCard
              key={nextTrip.id}
              title={nextTrip.title}
              location={location}
              startDate={nextTrip.startDate}
              endDate={nextTrip.endDate}
              travelers={nextTrip.travelers}
              className="py-0"
              imageUrl="/images/tripImage.png"
              onAction={() => {
                console.log("View trip:", nextTrip.id);
              }}
            />
          );
        })()}
      </div>
      <div className="grid grid-cols-1 gap-2 w-full">
        <h1 className='text-xl font-bold'>Your upcoming trips.</h1>
        <div className="w-full">
          <div className="flex flex-row gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-thumb-rounded-md py-2 px-1">
            {trips.map((trip) => {
              const destination = trip.destinations?.[0];
              const location = destination
                ? `${destination.city}, ${destination.country}`
                : "Unknown Location";

              return (
                <div className="min-w-[320px] max-w-xs flex-shrink-0" key={trip.id}>
                  <TripCard
                    title={trip.title}
                    location={location}
                    startDate={trip.startDate}
                    endDate={trip.endDate}
                    travelers={trip.travelers}
                    className="py-0"
                    imageUrl="/images/tripImage.png"
                    showAction = {false}
                    onAction={() => {
                      console.log("View trip:", trip.id);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function NoTrips() {
  return (
    <>
      <Lottie
        animationData={animationData}
        loop
        autoplay
        className="w-[90%] mx-auto"
      />
      <div className='flex flex-col gap-2 mt-4 text-center'>
        <h1 className='text-xl font-bold text-center mt-4'>
          Let&apos;s Get Your Next Adventure Started.
        </h1>
        <span className='text-xs text-center text-gray-500'>
          Your created trips will appear here.Ready to fill this space?
        </span>
        <Link href="/trips/create" passHref>
            <Button className='!w-fit !h-fit mt-2 mx-auto bg-primary rounded-full text-secondary hover:bg-primary/80 !px-6 !py-4'>
                Start planning now <ArrowRight className='ml-2' size={16} />
            </Button>
        </Link>
        <Link href="/explore" className='text-xs text-primary underline'>
          need some inspiration? click
        </Link>
      </div>
    </>
  );
}

export function LoadingTrips() {
  return (
    <div className="w-full h-dvh px-5 pb-30 gap-16 flex flex-col items-center justify-center">
      <div className="w-[90%] mx-auto animate-pulse">
        <div className="h-48 bg-gray-200 rounded-md mb-4"></div>
        <div className="h-6 bg-gray-200 rounded-md mb-2 w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded-md mb-2 w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded-md mb-2 w-1/3"></div>
      </div>
    </div>
  );
}
