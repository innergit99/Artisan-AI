import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ToolView from './components/ToolView';
import GalleryView from './components/GalleryView';
import LandingPage from './components/LandingPage';
import InfographicsPage from './components/InfographicsPage';
import ManuscriptDoctorPage from './components/ManuscriptDoctorPage';
import CoverFoundryPage from './components/CoverFoundryPage';
import TrendRadarPage from './components/TrendRadarPage';
import PricingPage from './components/PricingPage';
import TermsPage from './components/TermsPage';

import { AuthModal } from './components/AuthModal';
import { ToolType, GeneratedImage } from './types';
import { gemini } from './geminiService';
import { storage } from './storageService';
import { supabase } from './supabaseClient';
import { initializePaddle } from './paddleIntegration';
import { Loader2, Sun, Moon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ToolType>(ToolType.DASHBOARD);
  const [showLanding, setShowLanding] = useState(true);
  const [viewingInfographics, setViewingInfographics] = useState(false);
  const [activeDetail, setActiveDetail] = useState<'manuscript' | 'cover' | 'trends' | 'pricing' | 'terms' | null>(null);

  const [initialPrompt, setInitialPrompt] = useState<string | null>(null);
  const [gallery, setGallery] = useState<GeneratedImage[]>([]);
  const [needsApiKey, setNeedsApiKey] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Auth State
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [diagStatus, setDiagStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [diagMessage, setDiagMessage] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('publishlab-theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    localStorage.setItem('publishlab-theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Log environment configuration on mount
  useEffect(() => {
    console.log("🚀 PUBLISHLAB DEPLOYMENT: v2.1.0-hotfix (Firecrawl Fix + Navigation Patch)");
    import('./environmentConfig').then(({ logEnvironmentInfo }) => {
      logEnvironmentInfo();
    });
  }, []);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);

      if (event === 'PASSWORD_RECOVERY') {
        setShowAuthModal(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const initApp = async () => {
      try {
        await storage.init();
        const savedImages = await storage.getAllImages();
        setGallery(savedImages);
      } catch (e) {
        console.error("Failed to initialize database", e);
      }

      // Initialize Paddle Sandbox
      initializePaddle();

      const localStatus = await gemini.testConnection();
      if (!localStatus.success) {
        const win = window as any;
        if (win.aistudio && typeof win.aistudio.hasSelectedApiKey === 'function') {
          const hasKey = await win.aistudio.hasSelectedApiKey();
          setNeedsApiKey(!hasKey);
        }
      } else {
        setNeedsApiKey(false);
      }
      setIsInitializing(false);
    };
    initApp();
  }, []);

  const addToGallery = async (img: GeneratedImage) => {
    try {
      if (user) {
        // If logged in, strict cloud sync (implemented in storageService)
        // For now, we just save locally as the base implementation
      }
      await storage.saveImage(img);
      setGallery(prev => [img, ...prev]);
    } catch (e) {
      console.error("Failed to save to database", e);
    }
  };

  const handleNavigate = (tab: ToolType, prompt?: string) => {
    // GATEKEEPING: Require login for EVERYTHING in the Studio during Beta
    if (!user && tab !== ToolType.DASHBOARD) {
      setShowAuthModal(true);
      return;
    }

    setInitialPrompt(prompt || null);
    setActiveTab(tab);
    setShowLanding(false);
    setViewingInfographics(false);
    setActiveDetail(null);
  };

  const runDiagnostic = async () => {
    setDiagStatus('testing');
    const result = await gemini.testConnection();
    if (result.success) {
      setDiagStatus('success');
      setDiagMessage(result.message);
    } else {
      setDiagStatus('error');
      setDiagMessage(result.message);
    }
  };

  if (isInitializing) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-indigo-500" size={48} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Initializing Engine...</p>
      </div>
    );
  }

  const renderContent = () => {
    if (activeTab === ToolType.DASHBOARD) return <Dashboard onNavigate={handleNavigate} isDarkMode={isDarkMode} />;
    if (activeTab === ToolType.MY_GALLERY) return <GalleryView images={gallery} isDarkMode={isDarkMode} />;
    if (activeTab === ToolType.SETTINGS) return (
      <div className="p-12 animate-in fade-in slide-in-from-bottom-4">
        <h1 className="text-6xl font-black mb-12 italic uppercase tracking-tighter">Industrial Settings</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="p-10 rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-2xl space-y-8">
            <button onClick={runDiagnostic} className="w-full bg-indigo-600 py-4 rounded-2xl font-black uppercase tracking-widest text-xs">Run Diagnostic Scan</button>
            {diagMessage && <div className="p-6 bg-black/40 border border-slate-800 rounded-2xl font-mono text-[10px]">{diagMessage}</div>}

            {user ? (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                <p className="text-xs text-emerald-400 font-bold mb-2">Authenticated as:</p>
                <p className="text-sm text-white font-mono">{user.email}</p>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="mt-4 text-[10px] text-slate-400 hover:text-white underline uppercase tracking-widest"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                <p className="text-xs text-indigo-400 font-bold mb-2">Guest Mode</p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="w-full bg-indigo-600/50 hover:bg-indigo-600 py-3 rounded-xl text-white text-[10px] font-black uppercase tracking-widest"
                >
                  Log In / Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
    return <ToolView toolType={activeTab} initialPrompt={initialPrompt} onBack={() => setActiveTab(ToolType.DASHBOARD)} onImageGenerated={addToGallery} onNavigate={handleNavigate} isDarkMode={isDarkMode} />;
  };

  return (
    <AnimatePresence mode="wait">
      {/* AUTH MODAL */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
        }}
      />

      {viewingInfographics ? (
        <motion.div key="infographics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <InfographicsPage onBack={() => setViewingInfographics(false)} onLaunchStudio={() => { setShowLanding(false); setViewingInfographics(false); }} />
        </motion.div>
      ) : activeDetail === 'manuscript' ? (
        <motion.div key="manuscript" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
          <ManuscriptDoctorPage onBack={() => {
            setActiveDetail(null);
            setShowLanding(false);
            setActiveTab(ToolType.DASHBOARD);
          }} />
        </motion.div>
      ) : activeDetail === 'cover' ? (
        <motion.div key="cover" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
          <CoverFoundryPage onBack={() => setActiveDetail(null)} />
        </motion.div>
      ) : activeDetail === 'pricing' ? (
        <motion.div key="pricing" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
          <PricingPage
            onBack={() => setActiveDetail(null)}
            onPlanSelected={() => {
              setActiveDetail(null);
              setShowLanding(false);
            }}
            onViewTerms={() => setActiveDetail('terms')}
          />
        </motion.div>
      ) : activeDetail === 'terms' ? (
        <motion.div key="terms" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
          <TermsPage onBack={() => setActiveDetail('pricing')} />
        </motion.div>
      ) : showLanding ? (
        <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <LandingPage
            onLaunchApp={(prompt) => {
              // BETA GATING: Require auth before entering studio
              if (!user) {
                setShowAuthModal(true);
                return;
              }
              setShowLanding(false);
              setInitialPrompt(prompt || null);
            }}
            onViewDetail={(type) => setActiveDetail(type)}
            onViewPricing={() => setActiveDetail('pricing')}
          />
        </motion.div>
      ) : (
        <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`flex h-screen overflow-hidden ${isDarkMode ? 'bg-slate-950 text-slate-100 dark' : 'bg-slate-50 text-slate-900'}`}>
          <Sidebar activeTab={activeTab} onNavigate={(tab) => handleNavigate(tab)} isDarkMode={isDarkMode} />
          <main className="flex-1 overflow-y-auto relative">
            <header className="sticky top-0 z-40 backdrop-blur-md px-8 py-4 flex justify-between items-center border-b border-white/5 bg-black/50">
              <div className="flex items-center gap-6">
                <button onClick={() => setIsDarkMode(!isDarkMode)}>{isDarkMode ? <Sun size={18} /> : <Moon size={18} />}</button>
                <button onClick={() => setShowLanding(true)} className="text-[9px] font-black uppercase tracking-widest text-indigo-500">Back to Landing</button>
              </div>

              <div className="flex items-center gap-4">
                <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Public Beta Preview</span>
                </div>
              </div>
            </header>
            {renderContent()}
          </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default App;
