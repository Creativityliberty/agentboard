"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { MermaidPreview } from '@/components/mermaid/MermaidPreview';
import { Code2, Database, GitBranch, Cpu, Terminal, FileJson, Layers, Workflow, CheckCircle, Zap, Loader2, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- STATIC CONTENT (Documentation) ---
const FLOW_CHART = `flowchart TD
    userRequest[User Request] --> mainAgent[Main Decision Agent]
    
    mainAgent -->|read_file| readFile[Read File Action]
    mainAgent -->|edit_file| editAgent[Main Edit Agent]
    mainAgent -->|delete_file| deleteFile[Delete File Action]
    mainAgent -->|grep_search| grepSearch[Grep Search Action]
    mainAgent -->|list_dir| listDir[List Directory Action with Tree Viz]
    
    readFile --> mainAgent
    editAgent --> mainAgent
    deleteFile --> mainAgent
    grepSearch --> mainAgent
    listDir --> mainAgent
    
    mainAgent -->|done| formatResponse[Format Response]
    formatResponse --> userResponse[Response to User]

    %% Edit File Agent subflow
    subgraph editAgent[Edit File Agent Scope]
        direction TB
        readTarget[Read File Action] --> analyzeAndPlan[Analyze and Plan Changes]
        analyzeAndPlan --> applyChanges[Apply Changes Batch]
    end

    style mainAgent fill:#4f46e5,stroke:#818cf8,stroke-width:2px,color:#fff
    style editAgent fill:#0f172a,stroke:#475569,stroke-width:2px,color:#fff
    style userRequest fill:#059669,stroke:#34d399,color:#fff
    style userResponse fill:#059669,stroke:#34d399,color:#fff
`;

const SHARED_MEMORY_JSON = `{
  "input": {...},          // Payload initial
  "context": {             // Contexte Global
    "goal": "...",
    "user": {...},         // User prefs
    "constraints": {...},
    "language": "fr",
    "session_id": "...",
  },
  "state": {               // Runtime State
    "step": "detect_face",
    "errors": [],
    "metrics": {},
  },
  "artifacts": {           // Résultats Exportables
    // "face_crop": {"type": "image", "path": "...", "meta": {...}}
  },
  "memory": {              // Mémoire Conversationnelle
    "summary": "...",
    "decisions": [],
  },
  "steps": {               // Workspace par Node
    // "DetectFaceNode": {"boxes": [...], "conf": 0.92}
  },
  "debug": {               // Traces
    "trace": [],
  }
}`;

export default function PocketFlowPage() {
    const [activeTab, setActiveTab] = useState<'doc' | 'builder'>('doc');

    // Builder State
    const [description, setDescription] = useState('');
    const [generatedDoc, setGeneratedDoc] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!description.trim()) return;
        setIsGenerating(true);
        setGeneratedDoc('');

        try {
            const response = await fetch('/api/pocketflow/design', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description }),
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            setGeneratedDoc(data.markdown);
        } catch (error) {
            alert("Generation failed: " + (error instanceof Error ? error.message : String(error)));
        } finally {
            setIsGenerating(false);
        }
    };

    const extractMermaid = (md: string) => {
        const match = md.match(/```mermaid([\s\S]*?)```/);
        return match ? match[1].trim() : '';
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-indigo-500/30">
            <Navbar />

            <main className="container mx-auto px-6 pt-32 pb-20 max-w-[1400px]">

                {/* Header & Tabs */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                            <Workflow size={12} className="text-indigo-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">System Design Platform</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
                            PocketFlow <span className="text-zinc-600">Architect</span>
                        </h1>
                    </div>

                    <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-white/5">
                        <button
                            onClick={() => setActiveTab('doc')}
                            className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'doc' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                        >
                            Reference Doc
                        </button>
                        <button
                            onClick={() => setActiveTab('builder')}
                            className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'builder' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                        >
                            Design Builder
                        </button>
                    </div>
                </div>

                {activeTab === 'doc' ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                        {/* --- OLD DOC CONTENT --- */}
                        <div className="max-w-[1200px] mx-auto">
                            <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed mb-12">
                                L&apos;architecture de référence pour l&apos;agent de code autonome.
                                Basée sur un pattern <strong>Shared Memory Contract</strong> et des nœuds atomiques.
                            </p>

                            {/* Section: Architecture Flow */}
                            <section className="mb-32">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                        <GitBranch className="text-indigo-400" size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">Architecture Flow</h2>
                                        <p className="text-zinc-500 text-sm">Orchestration des décisions et sous-agents</p>
                                    </div>
                                </div>

                                <div className="h-[600px] w-full bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.05),transparent_70%)] pointer-events-none" />
                                    <MermaidPreview
                                        code={FLOW_CHART}
                                        onError={() => { }}
                                        onSuccess={() => { }}
                                    />
                                </div>
                            </section>

                            {/* Section: Shared Memory Contract */}
                            <section className="mb-32">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                        <Database className="text-emerald-400" size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">Shared Memory Contract</h2>
                                        <p className="text-zinc-500 text-sm">Structure de données unifiée pour l&apos;échange entre nœuds</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                    <div className="space-y-6">
                                        <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-3xl relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <FileJson className="text-zinc-600" />
                                            </div>
                                            <pre className="font-mono text-xs leading-relaxed text-zinc-300 whitespace-pre-wrap">
                                                {SHARED_MEMORY_JSON}
                                            </pre>
                                        </div>
                                    </div>
                                    <div className="space-y-8">
                                        <h3 className="text-xl font-bold text-white mb-6">Principes Clés</h3>

                                        <div className="space-y-2">
                                            <div className="text-sm font-black uppercase tracking-widest text-emerald-400">Context</div>
                                            <p className="text-zinc-400 text-sm leading-relaxed">
                                                Données stables et globales (Objectifs, User Prefs). Accessible en lecture par tous les nœuds.
                                            </p>
                                        </div>
                                        <div className="w-full h-px bg-white/5" />
                                        <div className="space-y-2">
                                            <div className="text-sm font-black uppercase tracking-widest text-blue-400">Steps Namespace</div>
                                            <p className="text-zinc-400 text-sm leading-relaxed">
                                                Workspace temporaire isolé pour chaque nœud pour éviter les collisions de données.
                                                <code className="block mt-2 bg-zinc-950 px-3 py-2 rounded-lg border border-white/5 text-xs">shared[&quot;steps&quot;][&quot;NodeName&quot;] = output</code>
                                            </p>
                                        </div>
                                        <div className="w-full h-px bg-white/5" />
                                        <div className="space-y-2">
                                            <div className="text-sm font-black uppercase tracking-widest text-purple-400">Artifacts</div>
                                            <p className="text-zinc-400 text-sm leading-relaxed">
                                                Résultats finaux exportables. Stocke des références (paths, IDs) plutôt que des blobs lourds.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-4 mb-12">
                                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                                        <Terminal className="text-orange-400" size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">Tooling System</h2>
                                        <p className="text-zinc-500 text-sm">Capacités natives accessibles par l&apos;agent</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[
                                        { name: 'File Operations', icon: Code2, desc: 'Read, Edit, Delete, Insert, Replace lines', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                                        { name: 'Search Engine', icon: Layers, desc: 'Grep Search (Regex support), File Pattern Filtering', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
                                        { name: 'Directory Ops', icon: FileJson, desc: 'List Dir with Tree Visualization', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
                                        { name: 'Edit Agent', icon: Cpu, desc: 'Specialized Sub-Agent for complex multi-line refactoring', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
                                    ].map((tool, i) => (
                                        <div key={i} className="p-6 bg-zinc-900/30 border border-white/5 rounded-2xl hover:bg-zinc-900/60 transition-all hover:-translate-y-1">
                                            <div className={`w-10 h-10 rounded-xl ${tool.bg} ${tool.border} border flex items-center justify-center mb-4`}>
                                                <tool.icon className={tool.color} size={20} />
                                            </div>
                                            <h4 className="font-bold text-white mb-2">{tool.name}</h4>
                                            <p className="text-xs text-zinc-500 leading-relaxed">{tool.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                        {/* --- BUILDER CONTENT --- */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-250px)]">

                            {/* LEFT: Input & Editor */}
                            <div className="flex flex-col gap-6 h-full">
                                <div className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-6 backdrop-blur-xl relative group shrink-0">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                                        <Zap size={14} /> Agent Description
                                    </h3>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Describe the agent you want to build (e.g. 'A PR Reviewer agent that checks strict null checks')..."
                                        className="w-full h-24 bg-zinc-950/50 border border-white/5 rounded-xl p-4 text-sm font-sans leading-relaxed text-zinc-300 focus:outline-none focus:border-indigo-500/50 transition-colors resize-none placeholder:text-zinc-700 mb-4"
                                    />
                                    <button
                                        onClick={handleGenerate}
                                        disabled={isGenerating || !description.trim()}
                                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-900/20 flex items-center justify-center gap-3 active:scale-95"
                                    >
                                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate Design Doc"}
                                    </button>
                                </div>

                                <div className="flex-1 bg-zinc-900/40 border border-white/5 rounded-[2rem] p-6 backdrop-blur-xl relative flex flex-col min-h-0">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                                            <FileJson size={14} /> Markdown Output
                                        </h3>
                                        {generatedDoc && (
                                            <button
                                                onClick={() => navigator.clipboard.writeText(generatedDoc)}
                                                className="text-[10px] bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
                                            >
                                                <Copy size={12} /> Copy
                                            </button>
                                        )}
                                    </div>
                                    <textarea
                                        value={generatedDoc}
                                        readOnly
                                        className="flex-1 bg-zinc-950/50 border border-white/5 rounded-xl p-4 text-xs font-mono leading-relaxed text-zinc-300 focus:outline-none focus:border-indigo-500/50 transition-colors resize-none mb-0 w-full h-full"
                                    />
                                </div>
                            </div>

                            {/* RIGHT: Visual Preview */}
                            <div className="bg-zinc-950 border border-indigo-500/10 rounded-[2.5rem] relative overflow-hidden shadow-2xl h-full min-h-[500px] flex flex-col">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.05),transparent_70%)] pointer-events-none" />

                                <div className="absolute top-6 left-6 z-20 flex gap-2">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-md">
                                        <Layers size={12} className="text-indigo-400" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Live Preview</span>
                                    </div>
                                </div>

                                {generatedDoc ? (
                                    <div className="h-full w-full">
                                        <MermaidPreview
                                            code={extractMermaid(generatedDoc) || 'graph TD; A[No specific flowchart found]'}
                                            onError={() => { }}
                                            onSuccess={() => { }}
                                        />
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-zinc-700 gap-6 p-12 text-center opacity-50">
                                        <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center -rotate-3">
                                            <GitBranch size={40} />
                                        </div>
                                        <p className="text-sm font-medium">Generate a design to see the Flowchart visualization.</p>
                                    </div>
                                )}
                            </div>

                        </div>
                    </motion.div>
                )}

            </main>
        </div>
    );
}
