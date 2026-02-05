import React, { useState } from 'react';
import { Player } from '@remotion/player';
import { TeaserComposition } from './TeaserComposition';
import { Send, Bot, X } from 'lucide-react';
import { gemini } from '../geminiService';
import { motion, AnimatePresence } from 'framer-motion';

const TeaserPlayer: React.FC = () => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState<string | null>(null);
    const [isThinking, setIsThinking] = useState(false);

    const handleAsk = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsThinking(true);
        setResponse(null);

        try {
            // Use Gemini Service (which falls back to Ollama Proxy)
            const answer = await gemini.queryAI(`Context: You are the AI assistant for "PublishLab", an industrial creative studio for authors.
            The user is watching the demo video.
            User Question: "${query}"
            
            Answer concisely in 1-2 sentences. Adopt a futuristic, "PublishLab" persona.`, false);
            setResponse(answer);
        } catch (err) {
            setResponse("Industrial sensors are offline. Please check local engines.");
        } finally {
            setIsThinking(false);
            setQuery(''); // Clear input but keep response visible
        }
    };

    return (
        <div className="w-full h-full rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl relative group bg-black">
            <Player
                component={TeaserComposition}
                durationInFrames={360} // 12 seconds @ 30fps
                compositionWidth={1280}
                compositionHeight={720}
                fps={30}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }}
                controls
                autoPlay
                loop
            />

            {/* Live Status Badge */}
            <div className="absolute top-6 left-6 z-10 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Industrial Teaser Engine Live</span>
            </div>

            {/* Responsive AI Bar */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[90%] max-w-xl z-20">
                <AnimatePresence>
                    {response && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="mb-4 bg-black/80 backdrop-blur-xl border border-indigo-500/30 p-4 rounded-2xl shadow-xl flex items-start gap-3"
                        >
                            <div className="p-2 bg-indigo-500/20 rounded-lg shrink-0">
                                <Bot size={16} className="text-indigo-400" />
                            </div>
                            <div className="flex-1 text-sm text-gray-200 leading-relaxed font-medium">
                                {response}
                            </div>
                            <button onClick={() => setResponse(null)} className="text-gray-500 hover:text-white">
                                <X size={14} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleAsk} className="relative group/input">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-30 group-hover/input:opacity-75 transition duration-500"></div>
                    <div className="relative flex items-center bg-[#0F0F0F]/90 backdrop-blur-md rounded-full border border-white/10 px-2 py-2">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask the PublishLab Intelligence (e.g. 'How fast is the engine?')"
                            className="flex-1 bg-transparent border-none text-sm text-white px-4 py-2 focus:ring-0 placeholder:text-gray-500 outline-none"
                        />
                        <button
                            type="submit"
                            disabled={isThinking}
                            className={`p-2 rounded-full transition-all ${isThinking ? 'bg-gray-700' : 'bg-indigo-600 hover:bg-indigo-500'}`}
                        >
                            {isThinking ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Send size={16} className="text-white" />
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TeaserPlayer;
