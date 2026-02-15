import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorDisplayProps {
  isDarkMode: boolean;
  title?: string;
  message: string;
  onRetry?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  isDarkMode,
  title = 'Something Went Wrong',
  message,
  onRetry
}) => {
  return (
    <div className={`rounded-[2rem] p-12 border ${
      isDarkMode
        ? 'bg-red-500/5 border-red-500/20'
        : 'bg-red-50 border-red-100'
    }`}>
      <div className="flex flex-col items-center justify-center gap-8">
        <div className={`w-24 h-24 rounded-3xl flex items-center justify-center ${
          isDarkMode ? 'bg-red-500/10' : 'bg-red-100'
        }`}>
          <AlertTriangle
            size={40}
            className={isDarkMode ? 'text-red-400' : 'text-red-600'}
          />
        </div>
        <div className="text-center space-y-3">
          <h3 className={`text-xl font-black uppercase italic tracking-tighter ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            {title}
          </h3>
          <p className={`text-sm font-bold italic max-w-md ${
            isDarkMode ? 'text-slate-500' : 'text-slate-400'
          }`}>
            {message}
          </p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className={`px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-all hover:-translate-y-0.5 ${
              isDarkMode
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-red-100 text-red-600 hover:bg-red-200'
            }`}
          >
            <RefreshCw size={14} />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
