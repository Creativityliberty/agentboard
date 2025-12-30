"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Check, ArrowRight, Loader2 } from 'lucide-react';
import { MermaidMessage } from '@/types/mermaid';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    messages: MermaidMessage[];
    onSendMessage: (text: string) => void;
    isLoading: boolean;
    onApplyCode: (code: string) => void;
}

export const MermaidChat: React.FC<Props> = ({ messages, onSendMessage, isLoading, onApplyCode }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        onSendMessage(input);
        setInput('');
    };

    return (
        <div className="flex flex-col h-full bg-zinc-900 overflow-hidden backdrop-blur-sm">
            <div className="shrink-0 p-4 border-b border-white/5 flex items-center justify-between bg-zinc-950/40">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white tracking-tight">Mermaid Architect</h2>
                        <p className="text-[10px] text-zinc-500 uppercase font-medium tracking-widest">Powered by Gemini Pro</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
                        <Bot size={48} className="mb-4" />
                        <p className="text-sm">Demandez-moi de générer, analyser ou modifier votre diagramme.</p>
                        <p className="text-[10px] mt-2 font-mono uppercase tracking-widest">Ex: &quot;Transforme ça en diagramme de séquence&quot;</p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                        <div
                            className={`max-w-[90%] rounded-2xl p-4 text-sm leading-relaxed break-words ${msg.role === 'user'
                                ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/20'
                                : 'bg-white/5 text-zinc-300 border border-white/5 rounded-tl-none'
                                }`}
                        >
                            <div className="whitespace-pre-wrap">{msg.text}</div>

                            {msg.codeBlock && (
                                <div className="mt-4 p-3 bg-zinc-950/50 rounded-xl border border-white/5 flex flex-col gap-3 overflow-hidden">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">New Architecture</span>
                                        <Check className="w-3 h-3 text-emerald-500" />
                                    </div>
                                    <button
                                        onClick={() => onApplyCode(msg.codeBlock!)}
                                        className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-4 rounded-xl text-xs transition-all font-bold shadow-lg shadow-emerald-900/40"
                                    >
                                        Appliquer les changements
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-2 animate-pulse">
                        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-none">
                            <Loader2 className="w-4 h-4 text-zinc-500 animate-spin" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} className="h-4" />
            </div>

            <form onSubmit={handleSubmit} className="shrink-0 p-4 bg-zinc-950/40 border-t border-white/5">
                <div className="relative flex items-center gap-2">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Décrivez les changements..."
                        className="flex-1 bg-white/5 border border-white/10 text-white text-sm rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none h-12 min-h-[48px] max-h-32"
                        disabled={isLoading}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl transition-all shadow-lg shadow-indigo-600/30 shrink-0"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </form>
        </div>
    );
};
