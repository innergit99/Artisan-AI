import React, { useState } from 'react';
import { Upload, Download } from 'lucide-react';
import { ToolComponentProps } from './types';
import { visualService } from '../../visualService';
import { downloadService } from '../../downloadService';

export const ObjectIsolatorTool: React.FC<ToolComponentProps> = ({ 
  toolType, 
  onBack, 
  isDarkMode 
}) => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [isIsolating, setIsIsolating] = useState(false);
  const [isolatedImage, setIsolatedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runIsolation = async () => {
    if (!sourceImage) return;
    setIsIsolating(true);
    setError(null);
    try {
      const result = await visualService.isolateSubject(sourceImage);
      setIsolatedImage(result);
    } catch (e) { 
      setError("Isolation failed."); 
    }
    finally { 
      setIsIsolating(false); 
    }
  };

  return (
    <div className={`p-12 max-w-4xl mx-auto pb-24 flex flex-col items-center justify-center min-h-[60vh] space-y-12 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-black uppercase italic tracking-tighter">Object Isolator <span className="text-indigo-500">∞</span></h1>
        <p className={`font-bold uppercase tracking-widest text-xs italic ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Industrial Edge Detection & Transparency Engine.</p>
      </div>

      {!sourceImage ? (
        <label className={`w-full aspect-video border-4 border-dashed rounded-[4rem] flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition-all group ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'}`}>
          <input type="file" className="hidden" onChange={e => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (ev) => setSourceImage(ev.target?.result as string);
              reader.readAsDataURL(file);
            }
          }} />
          <div className="p-8 bg-indigo-500/10 rounded-[2.5rem] text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
            <Upload size={48} />
          </div>
          <div className={`mt-6 text-sm font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Drop Master Asset to Begin</div>
        </label>
      ) : (
        <div className="w-full space-y-8">
          <div className={`relative aspect-video rounded-[3rem] overflow-hidden border ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-100'} group`}>
            <img src={isolatedImage || sourceImage} className="w-full h-full object-contain" />
            {isIsolating && (
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <div className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Scanning Subject Geometry...</div>
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setSourceImage(null)} 
              className={`flex-1 py-5 border rounded-[2rem] font-black uppercase tracking-widest text-xs transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white' : 'bg-slate-100 border-slate-300 text-slate-500 hover:text-slate-900'}`}
            >
              New Asset
            </button>
            {!isolatedImage && (
              <button 
                onClick={runIsolation} 
                disabled={isIsolating} 
                className="flex-[2] py-5 bg-indigo-600 hover:bg-indigo-500 rounded-[2rem] font-black uppercase tracking-widest text-xs text-white shadow-xl"
              >
                Run Industrial Isolation
              </button>
            )}
            {isolatedImage && (
              <button 
                onClick={() => downloadService.downloadImage(isolatedImage, 'isolated_asset')} 
                className="flex-[2] py-5 bg-emerald-600 hover:bg-emerald-500 rounded-[2rem] font-black uppercase tracking-widest text-xs text-white shadow-xl flex items-center justify-center gap-3"
              >
                <Download size={16} /> Download PNG
              </button>
            )}
          </div>
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

export default ObjectIsolatorTool;
