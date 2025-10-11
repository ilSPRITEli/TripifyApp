import { Suspense } from "react";

const Explore = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
        <main className="pt-24 pb-20 px-5">
            <h1 className="text-2xl font-bold mb-4">Explore Page</h1>
            <p>This is the Explore page of the Tripify app.</p>
        </main>
        </Suspense>
    );
}

export default Explore;