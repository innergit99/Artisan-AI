import React from 'react';
import { motion } from 'framer-motion';
import { X, Shield, Scale, Lock, Info } from 'lucide-react';

interface TermsPageProps {
    onBack: () => void;
}

const TermsPage: React.FC<TermsPageProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans relative overflow-hidden">
            {/* Neural Background Effect */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto pt-32 pb-20 px-6">
                <button
                    onClick={onBack}
                    className="mb-12 flex items-center gap-2 text-gray-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest"
                >
                    <X size={14} /> Back to Studio
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                >
                    <header className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                            <Shield size={12} /> Compliance & Legal
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase leading-tight">
                            Terms of <br /><span className="text-gradient-animated">Service.</span>
                        </h1>
                        <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Last Updated: February 6, 2026</p>
                    </header>

                    <div className="space-y-16">
                        {/* Section: Fair Use */}
                        <section className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                                    <Scale size={24} />
                                </div>
                                <h2 className="text-2xl font-black uppercase tracking-tight">Fair Use Policy</h2>
                            </div>
                            <p className="text-gray-400 leading-relaxed font-medium">
                                PublishLab's "Unlimited" plans are designed to support typical creator workflows while maintaining high-quality service for all users.
                            </p>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5">
                                    <div className="text-[10px] font-black text-indigo-500 uppercase mb-1">Artisan Tier</div>
                                    <div className="text-lg font-bold">~50 Manuscripts/mo</div>
                                </div>
                                <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5">
                                    <div className="text-[10px] font-black text-purple-500 uppercase mb-1">Master Tier</div>
                                    <div className="text-lg font-bold">~200 Manuscripts/mo</div>
                                </div>
                            </div>
                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Quality Management</h3>
                                <ul className="space-y-3">
                                    {[
                                        { l: '80%', d: 'Usage update notification' },
                                        { l: '100%', d: 'Power user alert' },
                                        { l: '120%', d: 'Temporary quality optimization (speed priority)' }
                                    ].map((item, i) => (
                                        <li key={i} className="flex gap-3 text-sm">
                                            <span className="text-indigo-500 font-bold">{item.l}</span>
                                            <span className="text-gray-500 font-medium">{item.d}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-[10px] text-gray-600 italic font-medium pt-2">
                                    * We will NEVER block your access or stop your service. "Unlimited" means unlimited.
                                </p>
                            </div>
                        </section>

                        {/* Section: Acceptable Use */}
                        <section className="space-y-6 px-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                                    <Lock size={24} />
                                </div>
                                <h2 className="text-2xl font-black uppercase tracking-tight">Acceptable Use</h2>
                            </div>
                            <div className="grid gap-4">
                                {[
                                    'No generation of illegal, harmful, or copyrighted content',
                                    'No reselling of API access or industrial infrastructure',
                                    'No automated mass-spam generation',
                                    'Full compliance with Amazon KDP & Marketplace terms'
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.01] border border-white/5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                        <span className="text-sm text-gray-400 font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Section: Data & Refund */}
                        <div className="grid md:grid-cols-2 gap-8 px-4">
                            <section className="space-y-4">
                                <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                                    <Shield size={18} className="text-indigo-500" /> Data & Privacy
                                </h2>
                                <ul className="space-y-2 text-sm text-gray-500 font-medium">
                                    <li>• Ephemeral manuscript processing (not stored)</li>
                                    <li>• 100% User content ownership</li>
                                    <li>• Industrial-grade AES-256 encryption</li>
                                </ul>
                            </section>
                            <section className="space-y-4">
                                <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                                    <Info size={18} className="text-indigo-500" /> Refund Policy
                                </h2>
                                <ul className="space-y-2 text-sm text-gray-500 font-medium">
                                    <li>• 7-day industrial satisfaction guarantee</li>
                                    <li>• Subscription cancellation anytime</li>
                                    <li>• Contact: support@publishlab.ink</li>
                                </ul>
                            </section>
                        </div>

                        {/* Footer Contact */}
                        <footer className="pt-16 border-t border-white/5 text-center">
                            <p className="text-sm text-gray-600 font-medium">
                                For enterprise pricing or volume inquiries:
                                <br />
                                <span className="text-indigo-500 font-black tracking-widest uppercase text-xs">hello@publishlab.ink</span>
                            </p>
                        </footer>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TermsPage;
