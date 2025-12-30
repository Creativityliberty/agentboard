"use client";

import React, { useState } from 'react';
import { MermaidPreview } from '@/components/mermaid/MermaidPreview';
import { Code, Share2, PanelRight, Tablet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    mermaidCode?: string;
    uiCode?: string;
    explanation: string;
}

export const AnalysisResult: React.FC<Props> = ({ mermaidCode, uiCode, explanation }) => {
    const [activeTab, setActiveTab] = useState<'diagram' | 'code' | 'explanation'>('diagram');

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-2 p-1 bg-zinc-900/80 backdrop-blur rounded-2xl border border-white/5 w-fit self-center shadow-2xl">
                <button
                    onClick={() => setActiveTab('diagram')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'diagram' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <PanelRight size={14} />
                    Architecture
                </button>
                <button
                    onClick={() => setActiveTab('code')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'code' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Code size={14} />
                    UI Component
                </button>
                <button
                    onClick={() => setActiveTab('explanation')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'explanation' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Tablet size={14} />
                    Analyse
                </button>
            </div>

            <div className="bg-zinc-900/60 rounded-[2.5rem] border border-white/5 min-h-[500px] overflow-hidden shadow-3xl flex flex-col backdrop-blur-xl">
                <AnimatePresence mode="wait">
                    {activeTab === 'diagram' && (
                        <motion.div
                            key="diagram"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 h-full min-h-[500px]"
                        >
                            {mermaidCode ? (
                                <MermaidPreview
                                    code={mermaidCode}
                                    onError={() => { }}
                                    onSuccess={() => { }}
                                />
                            ) : (
                                <div className="h-full flex items-center justify-center p-12 text-zinc-500">
                                    Pas de diagramme généré.
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'code' && (
                        <motion.div
                            key="code"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="p-8"
                        >
                            <pre className="p-6 bg-zinc-950 rounded-3xl border border-white/5 overflow-x-auto text-[13px] text-emerald-400 font-mono leading-relaxed selection:bg-emerald-500/20">
                                <code>{uiCode || "Code non disponible."}</code>
                            </pre>
                        </motion.div>
                    )}

                    {activeTab === 'explanation' && (
                        <motion.div
                            key="explanation"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="p-10"
                        >
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="h-1px flex-1 bg-white/5"></div>
                                    <span className="text-[10px] uppercase tracking-[0.3em] font-black text-indigo-400">Rapport d&apos;Expert</span>
                                    <div className="h-1px flex-1 bg-white/5"></div>
                                </div>
                                <div className="text-zinc-300 leading-loose text-sm whitespace-pre-wrap font-sans first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-white">
                                    {explanation}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
