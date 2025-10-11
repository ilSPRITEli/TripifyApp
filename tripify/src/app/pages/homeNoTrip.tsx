'use client';

import { Button } from '@/components/ui/button';
import animationData from '@public/lotties/noTrip.json';
import Lottie from 'lottie-react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HomeNoTrip() {
  return (
    <div className="w-full h-full">
      <Lottie
        animationData={animationData}
        loop
        autoplay
        className="w-full mx-auto"
      />
      <div className='flex flex-col gap-2 mt-4 text-center'>
        <h1 className='text-xl font-bold text-center mt-4'>
            Let's Get Your Next Adventure Started.
        </h1>
        <span className='text-xs text-center text-gray-500'>
            Your created trips will appear here.Ready to fill this space?
        </span>
        <Link href="/trips/create" passHref>
            <Button className='!w-fit !h-fit mt-2 mx-auto bg-primary rounded-full text-secondary hover:bg-primary/80 !px-6 !py-4'>
                Create New Trip
                <ArrowRight className='h-4 w-4' />
            </Button>
        </Link>
        <Link href="/explore" className='text-xs text-center text-primary underline'>
            need some inspiration? Explore trips.
        </Link>
      </div>
    </div>
  );
}
