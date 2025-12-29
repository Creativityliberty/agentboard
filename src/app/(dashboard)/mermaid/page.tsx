"use client";

import React, { useState, useCallback } from 'react';
import { Header } from '@/components/vortex/Header';
import { MermaidEditor } from '@/components/mermaid/MermaidEditor';
import { MermaidPreview } from '@/components/mermaid/MermaidPreview';
import { MermaidChat } from '@/components/mermaid/MermaidChat';
import { MermaidMessage, DEFAULT_MERMAID_CODE } from '@/types/mermaid';
import { Sparkles, ArrowLeft, Wrench } from 'lucide-react';
import Link from 'next/link';

export default function MermaidPage() {
    const [code, setCode] = useState<string>(DEFAULT_MERMAID_CODE);
    const [messages, setMessages] = useState<MermaidMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSendMessage = useCallback(async (text: string) => {
        const userMsg: MermaidMessage = {
            role: 'user',
            text: text,
            timestamp: Date.now(),
        };

        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/mermaid/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMsg],
                    currentCode: code,
                    prompt: text
                }),
            });

            const data = await response.json();

            const aiMsg: MermaidMessage = {
                role: 'model',
                text: data.text,
                codeBlock: data.codeBlock,
                timestamp: Date.now(),
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, {
                role: 'model',
                text: "Désolé, j'ai rencontré une erreur lors de l'analyse.",
                timestamp: Date.now()
            }]);
        } finally {
            setIsLoading(false);
        }
    }, [messages, code]);

    const handleFixSyntax = () => {
        if (!error) return;
        const prompt = `Corrige cette erreur de syntaxe Mermaid dans mon code : \n${error}\n\nAssure-toi que les labels avec des parenthèses ou caractères spéciaux sont bien entourés de guillemets.`;
        handleSendMessage(prompt);
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-blue-500/30">
            <main className="h-[calc(100vh-96px)] overflow-hidden relative">
                {error && (
                    <div className="absolute top-6 right-[26%] z-50 animate-in fade-in zoom-in duration-300">
                        <button
                            onClick={handleFixSyntax}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-red-900/40"
                        >
                            <Wrench size={14} />
                            Auto-Fix Syntax
                        </button>
                    </div>
                )}
                <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-0">
                    <div className="lg:col-span-3 border-r border-white/5 bg-zinc-950/20 shadow-2xl z-10 h-full overflow-hidden">
                        <MermaidEditor code={code} onChange={setCode} />
                    </div>

                    <div className="lg:col-span-6 bg-zinc-950 flex flex-col justify-center items-center relative overflow-hidden">
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                        <MermaidPreview
                            code={code}
                            onError={setError}
                            onSuccess={() => setError(null)}
                        />
                    </div>

                    <div className="lg:col-span-3 border-l border-white/5 bg-zinc-900 shadow-2xl z-10 overflow-hidden h-full">
                        <MermaidChat
                            messages={messages}
                            onSendMessage={handleSendMessage}
                            isLoading={isLoading}
                            onApplyCode={(newCode) => {
                                setCode(newCode);
                                setError(null);
                            }}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
