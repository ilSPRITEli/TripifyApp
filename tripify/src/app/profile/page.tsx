import { Suspense } from "react";
import ProfilePage from "../pages/profile";

const Profile = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col items-center justify-items-center min-h-dvh">
        <main className="flex flex-col row-start-2 items-center sm:items-start w-full">
          <ProfilePage />
        </main>
      </div>
    </Suspense>
  );
};

export default Profile;
