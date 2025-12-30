"use client";

import React from 'react';
import { BattleResult } from '@/types/arena';
import { motion } from 'framer-motion';
import { Trophy, ThumbsUp, Sparkles, Wand2, Gavel } from 'lucide-react';

interface Props {
    result: BattleResult;
}

export const ArenaDisplay: React.FC<Props> = ({ result }) => {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Answer A */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`relative p-8 rounded-[2.5rem] border ${result.winner === 'A' ? 'bg-red-500/5 border-red-500/20' : 'bg-zinc-900/40 border-white/5'}`}
                >
                    {result.winner === 'A' && (
                        <div className="absolute -top-4 -right-4 bg-red-500 text-white p-3 rounded-2xl shadow-xl shadow-red-900/40 rotate-12">
                            <Trophy size={20} />
                        </div>
                    )}
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-[10px] uppercase tracking-[0.3em] font-black text-red-400">Agent Alpha</span>
                        <div className="px-4 py-1 bg-white/5 border border-white/5 rounded-full text-xl font-black text-white">
                            {result.participantA.score.toString().padStart(2, '0')}
                        </div>
                    </div>
                    <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap mb-8">
                        {result.participantA.answer}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {result.participantA.positives.map((p, i) => (
                            <span key={i} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[9px] font-bold text-emerald-400 flex items-center gap-1">
                                <ThumbsUp size={10} /> {p}
                            </span>
                        ))}
                    </div>
                </motion.div>

                {/* Answer B */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`relative p-8 rounded-[2.5rem] border ${result.winner === 'B' ? 'bg-blue-500/5 border-blue-500/20' : 'bg-zinc-900/40 border-white/5'}`}
                >
                    {result.winner === 'B' && (
                        <div className="absolute -top-4 -right-4 bg-blue-500 text-white p-3 rounded-2xl shadow-xl shadow-blue-900/40 -rotate-12">
                            <Trophy size={20} />
                        </div>
                    )}
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-[10px] uppercase tracking-[0.3em] font-black text-blue-400">Agent Omega</span>
                        <div className="px-4 py-1 bg-white/5 border border-white/5 rounded-full text-xl font-black text-white">
                            {result.participantB.score.toString().padStart(2, '0')}
                        </div>
                    </div>
                    <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap mb-8">
                        {result.participantB.answer}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {result.participantB.positives.map((p, i) => (
                            <span key={i} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[9px] font-bold text-emerald-400 flex items-center gap-1">
                                <ThumbsUp size={10} /> {p}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Judge Section */}
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
                    <div className="flex items-center gap-2 text-zinc-500">
                        <Gavel size={16} />
                        <span className="text-[10px] uppercase tracking-[0.4em] font-black">Verdict du Juge IA</span>
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
                </div>

                <div className="bg-zinc-900/50 border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl shadow-3xl">
                    <p className="text-zinc-300 text-lg font-medium leading-loose mb-10 text-center italic">
                        &quot;{result.judgeAnalysis}&quot;
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
                                <Wand2 className="w-5 h-5 text-purple-400" />
                            </div>
                            <h4 className="text-xs uppercase tracking-widest font-black text-purple-400">Prompt de Fusion (Suggéré)</h4>
                        </div>
                        <div className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition transition-all"></div>
                            <div className="relative p-6 bg-zinc-950 rounded-3xl border border-white/5 font-mono text-sm text-purple-200 leading-relaxed">
                                {result.suggestedFusedPrompt}
                                <button
                                    onClick={() => navigator.clipboard.writeText(result.suggestedFusedPrompt)}
                                    className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-500 hover:text-white transition-all"
                                >
                                    <Sparkles size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
