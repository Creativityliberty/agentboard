"use client";

import React, { useState } from 'react';
import { BattleForm } from '@/components/arena/BattleForm';
import { ArenaDisplay } from '@/components/arena/ArenaDisplay';
import { BattleResult } from '@/types/arena';
import { Swords, ArrowLeft, Trophy, Ghost, Search, Gavel, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import Link from 'next/link';

export default function ArenaPage() {
    const [mode, setMode] = useState<'classic' | 'triad'>('classic');

    // Classic State
    const [promptA, setPromptA] = useState('Sois extrêmement technique et précis. Utilise des termes jargon.');
    const [promptB, setPromptB] = useState('Explique comme si j\'avais 10 ans. Utilise des emojis et sois cool.');
    const [query, setQuery] = useState('');
    const [result, setResult] = useState<BattleResult | null>(null);

    // Triad State
    const [triadTopic, setTriadTopic] = useState('');
    const [triadResult, setTriadResult] = useState<any>(null);

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
        } catch (error) {
            alert("Erreur dans l'arène : " + (error instanceof Error ? error.message : String(error)));
        } finally {
            setIsLoading(false);
        }
    };

    const handleTriadBattle = async () => {
        if (!triadTopic.trim()) return;
        setIsLoading(true);
        setTriadResult(null);
        try {
            const res = await fetch('/api/arena/triad', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic: triadTopic }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setTriadResult(data);
        } catch (err) {
            alert("Erreur Triad : " + (err instanceof Error ? err.message : String(err)));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-orange-500/30 overflow-x-hidden">

            {/* Navbar for consistent navigation */}
            <div className="fixed top-0 w-full z-50">
                <Navbar />
            </div>

            {/* Background gradients */}
            <div className="fixed top-0 left-0 w-full h-[600px] bg-gradient-to-b from-orange-500/5 via-transparent to-transparent pointer-events-none"></div>
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>


            <main className="relative container mx-auto px-6 pt-32 pb-12 max-w-6xl space-y-12">

                {/* Header & Mode Switcher */}
                <div className="text-center space-y-8">
                    <div className="flex justify-center gap-4 mb-4">
                        <button
                            onClick={() => setMode('classic')}
                            className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${mode === 'classic' ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40' : 'bg-zinc-900 text-zinc-500 hover:text-white'}`}
                        >
                            1v1 Duel
                        </button>
                        <button
                            onClick={() => setMode('triad')}
                            className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${mode === 'triad' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'bg-zinc-900 text-zinc-500 hover:text-white'}`}
                        >
                            Triad Chaos
                        </button>
                    </div>

                    {mode === 'classic' ? (
                        <>
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-white drop-shadow-2xl animate-in zoom-in-95 duration-500">
                                QUE LE MEILLEUR <br /> <span className="text-orange-500">PROMPT</span> GAGNE.
                            </h2>
                            <p className="text-zinc-500 text-sm max-w-lg mx-auto leading-relaxed font-medium">
                                Faites s&apos;affronter deux instructions système. Comparez les résultats, laissez le juge décider.
                            </p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-white drop-shadow-2xl animate-in zoom-in-95 duration-500">
                                TRIAD <br /> <span className="text-indigo-500">DEBATE</span> SIM.
                            </h2>
                            <p className="text-zinc-500 text-sm max-w-lg mx-auto leading-relaxed font-medium">
                                Simulez un débat à 3 voix générées dynamiquement. Orchestré par Gemini 2.0.
                            </p>
                        </>
                    )}
                </div>

                {/* --- FORMS --- */}
                {mode === 'classic' ? (
                    <BattleForm
                        promptA={promptA} setPromptA={setPromptA}
                        promptB={promptB} setPromptB={setPromptB}
                        query={query} setQuery={setQuery}
                        onBattle={handleStartBattle}
                        isLoading={isLoading}
                    />
                ) : (
                    <div className="max-w-2xl mx-auto relative animate-in slide-in-from-bottom-5 duration-500">
                        <div className="relative group">
                            <input
                                type="text"
                                value={triadTopic}
                                onChange={(e) => setTriadTopic(e.target.value)}
                                placeholder="Sujet du débat (ex: 'L'IA va-t-elle remplacer les artistes ?')..."
                                className="w-full bg-zinc-900/80 border border-white/10 rounded-2xl py-6 px-8 pl-14 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-2xl placeholder:text-zinc-600 group-hover:border-indigo-500/30"
                            />
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-hover:text-indigo-400 transition-colors" />

                            <button
                                onClick={handleTriadBattle}
                                disabled={isLoading || !triadTopic}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center gap-2 hover:scale-105 active:scale-95 shadow-lg shadow-indigo-900/20"
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : <>DEBATE <Swords size={16} /></>}
                            </button>
                        </div>
                    </div>
                )}

                {/* --- LOADING --- */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center gap-8 py-20 animate-pulse">
                        <div className="relative">
                            <div className={`w-24 h-24 border-4 rounded-full animate-spin ${mode === 'classic' ? 'border-orange-500/20 border-t-orange-500' : 'border-indigo-500/20 border-t-indigo-500'}`}></div>
                            <Swords className={`absolute inset-0 m-auto w-8 h-8 ${mode === 'classic' ? 'text-orange-500' : 'text-indigo-500'}`} />
                        </div>
                        <p className={`text-xs font-black uppercase tracking-[0.4em] ${mode === 'classic' ? 'text-orange-500' : 'text-indigo-500'}`}>
                            {mode === 'classic' ? 'Génération des réponses & délibération...' : 'Orchestration du débat tripartite...'}
                        </p>
                    </div>
                )}

                {/* --- RESULTS --- */}
                {mode === 'classic' && result && <ArenaDisplay result={result} />}

                {mode === 'triad' && triadResult && (
                    <div className="mt-12 space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000 fill-mode-forwards">
                        {/* 1. DEBATERS HEADER (Hero Cards) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {['A', 'B', 'C'].map((id, idx) => {
                                const debater = triadResult.debaters[id];
                                const gradients = id === 'A' ? 'from-blue-400 to-cyan-300' : id === 'B' ? 'from-rose-400 to-orange-300' : 'from-emerald-400 to-teal-300';
                                const bgGradients = id === 'A' ? 'from-blue-500/20 to-cyan-500/20' : id === 'B' ? 'from-rose-500/20 to-orange-500/20' : 'from-emerald-500/20 to-teal-500/20';
                                const border = id === 'A' ? 'border-blue-500/30' : id === 'B' ? 'border-rose-500/30' : 'border-emerald-500/30';

                                return (
                                    <div key={id} className={`relative p-8 rounded-[3rem] bg-gradient-to-br ${bgGradients} border ${border} flex flex-col items-center text-center overflow-hidden group hover:scale-[1.02] transition-transform duration-500`}>
                                        <div className={`absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity`} />

                                        {/* Avatar Layer */}
                                        <div className={`w-24 h-24 mb-6 rounded-full bg-gradient-to-br ${gradients} p-1 shadow-2xl shadow-black/50`}>
                                            <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center text-5xl">
                                                {debater.avatar}
                                            </div>
                                        </div>

                                        <h3 className="font-black text-white text-2xl mb-2 tracking-tight">{debater.name}</h3>
                                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-black/40 backdrop-blur-md border border-white/10`}>
                                            {debater.stance}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* 2. ROUNDS FLOW (Punchline Timeline) */}
                        <div className="space-y-16 relative">
                            {/* Central Thread */}
                            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent hidden md:block transform -translate-x-1/2" />

                            {triadResult.rounds.map((round: any, i: number) => (
                                <div key={i} className="relative">
                                    {/* Round Marker */}
                                    <div className="sticky top-24 z-20 flex justify-center mb-12">
                                        <div className="px-6 py-2 rounded-full bg-zinc-900/90 backdrop-blur-xl border border-white/20 text-xs font-black uppercase tracking-[0.3em] shadow-xl text-zinc-400">
                                            Round 0{round.roundNumber}
                                        </div>
                                    </div>

                                    <div className="space-y-12">
                                        {round.turns.map((turn: any, j: number) => {
                                            const isLeft = j === 0;
                                            const isRight = j === 2;
                                            const isCenter = j === 1;

                                            const colorClass = turn.speaker === 'A' ? 'text-blue-400 border-blue-500/30 shadow-blue-900/20' : turn.speaker === 'B' ? 'text-rose-400 border-rose-500/30 shadow-rose-900/20' : 'text-emerald-400 border-emerald-500/30 shadow-emerald-900/20';
                                            const scoreColor = turn.speaker === 'A' ? 'bg-blue-500' : turn.speaker === 'B' ? 'bg-rose-500' : 'bg-emerald-500';

                                            return (
                                                <div key={j} className={`flex ${isCenter ? 'justify-center' : isLeft ? 'justify-start md:pr-40' : 'justify-end md:pl-40'} relative`}>
                                                    <div className={`
                                                         relative p-8 rounded-3xl border bg-zinc-950/80 backdrop-blur-sm max-w-2xl w-full
                                                         ${colorClass} border-opacity-50 shadow-2xl hover:scale-[1.01] transition-transform
                                                     `}>
                                                        {/* Speaker Badge */}
                                                        <div className="absolute -top-4 left-8 px-4 py-1 bg-zinc-900 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2">
                                                            <span className={`w-2 h-2 rounded-full ${scoreColor}`} />
                                                            {turn.speaker === 'A' ? triadResult.debaters.A.name : turn.speaker === 'B' ? triadResult.debaters.B.name : triadResult.debaters.C.name}
                                                        </div>

                                                        {/* Punchline Text */}
                                                        <p className="text-lg md:text-xl font-medium leading-relaxed text-zinc-100 mb-6">
                                                            "{turn.text}"
                                                        </p>

                                                        {/* Impact Meter */}
                                                        <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl">
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Impact</span>
                                                            <div className="flex-1 h-2 bg-zinc-900 rounded-full overflow-hidden">
                                                                <div className={`h-full ${scoreColor} shadow-[0_0_10px_currentColor]`} style={{ width: `${turn.score}%` }} />
                                                            </div>
                                                            <span className={`text-sm font-bold font-mono ${colorClass.split(' ')[0]}`}>{turn.score}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Arbiter Verdict Intersection */}
                                    <div className="mt-16 mx-auto max-w-3xl relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent blur-xl" />
                                        <div className="relative p-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent rounded-xl">
                                            <div className="bg-zinc-950/80 backdrop-blur-xl border border-purple-500/30 p-8 rounded-lg text-center">
                                                <div className="inline-flex items-center gap-2 text-purple-400 mb-3">
                                                    <Gavel size={16} />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Arbiter Verdict</span>
                                                </div>
                                                <p className="text-purple-100/90 font-medium italic leading-relaxed text-lg">
                                                    "{round.arbiterComment}"
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 3. FINAL WINNER REVEAL */}
                        <div className="mt-20 p-1 rounded-[4rem] bg-gradient-to-br from-yellow-500 via-orange-500 to-rose-500 shadow-[0_0_100px_rgba(249,115,22,0.2)] scale-[1.02]">
                            <div className="bg-zinc-950 rounded-[3.8rem] p-12 md:p-24 text-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

                                <Trophy className="mx-auto text-yellow-500 mb-8 animate-bounce" size={80} />

                                <h2 className="text-2xl font-black uppercase tracking-[0.5em] text-zinc-500 mb-6 font-mono">Arena Champion</h2>
                                <div className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-rose-400 mb-10 tracking-tighter drop-shadow-2xl">
                                    {triadResult.winner}
                                </div>

                                <div className="max-w-3xl mx-auto bg-zinc-900/40 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/5 shadow-inner">
                                    <p className="text-zinc-200 text-xl leading-relaxed font-light italic">
                                        "{triadResult.summary}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!result && !triadResult && !isLoading && (
                    <div className="py-20 flex flex-col items-center justify-center gap-4 text-zinc-800/50">
                        <Ghost size={48} />
                        <p className="text-xs uppercase tracking-widest font-black">L&apos;arène attend vos champions.</p>
                    </div>
                )}
            </main>

            <footer className="py-12 border-t border-white/5 text-center mt-20 bg-zinc-950/50 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-6">
                    <div className="flex items-center gap-4 text-zinc-600 text-[10px] uppercase tracking-[0.5em] font-black">
                        <span>Battle</span>
                        <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                        <span>Debate</span>
                        <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                        <span>Resolve</span>
                    </div>
                    <p className="text-[10px] text-zinc-700 font-mono tracking-widest">GEMINI ARENA ENGINE v2.1.0 • TRIAD CORE ONLINE</p>
                </div>
            </footer>
        </div>
    );
}

