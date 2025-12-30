"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { MermaidPreview } from '@/components/mermaid/MermaidPreview';
import { FileCode2, Layers, Zap, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExplorerPage() {
    const [repoContent, setRepoContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ mermaidCode: string; summary: string; modules: string[] } | null>(null);

    const handleAnalyze = async () => {
        if (!repoContent.trim()) return;

        setIsLoading(true);
        setResult(null);

        try {
            const response = await fetch('/api/explorer/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ repoContent }),
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            setResult(data);
        } catch (error) {
            alert("Erreur d'analyse : " + (error instanceof Error ? error.message : String(error)));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-indigo-500/30">
            <Navbar />

            <main className="container mx-auto px-6 pt-32 pb-20 max-w-[1600px]">
                <div className="flex flex-col gap-12 h-[calc(100vh-180px)]">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row items-end justify-between gap-6 shrink-0">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                                <FileCode2 size={12} className="text-indigo-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Repo to Architecture Information System</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                                Codebase <span className="text-zinc-600">Cartographer</span>
                            </h1>
                        </div>

                        {/* Summary Stats (Only visible when result exists) */}
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex gap-4"
                            >
                                <div className="px-6 py-3 bg-zinc-900/50 border border-white/5 rounded-2xl backdrop-blur-md">
                                    <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Modules Detected</div>
                                    <div className="text-xl font-bold text-white">{result.modules.length}</div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Main Workspace */}
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">

                        {/* INPUT PANEL (Left) - Collapsible logic could be added later, for now 4 columns */}
                        <div className="lg:col-span-4 flex flex-col gap-4 min-h-0">
                            <div className="flex-1 bg-zinc-900/40 border border-white/5 rounded-[2rem] p-6 flex flex-col gap-4 backdrop-blur-xl relative group">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                                        <Layers size={14} /> Repository Dump
                                    </h3>
                                    <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-zinc-500 font-mono">
                                        {repoContent.length.toLocaleString()} chars
                                    </span>
                                </div>
                                <textarea
                                    value={repoContent}
                                    onChange={(e) => setRepoContent(e.target.value)}
                                    placeholder="Paste your codebase content here (Markdown file dumps, concatenated files, etc.)..."
                                    className="flex-1 bg-zinc-950/50 border border-white/5 rounded-xl p-4 text-xs font-mono leading-relaxed text-zinc-300 focus:outline-none focus:border-indigo-500/50 transition-colors resize-none placeholder:text-zinc-700"
                                    spellCheck={false}
                                />
                                <button
                                    onClick={handleAnalyze}
                                    disabled={isLoading || !repoContent.trim()}
                                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-900/20 flex items-center justify-center gap-3 active:scale-95"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Forge Architecture <Zap size={14} /></>}
                                </button>
                            </div>

                            {/* Summary Box */}
                            <AnimatePresence>
                                {result && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-6 max-h-[300px] overflow-y-auto"
                                    >
                                        <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-4 sticky top-0 bg-transparent">Architectural Summary</h3>
                                        <p className="text-sm text-zinc-400 leading-relaxed font-sans whitespace-pre-wrap">
                                            {result.summary}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* VISUALIZATION PANEL (Right) */}
                        <div className="lg:col-span-8 bg-zinc-950 border border-indigo-500/10 rounded-[2.5rem] relative overflow-hidden shadow-2xl h-full min-h-[500px]">
                            {/* Decorative Background */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.05),transparent_70%)] pointer-events-none" />

                            {result ? (
                                <MermaidPreview
                                    code={result.mermaidCode}
                                    onError={() => { }}
                                    onSuccess={() => { }}
                                />
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-zinc-700 gap-6 p-12 text-center opacity-50">
                                    <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center rotate-3">
                                        <Layers size={48} />
                                    </div>
                                    <div className="max-w-md space-y-2">
                                        <h4 className="text-lg font-bold text-zinc-500">Waiting for Data</h4>
                                        <p className="text-sm">Paste your codebase dump on the left to generate a hyper-detailed architectural map.</p>
                                    </div>
                                </div>
                            )}

                            {isLoading && (
                                <div className="absolute inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-8">
                                        <div className="relative">
                                            <div className="w-24 h-24 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                                            <Zap className="absolute inset-0 m-auto w-8 h-8 text-indigo-500 animate-pulse" />
                                        </div>
                                        <div className="text-center space-y-2">
                                            <h3 className="text-lg font-black uppercase tracking-widest text-indigo-400">Analyzing Structure</h3>
                                            <p className="text-xs text-zinc-500 font-mono">Gemini 1.5 Pro is mapping your system...</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
