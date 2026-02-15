import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  isDarkMode: boolean;
  message?: string;
  subMessage?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  isDarkMode,
  message = 'Processing...',
  subMessage
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-8">
      <div className={`w-24 h-24 rounded-3xl flex items-center justify-center ${
        isDarkMode ? 'bg-indigo-500/10' : 'bg-indigo-50'
      }`}>
        <Loader2
          size={40}
          className={`animate-spin ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}
        />
      </div>
      <div className="text-center space-y-3">
        <h3 className={`text-xl font-black uppercase italic tracking-tighter ${
          isDarkMode ? 'text-white' : 'text-slate-900'
        }`}>
          {message}
        </h3>
        {subMessage && (
          <p className={`text-sm font-bold italic max-w-md ${
            isDarkMode ? 'text-slate-500' : 'text-slate-400'
          }`}>
            {subMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingState;
