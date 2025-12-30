"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Bot,
  Cpu,
  Zap,
  ShieldCheck,
  Layers,
  Globe,
  Lock
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-indigo-500/30 overflow-x-hidden pt-12">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150 brightness-100 pointer-events-none"></div>
      </div>

      {/* Navigation for Landing */}
      <nav className="fixed top-0 inset-x-0 z-50 px-8 py-6 flex items-center justify-between backdrop-blur-md bg-zinc-950/20 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-black tracking-tighter uppercase italic">Nümtema <span className="text-indigo-400">Foundry</span></span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-xs font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest">Login</Link>
          <Link href="/dashboard" className="px-5 py-2.5 bg-white text-zinc-950 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl">Get Started</Link>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-6 pt-32 pb-20">
        {/* Hero Section */}
        <section className="text-center space-y-8 mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-400"
          >
            <Sparkles size={12} />
            The Future of Agentic Intelligence
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none italic"
          >
            NÜMTEMA <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 italic">FOUNDRY</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-zinc-400 text-lg md:text-xl leading-relaxed font-medium"
          >
            Forgez des agents IA fractals, orchestrez des flottes de collaborateurs autonomes et visualisez la connaissance humaine avec une précision architecturale.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4 pt-8"
          >
            <Link href="/dashboard" className="w-full md:w-auto px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-indigo-900/40 flex items-center justify-center gap-3">
              Commencer à forger <ArrowRight size={16} />
            </Link>
            <Link href="#features" className="w-full md:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all backdrop-blur-xl">
              Explorer les modules
            </Link>
          </motion.div>
        </section>

        {/* Bento Grid Features */}
        <section id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
          {/* Feature 1: Vortex */}
          <motion.div
            whileHover={{ y: -5 }}
            className="md:col-span-2 p-10 bg-zinc-900/40 border border-white/5 rounded-[3rem] backdrop-blur-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <Zap size={160} />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl w-fit">
                <Zap className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter">Vortex Engine v2</h3>
              <p className="text-zinc-500 max-w-md">Architecture fractale pour des prompts impossibles à briser. Sécurité multi-couches (Self_HL) et raisonnement déterministe.</p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-black uppercase tracking-widest text-zinc-400 border border-white/5">Anti-Hallucination</span>
                <span className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-black uppercase tracking-widest text-zinc-400 border border-white/5">Auto-Correction</span>
              </div>
            </div>
          </motion.div>

          {/* Feature 2: Crew */}
          <motion.div
            whileHover={{ y: -5 }}
            className="p-10 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-purple-500/20 rounded-[3rem] backdrop-blur-2xl relative overflow-hidden group"
          >
            <div className="relative z-10 space-y-6 flex flex-col h-full">
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl w-fit">
                <Layers className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter">Crew Architect</h3>
              <p className="text-zinc-500 text-sm">Orchestrez des équipes d&apos;IA. L&apos;un cherche, l&apos;autre écrit, le troisième vérifie. Collaboration massive sans friction.</p>
              <div className="mt-auto">
                <Link href="/crew" className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400 flex items-center gap-2">
                  Learn Flow <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Feature 3: Small Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="p-10 bg-zinc-900/40 border border-white/5 rounded-[3rem] backdrop-blur-2xl"
          >
            <div className="space-y-6">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl w-fit">
                <Globe className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">Vision Engine</h3>
              <p className="text-zinc-500 text-xs leading-relaxed">Passez de l&apos;image au code et de la doc au graphe de connaissance en une seconde.</p>
            </div>
          </motion.div>

          {/* Feature 4: Arena */}
          <motion.div
            whileHover={{ y: -5 }}
            className="md:col-span-2 p-10 bg-zinc-900/40 border border-white/5 rounded-[3rem] backdrop-blur-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <Bot size={160} />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-2xl w-fit">
                <Bot className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter">Prompt Battle Arena</h3>
              <p className="text-zinc-500 max-w-md">Laissez les IA s&apos;affronter. Notre Supreme Auditor Vortex juge la meilleure architecture et fusionne les gagnants.</p>
            </div>
          </motion.div>
        </section>

        {/* Identity Section */}
        <section className="text-center bg-zinc-900/20 p-20 rounded-[4rem] border border-white/5 backdrop-blur-3xl mb-32">
          <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">The Nümtema <span className="text-indigo-500">Credo</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="text-3xl font-black text-indigo-500">01</div>
                <h4 className="text-sm font-black uppercase tracking-widest">Coherence</h4>
                <p className="text-zinc-500 text-xs">Stabilité absolue des personas et des objectifs HL.</p>
              </div>
              <div className="space-y-4">
                <div className="text-3xl font-black text-purple-500">02</div>
                <h4 className="text-sm font-black uppercase tracking-widest">Scalability</h4>
                <p className="text-zinc-500 text-xs">Du simple script à l&apos;orchestration de flottes entières.</p>
              </div>
              <div className="space-y-4">
                <div className="text-3xl font-black text-pink-500">03</div>
                <h4 className="text-sm font-black uppercase tracking-widest">Transparency</h4>
                <p className="text-zinc-500 text-xs">Traçabilité totale des étapes de raisonnement (RRLA).</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Tiers (SaaS Mockup) */}
        <section className="mb-32">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">CHOOSE YOUR <span className="text-indigo-500">CORE</span></h2>
            <p className="text-zinc-500 text-sm">Forgez selon vos besoins.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Tier 1 */}
            <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-[2.5rem] flex flex-col gap-8 transition-all hover:border-white/20">
              <div>
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">APPRENTI</h4>
                <div className="text-4xl font-black italic">0€ <span className="text-xs text-zinc-600">/mo</span></div>
              </div>
              <ul className="space-y-4 text-xs font-medium text-zinc-400">
                <li className="flex items-center gap-2"><ShieldCheck size={14} className="text-indigo-500" /> Vortex Generator Lite</li>
                <li className="flex items-center gap-2"><ShieldCheck size={14} className="text-indigo-500" /> Chat Gemini Basic</li>
                <li className="flex items-center gap-2"><ShieldCheck size={14} className="text-indigo-500" /> 10 Architect Analyses</li>
              </ul>
              <Link href="/dashboard" className="mt-auto py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center transition-all border border-white/5">Start Free</Link>
            </div>

            {/* Tier 2: Popular */}
            <div className="p-8 bg-zinc-950 border-2 border-indigo-600 rounded-[2.5rem] flex flex-col gap-8 relative overflow-hidden shadow-2xl shadow-indigo-900/20 scale-105">
              <div className="absolute top-4 right-4 px-3 py-1 bg-indigo-600 text-[8px] font-black uppercase tracking-widest rounded-full">MOST POPULAR</div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400 mb-2">ARCHITECTE</h4>
                <div className="text-4xl font-black italic">29€ <span className="text-xs text-zinc-600">/mo</span></div>
              </div>
              <ul className="space-y-4 text-xs font-medium text-zinc-300">
                <li className="flex items-center gap-2"><ShieldCheck size={14} className="text-indigo-500" /> Full Vortex Architecture</li>
                <li className="flex items-center gap-2"><ShieldCheck size={14} className="text-indigo-500" /> Crew Orchestrator Pro</li>
                <li className="flex items-center gap-2"><ShieldCheck size={14} className="text-indigo-500" /> Prompt Battle Lab</li>
                <li className="flex items-center gap-2"><ShieldCheck size={14} className="text-indigo-500" /> Unlimited Vision Analysis</li>
              </ul>
              <Link href="/dashboard" className="mt-auto py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center transition-all shadow-xl">Forge Now</Link>
            </div>

            {/* Tier 3 */}
            <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-[2.5rem] flex flex-col gap-8 transition-all hover:border-white/20">
              <div>
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">MAÎTRE</h4>
                <div className="text-4xl font-black italic">Custom</div>
              </div>
              <ul className="space-y-4 text-xs font-medium text-zinc-400">
                <li className="flex items-center gap-2"><ShieldCheck size={14} className="text-purple-500" /> White-label API Access</li>
                <li className="flex items-center gap-2"><ShieldCheck size={14} className="text-purple-500" /> Custom Training Foundry</li>
                <li className="flex items-center gap-2"><ShieldCheck size={14} className="text-purple-500" /> Priority Support 24/7</li>
              </ul>
              <Link href="mailto:chef@numtema.com" className="mt-auto py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center transition-all border border-white/5">Contact Us</Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-20 bg-indigo-600 rounded-[3rem] shadow-3xl shadow-indigo-900/40 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-50"></div>
          <div className="relative z-10 space-y-8 px-6">
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">PRÊT À FORGER L&apos;AVENIR ?</h2>
            <p className="text-indigo-100 text-sm md:text-base font-medium max-w-xl mx-auto opacity-80">
              Rejoignez les pionniers de l&apos;intelligence agentique et commencez à bâtir votre Foundry personnelle dès aujourd&apos;hui.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <Link href="/dashboard" className="w-full md:w-auto px-10 py-5 bg-white text-zinc-950 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3">
                Ouvrir la Foundry <Zap size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-white/5 bg-zinc-950 relative z-10">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <Cpu size={16} />
              </div>
              <span className="text-sm font-black tracking-tighter uppercase italic">Nümtema Foundry</span>
            </div>
            <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-widest leading-relaxed">
              La plateforme d&apos;intelligence architecturale <br /> propulsée par l&apos;architecture Vortex.
            </p>
          </div>
          <div>
            <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6">Foundry Modules</h5>
            <ul className="space-y-4 text-xs font-bold text-zinc-400">
              <li><Link href="/vortex" className="hover:text-indigo-400">Vortex Engine</Link></li>
              <li><Link href="/crew" className="hover:text-purple-400">Crew Architect</Link></li>
              <li><Link href="/arena" className="hover:text-orange-400">Prompt Arena</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6">Company</h5>
            <ul className="space-y-4 text-xs font-bold text-zinc-400">
              <li><Link href="#" className="hover:text-white">Our Vision</Link></li>
              <li><Link href="#" className="hover:text-white">Privacy Forge</Link></li>
              <li><Link href="#" className="hover:text-white">Terms of Work</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6">Security</h5>
            <div className="flex items-center gap-2 p-4 bg-zinc-900 border border-white/5 rounded-2xl">
              <Lock size={16} className="text-indigo-500" />
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">End-to-End Encrypted</span>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-20 pt-8 border-t border-white/5 text-center">
          <p className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.5em]">© 2025 Nümtema AI Foundry. Forge the future.</p>
        </div>
      </footer>
    </div>
  );
}
