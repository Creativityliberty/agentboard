"use client";

import React from 'react';
import { Swords, Zap, MessageSquare, Sparkles } from 'lucide-react';

const VORTEX_PRESET = `# 🌪️ [AGENT_NAME] — Fractal Vortex Agent
## 1. IDENTITY & ROLE
Self_HL = [Value 1, Value 2, Value 3]
Self_LL = [Expertise and Persona]
## 2. RRLA — REASONING PIPELINE
1. Reveal, 2. Resolve, 3. Log, 4. Act.
## 3. MANDATORY OUTPUT
STATE, ACTION_NOW, NEXT_STEP, WHY, CERTAINTY.
`;

interface Props {
    promptA: string;
    setPromptA: (val: string) => void;
    promptB: string;
    setPromptB: (val: string) => void;
    query: string;
    setQuery: (val: string) => void;
    onBattle: () => void;
    isLoading: boolean;
}

export const BattleForm: React.FC<Props> = ({
    promptA, setPromptA, promptB, setPromptB, query, setQuery, onBattle, isLoading
}) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Agent A */}
                <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                    <div className="relative bg-zinc-900/50 border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-500/10 rounded-xl border border-red-500/20">
                                    <Zap className="w-4 h-4 text-red-400" />
                                </div>
                                <h3 className="text-xs uppercase tracking-widest font-black text-red-400">Agent Alpha</h3>
                            </div>
                            <button
                                onClick={() => setPromptA(VORTEX_PRESET)}
                                className="text-[9px] uppercase tracking-widest font-black px-2 py-1 bg-white/5 hover:bg-red-500/20 rounded-md border border-white/5 text-zinc-500 hover:text-red-400 transition-all"
                            >
                                Vortex DNA
                            </button>
                        </div>
                        <textarea
                            value={promptA}
                            onChange={(e) => setPromptA(e.target.value)}
                            placeholder="Ex: Sois un expert en cybersécurité, donne des réponses courtes et techniques."
                            className="w-full h-32 bg-transparent text-sm text-zinc-300 outline-none resize-none placeholder:text-zinc-600 leading-relaxed font-mono"
                        />
                    </div>
                </div>

                {/* Agent B */}
                <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                    <div className="relative bg-zinc-900/50 border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                    <Zap className="w-4 h-4 text-blue-400" />
                                </div>
                                <h3 className="text-xs uppercase tracking-widest font-black text-blue-400">Agent Omega</h3>
                            </div>
                            <button
                                onClick={() => setPromptB(VORTEX_PRESET)}
                                className="text-[9px] uppercase tracking-widest font-black px-2 py-1 bg-white/5 hover:bg-blue-500/20 rounded-md border border-white/5 text-zinc-500 hover:text-blue-400 transition-all"
                            >
                                Vortex DNA
                            </button>
                        </div>
                        <textarea
                            value={promptB}
                            onChange={(e) => setPromptB(e.target.value)}
                            placeholder="Ex: Sois un vulgarisateur, utilise des métaphores et sois très chaleureux."
                            className="w-full h-32 bg-transparent text-sm text-zinc-300 outline-none resize-none placeholder:text-zinc-600 leading-relaxed font-mono"
                        />
                    </div>
                </div>
            </div>

            <div className="relative group max-w-2xl mx-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2rem] blur opacity-25 group-focus-within:opacity-50 transition duration-500"></div>
                <div className="relative flex items-center bg-zinc-950/80 border border-white/10 rounded-[2rem] p-2 pr-4 shadow-2xl backdrop-blur-2xl">
                    <div className="p-4 text-zinc-500">
                        <MessageSquare size={20} />
                    </div>
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Pose le problème pour le combat..."
                        className="flex-1 bg-transparent py-4 text-sm outline-none placeholder:text-zinc-700 font-medium"
                        onKeyPress={(e) => e.key === 'Enter' && onBattle()}
                    />
                    <button
                        onClick={onBattle}
                        disabled={isLoading || !query.trim()}
                        className="px-8 py-3 bg-white text-zinc-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all disabled:opacity-50 flex items-center gap-2 shadow-xl"
                    >
                        {isLoading ? "Combat..." : <><Swords size={16} /> Fight</>}
                    </button>
                </div>
            </div>
        </div>
    );
};
