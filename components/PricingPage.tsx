import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap, Star, ShieldCheck, Cpu, Globe, ArrowRight, Check,
    X, CreditCard, Sparkles, TrendingUp, BookOpen, Coins
} from 'lucide-react';
import { NeuralNetworkBackground } from './GenerativeVisuals';
import { openPaddleCheckout, SUBSCRIPTION_TIERS } from '../paddleIntegration';

const TIERS = [
    {
        id: 'free',
        name: 'Novice',
        price: '0',
        description: 'For hobbyists exploring PublishLab.',
        features: [
            '1 Manuscript Projection / Mo',
            'Low-res Cover Previews',
            'Basic Niche Discovery',
            'Standard AI Model',
            'Community Support'
        ],
        icon: <BookOpen className="text-gray-400" size={24} />,
        accent: 'gray'
    },
    {
        id: 'solo',
        name: 'Solo Builder',
        price: '12.99',
        yearlyPrice: '124.99',
        description: 'The industrial standard for solo builders.',
        features: [
            '5 Manuscripts / Mo',
            '300 DPI Print-Ready Covers',
            'Standard Character Bibles',
            'Priority Support',
            'No Watermarks'
        ],
        icon: <Zap className="text-indigo-400" size={24} />,
        accent: 'indigo'
    },
    {
        id: 'artisan',
        name: 'Artisan',
        price: '14.99',
        yearlyPrice: '143.99',
        description: 'The industrial standard for serious creators.',
        features: [
            'Unlimited Manuscripts',
            '300 DPI Print-Ready Covers',
            'Trend Radar API Access',
            'Gemini 1.5 Pro Engine',
            'Advanced Character Bibles',
            'Priority Support'
        ],
        icon: <Sparkles className="text-indigo-400" size={24} />,
        accent: 'indigo',
        popular: true
    },
    {
        id: 'master',
        name: 'PublishLab Master',
        price: '49.00',
        yearlyPrice: '470.00',
        description: 'Scalable infrastructure for publishing empires.',
        features: [
            'Everything in Artisan',
            'Multi-Agent Collaboration',
            '1-Click KDP Deployment',
            'Whitelabel Export',
            'Dedicated Account Manager',
            'Custom AI Fine-tuning'
        ],
        icon: <Cpu className="text-emerald-400" size={24} />,
        accent: 'emerald'
    }
];

// Email Modal Component
const EmailCaptureModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (email: string) => void; tierName: string }> = ({ isOpen, onClose, onSubmit, tierName }) => {
    const [email, setEmail] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CreditCard className="text-indigo-400" size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Secure Access</h3>
                    <p className="text-gray-400 text-sm">Enter your email to activate the <span className="text-white font-bold">{tierName}</span> plan.</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); if (email) onSubmit(email); }}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:border-indigo-500 outline-none mb-6 transition-colors"
                        autoFocus
                    />
                    <div className="space-y-3">
                        <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors">
                            Continue to Checkout
                        </button>
                        <button type="button" onClick={onClose} className="w-full text-gray-500 text-sm hover:text-white transition-colors">
                            Cancel
                        </button>
                    </div>
                </form>
                <p className="text-[10px] text-gray-600 text-center mt-6">
                    <ShieldCheck size={10} className="inline mr-1" />
                    256-bit SSL Encrypted. No spam.
                </p>
            </motion.div>
        </div>
    );
};

export const PricingPage: React.FC<{ onBack?: () => void; onPlanSelected?: () => void }> = ({ onBack, onPlanSelected }) => {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [selectedTier, setSelectedTier] = useState<typeof TIERS[0] | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePlanActivation = async (email: string) => {
        if (!selectedTier) return;

        setIsProcessing(true);
        try {
            // Map UI tier ID to Integration Tier
            const tierKey = selectedTier.id.toUpperCase();
            const tierConfig = SUBSCRIPTION_TIERS[tierKey];

            if (tierConfig) {
                await openPaddleCheckout(tierConfig, email);
            }
        } catch (error) {
            console.error("Checkout failed", error);
            alert("Checkout initialization failed. Please try again.");
        } finally {
            setIsProcessing(false);
            setSelectedTier(null); // Close modal
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans relative overflow-hidden">
            <NeuralNetworkBackground />

            <EmailCaptureModal
                isOpen={!!selectedTier}
                onClose={() => setSelectedTier(null)}
                onSubmit={handlePlanActivation}
                tierName={selectedTier?.name || ''}
            />

            {/* Processing Overlay */}
            <AnimatePresence>
                {isProcessing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center"
                    >
                        <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-6" />
                        <h3 className="text-xl font-bold text-white animate-pulse">Initializing Industrial Account...</h3>
                        <p className="text-gray-500 text-sm mt-2">Provisioning secure workspace</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header Area */}
            <div className="relative z-10 max-w-[1400px] mx-auto pt-32 pb-20 px-6">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="mb-12 flex items-center gap-2 text-gray-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest"
                    >
                        <X size={14} /> Back to Studio
                    </button>
                )}

                <div className="text-center max-w-3xl mx-auto space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest text-indigo-400"
                    >
                        <Coins size={12} /> Industrial Pricing
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase leading-none"
                    >
                        Build Your <br /><span className="text-gradient-animated">Empire.</span>
                    </motion.h1>

                    <p className="text-xl text-gray-400">
                        Stop micro-subscribing. Start industrializing. One platform, total dominance.
                    </p>

                    {/* Toggle */}
                    <div className="flex items-center justify-center gap-4 pt-8">
                        <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-600'}`}>Monthly</span>
                        <button
                            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                            className="w-14 h-8 rounded-full bg-white/5 border border-white/10 p-1 relative flex items-center"
                        >
                            <motion.div
                                animate={{ x: billingCycle === 'monthly' ? 0 : 24 }}
                                className="w-6 h-6 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                            />
                        </button>
                        <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-600'}`}>Yearly <span className="text-emerald-400 text-[10px] ml-1">(-20%)</span></span>
                    </div>
                </div>

                {/* Pricing Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-24 items-start">
                    {TIERS.map((tier, idx) => (
                        <motion.div
                            key={tier.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -5 }}
                            className={`relative p-8 rounded-[2.5rem] border transition-all duration-500 group h-full flex flex-col ${tier.popular
                                ? 'bg-indigo-600/[0.08] border-indigo-500/40 shadow-[0_0_50px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500/20'
                                : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                                }`}
                        >
                            {tier.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-indigo-600 text-[9px] font-black uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(79,70,229,0.5)]">
                                    Industrial Standard
                                </div>
                            )}

                            <div className="flex flex-col mb-8">
                                <div className={`w-12 h-12 rounded-xl bg-${tier.accent}-500/10 border border-${tier.accent}-500/20 flex items-center justify-center mb-6`}>
                                    {tier.icon}
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{tier.name}</div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black text-white">$</span>
                                        <span className="text-5xl font-black text-white">
                                            {billingCycle === 'monthly' ? tier.price : Math.floor(parseFloat(tier.price) * 0.8)}
                                        </span>
                                        <span className="text-xs text-gray-500 font-bold uppercase tracking-tighter">/ mo</span>
                                    </div>
                                    {billingCycle === 'yearly' && tier.yearlyPrice && (
                                        <div className="text-[10px] text-emerald-400 font-bold mt-2 uppercase tracking-wide">
                                            Billed ${tier.yearlyPrice} annually
                                        </div>
                                    )}
                                </div>
                            </div>

                            <p className="text-gray-400 text-xs mb-8 leading-relaxed font-medium">
                                {tier.description}
                            </p>

                            <div className="space-y-4 mb-10 flex-1">
                                {tier.features.map((feature, fIdx) => (
                                    <div key={fIdx} className="flex items-start gap-3">
                                        <div className={`mt-0.5 p-0.5 rounded-full bg-${tier.accent}-500/20 text-${tier.accent}-400`}>
                                            <Check size={10} />
                                        </div>
                                        <span className="text-[13px] text-gray-400 font-medium leading-tight">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => setSelectedTier(tier)}
                                className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${tier.popular
                                    ? 'bg-white text-black hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.2)]'
                                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                    }`}>
                                {tier.price === '0' ? 'Get Started' : `Activate ${tier.name}`}
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="mt-40 max-w-4xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black uppercase tracking-widest text-white mb-4">Frequently Asked Questions</h2>
                        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Everything you need to know about the PublishLab Studio</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                        {[
                            {
                                q: "How do credits work?",
                                a: "Each plan comes with a monthly allocation of 'Node Credits'. 1 Credit = 1 high-resolution 4K generation or 1 deep manuscript audit. Unused credits don't rollover, but recharge every billing cycle."
                            },
                            {
                                q: "Can I cancel anytime?",
                                a: "Absolutely. You can cancel your subscription with one click from your profile settings. You'll retain access to your plan's features until the end of your current billing period."
                            },
                            {
                                q: "What is 'Lab Level Persistence'?",
                                a: "This is our industrial-grade cloud sync. Your manuscripts, cover designs, and research stay synced across all your devices, backed by encrypted global redundancy."
                            },
                            {
                                q: "Do I own the copyrights?",
                                a: "Yes. Any content, images, or manuscripts generated inside your Artisan account belong entirely to you for commercial use, subject to our Acceptable Use Policy."
                            },
                            {
                                q: "What happens if I run out of credits?",
                                a: "You can either wait for your monthly recharge or purchase 'Emergency Credit Packs' directly from the dashboard to keep your production line running."
                            },
                            {
                                q: "Is the Manuscript Doctor safe?",
                                a: "We use private, isolated instances for deep audits. Your intellectual property is never used for training public models and is treated with high-security confidentiality."
                            }
                        ].map((faq, i) => (
                            <div key={i} className="group p-6 rounded-3xl bg-white/[0.01] border border-white/5 hover:border-indigo-500/30 transition-all duration-300">
                                <h3 className="text-white font-black text-sm uppercase tracking-wider mb-3 group-hover:text-indigo-400 transition-colors flex items-center gap-2">
                                    <span className="text-indigo-500">?</span> {faq.q}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed font-medium">
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Badges */}
                <div className="mt-32 pt-16 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { icon: <ShieldCheck size={20} />, label: 'Sonatype Compliant' },
                        { icon: <Globe size={20} />, label: 'Global Edge Sync' },
                        { icon: <Star size={20} />, label: '99.9% Node Uptime' },
                        { icon: <TrendingUp size={20} />, label: 'Profit-First Logic' }
                    ].map((badge, i) => (
                        <div key={i} className="flex items-center gap-3 text-gray-600 grayscale hover:grayscale-0 hover:text-white transition-all cursor-default">
                            {badge.icon}
                            <span className="text-[10px] font-black uppercase tracking-widest">{badge.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PricingPage;
