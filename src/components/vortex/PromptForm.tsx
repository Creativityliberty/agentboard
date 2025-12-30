"use client";

import React, { useState } from 'react';
import type { VortexPromptFormState } from '@/types/vortex';
import { Sparkles, Loader2 } from 'lucide-react';

interface Props {
  onGenerate: (data: VortexPromptFormState) => void;
  isLoading: boolean;
}

export const PromptForm: React.FC<Props> = ({ onGenerate, isLoading }) => {
  const [state, setState] = useState<VortexPromptFormState>({
    agentName: '',
    objective: '',
    context: '',
    persona: '',
    expertise: '',
    capabilities: '',
    outputFormat: '',
    redLines: '',
    riskLevel: 'balanced',
  });

  const [suggesting, setSuggesting] = useState<Record<string, boolean>>({});

  const handleSuggest = async (field: keyof VortexPromptFormState) => {
    setSuggesting(prev => ({ ...prev, [field]: true }));
    try {
      const response = await fetch('/api/vortex/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field, context: state }),
      });
      const data = await response.json();
      if (data.suggestion) {
        setState(prev => ({ ...prev, [field]: data.suggestion }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSuggesting(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(state);
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-indigo-500/50 transition-all pr-12";
  const labelClass = "text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block flex justify-between items-center";

  const SuggestButton = ({ field }: { field: keyof VortexPromptFormState }) => (
    <button
      type="button"
      onClick={() => handleSuggest(field)}
      disabled={suggesting[field]}
      className="p-1.5 hover:bg-indigo-500/20 rounded-lg transition-all text-indigo-400/50 hover:text-indigo-400 disabled:opacity-50"
      title="Suggérer via IA"
    >
      {suggesting[field] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
    </button>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white/[0.02] border border-white/5 p-8 rounded-3xl backdrop-blur-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>
            Agent Name
            <SuggestButton field="agentName" />
          </label>
          <input
            required
            className={inputClass}
            placeholder="e.g. Nexus-7"
            value={state.agentName}
            onChange={e => setState({ ...state, agentName: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Risk Level</label>
          <select
            className={inputClass}
            value={state.riskLevel}
            onChange={e => setState({ ...state, riskLevel: e.target.value as VortexPromptFormState['riskLevel'] })}
          >
            <option value="prudent">Prudent</option>
            <option value="balanced">Balanced</option>
            <option value="aggressive">Aggressive</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>
          Main Objective
          <SuggestButton field="objective" />
        </label>
        <textarea
          required
          rows={2}
          className={inputClass}
          placeholder="What is the agent's primary goal?"
          value={state.objective}
          onChange={e => setState({ ...state, objective: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>
            Context
            <SuggestButton field="context" />
          </label>
          <input
            className={inputClass}
            placeholder="Operational environment"
            value={state.context}
            onChange={e => setState({ ...state, context: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>
            Persona
            <SuggestButton field="persona" />
          </label>
          <input
            className={inputClass}
            placeholder="Style and personality"
            value={state.persona}
            onChange={e => setState({ ...state, persona: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>
            Expertise
            <SuggestButton field="expertise" />
          </label>
          <input
            className={inputClass}
            placeholder="Primary domains of knowledge"
            value={state.expertise}
            onChange={e => setState({ ...state, expertise: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>
            Capabilities
            <SuggestButton field="capabilities" />
          </label>
          <input
            className={inputClass}
            placeholder="Special tools or abilities"
            value={state.capabilities}
            onChange={e => setState({ ...state, capabilities: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>
          Red Lines
          <SuggestButton field="redLines" />
        </label>
        <input
          className={inputClass}
          placeholder="What must the agent NEVER do?"
          value={state.redLines}
          onChange={e => setState({ ...state, redLines: e.target.value })}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-4 rounded-2xl font-semibold text-sm transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
      >
        {isLoading ? "Génération en cours..." : (
          <><Sparkles className="w-4 h-4" /> Générer le Vortex Agent</>
        )}
      </button>
    </form>
  );
};
