"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Something went wrong</h2>
      <p className="text-gray-600">{error.message}</p>
      <button
        onClick={reset}
        className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
      >
        Try again
      </button>
    </div>
  );
}
