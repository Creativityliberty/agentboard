"use client";

import React, { useState, useCallback } from 'react';
import { Header } from '@/components/vortex/Header';
import { KnowledgeBase } from '@/components/browser/KnowledgeBase';
import { BrowserChat } from '@/components/browser/BrowserChat';
import { ChatMessage, MessageSender } from '@/types/browser';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function BrowserPage() {
  const [urls, setUrls] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = useCallback(async (query: string) => {
    if (urls.length === 0) {
      alert("Veuillez ajouter au moins une URL dans la Knowledge Base.");
      return;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text: query,
      sender: MessageSender.USER,
      timestamp: new Date(),
    };

    const botLoaderMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: '',
      sender: MessageSender.MODEL,
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages(prev => [...prev, userMsg, botLoaderMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/browser/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, urls }),
      });

      const data = await response.json();
      
      setMessages(prev => prev.map(msg => 
        msg.id === botLoaderMsg.id 
        ? { ...msg, text: data.text || "Erreur de réponse", isLoading: false }
        : msg
      ));
    } catch (error) {
      console.error(error);
      setMessages(prev => prev.map(msg => 
        msg.id === botLoaderMsg.id 
        ? { ...msg, text: "Une erreur est survenue lors de la communication avec l'IA.", isLoading: false }
        : msg
      ));
    } finally {
      setIsLoading(false);
    }
  }, [urls]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30">
        <header className="border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-400 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold tracking-tight text-white">Knowledge Browser</h1>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">Chat with Documentation</p>
                </div>
              </div>
            </div>
          </div>
        </header>

      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[700px]">
          <div className="lg:col-span-1">
            <KnowledgeBase 
              urls={urls} 
              onAddUrl={url => setUrls(prev => [...prev, url])}
              onRemoveUrl={url => setUrls(prev => prev.filter(u => u !== url))}
            />
          </div>
          <div className="lg:col-span-3">
            <BrowserChat 
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
