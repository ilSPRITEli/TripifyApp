import { Suspense } from "react";
import Explore from "../pages/explore";

const ExplorePage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="flex flex-col items-center justify-items-center min-h-dvh">
            <main className="flex flex-col row-start-2 items-center sm:items-start w-full">
                <Explore />
            </main>
            </div>
        </Suspense>
    );
}

export default ExplorePage;