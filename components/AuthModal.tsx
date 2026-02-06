import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { X, Mail, Lock, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

type AuthMode = 'login' | 'signup' | 'forgot' | 'update_password';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [mode, setMode] = useState<AuthMode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resetSent, setResetSent] = useState(false);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (mode === 'login') {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                onSuccess();
                onClose();
            } else if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                onSuccess();
                onClose();
            } else if (mode === 'forgot') {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/reset-password`,
                });
                if (error) throw error;
                setResetSent(true);
            } else if (mode === 'update_password') {
                const { error } = await supabase.auth.updateUser({
                    password: password
                });
                if (error) throw error;
                onSuccess();
                onClose();
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleModeChange = (newMode: AuthMode) => {
        setMode(newMode);
        setError(null);
        setResetSent(false);
    };

    // Auto-switch to update_password mode if we detect recovery flow
    React.useEffect(() => {
        supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY') {
                setMode('update_password');
            }
        });
    }, []);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-8 pb-0 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-black italic uppercase text-white">
                                {mode === 'forgot' ? 'Reset Password' :
                                    mode === 'update_password' ? 'Set New Password' :
                                        'Public Beta Access'}
                            </h2>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                {mode === 'login' && 'Enter Your Studio'}
                                {mode === 'signup' && 'Claim Your Beta Account — Free Forever'}
                                {mode === 'forgot' && 'We\'ll send you a reset link'}
                                {mode === 'update_password' && 'Enter your new password below'}
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X size={20} className="text-slate-400" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleAuth} className="p-8 space-y-6">
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-bold">
                                {error}
                            </div>
                        )}

                        {resetSent ? (
                            <div className="text-center space-y-4 py-4">
                                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                                <p className="text-white font-bold">Password Reset Email Sent!</p>
                                <p className="text-slate-400 text-sm">
                                    Check your inbox for <span className="text-white">{email}</span> and follow the link to reset your password.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => handleModeChange('login')}
                                    className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm font-bold flex items-center gap-2 mx-auto"
                                >
                                    <ArrowLeft size={14} /> Back to Login
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    {mode !== 'update_password' && (
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                                <input
                                                    type="email"
                                                    required
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700"
                                                    placeholder="user@example.com"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {mode !== 'forgot' && (
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                {mode === 'update_password' ? 'New Password' : 'Password'}
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                                <input
                                                    type="password"
                                                    required
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Forgot Password Link - Only show on login */}
                                {mode === 'login' && (
                                    <div className="text-right">
                                        <button
                                            type="button"
                                            onClick={() => handleModeChange('forgot')}
                                            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl py-4 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={16} /> : (
                                        mode === 'login' ? 'Restore Session' :
                                            mode === 'signup' ? 'Activate Free Beta Access' :
                                                mode === 'update_password' ? 'Update Password & Login' :
                                                    'Send Reset Link'
                                    )}
                                </button>

                                <div className="text-center space-y-2">
                                    {mode === 'forgot' || mode === 'update_password' ? (
                                        <button
                                            type="button"
                                            onClick={() => handleModeChange('login')}
                                            className="text-xs text-slate-500 hover:text-white transition-colors flex items-center gap-1 mx-auto"
                                        >
                                            <ArrowLeft size={12} /> Back to Login
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => handleModeChange(mode === 'login' ? 'signup' : 'login')}
                                            className="text-xs text-slate-500 hover:text-white transition-colors"
                                        >
                                            {mode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Log in"}
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
