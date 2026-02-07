import React, { useState, useRef } from 'react';
import { BookOpen, Sparkles, Check, ArrowRight, Zap, Target, Layers, Upload, FileText, AlertCircle, Activity, Brain, ShieldCheck, Microscope } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NeuralNetworkBackground } from './GenerativeVisuals';
import { manuscriptDoctorService, ContextProfile, TextMetrics, Change } from '../manuscriptDoctorService';

const ManuscriptDoctorPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [mode, setMode] = useState<'hero' | 'workbench'>('hero');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<{
        text: string;
        profile: ContextProfile;
        metrics: TextMetrics;
        fileName: string;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsAnalyzing(true);
        setError(null);

        try {
            // 1. Parse
            const { text } = await manuscriptDoctorService.parseFile(file);

            // 2. Analyze (Simulated thinking time for UX)
            await new Promise(r => setTimeout(r, 2000));

            const profile = manuscriptDoctorService.analyzeContext(text);
            const metrics = (manuscriptDoctorService as any).calculateTextMetrics(text); // Accessing private for demo metrics

            setAnalysis({
                text,
                profile,
                metrics,
                fileName: file.name
            });
            setMode('workbench');
        } catch (err: any) {
            setError(err.message || "Failed to analyze manuscript.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden relative">
            <NeuralNetworkBackground />

            {/* Header / Nav */}
            <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/5 bg-[#050505]/80">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                        <ArrowRight className="rotate-180" size={18} />
                        <span className="text-sm font-bold uppercase tracking-widest">Back to Studio</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <img src="/artisan_logo_official.png" alt="Logo" className="w-8 h-8 rounded" />
                        <span className="font-black uppercase italic tracking-tighter">Manuscript Doctor</span>
                    </div>
                    {mode === 'workbench' && (
                        <button
                            onClick={() => { setMode('hero'); setAnalysis(null); }}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-xs font-bold border border-white/10 transition-all"
                        >
                            New Analysis
                        </button>
                    )}
                </div>
            </nav>

            <AnimatePresence mode="wait">
                {mode === 'hero' ? (
                    <motion.main
                        key="hero"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="pt-32 pb-20 px-6 max-w-7xl mx-auto"
                    >
                        {/* Hero Section */}
                        <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-400 mb-8">
                                    <Zap size={14} />
                                    <span>50,000 WORDS IN 10 MINUTES</span>
                                </div>
                                <h1 className="text-6xl md:text-7xl font-black mb-8 leading-tight">
                                    The End of <br />
                                    <span className="text-gradient-animated">Writer's Block.</span>
                                </h1>
                                <p className="text-xl text-gray-400 leading-relaxed mb-10 max-w-xl">
                                    Artisan's Manuscript Doctor doesn't just "generate" text. It architects narratives.
                                    Maintains perfect character consistency and KDP compliance.
                                </p>
                                <div className="flex gap-6">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-8 py-4 bg-indigo-600 rounded-full font-bold shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all flex items-center gap-2"
                                    >
                                        {isAnalyzing ? <Activity className="animate-spin" size={20} /> : <Upload size={20} />}
                                        {isAnalyzing ? "Analyzing Core..." : "Upload Manuscript"}
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        accept=".txt,.pdf,.docx"
                                    />
                                    <button className="px-8 py-4 bg-white/5 rounded-full font-bold border border-white/10 hover:bg-white/10 transition-all">
                                        View Compliance Specs
                                    </button>
                                </div>
                                {error && (
                                    <div className="mt-6 flex items-center gap-2 text-red-400 text-sm font-bold bg-red-400/10 p-4 rounded-xl border border-red-400/20">
                                        <AlertCircle size={16} />
                                        {error}
                                    </div>
                                )}
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, rotateY: 30 }}
                                whileInView={{ opacity: 1, rotateY: 0 }}
                                transition={{ duration: 1 }}
                                className="relative"
                            >
                                <div className="aspect-[4/5] bg-gradient-to-br from-indigo-900/20 to-black rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(99,102,241,0.2)] p-1 overflow-hidden">
                                    <div className="bg-[#0A0A0A] w-full h-full rounded-[1.4rem] p-8 relative overflow-hidden">
                                        <div className="flex items-center justify-between mb-8 opacity-50">
                                            <div className="flex gap-2">
                                                <div className="w-3 h-3 rounded-full bg-red-500/30" />
                                                <div className="w-3 h-3 rounded-full bg-yellow-500/30" />
                                                <div className="w-3 h-3 rounded-full bg-green-500/30" />
                                            </div>
                                            <span className="text-[10px] font-mono uppercase tracking-tighter">AI_SURGERY_RUNTIME.log</span>
                                        </div>
                                        <div className="space-y-4 font-mono text-sm">
                                            <p className="text-gray-500">{"// Contextual Anatomy Scan"}</p>
                                            <p className="text-white">Status: <span className="text-green-400 italic">Ready for procedure</span></p>
                                            <p className="text-gray-400 text-xs">Waiting for .docx, .pdf or .txt source material to begin narrative extraction...</p>

                                            <div className="pt-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl p-10 group hover:border-indigo-500/50 transition-all cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                    <FileText className="text-gray-500 group-hover:text-indigo-400" size={32} />
                                                </div>
                                                <span className="text-[10px] text-gray-500 uppercase font-black">Drop Manuscript to Begin</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Features Grid */}
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { icon: <ShieldCheck className="text-green-400" />, title: 'KDP Sanitization', desc: 'Automatically scrubs "AI-smell", placeholder leaks, and formatting errors that cause rejections.' },
                                { icon: <Brain className="text-indigo-400" />, title: 'Contextual Memory', desc: 'Maintains character eye color, verbal habits, and plot consistency across 100+ chapters.' },
                                { icon: <Microscope className="text-purple-400" />, title: 'Diagnostic Audit', desc: 'Identifies pacing dead-spots, passive voice clusters, and vocabulary complexity issues.' }
                            ].map((feat, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -10 }}
                                    className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 transition-all group"
                                >
                                    <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        {feat.icon}
                                    </div>
                                    <h3 className="text-2xl font-black mb-4">{feat.title}</h3>
                                    <p className="text-gray-400 leading-relaxed text-sm">{feat.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.main>
                ) : (
                    <motion.main
                        key="workbench"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="pt-24 pb-20 px-6 max-w-[1600px] mx-auto"
                    >
                        <div className="grid lg:grid-cols-12 gap-8 h-[calc(100vh-180px)]">
                            {/* Left: Intelligence Summary */}
                            <div className="lg:col-span-3 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                                            <Activity size={20} />
                                        </div>
                                        <div>
                                            <h2 className="font-black text-sm uppercase tracking-widest">Diagnostic Report</h2>
                                            <p className="text-[10px] text-gray-500 uppercase font-bold">{analysis?.fileName}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                            <div className="flex justify-between items-end mb-2">
                                                <span className="text-[10px] uppercase font-black text-gray-500 tracking-tighter">Word Count</span>
                                                <span className="text-xl font-black italic">{analysis?.metrics.wordCount.toLocaleString()}</span>
                                            </div>
                                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-indigo-500 w-[70%]" />
                                            </div>
                                        </div>

                                        <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                            <div className="flex justify-between items-end mb-2">
                                                <span className="text-[10px] uppercase font-black text-gray-500 tracking-tighter">Readability Grade</span>
                                                <span className="text-xl font-black italic">Level {analysis?.profile.readabilityGrade}</span>
                                            </div>
                                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-purple-500 w-[45%]" />
                                            </div>
                                        </div>

                                        <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                            <div className="flex justify-between items-end mb-2">
                                                <span className="text-[10px] uppercase font-black text-gray-500 tracking-tighter">Detected Genre</span>
                                                <span className="text-xs font-black italic text-indigo-400">{analysis?.profile.detectedGenre}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Voice Fingerprint */}
                                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-6 flex items-center gap-2">
                                        <Brain size={14} className="text-indigo-400" />
                                        Author Fingerprint
                                    </h3>
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex justify-between text-[10px] mb-2 uppercase font-bold">
                                                <span className="text-gray-400">Dialogue Density</span>
                                                <span className="text-indigo-400">{Math.round((analysis?.profile.dialogueDensity || 0) * 100)}%</span>
                                            </div>
                                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(analysis?.profile.dialogueDensity || 0) * 100}%` }}
                                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-[10px] mb-2 uppercase font-bold">
                                                <span className="text-gray-400">Pacing (Action Focus)</span>
                                                <span className="text-indigo-400">{Math.round((analysis?.profile.pacingScore || 0) * 100)}%</span>
                                            </div>
                                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(analysis?.profile.pacingScore || 0) * 100}%` }}
                                                    className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                                                <span className="block text-[8px] uppercase font-black text-gray-500 mb-1">Tone</span>
                                                <span className="text-[10px] font-black italic text-indigo-300 uppercase">{analysis?.profile.tone}</span>
                                            </div>
                                            <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                                                <span className="block text-[8px] uppercase font-black text-gray-500 mb-1">POV</span>
                                                <span className="text-[10px] font-black italic text-indigo-300 uppercase">{analysis?.profile.pov} Person</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Center: Manuscript Preview / Surgeon View */}
                            <div className="lg:col-span-6 flex flex-col h-full">
                                <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden flex flex-col">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="flex gap-1.5 font-mono text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
                                                <Sparkles size={12} />
                                                Interactive Audit Mode
                                            </div>
                                            <span className="text-[10px] text-gray-600 font-mono italic">{"// Integrity Scan Complete - No Fatal Leaks Detected"}</span>
                                        </div>
                                        <div className="text-[10px] text-gray-500 font-mono tracking-tighter">
                                            CRC: {Math.random().toString(16).substring(2, 8).toUpperCase()}
                                        </div>
                                    </div>

                                    <div className="flex-1 bg-black/40 rounded-2xl border border-white/5 p-8 font-mono text-sm text-gray-300 overflow-y-auto leading-relaxed custom-scrollbar font-serif-italics">
                                        <pre className="whitespace-pre-wrap font-sans opacity-80 decoration-indigo-500/30">
                                            {analysis?.text.substring(0, 5000)}
                                            {analysis?.text.length && analysis.text.length > 5000 && "... [Full Manuscript Loaded in Virtual Memory]"}
                                        </pre>
                                    </div>

                                    {/* Action Bar */}
                                    <div className="mt-6 flex gap-4">
                                        <button className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-3">
                                            <Zap size={16} />
                                            Perform Full Narrative Surgery
                                        </button>
                                        <button className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
                                            Export to KDP
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Surgical Options */}
                            <div className="lg:col-span-3 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-6 flex items-center gap-2">
                                        <Zap size={14} className="text-yellow-400" />
                                        Surgical Modes
                                    </h3>
                                    <div className="space-y-3">
                                        {[
                                            { id: 'fix_errors', label: 'Sanitize & Fix', desc: 'Removes double spaces, typos, and KDP-blocking phrases.' },
                                            { id: 'enhance_style', label: 'Style Inversion', desc: 'Adds sensory detail and removes repetitive AI phrasing.' },
                                            { id: 'full_rewrite', label: 'Deep Context Polish', desc: 'The most thorough rewrite. Maintains perfect consistency.' },
                                            { id: 'continue_writing', label: 'Ghostwriter Mode', desc: 'Continues the book from where you left off.' }
                                        ].map((opt) => (
                                            <button
                                                key={opt.id}
                                                className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 text-left hover:bg-indigo-600/10 hover:border-indigo-500/30 transition-all group"
                                            >
                                                <span className="block text-xs font-black uppercase tracking-wide mb-1 group-hover:text-indigo-400">{opt.label}</span>
                                                <span className="block text-[9px] text-gray-500 leading-tight">{opt.desc}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-3xl p-6">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-4">KDP Readiness</h3>
                                    <div className="text-4xl font-black italic mb-2">92%</div>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold leading-tight mb-6">Excellent. Minor style warnings detected in Chapter 3.</p>
                                    <button className="w-full py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all">
                                        View Blocker Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.main>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManuscriptDoctorPage;

