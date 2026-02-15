import { useState, useCallback } from 'react';

interface UseCopyHandlerReturn {
  copied: boolean;
  copyToClipboard: (text: string) => Promise<void>;
  reset: () => void;
}

export function useCopyHandler(duration: number = 2000): UseCopyHandlerReturn {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, duration);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      setCopied(false);
    }
  }, [duration]);

  const reset = useCallback(() => {
    setCopied(false);
  }, []);

  return {
    copied,
    copyToClipboard,
    reset
  };
}

export default useCopyHandler;
