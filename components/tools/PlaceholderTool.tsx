import React from 'react';
import { Construction } from 'lucide-react';
import { ToolComponentProps } from './types';
import { ToolContainer, ToolHeader } from './shared';

const PlaceholderTool: React.FC<ToolComponentProps> = ({ isDarkMode }) => {
  return (
    <ToolContainer isDarkMode={isDarkMode}>
      <ToolHeader
        title="Tool Under Construction"
        description="This feature is currently being built. Check back soon!"
        isDarkMode={isDarkMode}
      />
      <div className="flex flex-col items-center justify-center py-24 gap-8">
        <div className={`w-32 h-32 rounded-3xl flex items-center justify-center ${
          isDarkMode ? 'bg-indigo-500/10' : 'bg-indigo-50'
        }`}>
          <Construction
            size={48}
            className={isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}
          />
        </div>
        <div className="text-center space-y-4">
          <h3 className={`text-2xl font-black uppercase italic tracking-tighter ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Coming Soon
          </h3>
          <p className={`text-sm font-bold italic max-w-md ${
            isDarkMode ? 'text-slate-500' : 'text-slate-400'
          }`}>
            This tool is part of the Phase 2 rollout. The infrastructure is in place,
            and we're actively developing this feature.
          </p>
        </div>
      </div>
    </ToolContainer>
  );
};

export default PlaceholderTool;
