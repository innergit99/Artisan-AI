import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, Loader2 } from 'lucide-react';
import { ToolComponentProps } from './types';
import { complianceService } from '../../complianceService';

export const BanShieldTool: React.FC<ToolComponentProps> = ({ 
  toolType, 
  initialPrompt, 
  onBack, 
  isDarkMode 
}) => {
  const [banText, setBanText] = useState(initialPrompt || '');
  const [banResult, setBanResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runAudit = async () => {
    setIsAnalyzing(true);
    try {
      const res = await complianceService.runBanShield(banText);
      setBanResult(res);
    } finally { 
      setIsAnalyzing(false); 
    }
  };

  return (
    <div className={`p-12 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh] space-y-12 animate-in fade-in ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <div className="text-center space-y-4">
        <h1 className="text-7xl font-black uppercase italic tracking-tighter leading-none">KDP Ban Shield <span className="text-rose-500">∞</span></h1>
        <p className={`font-bold uppercase tracking-widest text-xs italic ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Industrial Policy Enforcement for Zero-Risk Publishing.</p>
      </div>

      <div className="w-full relative group">
        <div className={`absolute -inset-1 bg-gradient-to-r ${banResult?.status === 'FLAGGED' ? 'from-rose-500 to-rose-600' : 'from-indigo-500 to-cyan-500'} rounded-[3rem] blur opacity-10 transition duration-500`} />
        <textarea
          value={banText} 
          onChange={e => setBanText(e.target.value)}
          placeholder="Paste Listing Description, Subtitle, or Chapter Hooks for policy audit..."
          className={`relative w-full h-[350px] border rounded-[3rem] p-10 font-medium outline-none focus:border-rose-500 transition-all custom-scrollbar text-lg leading-relaxed ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300 placeholder:text-slate-900' : 'bg-slate-50 border-slate-300 text-slate-700 placeholder:text-slate-400'}`}
        />
      </div>

      <button
        onClick={runAudit}
        disabled={isAnalyzing || !banText}
        className="w-full bg-rose-600 hover:bg-rose-500 disabled:bg-slate-900 py-8 rounded-[3rem] text-white font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-95 border-b-[12px] border-rose-900"
      >
        {isAnalyzing ? <Loader2 className="animate-spin" /> : <ShieldAlert size={24} />}
        <span>{isAnalyzing ? "Scanning Policy Database..." : "Deploy Industrial Scan"}</span>
      </button>

      {banResult && (
        <div className={`w-full p-12 rounded-[4rem] border transition-all animate-in slide-in-from-bottom-8 ${banResult.status === 'CLEAN' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/5 border-rose-500/20 text-rose-500'}`}>
          <div className="flex items-center gap-6 mb-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${banResult.status === 'CLEAN' ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
              {banResult.status === 'CLEAN' ? <ShieldCheck size={32} /> : <ShieldAlert size={32} />}
            </div>
            <div>
              <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Dossier {banResult.status}</h3>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-1">Industrial Compliance Audit Report</p>
            </div>
          </div>
          <p className={`text-lg font-bold italic leading-relaxed ${banResult.status === 'CLEAN' ? (isDarkMode ? 'text-slate-300' : 'text-slate-600') : 'text-rose-400'}`}>
            {banResult.recommendation}
          </p>
        </div>
      )}

      <button 
        onClick={onBack} 
        className={`text-[10px] font-black uppercase transition-colors tracking-[0.3em] ${isDarkMode ? 'text-slate-600 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}
      >
        Return to Lab
      </button>
    </div>
  );
};

export default BanShieldTool;
