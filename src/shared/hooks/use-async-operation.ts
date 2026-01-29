/**
 * Generic async operation hook with loading and error states
 */

import { useState, useCallback } from 'react';

interface UseAsyncOperationReturn<T extends any[]> {
  loading: boolean;
  error: string | null;
  execute: (...args: T) => Promise<void>;
  reset: () => void;
}

export function useAsyncOperation<T extends any[] = []>(
  operation: (...args: T) => Promise<void>
): UseAsyncOperationReturn<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: T) => {
      setLoading(true);
      setError(null);

      try {
        await operation(...args);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Operation failed';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [operation]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return { loading, error, execute, reset };
}
