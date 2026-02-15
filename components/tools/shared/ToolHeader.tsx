import React from 'react';

interface ToolHeaderProps {
  title: string;
  description?: string;
  isDarkMode: boolean;
  action?: React.ReactNode;
}

const ToolHeader: React.FC<ToolHeaderProps> = ({
  title,
  description,
  isDarkMode,
  action
}) => {
  return (
    <div className="mb-12 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
      <div className="space-y-4">
        <h1 className={`text-6xl font-black uppercase italic tracking-tighter leading-[0.9] ${
          isDarkMode ? 'text-white' : 'text-slate-900'
        }`}>
          {title}
        </h1>
        {description && (
          <p className={`text-base font-bold italic max-w-2xl leading-relaxed ${
            isDarkMode ? 'text-slate-500' : 'text-slate-400'
          }`}>
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
};

export default ToolHeader;
