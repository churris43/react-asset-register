"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import "./globals.css";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-semibold text-white m-2">
        500: Something went wrong!
      </h2>

      <button
        className="border-2 px-2 py-2 border-white rounded-md bg-blue-400 hover:bg-blue-600"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
