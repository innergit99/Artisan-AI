
import React from 'react';
import { ToolType } from '../types';
import {
  LayoutDashboard, Palette, Shirt, Box, PenTool, Scissors, Maximize,
  ImageIcon, Settings, Crown, TrendingUp, Search, BookOpen, Target,
  Rocket, ShieldCheck, BarChart3, ShieldAlert, Users
} from 'lucide-react';

interface SidebarProps {
  activeTab: ToolType;
  onNavigate: (tab: ToolType) => void;
  isDarkMode: boolean;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  accent?: boolean;
  isDarkMode: boolean;
}> = ({ icon, label, isActive, onClick, accent, isDarkMode }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${isActive
      ? (accent ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg' : (isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-indigo-600'))
      : (isDarkMode ? 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-indigo-600')
      }`}
  >
    <span className={`${isActive ? (accent ? 'text-white' : (isDarkMode ? 'text-indigo-400' : 'text-indigo-600')) : (isDarkMode ? 'text-slate-500 group-hover:text-slate-300' : 'text-slate-400 group-hover:text-indigo-500')}`}>{icon}</span>
    <span className="text-sm font-semibold">{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onNavigate, isDarkMode }) => {
  return (
    <aside className={`w-64 border-r flex flex-col h-full transition-colors duration-300 ${isDarkMode ? 'bg-[#0a0f1d] border-slate-900 text-slate-100' : 'bg-white border-slate-200 shadow-xl z-50 text-slate-900'}`}>
      <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
        <div className="mb-10 flex items-center gap-3 px-1">
          <img src="/assets/publishlab_logo.svg" alt="PublishLab Logo" className="w-12 h-12 object-contain drop-shadow-lg" />
          <h1 className={`text-lg font-black italic tracking-tighter leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            PublishLab <span className="text-indigo-500 block">Studio</span>
          </h1>
        </div>

        <nav className="space-y-1">
          <NavItem isDarkMode={isDarkMode} isActive={activeTab === ToolType.DASHBOARD} onClick={() => onNavigate(ToolType.DASHBOARD)} icon={<LayoutDashboard size={18} />} label="Dashboard" accent={activeTab === ToolType.DASHBOARD} />
        </nav>

        <div className="mt-8">
          <p className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 mb-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Production Units</p>
          <div className="space-y-1">
            <NavItem isDarkMode={isDarkMode} isActive={activeTab === ToolType.COLORING_PAGES} onClick={() => onNavigate(ToolType.COLORING_PAGES)} icon={<BookOpen size={16} />} label="KDP Book Lab" />
            <NavItem isDarkMode={isDarkMode} isActive={activeTab === ToolType.POD_MERCH} onClick={() => onNavigate(ToolType.POD_MERCH)} icon={<Shirt size={16} />} label="POD Designer" />
            <NavItem isDarkMode={isDarkMode} isActive={activeTab === ToolType.NICHE_RADAR} onClick={() => onNavigate(ToolType.NICHE_RADAR)} icon={<Target size={16} />} label="Niche Radar" />
            <NavItem isDarkMode={isDarkMode} isActive={activeTab === ToolType.TREND_INTELLIGENCE} onClick={() => onNavigate(ToolType.TREND_INTELLIGENCE)} icon={<TrendingUp size={16} />} label="Trend Intelligence" />
            <NavItem isDarkMode={isDarkMode} isActive={activeTab === ToolType.AMAZON_SEO} onClick={() => onNavigate(ToolType.AMAZON_SEO)} icon={<Rocket size={16} />} label="Amazon SEO Engine" />
          </div>
        </div>

        <div className="mt-8">
          <p className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 mb-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Factory Floor</p>
          <div className="space-y-1">
            <NavItem isDarkMode={isDarkMode} isActive={activeTab === ToolType.BRAND_INTELLIGENCE} onClick={() => onNavigate(ToolType.BRAND_INTELLIGENCE)} icon={<Search size={16} />} label="Brand Analyzer" />
            <NavItem isDarkMode={isDarkMode} isActive={activeTab === ToolType.LOGO_CREATOR} onClick={() => onNavigate(ToolType.LOGO_CREATOR)} icon={<Box size={16} />} label="Logo Creator" />
            <NavItem isDarkMode={isDarkMode} isActive={activeTab === ToolType.TEXT_TO_IMAGE} onClick={() => onNavigate(ToolType.TEXT_TO_IMAGE)} icon={<Palette size={16} />} label="Text to Image" />
            <NavItem isDarkMode={isDarkMode} isActive={activeTab === ToolType.MANUSCRIPT_DOCTOR} onClick={() => onNavigate(ToolType.MANUSCRIPT_DOCTOR)} icon={<PenTool size={16} />} label="Manuscript Doctor" />
          </div>
        </div>

        <div className="mt-8">
          <p className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 mb-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Optimization</p>
          <div className="space-y-1">
            <NavItem isDarkMode={isDarkMode} isActive={activeTab === ToolType.BAN_SHIELD} onClick={() => onNavigate(ToolType.BAN_SHIELD)} icon={<ShieldCheck size={16} />} label="KDP Ban Shield" />
            <NavItem isDarkMode={isDarkMode} isActive={activeTab === ToolType.PROFIT_ESTIMATOR} onClick={() => onNavigate(ToolType.PROFIT_ESTIMATOR)} icon={<BarChart3 size={16} />} label="Profit Estimator" />
            <NavItem isDarkMode={isDarkMode} isActive={activeTab === ToolType.HD_UPSCALER} onClick={() => onNavigate(ToolType.HD_UPSCALER)} icon={<Maximize size={16} />} label="HD Upscaler" />
            <NavItem isDarkMode={isDarkMode} isActive={activeTab === ToolType.OBJECT_ISOLATOR} onClick={() => onNavigate(ToolType.OBJECT_ISOLATOR)} icon={<Scissors size={16} />} label="Object Isolator" />
          </div>
        </div>
      </div>

      <div className={`mt-auto p-4 border-t ${isDarkMode ? 'border-slate-900 bg-slate-950/50' : 'border-slate-100 bg-slate-50/50'}`}>
        <div className="px-4 py-3 mb-4 rounded-xl bg-slate-900/50 border border-slate-800 animate-pulse">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Powerhouse Engine</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          </div>
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 w-[92%]"></div>
          </div>
          <div className="mt-2 flex justify-between text-[8px] font-bold text-slate-600 uppercase tracking-tighter">
            <span>92% Quota</span>
            <span>12ms Latency</span>
          </div>
        </div>
        <NavItem isDarkMode={isDarkMode} isActive={activeTab === ToolType.MY_GALLERY} onClick={() => onNavigate(ToolType.MY_GALLERY)} icon={<ImageIcon size={18} />} label="Master Gallery" />
        <NavItem isDarkMode={isDarkMode} isActive={activeTab === ToolType.CHARACTER_VAULT} onClick={() => onNavigate(ToolType.CHARACTER_VAULT)} icon={<Users size={18} />} label="Character Vault" />
        <NavItem isDarkMode={isDarkMode} isActive={activeTab === ToolType.SETTINGS} onClick={() => onNavigate(ToolType.SETTINGS)} icon={<Settings size={18} />} label="Diagnostics" />
      </div>
    </aside>
  );
};


export default Sidebar;
