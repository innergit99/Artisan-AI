import React from 'react';
import { Palette, Layers, ZoomIn, Download, ArrowRight, Zap, Target, Box } from 'lucide-react';
import { motion } from 'framer-motion';
import { NeuralNetworkBackground } from './GenerativeVisuals';

const CoverFoundryPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30 overflow-x-hidden relative">
            <NeuralNetworkBackground />

            {/* Header / Nav */}
            <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/5 bg-[#050505]/80">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                        <ArrowRight className="rotate-180" size={18} />
                        <span className="text-sm font-bold uppercase tracking-widest">Back to Studio</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <img src="/assets/publishlab_logo.svg" alt="Logo" className="w-8 h-8 rounded" />
                        <span className="font-black uppercase italic tracking-tighter">Cover Foundry</span>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-400 mb-8">
                            <Box size={14} />
                            <span>KDP-READY • 300 DPI</span>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-black mb-8 leading-tight">
                            Design for <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Dominance.</span>
                        </h1>
                        <p className="text-xl text-gray-400 leading-relaxed mb-10 max-w-xl">
                            PublishLab doesn't just generate images. It builds full-wrap 3D book covers with accurate bleed, spine, and professional typography.
                        </p>
                        <div className="flex gap-6">
                            <button className="px-8 py-4 bg-purple-600 rounded-full font-bold shadow-lg shadow-purple-600/30 hover:scale-105 transition-all">
                                Launch PublishLab
                            </button>
                            <button className="px-8 py-4 bg-white/5 rounded-full font-bold border border-white/10 hover:bg-white/10 transition-all">
                                Gallery Showcase
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-2 gap-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        {[
                            'https://images.unsplash.com/photo-1543003919-a995700aa80d?q=80&w=800&auto=format&fit=crop',
                            'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop',
                            'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=800&auto=format&fit=crop',
                            'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop'
                        ].map((src, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.05, rotateZ: i % 2 === 0 ? 2 : -2 }}
                                className={`aspect-[2/3] rounded-2xl border border-white/10 overflow-hidden relative shadow-2xl ${i === 1 ? 'mt-12' : i === 2 ? '-mt-12' : ''}`}
                            >
                                <img src={src} className="w-full h-full object-cover grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-700" alt="Book Cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400">Genre: Mystery</span>
                                    <span className="text-sm font-black">THE SILENT VOID</span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Workflow Section */}
                <div className="py-20 border-t border-white/5">
                    <h2 className="text-3xl font-black mb-16 text-center italic uppercase tracking-tighter">PublishLab Workflow</h2>
                    <div className="grid md:grid-cols-4 gap-4">
                        {[
                            { step: '01', title: 'Atmosphere Selection', desc: 'Define mood using "Industrial" prompts or Genre presets.' },
                            { step: '02', title: 'Asset Generation', desc: 'Procedural creation of characters, icons, and environments.' },
                            { step: '03', title: 'Layout Orchestration', desc: 'AI-guided positioning for title, spine, and back cover blurb.' },
                            { step: '04', title: 'KDP Compression', desc: 'Exporting specialized PDF/X-1a files ready for instant upload.' }
                        ].map((s, i) => (
                            <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl relative overflow-hidden">
                                <span className="text-8xl font-black absolute -top-4 -right-4 opacity-5 italic text-white">{s.step}</span>
                                <h4 className="font-black text-xl mb-4 relative z-10">{s.title}</h4>
                                <p className="text-gray-500 text-sm leading-relaxed relative z-10">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CoverFoundryPage;
