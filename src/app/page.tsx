import { Suspense } from "react";
import Header from "./_components/Header";
import Home from "./pages/home";

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="flex flex-col pt-24 items-center sm:items-start w-full px-5 pb-30">
        <Header />
        <Home />
      </main>
    </Suspense>
  );
}
