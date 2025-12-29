"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Cpu, Mail, Lock, Sparkles, ArrowRight, Github, Globe } from 'lucide-react';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-50"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-10 space-y-4">
                    <div className="inline-flex p-3 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl shadow-xl shadow-indigo-500/20 mb-4">
                        <Cpu size={32} />
                    </div>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter">Welcome to the <span className="text-indigo-500">Foundry</span></h1>
                    <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">Connect to your personal forge</p>
                </div>

                <div className="bg-zinc-900/50 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-3xl shadow-3xl space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                                <input
                                    type="email"
                                    placeholder="name@company.com"
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-indigo-500/50 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Master Key</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-indigo-500/50 transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    <Link href="/dashboard" className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-900/40 flex items-center justify-center gap-3 group">
                        Ouvrir la Foundry <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                        <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest"><span className="bg-zinc-900 px-4 text-zinc-600">Or integrate with</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                            <Github size={14} /> GitHub
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                            <Globe size={14} className="text-blue-500" /> Google
                        </button>
                    </div>
                </div>

                <p className="mt-8 text-center text-xs text-zinc-600 font-medium tracking-widest uppercase">
                    Pas encore de forge ? <Link href="/register" className="text-indigo-400 hover:underline">Rejoignez la guilde</Link>
                </p>
            </motion.div>

            {/* Floating sparkles */}
            <div className="absolute top-1/4 left-10 text-indigo-500/20 animate-pulse"><Sparkles size={48} /></div>
            <div className="absolute bottom-1/4 right-10 text-purple-500/20 animate-pulse [animation-delay:1s]"><Sparkles size={64} /></div>
        </div>
    );
}
