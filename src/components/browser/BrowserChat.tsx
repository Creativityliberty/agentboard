"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MessageSender } from '@/types/browser';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export const BrowserChat: React.FC<Props> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.filter(m => m.sender !== MessageSender.SYSTEM).length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4 border border-emerald-500/20">
              <Bot className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-white font-semibold">Discutez avec vos docs</h3>
            <p className="text-zinc-500 text-sm mt-2 max-w-xs">Posez des questions sur les URLs ajoutées dans votre base de connaissances.</p>
          </div>
        ) : (
          messages.filter(m => m.sender !== MessageSender.SYSTEM).map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-3 ${msg.sender === MessageSender.USER ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                msg.sender === MessageSender.USER ? "bg-emerald-600" : "bg-zinc-800 border border-white/10"
              }`}>
                {msg.sender === MessageSender.USER ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-emerald-400" />}
              </div>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                msg.sender === MessageSender.USER 
                ? "bg-emerald-600 text-white rounded-tr-none" 
                : "bg-white/5 text-zinc-300 border border-white/5 rounded-tl-none"
              }`}>
                {msg.isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : msg.text}
              </div>
            </motion.div>
          ))
        )}
        <div ref={endRef} />
      </div>

      <div className="p-4 bg-zinc-950/20 border-t border-white/5">
        <div className="flex gap-2">
          <textarea
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-emerald-500/50 transition-all resize-none h-10 min-h-[40px] max-h-32"
            placeholder="Posez votre question..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl transition-all h-10"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
