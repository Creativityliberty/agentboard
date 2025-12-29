"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Bot, Terminal, Globe, Eye, User, Loader2, Trash2, Network, Swords } from 'lucide-react';
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: data.text || "Désolé, j'ai rencontré une erreur.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => setMessages([]);

  return (
    <div className="flex h-screen flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30">

      {/* Chat Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-8 space-y-6 scroll-smooth"
      >
        {messages.length === 0 && !isLoading && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 max-w-sm mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-3xl blur-2xl opacity-20 absolute" />
            <div className="relative">
              <Bot className="w-12 h-12 text-indigo-400" />
            </div>
            <h2 className="text-xl font-medium tracking-tight">Comment puis-je t'aider aujourd'hui ?</h2>
            <p className="text-sm text-zinc-500 leading-relaxed"> Pose-moi n'importe quelle question sur le développement, la tech ou tout ce qui te passe par la tête.</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex w-full gap-4 max-w-3xl mx-auto",
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                msg.role === "user"
                  ? "bg-zinc-800 border-zinc-700 text-zinc-300"
                  : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
              )}>
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={cn(
                "px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[85%] border",
                msg.role === "user"
                  ? "bg-indigo-600 border-indigo-500 text-white selection:bg-indigo-400 shadow-lg shadow-indigo-500/10"
                  : "bg-white/5 border-white/10 text-zinc-200 selection:bg-zinc-700"
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4 max-w-3xl mx-auto"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" />
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/5 bg-zinc-950/80 backdrop-blur-xl">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto flex items-center gap-2 relative bg-white/5 p-1.5 rounded-2xl border border-white/10 focus-within:border-indigo-500/50 transition-all shadow-2xl shadow-indigo-500/5"
        >
          <button
            type="button"
            onClick={clearChat}
            className="p-2.5 hover:bg-white/5 rounded-xl transition-colors text-zinc-600 hover:text-red-400 shrink-0"
            title="Nettoyer la conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Écris ton message ici..."
            className="flex-1 bg-transparent px-1 py-2 text-sm outline-none placeholder:text-zinc-600"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 p-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white/50" />
            ) : (
              <Send className="w-4 h-4 text-white" />
            )}
          </button>
        </form>
        <p className="text-[10px] text-zinc-600 text-center mt-3 font-medium">
          Appuyez sur Entrée pour envoyer • Propulsé par Google Gemini 1.5 Flash
        </p>
      </div>
    </div>
  );
}
