"use client";

import React, { useState } from 'react';
import { Plus, Trash2, Globe, Link as LinkIcon } from 'lucide-react';

interface Props {
  urls: string[];
  onAddUrl: (url: string) => void;
  onRemoveUrl: (url: string) => void;
}

export const KnowledgeBase: React.FC<Props> = ({ urls, onAddUrl, onRemoveUrl }) => {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (input.trim() && !urls.includes(input.trim())) {
      onAddUrl(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900/50 border border-white/5 rounded-3xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
          <Globe className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Knowledge Base</h2>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">Gestion des URLs</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-emerald-500/50 transition-all"
          placeholder="https://docs.example.com..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleAdd()}
        />
        <button
          onClick={handleAdd}
          className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {urls.length === 0 ? (
          <div className="text-center py-12 text-zinc-600">
            <LinkIcon className="w-8 h-8 mx-auto mb-3 opacity-20" />
            <p className="text-sm">Aucune URL ajoutée</p>
          </div>
        ) : (
          urls.map(url => (
            <div key={url} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group">
              <span className="text-xs text-zinc-400 truncate flex-1 mr-2">{url}</span>
              <button
                onClick={() => onRemoveUrl(url)}
                className="p-1 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
