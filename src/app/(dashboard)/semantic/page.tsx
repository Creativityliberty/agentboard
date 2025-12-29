"use client";

import React, { useState, useCallback } from 'react';
import { KnowledgeBase } from '@/components/browser/KnowledgeBase';
import { MermaidPreview } from '@/components/mermaid/MermaidPreview';
import { SemanticMapResponse } from '@/types/semantic';
import { Network, ArrowLeft, Loader2, Sparkles, Map, Info, ListChecks } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function SemanticPage() {
    const [urls, setUrls] = useState<string[]>([]);
    const [result, setResult] = useState<SemanticMapResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [focus, setFocus] = useState('');

    const handleGenerateMap = async () => {
        if (urls.length === 0) {
            alert("Ajoutez au moins une URL.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/semantic/map', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ urls, focus }),
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            setResult(data);
        } catch (error: any) {
            alert("Erreur : " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-emerald-500/30">

            <main className="container mx-auto px-6 py-12 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Left Column: Input */}
                    <div className="lg:col-span-1 space-y-8">
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Map className="w-4 h-4 text-emerald-400" />
                                <h2 className="text-xs uppercase tracking-widest font-black text-zinc-500">Source Selection</h2>
                            </div>
                            <KnowledgeBase
                                urls={urls}
                                onAddUrl={(url) => setUrls(prev => [...prev, url])}
                                onRemoveUrl={(url) => setUrls(prev => prev.filter(u => u !== url))}
                            />
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-emerald-400" />
                                <h2 className="text-xs uppercase tracking-widest font-black text-zinc-500">Analysis Focus</h2>
                            </div>
                            <textarea
                                value={focus}
                                onChange={(e) => setFocus(e.target.value)}
                                placeholder="Ex: 'Comment ces libs gèrent le state management?' (Optionnel)"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-emerald-500/50 min-h-[100px] resize-none transition-all placeholder:text-zinc-600"
                            />
                        </section>

                        <button
                            onClick={handleGenerateMap}
                            disabled={isLoading || urls.length === 0}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-emerald-900/40 flex items-center justify-center gap-3"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Network className="w-5 h-5" />}
                            Générer la Carte
                        </button>
                    </div>

                    {/* Right Column: Visualization */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="h-[600px] bg-zinc-900/50 rounded-[2.5rem] border border-white/5 overflow-hidden relative shadow-3xl">
                            <AnimatePresence mode="wait">
                                {result ? (
                                    <motion.div
                                        key="map"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="h-full w-full"
                                    >
                                        <MermaidPreview
                                            code={result.mermaidCode}
                                            onError={() => { }}
                                            onSuccess={() => { }}
                                        />
                                    </motion.div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-30">
                                        <Network size={64} className="mb-4" />
                                        <p className="text-sm font-medium">Ajoutez des sources et lancez l'analyse pour visualiser votre Knowledge Graph.</p>
                                    </div>
                                )}
                            </AnimatePresence>

                            {isLoading && (
                                <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md flex items-center justify-center z-20">
                                    <div className="flex flex-col items-center gap-6">
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce"></div>
                                        </div>
                                        <p className="text-[10px] uppercase tracking-[0.4em] font-black text-emerald-400">Synthèse sémantique...</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {result && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <div className="p-8 bg-zinc-900/40 rounded-[2rem] border border-white/5 space-y-4">
                                    <div className="flex items-center gap-3 text-emerald-400 mb-2">
                                        <Info className="w-5 h-5" />
                                        <h3 className="text-xs font-black uppercase tracking-widest">Synthèse Globale</h3>
                                    </div>
                                    <p className="text-sm text-zinc-400 leading-relaxed font-sans first-letter:text-3xl first-letter:font-bold first-letter:float-left first-letter:mr-2">
                                        {result.summary}
                                    </p>
                                </div>

                                <div className="p-8 bg-zinc-900/40 rounded-[2rem] border border-white/5 space-y-4">
                                    <div className="flex items-center gap-3 text-emerald-400 mb-2">
                                        <ListChecks className="w-5 h-5" />
                                        <h3 className="text-xs font-black uppercase tracking-widest">Concepts Clés</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {result.concepts.map((concept, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all">
                                                {concept}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
