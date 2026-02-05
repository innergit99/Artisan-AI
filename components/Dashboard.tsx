import React, { useState, useEffect } from 'react';
import { ToolType, TrendingNiche, UserIntent, DashboardUIState } from '../types';
import { TOOLS } from '../constants';
import { gemini } from '../geminiService';
import {
  Palette, Shirt, Box, PenTool, Scissors, Maximize, Grid2X2,
  TrendingUp, Sparkles, Zap, ArrowRight, Loader2, BarChart3, RotateCw,
  Search, ShieldCheck, Target, BookOpen, Rocket, FileEdit, Monitor,
  ShieldAlert, Info
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: ToolType, prompt?: string) => void;
  isDarkMode: boolean;
}

const IconMap: Record<string, any> = {
  palette: Palette,
  shirt: Shirt,
  box: Box,
  'pen-tool': PenTool,
  scissors: Scissors,
  maximize: Maximize,
  'layout-grid': Grid2X2,
  'trending-up': TrendingUp,
  'search': Search,
  'target': Target,
  'book-open': BookOpen,
  'file-edit': FileEdit,
  'rocket': Rocket,
  'bar-chart-3': BarChart3,
  'shield-check': ShieldCheck
};

// --- INTENT -> TOOL MAP ---
const INTENT_PRIORITY: Record<UserIntent, { primary: ToolType[], secondary: ToolType[], label: string }> = {
  [UserIntent.IDLE]: {
    primary: [ToolType.TREND_INTELLIGENCE, ToolType.NICHE_RADAR],
    secondary: [ToolType.COLORING_PAGES, ToolType.POD_MERCH],
    label: 'Identify Your Next Big Hit'
  },
  [UserIntent.DISCOVER]: {
    primary: [ToolType.TREND_INTELLIGENCE, ToolType.NICHE_RADAR],
    secondary: [ToolType.PROFIT_ESTIMATOR],
    label: 'Explore Market Opportunities'
  },
  [UserIntent.VALIDATE]: {
    primary: [ToolType.NICHE_RADAR, ToolType.PROFIT_ESTIMATOR],
    secondary: [ToolType.BRAND_INTELLIGENCE, ToolType.TREND_INTELLIGENCE],
    label: 'Validate Your Strategy'
  },
  [UserIntent.CREATE]: {
    primary: [ToolType.COLORING_PAGES, ToolType.POD_MERCH, ToolType.TEXT_TO_IMAGE],
    secondary: [ToolType.LOGO_CREATOR, ToolType.BRAND_INTELLIGENCE],
    label: 'Build Your Assets'
  },
  [UserIntent.OPTIMIZE]: {
    primary: [ToolType.MANUSCRIPT_DOCTOR, ToolType.HD_UPSCALER, ToolType.OBJECT_ISOLATOR],
    secondary: [ToolType.BRAND_INTELLIGENCE, ToolType.BAN_SHIELD],
    label: 'Refine & Polish'
  },
  [UserIntent.PUBLISH]: {
    primary: [ToolType.AMAZON_SEO, ToolType.PROFIT_ESTIMATOR, ToolType.BAN_SHIELD],
    secondary: [ToolType.NICHE_RADAR],
    label: 'Prepare for Launch'
  },
  [UserIntent.PROTECT]: {
    primary: [ToolType.BAN_SHIELD, ToolType.MANUSCRIPT_DOCTOR],
    secondary: [ToolType.AMAZON_SEO, ToolType.PROFIT_ESTIMATOR],
    label: 'Audit & Secure'
  }
};

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, isDarkMode }) => {
  const [trends, setTrends] = useState<{ pod: TrendingNiche[], kdp: TrendingNiche[] }>({ pod: [], kdp: [] });
  const [loadingTrends, setLoadingTrends] = useState(false);

  // --- INTENT ENGINE STATE ---
  const [intent, setIntent] = useState<UserIntent>(UserIntent.IDLE);
  const [uiState, setUiState] = useState<DashboardUIState>(DashboardUIState.DEFAULT);
  const [activeProject, setActiveProject] = useState<any>(null);

  useEffect(() => {
    // RESOLVE INTENT ON MOUNT
    const historyString = localStorage.getItem('publishlab_tool_history');
    const history = historyString ? JSON.parse(historyString) : [];
    const project = localStorage.getItem('kdp_project_autosave');
    const blueprint = localStorage.getItem('kdp_blueprint_autosave');

    if (project) setActiveProject(JSON.parse(project));

    // Simple Intent Resolution Logic
    if (blueprint) {
      setIntent(UserIntent.OPTIMIZE);
      setUiState(DashboardUIState.FOCUSED);
    } else if (history.length > 0) {
      const lastTool = history[history.length - 1];
      if (lastTool === ToolType.NICHE_RADAR) setIntent(UserIntent.CREATE);
      else if (lastTool === ToolType.TREND_INTELLIGENCE) setIntent(UserIntent.VALIDATE);
      else setIntent(UserIntent.DISCOVER);
      setUiState(DashboardUIState.FOCUSED);
    } else {
      setIntent(UserIntent.DISCOVER);
      setUiState(DashboardUIState.GUIDED);
    }
  }, []);

  const fetchTrendsData = async () => {
    setLoadingTrends(true);
    try {
      const data = await gemini.fetchTrends();
      setTrends(data);
    } catch (e) {
      console.error("Trends fetch failed", e);
    } finally {
      setLoadingTrends(false);
    }
  };

  const handleToolClick = (toolId: ToolType) => {
    // Track history for intent mapping
    const historyString = localStorage.getItem('publishlab_tool_history');
    const history = historyString ? JSON.parse(historyString) : [];
    const newHistory = [...history, toolId].slice(-10);
    localStorage.setItem('publishlab_tool_history', JSON.stringify(newHistory));
    onNavigate(toolId);
  };

  const allTrends = [...trends.pod, ...trends.kdp];

  // --- DYNAMIC CTA MAP ---
  const getCtaLabel = (toolId: ToolType) => {
    if (intent === UserIntent.DISCOVER) return "Find Opportunities";
    if (intent === UserIntent.CREATE) return "Start Creating";
    if (intent === UserIntent.OPTIMIZE) return "Improve Quality";
    if (intent === UserIntent.PUBLISH) return "Prepare for Launch";
    return "Engage Tool";
  };

  return (
    <div className="p-12 animate-in fade-in duration-500 relative pb-40">
      {/* STUDIO BACKGROUND LAYER */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className={`absolute inset-0 transition-opacity duration-1000 ${isDarkMode ? 'opacity-[0.15]' : 'opacity-[0.4]'}`}>
          <img
            src="/assets/dashboard_bg.png"
            alt=""
            className={`w-full h-full object-cover grayscale transition-all duration-1000 ${!isDarkMode ? 'invert brightness-150 contrast-50' : ''}`}
          />
          <div className={`absolute inset-0 bg-gradient-to-b ${isDarkMode ? 'from-slate-950 via-indigo-950/20 to-slate-950' : 'from-slate-50 via-white/80 to-slate-50'}`}></div>
        </div>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] blur-[200px] rounded-full transition-colors duration-1000 ${isDarkMode ? 'bg-indigo-500/5' : 'bg-indigo-500/10'}`}></div>
      </div>

      <div className="relative z-10">
        <div className="mb-20 flex flex-col xl:flex-row xl:items-end justify-between gap-12">
          <div className="space-y-8 max-w-4xl">
            <div className="flex items-center gap-4">
              <div className="px-5 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 animate-pulse">PublishLab v4.2</div>
              {activeProject && (
                <div className="px-5 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active: {activeProject.title}
                </div>
              )}
            </div>
            <h1 className={`text-8xl font-black uppercase italic tracking-tighter leading-[0.85] ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Master your <br /><span className="text-indigo-600">Intent.</span>
            </h1>
            <div className="space-y-4">
              <p className={`text-4xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-indigo-400/60' : 'text-indigo-600/40'}`}>
                {INTENT_PRIORITY[intent].label}
              </p>
              <p className={`text-sm font-bold italic max-w-2xl leading-relaxed ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                The industrial dashboard has adapted to your current workflow signals. High-velocity tools prioritized for maximum throughput.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6 w-full xl:max-w-2xl">
            {/* INTENT-AWARE BANNER */}
            <div className={`p-10 rounded-[4rem] border backdrop-blur-3xl shadow-2xl relative overflow-hidden group transition-all duration-700 ${isDarkMode ? 'bg-indigo-600/5 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000">
                <Monitor size={160} />
              </div>

              <div className="flex items-center gap-3 mb-8 text-indigo-500 font-black text-[10px] uppercase tracking-[0.4em]">
                <RotateCw size={14} className="animate-spin" /> Contextual Recommendation
              </div>
              <div className="space-y-6">
                <h4 className={`text-xl font-black uppercase italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {intent === UserIntent.DISCOVER ? "Start with Niche Validation" :
                    intent === UserIntent.OPTIMIZE ? "Refine Your Manuscript Flow" :
                      intent === UserIntent.CREATE ? "Deploy Your Design Blueprint" : "Access the Industrial Suite"}
                </h4>
                <p className="text-xs font-bold text-slate-500 leading-relaxed italic">
                  {intent === UserIntent.DISCOVER ? "We detected interest in new markets. Use Niche Radar to verify demand before investing build time." :
                    intent === UserIntent.OPTIMIZE ? "Your book structure is defined. Now utilize the Manuscript Doctor to ensure KDP compliance." :
                      "The autonomous publishing factory is idling at optimal capacity. Engaged required studio module to continue."}
                </p>
                <button
                  onClick={() => handleToolClick(INTENT_PRIORITY[intent].primary[0])}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 shadow-xl shadow-indigo-600/20 transition-all hover:-translate-y-1">
                  Next Best Action <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* DYNAMIC TOOLS GRID */}
        <div className="space-y-32">
          {['CORE', 'CREATIVE', 'UTILITY'].map((category) => {
            const categoryTools = TOOLS.filter(t => t.category === category);

            // Re-order based on Intent - DISABLED to maintain static industrial sequencing (1,2,3,4,5) as requested
            const sortedTools = [...categoryTools];
            /* 
            const sortedTools = [...categoryTools].sort((a, b) => {
              const aPriority = INTENT_PRIORITY[intent].primary.includes(a.id) ? 2 : INTENT_PRIORITY[intent].secondary.includes(a.id) ? 1 : 0;
              const bPriority = INTENT_PRIORITY[intent].primary.includes(b.id) ? 2 : INTENT_PRIORITY[intent].secondary.includes(b.id) ? 1 : 0;
              return bPriority - aPriority;
            });
            */

            return (
              <div key={category} className="space-y-12">
                <div className="flex items-center gap-8">
                  <h2 className={`text-2xl font-black uppercase italic tracking-[0.3em] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    {category === 'CORE' ? '🟣 Core Publishing Factory' :
                      category === 'CREATIVE' ? '🔵 Content & Aesthetic DNA' :
                        '⚙️ Industrial Utilities'}
                  </h2>
                  <div className={`h-[1px] flex-1 ${isDarkMode ? 'bg-white/5' : 'bg-slate-200'}`} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                  {sortedTools.map((tool) => {
                    const Icon = IconMap[tool.icon] || Sparkles;
                    const isPrimary = INTENT_PRIORITY[intent].primary.includes(tool.id);
                    const isDeemphasized = !isPrimary && !INTENT_PRIORITY[intent].secondary.includes(tool.id) && intent !== UserIntent.IDLE;

                    return (
                      <button
                        key={tool.id}
                        onClick={() => handleToolClick(tool.id)}
                        className={`group relative h-[450px] rounded-[4rem] overflow-hidden text-left transition-all duration-700 border-2 
                          ${isPrimary ? (isDarkMode ? 'scale-105 z-20 shadow-[0_0_80px_rgba(99,102,241,0.3)] border-indigo-500/60' : 'scale-105 z-20 shadow-[0_0_80px_rgba(37,99,235,0.15)] border-indigo-200') : (isDarkMode ? 'border-white/10 card-industrial-pulse' : 'border-slate-900/20 shadow-2xl shadow-black/5')}
                          ${isDeemphasized ? (isDarkMode ? 'opacity-70 grayscale-[0.3]' : 'opacity-100 grayscale-0') + ' scale-95 hover:opacity-100 hover:grayscale-0 hover:scale-100' : 'opacity-100'}
                          ${isDarkMode ? 'bg-slate-800/80 backdrop-blur-3xl hover:border-indigo-500/50 hover:shadow-[0_0_60px_rgba(99,102,241,0.2)]' : 'bg-white border-slate-200 shadow-2xl shadow-slate-400/20 hover:border-indigo-500 hover:shadow-indigo-500/20'}`}
                      >
                        {/* SEMANTIC BACKGROUND IMAGE */}
                        <div
                          className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 blur-[1px] group-hover:scale-110 group-hover:blur-0
                            ${isDarkMode ? 'opacity-[0.5] group-hover:opacity-[0.8]' : 'opacity-[0.3] group-hover:opacity-[0.7] grayscale group-hover:grayscale-0 mix-blend-multiply'}`}
                          style={{ backgroundImage: `url(${tool.image})` }}
                        />
                        <div className={`absolute inset-0 transition-all duration-700 ${isDarkMode ? 'bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent' : 'bg-gradient-to-t from-white via-white/40 to-transparent group-hover:from-white/60'}`} />

                        {/* STATUS BADGES */}
                        <div className="absolute top-10 left-10 flex items-center gap-3">
                          {isPrimary && (
                            <div className="px-4 py-1.5 rounded-full bg-indigo-600 text-white text-[8px] font-black uppercase tracking-[0.2em] shadow-lg animate-bounce">
                              Recommended
                            </div>
                          )}
                          <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${isDarkMode ? 'bg-slate-950/50 border-white/5 text-slate-500 font-bold' : 'bg-white/50 border-slate-200 text-slate-400'}`}>
                            {tool.category === 'CORE' ? 'Industrial Engine' : tool.category === 'UTILITY' ? 'Precision Tool' : 'Studio Module'}
                          </div>
                        </div>

                        <div className="absolute inset-0 p-12 flex flex-col justify-end gap-6 relative z-10">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-700 group-hover:scale-125 group-hover:-rotate-6 ${isDarkMode ? 'bg-slate-900 shadow-black' : 'bg-white shadow-indigo-100'}`}>
                            <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-inner`}>
                              <Icon size={28} className="text-white" />
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className={`text-4xl font-black uppercase italic tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{tool.name}</h3>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <Info size={16} className="text-indigo-400" />
                              </div>
                            </div>
                            <p className={`text-base font-bold italic leading-relaxed line-clamp-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{tool.description}</p>
                          </div>

                          {isPrimary && (
                            <div className="pt-4 flex items-center gap-3 text-indigo-500 font-black text-[10px] uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                              {getCtaLabel(tool.id)} <ArrowRight size={14} />
                            </div>
                          )}
                        </div>

                        <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-500">
                          <div className="p-5 rounded-[2rem] shadow-2xl bg-indigo-600 text-white">
                            <ArrowRight size={24} />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
