'use client';

import { useEffect } from 'react';
import { Alert } from '@/components/layout/taxonomy/ui/Alert';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Alert
        variant="error"
        title="Something went wrong!"
      >
        <p className="mb-4">
          We encountered an error while loading the application. Please try again later.
        </p>
        <button
          onClick={reset}
          className="bg-red-100 text-red-800 px-4 py-2 rounded-md hover:bg-red-200 transition-colors"
        >
          Try again
        </button>
      </Alert>
    </div>
  );
}

