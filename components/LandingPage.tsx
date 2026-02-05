import React, { useState, useEffect } from 'react';
import {
    Sparkles, BookOpen, PenTool, LayoutTemplate, Printer, Download, Check, Star,
    Shirt, Target, TrendingUp, Rocket, Search, Box, Palette, ShieldCheck,
    BarChart3, Maximize, Scissors, Zap, Coins, ChevronRight, ShieldAlert, Settings,
    Play, Video, MousePointer2, Layers, Cpu, Globe, ArrowRight, X, Mail
} from 'lucide-react';
import { motion } from 'framer-motion';
import LegalModal from './LegalModal';
import { GenerativeBrain, NeuralNetworkBackground } from './GenerativeVisuals';
import TeaserPlayer from './TeaserPlayer';
import '../LandingPage.css';

export default function LandingPage({
    onLaunchApp,
    onViewDetail,
    onViewPricing
}: {
    onLaunchApp: (prompt?: string) => void,
    onViewDetail?: (type: 'manuscript' | 'cover' | 'trends') => void,
    onViewPricing?: () => void
}) {
    const [legalModal, setLegalModal] = useState<'terms' | 'privacy' | 'refund' | null>(null);
    const [selectedMode, setSelectedMode] = useState<'SELF-PUBLISHER' | 'POD SELLER' | 'STUDIO / AGENCY'>('SELF-PUBLISHER');
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);

    // New State for Conversion Features
    const [genesisPrompt, setGenesisPrompt] = useState('');
    const [roiBooks, setRoiBooks] = useState(12); // Default 12 books/year

    // Derived Savings Calculation
    // Old Stack: $207/mo * 12 = $2484/yr
    // Artisan: $15/book * roiBooks (Assumed credit cost per full project)
    const oldStackCost = 2484;
    const artisanCost = roiBooks * 15;
    const yearlySavings = oldStackCost - artisanCost;

    // Mode-specific briefing data
    const MODE_BRIEFING = {
        'SELF-PUBLISHER': {
            icon: <BookOpen size={16} />,
            text: "Optimizing for KDP Velocity. Automated manuscripts, bleed-safe covers, and keyword-rich metadata.",
            cta: "Launch Manuscript Engine",
            color: "indigo"
        },
        'POD SELLER': {
            icon: <Shirt size={16} />,
            text: "Scaling Merchandise Factory. Procedural designs for Etsy/Shopify. Automated background removal.",
            cta: "Launch Merch Foundry",
            color: "emerald"
        },
        'STUDIO / AGENCY': {
            icon: <Globe size={16} />,
            text: "Enterprise Infrastructure. Multi-project management, deep market intelligence, and ROI metrics.",
            cta: "View Enterprise Stack",
            color: "purple"
        }
    };

    const handleGenesisSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (genesisPrompt.trim()) {
            onLaunchApp(genesisPrompt);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden relative">

            {/* ROBUST BACKGROUND LAYERS */}
            <div className="fixed inset-0 bg-radial-glow pointer-events-none z-0" />
            <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0 opacity-50" />

            {/* NAVBAR */}
            <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/5 bg-[#050505]/80">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/assets/publishlab_logo.svg" alt="PublishLab Logo" className="w-10 h-10 rounded-lg" />
                        <span className="text-xl font-bold tracking-tight text-white">PublishLab</span>
                    </div>
                    <div className="flex items-center gap-10">
                        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400 tracking-wide uppercase text-[11px]">
                            <a href="#system" className="hover:text-white transition-colors">System</a>
                            <a href="#features" className="hover:text-white transition-colors">Intelligence</a>
                            <a href="#infrastructure" className="hover:text-white transition-colors">Infrastructure</a>
                            <button onClick={onViewPricing} className="hover:text-white transition-colors">Licensing</button>
                        </div>
                        <button
                            onClick={() => onLaunchApp()}
                            className="relative group overflow-hidden px-6 py-3 bg-white text-black text-xs font-black uppercase tracking-widest rounded-full transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Launch PublishLab
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent translate-x-[-200%] group-hover:animate-shine" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* HERO SECTION: INDUSTRIAL BRIEFING */}
            <section className="pt-48 pb-32 px-6 relative overflow-visible perspective-1000">
                <NeuralNetworkBackground />

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
                    <div className="text-left space-y-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-indigo-500/30 bg-indigo-500/10 text-[10px] font-black tracking-[0.2em] text-indigo-400 uppercase">
                            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                            <span>System Online</span>
                        </div>

                        <div>
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[1.05] mb-6">
                                PUBLISHLAB <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500">AI PUBLISHING PLATFORM</span>
                            </h1>
                            <p className="text-lg text-gray-400 leading-relaxed max-w-xl border-l-2 border-indigo-500/50 pl-6">
                                Write bestsellers, design professional covers, and discover profitable niches — all powered by intelligent AI automation.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => onLaunchApp()}
                                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
                            >
                                <Play size={18} fill="currentColor" />
                                Launch PublishLab
                            </button>
                            <button
                                onClick={() => document.getElementById('system')?.scrollIntoView({ behavior: 'smooth' })}
                                className="px-8 py-4 bg-[#111] border border-white/10 hover:bg-white/5 text-gray-300 font-medium rounded-lg transition-all flex items-center justify-center gap-3"
                            >
                                <LayoutTemplate size={18} />
                                View System Architecture
                            </button>
                        </div>

                        {/* Persona Selector */}
                        <div className="pt-8 border-t border-white/5">
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-4">Select Operations Mode:</p>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {(['SELF-PUBLISHER', 'POD SELLER', 'STUDIO / AGENCY'] as const).map((mode) => (
                                    <button
                                        key={mode}
                                        onClick={() => setSelectedMode(mode)}
                                        className={`px-4 py-2 border rounded text-xs font-mono transition-all uppercase ${selectedMode === mode
                                            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                                            : 'bg-[#111] border-white/10 text-gray-400 hover:border-white/20'
                                            }`}
                                    >
                                        [{mode}]
                                    </button>
                                ))}
                            </div>

                            {/* Dynamic Mode Briefing */}
                            <motion.div
                                key={selectedMode}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-4 rounded-lg bg-[#0A0A0A] border border-white/5 flex items-start gap-4 max-w-md group hover:border-indigo-500/20 transition-colors"
                            >
                                <div className={`p-2 rounded bg-${MODE_BRIEFING[selectedMode].color}-500/10 text-${MODE_BRIEFING[selectedMode].color}-400`}>
                                    {MODE_BRIEFING[selectedMode].icon}
                                </div>
                                <div>
                                    <p className="text-xs text-gray-300 leading-relaxed mb-2">
                                        {MODE_BRIEFING[selectedMode].text}
                                    </p>
                                    <button
                                        onClick={() => onLaunchApp()}
                                        className={`text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2 group-hover:gap-3 transition-all`}
                                    >
                                        {MODE_BRIEFING[selectedMode].cta} <ChevronRight size={10} />
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    <div className="relative h-[500px] w-full flex items-center justify-center hero-3d-card group">
                        {/* Abstract Industrial Intelligence Visual */}
                        <div className="relative w-full h-full rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#050505]">
                            <img
                                src="/industrial_hero_engine.png"
                                alt="Artisan AI Industrial Engine Core"
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                            />

                            {/* Overlay UI hints - subtle */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />

                            {/* Interactive Prompt Overlay (Optional - kept for interaction) */}
                            <div className="absolute bottom-0 left-0 right-0 p-8">
                                <form onSubmit={handleGenesisSubmit} className="relative flex items-center bg-black/60 backdrop-blur-xl rounded-lg border border-white/10 p-1 shadow-2xl">
                                    <div className="pl-4 text-indigo-500"><Sparkles size={16} /></div>
                                    <input
                                        type="text"
                                        value={genesisPrompt}
                                        onChange={(e) => setGenesisPrompt(e.target.value)}
                                        placeholder="Initialize generation sequence..."
                                        className="flex-1 bg-transparent border-none text-white px-4 py-3 focus:ring-0 placeholder:text-gray-500 text-sm font-mono outline-none"
                                    />
                                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded transition-colors">
                                        <ArrowRight size={16} />
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
                        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
                    </div>
                </div>
            </section>

            {/* TRUST / SOCIAL PROOF */}
            <section className="py-12 border-y border-white/5 bg-black/40 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-sm text-gray-400 font-bold mb-8 uppercase tracking-[0.2em]">
                        Engineered for global ecosystem integration.
                    </p>
                    <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                        {/* Replaced generic avatars with enterprise logos concept */}
                        <div className="flex items-center gap-3"><Box size={24} /> <span className="font-black text-xl tracking-tight">DEPLOY TO AMAZON KDP</span></div>
                        <div className="flex items-center gap-3"><Globe size={24} /> <span className="font-black text-xl tracking-tight">SYNC WITH SHOPIFY</span></div>
                        <div className="flex items-center gap-3"><BookOpen size={24} /> <span className="font-black text-xl tracking-tight">FORMAT FOR INGRAM</span></div>
                        <div className="flex items-center gap-3"><Palette size={24} /> <span className="font-black text-xl tracking-tight">EXPORT TO ETSY</span></div>
                    </div>
                </div>
            </section>

            {/* PROBLEM VALIDATION: THE BROKEN SYSTEM */}
            <section className="py-24 px-6 bg-[#050505] relative overflow-hidden">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-block mb-4 p-2 bg-red-900/10 border border-red-500/20 rounded text-xs font-bold text-red-500 uppercase tracking-widest">
                        Diagnosis
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-8">Publishing Today Is Broken.</h2>
                    <p className="text-xl text-gray-400 leading-relaxed mb-12">
                        Trends change faster than creators can react. Platform rules are opaque.
                        Manual formatting destroys scale. Rejections kill momentum.
                        Agencies drown in tool sprawl.
                    </p>
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto" />
                    <p className="mt-8 text-white font-medium">
                        PublishLab was built to replace all of that.
                    </p>
                </div>
            </section>

            {/* COMPARISON: INFRASTRUCTURE PITCH */}
            <section id="system" className="py-24 px-6 bg-black relative">
                <div className="absolute inset-0 bg-grid-pattern opacity-30" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-[0.3em] mb-4">System Architecture</h2>
                        <h3 className="text-3xl text-white font-bold">This is not a tool. It is infrastructure.</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-stretch">
                        {/* SAAS HELL */}
                        <div className="bg-[#0A0A0A] border border-white/5 p-10 rounded-2xl relative overflow-hidden group hover:border-red-500/20 transition-colors">
                            <div className="absolute top-0 right-0 p-6 opacity-10"><ShieldAlert size={80} className="text-red-500" /></div>
                            <h3 className="text-2xl font-black text-red-500 uppercase italic mb-6">The SaaS Hell</h3>
                            <ul className="space-y-4 mb-8 text-gray-400">
                                <li className="flex gap-3"><X className="text-red-500 shrink-0" /> Fragmented, disconnected tools</li>
                                <li className="flex gap-3"><X className="text-red-500 shrink-0" /> Subscription fatigue ($200+/mo)</li>
                                <li className="flex gap-3"><X className="text-red-500 shrink-0" /> Manual data handoffs & CSV hell</li>
                                <li className="flex gap-3"><X className="text-red-500 shrink-0" /> Constant risk of IP infringement</li>
                            </ul>
                            <img src="/problem_saas_clutter.png" alt="SaaS Clutter" className="w-full rounded-lg shadow-2xl opacity-60 grayscale group-hover:grayscale-0 transition-all border border-white/5" />
                        </div>

                        {/* ARTISAN GENESIS */}
                        <div className="bg-[#111] border border-indigo-500/30 p-10 rounded-2xl relative overflow-hidden group shadow-[0_0_30px_rgba(99,102,241,0.1)]">
                            <div className="absolute top-0 right-0 p-6 opacity-10"><Cpu size={80} className="text-indigo-500" /></div>
                            <h3 className="text-2xl font-black text-indigo-400 uppercase italic mb-6">PublishLab</h3>
                            <ul className="space-y-4 mb-8 text-gray-300">
                                <li className="flex gap-3"><Check className="text-indigo-400 shrink-0" /> Single autonomous industrial pipeline</li>
                                <li className="flex gap-3"><Check className="text-indigo-400 shrink-0" /> Pay-per-result efficiency</li>
                                <li className="flex gap-3"><Check className="text-indigo-400 shrink-0" /> Platform-aware compliance guardrails</li>
                                <li className="flex gap-3"><Check className="text-indigo-400 shrink-0" /> Predictive market signals (Real-time)</li>
                            </ul>
                            <img src="/artisan_foundry_solution.png" alt="Artisan Core" className="w-full rounded-lg shadow-2xl border border-indigo-500/20" />
                        </div>
                    </div>
                </div>
            </section>

            {/* PHASED FEATURE REVEAL */}
            <section id="features" className="py-32 px-6 bg-[#050505]">
                <div className="max-w-7xl mx-auto">
                    {/* PHASE 1 */}
                    <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                        <div className="order-2 lg:order-1">
                            <div className="w-full h-96 bg-[#0A0A0A] rounded-[2.5rem] border border-emerald-500/20 flex items-center justify-center relative overflow-hidden group shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                                {/* Mesh Gradient Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-transparent opacity-50" />
                                <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full group-hover:bg-emerald-500/20 transition-all duration-1000" />

                                <div className="text-center z-10 transition-transform duration-700 group-hover:scale-110">
                                    <div className="relative inline-block">
                                        <div className="absolute -inset-4 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
                                        <Search size={80} className="relative text-emerald-400 mb-6 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                                    </div>
                                    <p className="font-mono text-emerald-400 text-[10px] tracking-[0.4em] uppercase">Market_Intelligence_Module</p>
                                    <div className="mt-4 flex gap-1 justify-center">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="w-8 h-1 bg-emerald-500/20 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500" style={{ width: '100%', animation: `shimmer 2s infinite ${i * 0.2}s` }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <h4 className="text-emerald-500 font-bold uppercase tracking-widest mb-2">Phase 1</h4>
                            <h3 className="text-4xl font-black text-white mb-4">Market Intelligence</h3>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                Don't guess. Know. Our Niche Radar analyzes millions of data points to identify high-demand, low-competition vectors before execution begins.
                            </p>
                            <ul className="mt-6 space-y-2 text-gray-500 font-mono text-sm">
                                <li>&gt; Real-time Amazon Best Seller Scans</li>
                                <li>&gt; Keyword Profitability Calc</li>
                                <li>&gt; Trend Velocity Metrics</li>
                            </ul>
                        </div>
                    </div>

                    {/* PHASE 2 */}
                    <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                        <div>
                            <h4 className="text-indigo-500 font-bold uppercase tracking-widest mb-2">Phase 2</h4>
                            <h3 className="text-4xl font-black text-white mb-4">Asset Orchestration</h3>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                PublishLab writes 50k word manuscripts and generates procedural, print-ready covers in parallel. Context is preserved across the entire assembly line.
                            </p>
                            <ul className="mt-6 space-y-2 text-gray-500 font-mono text-sm">
                                <li>&gt; Context-Aware Gemini Text Engine</li>
                                <li>&gt; 300 DPI Procedural Flux Image Gen</li>
                                <li>&gt; Bleed-Zone Safe Layouts</li>
                            </ul>
                        </div>
                        <div className="">
                            <div className="w-full h-96 bg-[#0A0A0A] rounded-[2.5rem] border border-indigo-500/20 flex items-center justify-center relative overflow-hidden group shadow-[0_0_50px_rgba(79,70,229,0.1)]">
                                {/* Mesh Gradient Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-transparent to-transparent opacity-50" />
                                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full group-hover:bg-indigo-500/20 transition-all duration-1000" />

                                <div className="text-center z-10 transition-transform duration-700 group-hover:scale-110">
                                    <div className="relative inline-block">
                                        <div className="absolute -inset-4 bg-indigo-500/20 blur-xl rounded-full animate-pulse" />
                                        <Layers size={80} className="relative text-indigo-400 mb-6 drop-shadow-[0_0_15px_rgba(79,70,229,0.5)]" />
                                    </div>
                                    <p className="font-mono text-indigo-400 text-[10px] tracking-[0.4em] uppercase">Asset_Construction_Module</p>
                                    <div className="mt-4 grid grid-cols-3 gap-2 justify-center max-w-[120px] mx-auto">
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} className="w-full aspect-square bg-indigo-500/10 border border-indigo-500/20 rounded animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                                        ))}
                                    </div>
                                </div>
                                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
                            </div>
                        </div>
                    </div>

                    {/* PHASE 3 */}
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="w-full h-96 bg-[#0A0A0A] rounded-[2.5rem] border border-blue-500/20 flex items-center justify-center relative overflow-hidden group shadow-[0_0_50px_rgba(59,130,246,0.1)]">
                                {/* Mesh Gradient Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-transparent opacity-50" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

                                <div className="text-center z-10 transition-transform duration-700 group-hover:scale-110">
                                    <div className="relative inline-block">
                                        <div className="absolute -inset-4 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
                                        <ShieldCheck size={80} className="relative text-blue-400 mb-6 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                                    </div>
                                    <p className="font-mono text-blue-400 text-[10px] tracking-[0.4em] uppercase">Compliance_Export_Module</p>
                                    <div className="mt-4 flex items-center gap-2 justify-center">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                                        <span className="font-mono text-blue-500/60 text-[8px] tracking-widest uppercase">Encryption Active</span>
                                    </div>
                                </div>
                                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <h4 className="text-blue-500 font-bold uppercase tracking-widest mb-2">Phase 3</h4>
                            <h3 className="text-4xl font-black text-white mb-4">Compliance & Export</h3>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                Zero-rejection pipeline. Assets are validated against platform rules before they leave the system. One-click deploy to PDF, EPUB, or print.
                            </p>
                            <ul className="mt-6 space-y-2 text-gray-500 font-mono text-sm">
                                <li>&gt; Auto-Formatting Engine</li>
                                <li>&gt; Copyright & Trademark Checks</li>
                                <li>&gt; Multi-Platform Bundle Export</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* WHO THIS IS FOR */}
            <section className="py-24 px-6 bg-black border-t border-white/5">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
                    <div className="p-8 border-l border-red-900/30">
                        <h3 className="text-lg font-bold text-gray-400 mb-6 uppercase tracking-widest">Who This Is <span className="text-red-500">NOT</span> For</h3>
                        <ul className="space-y-4 text-gray-500">
                            <li className="flex gap-2 items-center"><X size={16} /> Hobbyists dabbling in free tools</li>
                            <li className="flex gap-2 items-center"><X size={16} /> One-off creators aiming for a single book</li>
                            <li className="flex gap-2 items-center"><X size={16} /> People afraid of industrial automation</li>
                        </ul>
                    </div>
                    <div className="p-8 border-l border-emerald-900/30 bg-emerald-900/5">
                        <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest">Who This Is <span className="text-emerald-500">Built</span> For</h3>
                        <ul className="space-y-4 text-gray-300 font-medium">
                            <li className="flex gap-2 items-center"><Check size={16} className="text-emerald-500" /> High-Volume Operators & Studios</li>
                            <li className="flex gap-2 items-center"><Check size={16} className="text-emerald-500" /> System-Thinkers scaling assets</li>
                            <li className="flex gap-2 items-center"><Check size={16} className="text-emerald-500" /> Publishers who value infrastructure over toys</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* SUBSCRIPTION / ROI */}
            <section id="infrastructure" className="py-32 px-6 bg-[#0F0F0F] relative overflow-hidden">
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl font-black text-white mb-12">Stop Burning Cash. Start Building Revenue.</h2>

                    <div className="bg-[#111] border border-white/10 rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

                        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                            <div className="text-left space-y-4">
                                <p className="text-gray-400">Projected output per year</p>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="1" max="100"
                                        value={roiBooks} onChange={(e) => setRoiBooks(parseInt(e.target.value))}
                                        className="w-48 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    />
                                    <span className="text-3xl font-bold text-white">{roiBooks} Projects</span>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-1">Annual Profit Unlocked</p>
                                <div className="text-5xl font-black text-white mb-2">+${yearlySavings.toLocaleString()}</div>
                                <p className="text-xs text-gray-500">Compared to traditional tool stack costs</p>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-white/5 flex justify-center">
                            <button onClick={onViewPricing} className="text-indigo-400 hover:text-white flex items-center gap-2 text-sm font-bold transition-colors">
                                View Enterprise Licensing Models <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* FINAL CTA: INEVITABLE */}
            <section className="py-32 px-6 text-center relative bg-black">
                <div className="absolute inset-0 bg-indigo-900/10 blur-[100px] pointer-events-none" />
                <div className="max-w-3xl mx-auto relative z-10 space-y-10">
                    <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none">
                        BUILD YOUR <br />
                        INFRASTRUCTURE.
                    </h2>
                    <p className="text-xl text-gray-400 max-w-lg mx-auto">
                        No templates. No guesswork. No rejection cycles.
                    </p>
                    <button
                        onClick={() => onLaunchApp()}
                        className="px-10 py-5 bg-white text-black text-lg font-black uppercase tracking-widest rounded-full hover:scale-105 transition-transform shadow-[0_0_50px_rgba(255,255,255,0.4)] flex items-center gap-4 mx-auto"
                    >
                        <Zap size={24} fill="black" />
                        Enter PublishLab
                    </button>
                    <p className="text-xs text-gray-600 font-mono">SECURE ENTRY • CANCEL AT ANY TIME</p>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-12 border-t border-white/5 bg-black text-center text-gray-600">
                <div className="flex justify-center flex-col items-center gap-6 mb-8">
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-900/20 border border-green-500/20 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-mono text-green-500">SYSTEM ONLINE: v2.4.0 (Stable)</span>
                    </div>

                    {/* LEGAL DISCLAIMER - NOMINAL FAIR USE */}
                    <p className="text-[10px] text-gray-500 max-w-2xl leading-relaxed opacity-60">
                        PublishLab is an independent software provider. We are not affiliated with, endorsed by, or sponsored by Amazon, Shopify, Ingram, or Etsy.
                        All brand names and trademarks are the property of their respective owners and are used here for descriptive compatibility purposes only according to nominal fair use principles.
                    </p>

                    <div className="flex flex-col items-center gap-4 mb-8">
                        <div className="flex gap-6 text-xs uppercase tracking-wider">
                            <button onClick={() => setLegalModal('terms')} className="hover:text-white transition-colors">Terms of Service</button>
                            <button onClick={() => setLegalModal('privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
                            <button onClick={() => setLegalModal('refund')} className="hover:text-white transition-colors underline underline-offset-4 decoration-indigo-500/50">Refund Policy</button>
                        </div>
                        <div className="flex items-center gap-2 opacity-50 italic text-[10px]">Registered Office: Adh Dhawq Street, Abu Dhabi, 00971, United Arab Emirates</div>
                        <div className="flex items-center gap-2 opacity-50 text-[10px] hover:text-white transition-colors"><Mail size={12} /> support@publishlab.ink</div>
                    </div>
                </div>
                <p className="text-xs font-mono opacity-50">&copy; 2026 PUBLISHLAB. ALL RIGHTS RESERVED.</p>
            </footer>

            {/* LEGAL MODAL */}
            {legalModal && <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />}
        </div>
    );
}
