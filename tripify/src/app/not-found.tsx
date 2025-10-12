'use client';

import { Button } from '@/components/ui/button';
import animationData from '@public/lotties/notfound.json';
import Lottie from 'lottie-react';
import Link from 'next/link';

export default function Notfound() {
  return (
    <div className="w-full h-dvh px-5 pb-30 gap-16 flex flex-col items-center justify-center">
      <Lottie
        animationData={animationData}
        loop
        autoplay
        className="w-[90%] mx-auto"
      />
      <div className='flex flex-col gap-2 mt-4 text-center'>
        <h1 className='text-xl font-bold text-center mt-4'>
            Page Not Found
        </h1>
        <span className='text-xs text-center text-gray-500'>
            Could not find requested resource
        </span>
        <Link href="/" passHref>
            <Button className='!w-fit !h-fit mt-2 mx-auto bg-primary rounded-full text-secondary hover:bg-primary/80 !px-6 !py-4'>
                Back to Home
            </Button>
        </Link>
      </div>
    </div>
  );
}
