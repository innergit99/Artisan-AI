import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { ToolComponentProps } from './types';
import { CharacterVault } from '../CharacterVault';

export const CharacterVaultTool: React.FC<ToolComponentProps> = ({ 
  toolType, 
  onBack, 
  isDarkMode 
}) => {
  return (
    <div className={`p-12 max-w-[1600px] mx-auto pb-24 animate-in fade-in ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <div className="flex items-center justify-between mb-16">
        <button 
          onClick={onBack} 
          className={`flex items-center space-x-2 transition-colors uppercase font-black text-[10px] tracking-widest leading-none ${isDarkMode ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}
        >
          <ChevronLeft size={16} /> <span>Exit Vault</span>
        </button>
        <div className="px-6 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase text-indigo-400 tracking-widest">
          Character Continuity Engine V1.0
        </div>
      </div>

      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-7xl font-black uppercase italic tracking-tighter leading-none">Character <span className="text-indigo-500">Vault</span></h1>
          <p className={`font-bold uppercase tracking-widest text-xs italic ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Maintain Visual DNA Consistency across the Multiverse.</p>
        </div>

        <CharacterVault />
      </div>
    </div>
  );
};

export default CharacterVaultTool;
