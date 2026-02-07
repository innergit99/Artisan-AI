import React, { useState } from 'react';
import { TrendingUp, BarChart3, Search, Target, ArrowRight, Zap, Globe, Cpu, Loader2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NeuralNetworkBackground } from './GenerativeVisuals';
import { marketService, NicheAnalysis } from '../marketService';

const TrendRadarPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState<NicheAnalysis | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleScan = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!keyword.trim()) return;

        setLoading(true);
        setError(null);
        setAnalysis(null);

        try {
            const result = await marketService.analyzeNiche(keyword);
            setAnalysis(result);
        } catch (err: any) {
            console.error(err);
            setError("Failed to analyze niche. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden relative">
            <NeuralNetworkBackground />

            {/* Header / Nav */}
            <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/5 bg-[#050505]/80">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                        <ArrowRight className="rotate-180" size={18} />
                        <span className="text-sm font-bold uppercase tracking-widest">BACK TO DASHBOARD</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <img src="/artisan_logo_official.png" alt="Logo" className="w-8 h-8 rounded" />
                        <span className="font-black uppercase italic tracking-tighter">Trend Radar <span className="text-emerald-500 text-xs not-italic">v2.1</span></span>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 mb-8">
                            <TrendingUp size={14} />
                            <span>REAL-TIME INTELLIGENCE ENGINE</span>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-black mb-8 leading-tight">
                            Hunt the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Unseen Gap.</span>
                        </h1>
                        <p className="text-xl text-gray-400 leading-relaxed mb-10 max-w-xl">
                            Trend Radar scans live search queries to find "Zero-Competition" high-demand niches. Don't guess. Build what the world is already searching for.
                        </p>

                        <form onSubmit={handleScan} className="flex gap-4 max-w-md">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                <input
                                    type="text"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    placeholder="Enter niche (e.g. 'Cyberpunk Gardening')"
                                    className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-12 pr-6 focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-gray-600"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !keyword}
                                className="px-8 py-4 bg-emerald-600 rounded-full font-bold shadow-lg shadow-emerald-600/30 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                                {loading ? 'Scanning...' : 'Scan'}
                            </button>
                        </form>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-200"
                            >
                                <AlertTriangle size={20} />
                                {error}
                            </motion.div>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group min-h-[500px] flex items-center justify-center"
                    >
                        {/* Radar Circle Animation (Always Visible but subtle) */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
                            <div className={`w-[150%] h-[150%] border-2 ${loading ? 'border-emerald-500/20' : 'border-white/5'} rounded-full ${loading ? 'animate-pulse' : ''}`} />
                            <div className="w-full h-full border border-white/5 rounded-full scale-75" />
                            {loading && (
                                <div className="absolute w-[2px] h-1/2 bg-gradient-to-t from-emerald-500 to-transparent origin-bottom animate-spin-fast opacity-50" />
                            )}
                        </div>

                        {/* Analysis Content */}
                        <AnimatePresence mode='wait'>
                            {!analysis && !loading && !error && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center relative z-10 p-8"
                                >
                                    <Globe className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-500">Waiting for Signal...</h3>
                                    <p className="text-gray-600 mt-2">Enter a niche keyword to begin scanning total addressable market.</p>
                                </motion.div>
                            )}

                            {analysis && !loading && (
                                <motion.div
                                    key="results"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="relative z-10 space-y-6 w-full"
                                >
                                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                                        <div>
                                            <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Niche Analysis</div>
                                            <div className="text-xl font-black capitalize">{keyword}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Opportunity</div>
                                            <div className={`text-xl font-black ${analysis.opportunity === 'Gold Mine' ? 'text-yellow-400' :
                                                analysis.opportunity === 'Viable' ? 'text-emerald-400' : 'text-red-400'
                                                }`}>
                                                {analysis.opportunity}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-black rounded-xl border border-white/5">
                                            <div className="text-[10px] text-gray-500 mb-1">SATURATION</div>
                                            <div className="w-full h-1 bg-white/10 rounded-full mb-2">
                                                <div
                                                    className={`h-full rounded-full ${analysis.saturationIndex === 'Very Low' ? 'bg-emerald-500 w-1/4' :
                                                        analysis.saturationIndex === 'High' ? 'bg-red-500 w-3/4' : 'bg-yellow-500 w-1/2'
                                                        }`}
                                                />
                                            </div>
                                            <div className="text-xs font-bold text-white">{analysis.saturationIndex}</div>
                                        </div>
                                        <div className="p-4 bg-black rounded-xl border border-white/5">
                                            <div className="text-[10px] text-gray-500 mb-1">DEMAND SCORE</div>
                                            <div className="w-full h-1 bg-white/10 rounded-full mb-2">
                                                <div
                                                    className="h-full bg-emerald-500 rounded-full"
                                                    style={{ width: `${analysis.demandScore}%` }}
                                                />
                                            </div>
                                            <div className="text-xs font-bold text-emerald-400">{analysis.demandScore}/100</div>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Cpu size={14} className="text-emerald-500" />
                                            <span className="text-[10px] font-bold text-emerald-300">AI STRATEGIC INSIGHT</span>
                                        </div>
                                        <p className="text-sm text-gray-300 leading-relaxed italic">
                                            "{analysis.aiInsight}"
                                        </p>
                                    </div>

                                    {/* Related Keywords Tags */}
                                    <div className="flex flex-wrap gap-2">
                                        {analysis.relatedKeywords.map((tag, i) => (
                                            <span key={i} className="text-[10px] px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-400">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default TrendRadarPage;
