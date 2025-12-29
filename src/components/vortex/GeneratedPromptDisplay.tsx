"use client";

import React, { useState } from 'react';
import type { GeneratedPrompt } from '@/types/vortex';
import { Copy, Check, Terminal, FileCode, ScrollText } from 'lucide-react';

interface Props {
  prompt: GeneratedPrompt;
}

export const GeneratedPromptDisplay: React.FC<Props> = ({ prompt }) => {
  const [activeTab, setActiveTab] = useState<'markdown' | 'ascii' | 'json'>('markdown');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const text = prompt[activeTab];
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all rounded-lg ${
        activeTab === id 
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
        : "text-zinc-500 hover:text-white hover:bg-white/5"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-zinc-950/20">
        <div className="flex gap-2">
          <TabButton id="markdown" label="Markdown" icon={FileCode} />
          <TabButton id="ascii" label="ASCII" icon={Terminal} />
          <TabButton id="json" label="JSON" icon={ScrollText} />
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-white/5 hover:bg-white/10 text-zinc-300 rounded-xl transition-all border border-white/5"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Coopié !" : "Copier"}
        </button>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto">
        <pre className="text-sm font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed selection:bg-indigo-500/30">
          {prompt[activeTab]}
        </pre>
      </div>
    </div>
  );
};
