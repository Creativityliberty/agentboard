"use client";

import React, { useState } from 'react';
import { BattleForm } from '@/components/arena/BattleForm';
import { ArenaDisplay } from '@/components/arena/ArenaDisplay';
import { BattleResult } from '@/types/arena';
import { Swords, ArrowLeft, Trophy, Ghost } from 'lucide-react';
import Link from 'next/link';

export default function ArenaPage() {
    const [promptA, setPromptA] = useState('Sois extrêmement technique et précis. Utilise des termes jargon.');
    const [promptB, setPromptB] = useState('Explique comme si j\'avais 10 ans. Utilise des emojis et sois cool.');
    const [query, setQuery] = useState('');
    const [result, setResult] = useState<BattleResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleStartBattle = async () => {
        if (!query.trim()) return;

        setIsLoading(true);
        setResult(null);
        try {
            const response = await fetch('/api/arena/battle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ promptA, promptB, query }),
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            setResult(data);
        } catch (error: any) {
            alert("Erreur dans l'arène : " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-orange-500/30 overflow-x-hidden">
            {/* Background gradients */}
            <div className="fixed top-0 left-0 w-full h-[600px] bg-gradient-to-b from-orange-500/5 via-transparent to-transparent pointer-events-none"></div>
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>


            <main className="relative container mx-auto px-6 py-12 max-w-6xl space-y-20">
                <div className="text-center space-y-4">
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-white drop-shadow-2xl">
                        QUE LE MEILLEUR <br /> <span className="text-orange-500">PROMPT</span> GAGNE.
                    </h2>
                    <p className="text-zinc-500 text-sm max-w-lg mx-auto leading-relaxed font-medium">
                        Faites s'affronter deux instructions système. Comparez les résultats, laissez le juge décider, et obtenez le prompt ultime.
                    </p>
                </div>

                <BattleForm
                    promptA={promptA} setPromptA={setPromptA}
                    promptB={promptB} setPromptB={setPromptB}
                    query={query} setQuery={setQuery}
                    onBattle={handleStartBattle}
                    isLoading={isLoading}
                />

                {isLoading && (
                    <div className="flex flex-col items-center justify-center gap-8 py-20 animate-pulse">
                        <div className="relative">
                            <div className="w-24 h-24 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
                            <Swords className="absolute inset-0 m-auto w-8 h-8 text-orange-500" />
                        </div>
                        <p className="text-xs font-black uppercase tracking-[0.4em] text-orange-500">Génération des réponses & délibération du juge...</p>
                    </div>
                )}

                {result && <ArenaDisplay result={result} />}

                {!result && !isLoading && (
                    <div className="py-20 flex flex-col items-center justify-center gap-4 text-zinc-800">
                        <Ghost size={48} />
                        <p className="text-xs uppercase tracking-widest font-black">L'arène est vide. Lancez un combat.</p>
                    </div>
                )}
            </main>

            <footer className="py-20 border-t border-white/5 text-center mt-20 bg-zinc-950/50">
                <div className="flex flex-col items-center gap-6">
                    <div className="flex items-center gap-4 text-zinc-600 text-[10px] uppercase tracking-[0.5em] font-black">
                        <span>Engineering</span>
                        <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                        <span>Competition</span>
                        <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                        <span>Synthesis</span>
                    </div>
                    <p className="text-[10px] text-zinc-700 font-mono tracking-widest">GEMINI PROMPT BATTLE ENGINE v1.0.4</p>
                </div>
            </footer>
        </div>
    );
}
