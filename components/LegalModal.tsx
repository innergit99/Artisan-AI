import React, { useEffect } from 'react';
import { Shield, Lock, FileText, ChevronLeft, Mail } from 'lucide-react';

interface LegalModalProps {
    type: 'terms' | 'privacy' | 'refund' | null;
    onClose: () => void;
}

export default function LegalModal({ type, onClose }: LegalModalProps) {
    useEffect(() => {
        if (type) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [type]);

    if (!type) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0F0F0F] w-full max-w-4xl h-[90vh] rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#0F0F0F]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                            {type === 'terms' ? <FileText className="text-indigo-400" size={20} /> : <Lock className="text-emerald-400" size={20} />}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                {type === 'terms' && 'Terms of Service'}
                                {type === 'privacy' && 'Privacy Policy'}
                                {type === 'refund' && 'Refund Policy'}
                            </h2>
                            <p className="text-xs text-gray-500">Effective Date: January 18, 2026</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                        <ChevronLeft size={24} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8 text-gray-300 leading-relaxed space-y-8 custom-scrollbar">

                    {type === 'terms' && (
                        <>
                            <section>
                                <h3 className="text-white font-bold text-lg mb-2">1. Agreement to Terms</h3>
                                <p>By accessing PublishLab ("Service"), provided by <strong>PublishLab</strong> ("Company"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service.</p>
                            </section>

                            <section>
                                <h3 className="text-white font-bold text-lg mb-2">2. Description of Service</h3>
                                <p>PublishLab provides AI-powered publishing tools including manuscript writing, professional cover design, niche research, and marketing automation for authors and creators.</p>
                            </section>

                            <section>
                                <h3 className="text-white font-bold text-lg mb-2">3. Payment & Credits</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li><strong>Pay-Per-Result:</strong> Services are billed based on consumable "Credits" or direct purchases via Paddle.</li>
                                    <li><strong>Refunds:</strong> We offer a 14-day money-back guarantee for unused credits. Contact support@publishlab.ink.</li>
                                    <li><strong>Cancellation:</strong> You may cease using the service at any time. No long-term contracts.</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-white font-bold text-lg mb-2">4. User Responsibilities</h3>
                                <p>You agree not to generate harmful, illegal, or offensive content. You verify that you are at least 18 years of age.</p>
                            </section>

                            <section>
                                <h3 className="text-white font-bold text-lg mb-2">5. Intellectual Property</h3>
                                <p><strong>Your Content:</strong> You retain full ownership of the content you generate using our tools (Book Manuscripts, Covers). We claim no copyright over your creations.</p>
                            </section>
                        </>
                    )}

                    {type === 'privacy' && (
                        <>
                            <section>
                                <h3 className="text-white font-bold text-lg mb-2">1. Data Collection</h3>
                                <p>We collect only the essential data required to operate the service: Email address (for account identification) and Usage Data (to track credit consumption).</p>
                            </section>

                            <section>
                                <h3 className="text-white font-bold text-lg mb-2">2. Processing of AI Content</h3>
                                <p>Input data (prompts, manuscripts) is processed by our AI partners (Google Gemini, Fal.ai) solely for the purpose of generation. <strong>We do not use your private manuscripts to train public models.</strong></p>
                            </section>

                            <section>
                                <h3 className="text-white font-bold text-lg mb-2">3. Payment Security</h3>
                                <p>All financial transactions are handled by <strong>Paddle</strong>. We do not store your credit card information on our servers.</p>
                            </section>

                            <section>
                                <h3 className="text-white font-bold text-lg mb-2">4. Cookies</h3>
                                <p>We use local storage keys to save your preferences (Dark Mode, WIP Drafts). We do not use invasive tracking cookies.</p>
                            </section>

                            <section>
                                <h3 className="text-white font-bold text-lg mb-2">5. Contact Data Officer</h3>
                                <p className="flex items-center gap-2"><Mail size={16} /> privacy@publishlab.ink</p>
                            </section>
                        </>
                    )}

                    {type === 'refund' && (
                        <>
                            <section>
                                <h3 className="text-white font-bold text-lg mb-2">1. 14-Day Money-Back Guarantee</h3>
                                <p>We want you to be completely satisfied with The Foundry. If you are not satisfied with your purchase of credits or subscription, you may request a full refund within 14 days of the transaction date, provided that you have not significantly consumed the purchased credits (usage &lt; 10%).</p>
                            </section>

                            <section>
                                <h3 className="text-white font-bold text-lg mb-2">2. How to Request a Refund</h3>
                                <p>To initiate a refund, please contact our support team at <a href="mailto:support@publishlab.ink" className="text-indigo-400 hover:underline">support@publishlab.ink</a> with your order number/receipt ID.</p>
                            </section>

                            <section>
                                <h3 className="text-white font-bold text-lg mb-2">3. Processing Time</h3>
                                <p>Refunds are processed by our payment partner, Paddle. Once approved, funds usually return to your bank account within 5-10 business days.</p>
                            </section>

                            <section>
                                <h3 className="text-white font-bold text-lg mb-2">4. Digital Goods Exception</h3>
                                <p>Please note that due to the nature of digital goods, we cannot offer refunds for downloadable assets (e.g., exported manuscripts, high-res images) once they have been successfully generated and downloaded, unless the file is technically defective.</p>
                            </section>
                        </>
                    )}

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-[#0A0A0A] flex justify-end gap-4">
                    <button onClick={onClose} className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors">
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
}
