"use client";

import React, { useState } from 'react';
import { ImageUpload } from '@/components/blueprint/ImageUpload';
import { AnalysisResult } from '@/components/blueprint/AnalysisResult';
import { BlueprintAnalysis } from '@/types/blueprint';
import { Sparkles, ArrowLeft, Zap, Eye } from 'lucide-react';
import Link from 'next/link';

export default function BlueprintPage() {
    const [analysis, setAnalysis] = useState<BlueprintAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleImageAnalysis = async (base64: string) => {
        if (!base64) {
            setAnalysis(null);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/blueprint/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64 }),
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            setAnalysis({
                ...data,
                timestamp: Date.now()
            });
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'analyse : " + (error as any).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-indigo-500/30">
            <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none"></div>


            <main className="relative container mx-auto px-6 py-12 max-w-5xl">
                <div className="mb-16 text-center space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none bg-gradient-to-r from-white via-white to-zinc-500 bg-clip-text text-transparent">
                        Transformez vos visuels <br /> en architectures techniques.
                    </h2>
                    <p className="text-zinc-400 text-sm max-w-lg mx-auto leading-relaxed">
                        Téléchargez une capture d'écran, un croquis ou un design pour générer instantanément des diagrammes Mermaid et des squelettes de composants UI.
                    </p>
                </div>

                <div className="grid gap-12">
                    <ImageUpload onImageSelected={handleImageAnalysis} isLoading={isLoading} />

                    {analysis && (
                        <AnalysisResult
                            mermaidCode={analysis.mermaidCode}
                            uiCode={analysis.uiCode}
                            explanation={analysis.explanation}
                        />
                    )}
                </div>
            </main>

            <footer className="py-20 mt-20 border-t border-white/5 text-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="flex items-center gap-4 text-zinc-600 text-[10px] uppercase tracking-[0.4em] font-black">
                        <span>Vision</span>
                        <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                        <span>Architecture</span>
                        <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                        <span>Code</span>
                    </div>
                    <p className="text-[10px] text-zinc-700 font-mono">POWERED BY GEMINI 1.5 PRO & TURBO VISION ENGINE</p>
                </div>
            </footer>
        </div>
    );
}
