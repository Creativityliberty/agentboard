"use client";

import React, { useState, useCallback } from 'react';
import { PromptForm } from '@/components/vortex/PromptForm';
import { GeneratedPromptDisplay } from '@/components/vortex/GeneratedPromptDisplay';
import { Loader } from '@/components/vortex/Loader';
import type { VortexPromptFormState, GeneratedPrompt } from '@/types/vortex';
import { AlertCircle, Sparkles } from 'lucide-react';

export default function VortexPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<GeneratedPrompt | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePrompt = useCallback(async (formData: VortexPromptFormState) => {
    setIsLoading(true);
    setError(null);
    setGeneratedPrompt(null);
    try {
      const response = await fetch('/api/vortex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération du prompt.');
      }

      const result = await response.json();
      setGeneratedPrompt(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30">
      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="lg:sticky lg:top-28">
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-4">Vortex Configuration</h2>
              <p className="text-zinc-500 leading-relaxed max-w-md">
                Configurez les paramètres HL (High-Level) et LL (Low-Level) de votre agent pour générer une architecture Vortex complète et sécurisée.
              </p>
            </div>
            <PromptForm onGenerate={handleGeneratePrompt} isLoading={isLoading} />
          </div>

          <div className="min-h-[600px] flex flex-col">
            {isLoading && (
              <div className="flex-1 flex flex-col items-center justify-center bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-sm">
                <Loader />
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-3xl flex items-start gap-4">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="font-bold text-sm uppercase tracking-wider">Erreur de Traitement</h3>
                  <p className="text-sm opacity-80">{error}</p>
                </div>
              </div>
            )}

            {generatedPrompt ? (
              <GeneratedPromptDisplay prompt={generatedPrompt} />
            ) : !isLoading && !error && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white/[0.01] border border-dashed border-white/10 rounded-3xl">
                <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 text-zinc-600" />
                </div>
                <h3 className="text-zinc-400 font-medium">En attente de configuration</h3>
                <p className="text-zinc-600 text-sm mt-2">Remplissez le formulaire pour générer votre premier Vortex Agent.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className="container mx-auto px-6 py-8 border-t border-white/5 text-center">
        <p className="text-xs text-zinc-600 font-medium tracking-widest uppercase">
          Build with Vortex Intelligence Architecture • 🌪️ v2.0
        </p>
      </footer>
    </div>
  );
}

