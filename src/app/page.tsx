import { Suspense } from "react";
import Header from "./_components/Header";
import Home from "./pages/home";

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-dvh px-5 pb-30 gap-16">
      <main className="flex flex-col row-start-2 items-center sm:items-start w-full">
        <Header/>
        <Home />
      </main>
    </div>
    </Suspense>
  );
}
