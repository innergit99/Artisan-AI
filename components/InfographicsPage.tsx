
import React from 'react';
import { ArrowLeft, Search, Layout, Cpu, Shield, Download, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

interface InfographicsPageProps {
    onBack: () => void;
    onLaunchStudio: () => void;
}

const InfographicsPage: React.FC<InfographicsPageProps> = ({ onBack, onLaunchStudio }) => {
    const steps = [
        {
            id: '01',
            title: 'Niche Intelligence',
            subtitle: 'Market Signal Analysis',
            desc: 'The engine scans global marketplaces, analyzing sales velocity, search volume, and saturation levels. We identify high-probability "GAPs" where demand outstrips supply.',
            icon: <Search size={48} />,
            img: '/assets/dashboard/trend_intelligence.png',
            details: [
                'Scans 400+ niches daily',
                'Analyzes 2026 trending patterns',
                'Identifies low-competition entry points'
            ],
            color: 'text-amber-500',
            bg: 'bg-amber-500/10'
        },
        {
            id: '02',
            title: 'Structural Architecture',
            subtitle: 'Loki Mode Blueprinting',
            desc: 'Once a niche is selected, our Loki agent builds three parallel blueprints. It formats margins, gutters, and bleed levels strictly to 2026 KDP/POD mandates.',
            icon: <Layout size={48} />,
            img: '/assets/dashboard/kdp_book_lab.png',
            details: [
                'Gutter-aware interior formatting',
                '3 parallel layout strategies',
                'Autonomous TOC generation'
            ],
            color: 'text-indigo-500',
            bg: 'bg-indigo-500/10'
        },
        {
            id: '03',
            title: 'Industrial Generation',
            subtitle: 'High-Fidelity Rendering',
            desc: 'Nano Banana Pro takes the blueprints and renders 4K assets. Whether it is a 400-page manuscript or a full-wrap cover, every pixel is industrial-grade.',
            icon: <Cpu size={48} />,
            img: '/assets/dashboard/pod_designer.png',
            details: [
                '4K resolution exports',
                '300 DPI print-ready quality',
                'Vector-locked color accuracy'
            ],
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            id: '04',
            title: 'Compliance Shield',
            subtitle: 'Policy & Trademark Audit',
            desc: 'The engine runs a hard audit against platform-specific policies (KDP / Amazon / Etsy). We cross-reference trademarks and automated content flags to ensure zero rejection.',
            icon: <Shield size={48} />,
            img: '/assets/dashboard/kdp_ban_shield.png',
            details: [
                'USPTO trademark cross-check',
                'Platform policy simulation',
                'AI Disclosure compliance'
            ],
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10'
        },
        {
            id: '05',
            title: 'Global Export',
            subtitle: 'Multi-Format Delivery',
            desc: 'The final product is packaged and delivered via secure cloud link. One-click access to production-ready PDF, EPUB, and High-Res source files.',
            icon: <Download size={48} />,
            img: '/assets/dashboard/amazon_seo.png',
            details: [
                'Direct-to-drive delivery',
                'Global publishing standards',
                'Master archive storage'
            ],
            color: 'text-violet-500',
            bg: 'bg-violet-500/10'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-inter selection:bg-indigo-500 selection:text-white overflow-x-hidden">
            {/* AMBIENT BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 opacity-20">
                    <img src="/assets/industrial_pipeline_bg.png" alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950"></div>
                </div>
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full"></div>
            </div>

            <nav className="fixed top-0 left-0 right-0 z-50 p-8">
                <div className="max-w-[1500px] mx-auto flex justify-between items-center">
                    <button
                        onClick={onBack}
                        className="group flex items-center gap-4 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all active:scale-95"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to PublishLab
                    </button>
                    <div className="flex items-center gap-12">
                        <button onClick={onLaunchStudio} className="group px-10 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-indigo-600 hover:text-white transition-all shadow-2xl hover:shadow-indigo-500/50 active:scale-95 flex items-center gap-4">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span>
                            Launch Studio
                        </button>
                        <div className="flex items-center gap-6 border-l border-white/10 pl-12">
                            <span className="text-2xl font-black tracking-tighter uppercase italic hidden lg:block text-white">PublishLab</span>
                            <img src="/assets/publishlab_logo.svg" alt="PublishLab" className="w-16 h-16 object-contain drop-shadow-[0_0_20px_rgba(99,102,241,0.6)]" />
                        </div>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 pt-56 pb-32 px-12">
                <div className="max-w-[1400px] mx-auto space-y-48">
                    <div className="text-center space-y-10">
                        <div className="inline-flex items-center gap-5 px-8 py-3 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[12px] font-black uppercase tracking-[0.4em] text-indigo-400">
                            <Zap size={18} className="animate-pulse" />
                            Process Map v4.2 Industrial
                        </div>
                        <h1 className="text-8xl md:text-[10rem] font-black uppercase italic tracking-tighter leading-none text-white">
                            How It <span className="text-indigo-500">Works.</span>
                        </h1>
                        <p className="max-w-4xl mx-auto text-3xl md:text-4xl text-slate-400 font-medium italic leading-relaxed">
                            Trace the journey of a single asset through the PublishLab industrial pipeline — from raw signal to retail product.
                        </p>
                    </div>

                    <div className="space-y-64 flex flex-col items-center">
                        {steps.map((step, i) => (
                            <section key={i} className="grid lg:grid-cols-2 gap-32 items-center w-full max-w-[1400px]">
                                <div className={`space-y-12 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                                    <div className="flex items-center gap-8">
                                        <div className={`w-32 h-32 ${step.bg} ${step.color} rounded-[3rem] border border-white/5 flex items-center justify-center shadow-[0_30px_60px_rgba(0,0,0,0.4)]`}>
                                            {step.icon}
                                        </div>
                                        <div className="space-y-4">
                                            <span className="text-[16px] font-black text-indigo-500 uppercase tracking-[0.5em]">Phase {step.id}</span>
                                            <h2 className="text-6xl md:text-7xl font-black uppercase italic tracking-tighter text-white">{step.title}</h2>
                                            <p className="text-3xl text-slate-500 font-bold italic">{step.subtitle}</p>
                                        </div>
                                    </div>
                                    <p className="text-3xl text-slate-300 leading-relaxed font-medium italic">
                                        {step.desc}
                                    </p>
                                    <ul className="space-y-6">
                                        {step.details.map((detail, di) => (
                                            <li key={di} className="flex items-center gap-6 text-xl font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-colors">
                                                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                                                    <CheckCircle2 size={16} className="text-white" />
                                                </div>
                                                {detail}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className={`relative group ${i % 2 === 1 ? 'lg:order-1' : ''} scale-125 lg:scale-150`}>
                                    <div className={`absolute inset-x-[-20%] inset-y-[-20%] ${step.bg} blur-[140px] rounded-full opacity-40 group-hover:opacity-70 transition-opacity`}></div>
                                    <div className="relative p-2 bg-gradient-to-br from-white/20 to-transparent rounded-[4rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.6)] overflow-hidden aspect-video flex items-center justify-center bg-slate-950">
                                        <img src={step.img} alt={step.title} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-[4000ms]" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                                        <div className="absolute bottom-10 left-10 flex items-center gap-4 text-white/40 font-black uppercase tracking-[0.8em] text-[10px]">
                                            <div className="w-32 h-px bg-white/10"></div>
                                            Layer {step.id} VISUALIZATION
                                        </div>
                                    </div>
                                </div>
                            </section>
                        ))}
                    </div>

                    <div className="p-32 bg-slate-900/60 border-2 border-white/10 rounded-[6rem] text-center space-y-16 shadow-[0_60px_120px_rgba(0,0,0,0.8)] relative overflow-hidden group flex flex-col items-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-violet-700/20"></div>
                        <div className="relative z-10 space-y-8">
                            <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter text-white">Ready to deploy?</h2>
                            <p className="text-slate-400 font-bold italic text-3xl max-w-3xl mx-auto leading-tight">Initialize your industrial studio and start producing production-ready assets today.</p>
                        </div>
                        <button onClick={onLaunchStudio} className="relative z-10 group px-24 py-12 bg-indigo-600 hover:bg-indigo-500 rounded-[3rem] text-2xl font-black uppercase tracking-[0.5em] flex items-center gap-10 shadow-[0_40px_80px_rgba(99,102,241,0.6)] transition-all hover:-translate-y-2 active:scale-95 text-white overflow-hidden">
                            <div className="relative z-20 flex items-center gap-6">
                                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-xl">
                                    <Zap size={32} className="fill-white" />
                                </div>
                                <span>Launch Studio Now</span>
                            </div>
                            <ArrowRight size={36} className="group-hover:translate-x-3 transition-transform relative z-20" />
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-indigo-600 to-violet-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </button>
                    </div>
                </div>
            </main>

            <footer className="py-32 text-center border-t border-white/10 bg-slate-950">
                <p className="text-[12px] font-black uppercase tracking-[0.6em] text-slate-700">
                    © 2026 PublishLab Industrial Systems • Built on AntiGravity Kit 2.0
                </p>
            </footer>
        </div>
    );
};

export default InfographicsPage;
