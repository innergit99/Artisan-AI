import React from 'react';

interface ToolContainerProps {
  children: React.ReactNode;
  isDarkMode: boolean;
  className?: string;
}

const ToolContainer: React.FC<ToolContainerProps> = ({
  children,
  isDarkMode,
  className = ''
}) => {
  return (
    <div className={`p-12 animate-in fade-in duration-500 relative pb-40 min-h-screen ${className}`}>
      <div className={`absolute inset-0 pointer-events-none z-0 overflow-hidden ${
        isDarkMode ? 'opacity-[0.15]' : 'opacity-[0.4]'
      }`}>
        <div className={`absolute inset-0 bg-linear-to-b ${
          isDarkMode
            ? 'from-slate-950 via-indigo-950/20 to-slate-950'
            : 'from-slate-50 via-white/80 to-slate-50'
        }`} />
      </div>
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] blur-[200px] rounded-full transition-colors duration-1000 ${
        isDarkMode ? 'bg-indigo-500/5' : 'bg-indigo-500/10'
      }`} />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default ToolContainer;
