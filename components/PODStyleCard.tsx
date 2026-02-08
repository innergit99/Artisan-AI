import React from 'react';
import { Check } from 'lucide-react';

interface PODStyleCardProps {
  style: {
    id: string;
    label: string;
    category: string;
    gradient: string;
    icon?: React.ReactNode;
  };
  isSelected: boolean;
  onClick: () => void;
}

export const PODStyleCard: React.FC<PODStyleCardProps> = ({ 
  style, 
  isSelected, 
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative group overflow-hidden rounded-2xl transition-all duration-300
        ${isSelected 
          ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900 scale-105 shadow-[0_0_30px_rgba(99,102,241,0.4)]' 
          : 'hover:scale-102 hover:shadow-xl border border-white/5 hover:border-white/20'
        }
      `}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-linear-to-br ${style.gradient} opacity-80 group-hover:opacity-100 transition-opacity`} />
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4zKSIvPjwvc3ZnPg==')]" />
      
      {/* Content */}
      <div className="relative p-4 h-28 flex flex-col justify-between">
        {/* Category Badge */}
        <div className="flex justify-between items-start">
          <span className="text-[8px] font-black uppercase tracking-widest text-white/60 bg-black/20 px-2 py-1 rounded-full">
            {style.category}
          </span>
          {isSelected && (
            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg">
              <Check size={14} className="text-white" strokeWidth={3} />
            </div>
          )}
        </div>
        
        {/* Label */}
        <div>
          <h3 className="text-sm font-black uppercase italic tracking-tighter text-white leading-tight">
            {style.label}
          </h3>
          <div className={`h-0.5 rounded-full mt-2 transition-all duration-300 ${isSelected ? 'w-full bg-white/50' : 'w-0 group-hover:w-8 bg-white/30'}`} />
        </div>
      </div>
      
      {/* Hover Glow */}
      <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
};
