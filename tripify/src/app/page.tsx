import { Suspense } from "react";
import HomeNoTrip from "./pages/homeNoTrip";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-dvh px-5 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col row-start-2 items-center sm:items-start">
        <HomeNoTrip />
      </main>
    </div>
    </Suspense>
  );
}
