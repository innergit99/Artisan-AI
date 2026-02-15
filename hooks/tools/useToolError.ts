import { useState, useCallback } from 'react';

interface UseToolErrorReturn {
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
  handleError: (err: unknown, fallbackMessage?: string) => void;
  hasError: boolean;
}

export function useToolError(): UseToolErrorReturn {
  const [error, setErrorState] = useState<string | null>(null);

  const setError = useCallback((err: string | null) => {
    setErrorState(err);
  }, []);

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  const handleError = useCallback((err: unknown, fallbackMessage: string = 'An unexpected error occurred'): void => {
    if (err instanceof Error) {
      setErrorState(err.message);
    } else if (typeof err === 'string') {
      setErrorState(err);
    } else {
      setErrorState(fallbackMessage);
    }
  }, []);

  return {
    error,
    setError,
    clearError,
    handleError,
    hasError: error !== null
  };
}

export default useToolError;
