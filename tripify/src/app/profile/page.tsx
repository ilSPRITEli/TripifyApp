import { Suspense } from "react";

const Profile = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl font-bold mb-4">Profile Page</h1>
            <p className="text-lg text-gray-600">This is the profile page.</p>
        </div>
        </Suspense>
    );
}

export default Profile;