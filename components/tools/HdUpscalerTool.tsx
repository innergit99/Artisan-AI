import React, { useState } from 'react';
import { Maximize, Download } from 'lucide-react';
import { ToolComponentProps } from './types';
import { visualService } from '../../visualService';
import { downloadService } from '../../downloadService';

export const HdUpscalerTool: React.FC<ToolComponentProps> = ({ 
  toolType, 
  onBack, 
  isDarkMode 
}) => {
  const [upSource, setUpSource] = useState<string | null>(null);
  const [isUpscaling, setIsUpscaling] = useState(false);
  const [upResult, setUpResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runUpscale = async () => {
    if (!upSource) return;
    setIsUpscaling(true);
    setError(null);
    try {
      const result = await visualService.upscaleImage(upSource);
      setUpResult(result);
    } catch (e) { 
      setError("Upscale engine malfunction."); 
    }
    finally { 
      setIsUpscaling(false); 
    }
  };

  return (
    <div className={`p-12 max-w-4xl mx-auto pb-24 flex flex-col items-center justify-center min-h-[60vh] space-y-12 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-black uppercase italic tracking-tighter">HD Upscaler <span className="text-blue-500">∞</span></h1>
        <p className={`font-bold uppercase tracking-widest text-xs italic ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>300DPI Industrial Restoration for High-End Print.</p>
      </div>

      {!upSource ? (
        <label className={`w-full aspect-video border-4 border-dashed rounded-[4rem] flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-all group ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'}`}>
          <input type="file" className="hidden" onChange={e => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (ev) => setUpSource(ev.target?.result as string);
              reader.readAsDataURL(file);
            }
          }} />
          <div className="p-8 bg-blue-500/10 rounded-[2.5rem] text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
            <Maximize size={48} />
          </div>
          <div className={`mt-6 text-sm font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Initialize Master Scan</div>
        </label>
      ) : (
        <div className="w-full space-y-8">
          <div className={`relative aspect-video rounded-[3rem] overflow-hidden border ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-100'}`}>
            <img src={upSource} className="w-full h-full object-contain" />
            {isUpscaling && (
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <div className="text-[10px] font-black uppercase tracking-widest text-blue-400">Restoring 4K Pixel Map...</div>
              </div>
            )}
          </div>

          {upResult ? (
            <div className={`p-8 border rounded-[2.5rem] flex items-center justify-between ${isDarkMode ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'}`}>
              <div className="flex gap-12">
                <div className="space-y-1">
                  <span className={`text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Resolution</span>
                  <div className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{upResult.resolution}</div>
                </div>
                <div className="space-y-1">
                  <span className={`text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>DPI Index</span>
                  <div className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{upResult.dpi} DPI</div>
                </div>
              </div>
              <button 
                onClick={() => downloadService.downloadImage(upResult.url, 'upscaled_master')} 
                className="px-10 py-5 bg-blue-500 text-slate-950 font-black uppercase tracking-widest rounded-2xl flex items-center gap-3"
              >
                <Download size={20} /> Collect Master
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <button 
                onClick={() => setUpSource(null)} 
                className={`flex-1 py-5 border rounded-[2rem] font-black uppercase tracking-widest text-xs transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white' : 'bg-slate-100 border-slate-300 text-slate-500 hover:text-slate-900'}`}
              >
                Discharge File
              </button>
              <button 
                onClick={runUpscale} 
                disabled={isUpscaling} 
                className="flex-[2] py-5 bg-blue-600 hover:bg-blue-500 rounded-[2rem] font-black uppercase tracking-widest text-xs text-white shadow-xl"
              >
                Engage 300DPI Restore
              </button>
            </div>
          )}
          
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}
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

export default HdUpscalerTool;
