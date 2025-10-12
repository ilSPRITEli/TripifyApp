export const metadata = {
  title: "Offline | Tripify",
};

export default function OfflinePage() {
  return (
    <main className="min-h-dvh flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-3">
        <div className="text-3xl font-bold">You’re Offline</div>
        <p className="text-muted-foreground">
          It looks like there’s no internet connection. Some features may be
          unavailable. Please reconnect to continue.
        </p>
      </div>
    </main>
  );
}

