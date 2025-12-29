"use client";

import React, { useState } from 'react';
import { MermaidPreview } from '@/components/mermaid/MermaidPreview';
import { CrewDesignResponse } from '@/types/crew';
import {
    Users,
    ArrowRight,
    Loader2,
    ChevronRight,
    Bot,
    ClipboardList,
    Layers,
    Sparkles,
    Zap,
    Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CrewPage() {
    const [objective, setObjective] = useState('');
    const [result, setResult] = useState<CrewDesignResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleDesignCrew = async () => {
        if (!objective.trim()) return;

        setIsLoading(true);
        try {
            const response = await fetch('/api/crew/design', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ objective }),
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            setResult(data);
        } catch (error: any) {
            alert("Erreur de design : " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-purple-500/30 overflow-x-hidden pt-12">
            {/* Background gradients */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none"></div>

            <main className="container mx-auto px-6 py-12 max-w-7xl space-y-20">
                {/* Hero Section */}
                <div className="text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-purple-400 mb-4"
                    >
                        <Zap size={12} className="animate-pulse" />
                        Agentic Orchestration Flow
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none italic">
                        VORTEX <span className="text-purple-500">CREW</span> DESIGNER
                    </h1>
                    <p className="text-zinc-500 text-sm max-w-xl mx-auto leading-relaxed font-medium">
                        Passez de l'agent unique à la collaboration massive. Définissez un objectif, l'IA conçoit l'équipe et le flux d'orchestration.
                    </p>
                </div>

                {/* Input area */}
                <div className="max-w-3xl mx-auto">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-[2.5rem] blur opacity-25 group-focus-within:opacity-50 transition duration-500"></div>
                        <div className="relative flex items-center bg-zinc-950 border border-white/10 rounded-[2.5rem] p-3 shadow-2xl backdrop-blur-3xl">
                            <div className="p-4 text-purple-500">
                                <Users size={24} />
                            </div>
                            <input
                                value={objective}
                                onChange={(e) => setObjective(e.target.value)}
                                placeholder="Ex: Créer une campagne marketing complète pour un nouveau SaaS..."
                                className="flex-1 bg-transparent py-4 text-lg outline-none placeholder:text-zinc-700 font-medium"
                                onKeyPress={(e) => e.key === 'Enter' && handleDesignCrew()}
                            />
                            <button
                                onClick={handleDesignCrew}
                                disabled={isLoading || !objective.trim()}
                                className="px-10 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-[1.8rem] font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50 flex items-center gap-3 shadow-xl shadow-purple-900/40"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Design <Sparkles size={16} /></>}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <AnimatePresence mode="wait">
                    {result && !isLoading && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-12"
                        >
                            {/* Agents Sidebar */}
                            <div className="lg:col-span-4 space-y-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <Bot className="text-purple-400" size={20} />
                                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">The Crew (Agents)</h2>
                                </div>
                                {result.agents.map((agent, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="p-6 bg-zinc-900/50 border border-white/5 rounded-3xl hover:border-purple-500/30 transition-all group"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors uppercase italic">{agent.name}</h3>
                                            <div className="px-2 py-0.5 bg-purple-500/10 rounded-md text-[8px] font-black text-purple-400 border border-purple-500/20">AGENT_{i + 1}</div>
                                        </div>
                                        <p className="text-[10px] text-zinc-400 leading-relaxed font-mono opacity-80 uppercase tracking-wider mb-3">{agent.role}</p>
                                        <p className="text-xs text-zinc-500 leading-relaxed italic line-clamp-2 hover:line-clamp-none transition-all">"{agent.backstory}"</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Central Flow & Tasks */}
                            <div className="lg:col-span-8 space-y-12">
                                {/* Visual Flow */}
                                <div className="bg-zinc-900/30 border border-white/5 rounded-[3rem] p-8 h-[500px] overflow-hidden shadow-2xl relative">
                                    <div className="absolute top-6 left-6 z-20 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                                        <Layers size={14} /> Orchestration Diagram
                                    </div>
                                    <MermaidPreview
                                        code={result.mermaidFlow}
                                        onError={() => { }}
                                        onSuccess={() => { }}
                                    />
                                </div>

                                {/* Tasks List */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <ClipboardList className="text-purple-400" size={20} />
                                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Execution Pipeline (Tasks)</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {result.tasks.map((task, i) => (
                                            <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex flex-col gap-3">
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-purple-400 uppercase tracking-widest">
                                                    <Bot size={12} /> {task.agentName}
                                                </div>
                                                <p className="text-sm font-medium text-zinc-300 leading-relaxed">{task.description}</p>
                                                <div className="mt-auto pt-4 border-t border-white/5">
                                                    <p className="text-[9px] uppercase tracking-widest font-black text-zinc-600 mb-1">Expected Output</p>
                                                    <p className="text-[10px] text-zinc-400 italic">{task.expectedOutput}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Analysis */}
                                <div className="p-8 bg-purple-500/5 border border-purple-500/10 rounded-[2.5rem] flex gap-6 italic">
                                    <Info className="text-purple-400 shrink-0" size={24} />
                                    <p className="text-sm text-purple-200/70 leading-relaxed font-medium">
                                        {result.explanation}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {isLoading && (
                    <div className="py-20 flex flex-col items-center justify-center gap-8">
                        <div className="relative">
                            <div className="w-24 h-24 border-4 border-purple-500/10 border-t-purple-500 rounded-full animate-spin"></div>
                            <Users className="absolute inset-0 m-auto w-8 h-8 text-purple-500" />
                        </div>
                        <p className="text-xs font-black uppercase tracking-[0.4em] text-purple-500 animate-pulse">Configuration du Crew & Orchestration...</p>
                    </div>
                )}
            </main>

            <footer className="py-20 border-t border-white/5 text-center bg-zinc-950/20">
                <p className="text-[10px] uppercase tracking-[0.5em] font-black text-zinc-700">Multi-Agent Intelligence Architecture • v1.1.2</p>
            </footer>
        </div>
    );
}
