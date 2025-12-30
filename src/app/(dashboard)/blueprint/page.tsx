"use client";

import React, { useState } from 'react';
import { ImageUpload } from '@/components/blueprint/ImageUpload';
import { AnalysisResult } from '@/components/blueprint/AnalysisResult';
import { BlueprintAnalysis } from '@/types/blueprint';
import { Sparkles, ArrowLeft, Zap, Eye, Box, Hammer, Search, Copy, Check, FileCode, FolderTree, Terminal, Rocket, Download } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { MermaidDiagram } from '@/components/mermaid/MermaidDiagram';
import Link from 'next/link';

export default function BlueprintPage() {
    const [mode, setMode] = useState<'analyzer' | 'forge'>('analyzer');
    const [isLoading, setIsLoading] = useState(false);

    // Analyzer State
    const [analysis, setAnalysis] = useState<BlueprintAnalysis | null>(null);

    // Forge State
    const [forgeDescription, setForgeDescription] = useState('');
    const [forgeResult, setForgeResult] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'design' | 'structure' | 'code'>('design');
    const [copiedFile, setCopiedFile] = useState<string | null>(null);

    const handleImageAnalysis = async (base64: string) => {
        if (!base64) {
            setAnalysis(null);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/blueprint/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64 }),
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            setAnalysis({
                ...data,
                timestamp: Date.now()
            });
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'analyse : " + (error instanceof Error ? error.message : String(error)));
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgeGeneration = async () => {
        if (!forgeDescription.trim()) return;
        setIsLoading(true);
        setForgeResult(null);
        setActiveTab('design');
        try {
            const response = await fetch('/api/blueprint/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description: forgeDescription }),
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            setForgeResult(data);
        } catch (error) {
            alert("Forge Error: " + (error instanceof Error ? error.message : String(error)));
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to render designDoc with Mermaid blocks
    const renderDesignDoc = (doc: string) => {
        if (!doc) return null;
        const parts = doc.split(/(```mermaid[\s\S]*?```)/g);
        return parts.map((part, i) => {
            if (part?.startsWith('```mermaid')) { // It's mermaid
                const chart = part.replace('```mermaid', '').replace('```', '').trim();
                return (
                    <div key={i} className="my-10 p-8 bg-zinc-900/50 rounded-3xl border border-indigo-500/20 shadow-2xl overflow-hidden">
                        <div className="flex items-center gap-2 mb-6 text-indigo-400">
                            <Zap size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Architectural Flow</span>
                        </div>
                        <MermaidDiagram chart={chart} />
                    </div>
                );
            }
            if (!part?.trim()) return null;
            // It's text/markdown (simple rendering)
            return (
                <div key={i} className="whitespace-pre-wrap text-zinc-300 leading-relaxed font-light py-4 text-lg">
                    {part.trim().split('\n').map((line, idx) => {
                        if (line.startsWith('# ')) return <h1 key={idx} className="text-4xl font-black text-white mt-12 mb-6 tracking-tight">{line.slice(2)}</h1>;
                        if (line.startsWith('## ')) return <h2 key={idx} className="text-2xl font-black text-indigo-400 mt-10 mb-5 tracking-tight border-b border-white/5 pb-2">{line.slice(3)}</h2>;
                        if (line.startsWith('- ')) return <div key={idx} className="flex gap-3 mb-2 ml-4"><span className="text-indigo-500">•</span><span>{line.slice(2)}</span></div>;
                        return <p key={idx} className="mb-4">{line}</p>;
                    })}
                </div>
            );
        });
    };

    // Full Export Logic
    const handleFullExport = () => {
        if (!forgeResult) return;

        let md = `# Project Blueprint: ${forgeResult.projectName}\n\n`;
        md += `> ${forgeResult.description}\n\n`;
        md += `## 🛠️ Stack\n${forgeResult.stack.map((s: string) => `- ${s}`).join('\n')}\n\n`;
        md += `## 📂 Project Structure\n\`\`\`\n${forgeResult.tree}\n\`\`\`\n\n`;
        md += `## 🎨 Design Documentation\n\n${forgeResult.designDoc}\n\n`;
        md += `## 💻 Source Code\n\n`;

        forgeResult.files.forEach((file: any) => {
            md += `### 📄 ${file.path}\n\`\`\`${file.path.split('.').pop()}\n${file.content}\n\`\`\`\n\n`;
        });

        const blob = new Blob([md], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${forgeResult.projectName.toLowerCase().replace(/\s+/g, '-')}-blueprint.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const copyToClipboard = (text: string, path: string) => {
        navigator.clipboard.writeText(text);
        setCopiedFile(path);
        setTimeout(() => setCopiedFile(null), 2000);
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-indigo-500/30 overflow-x-hidden">
            <Navbar />

            <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent pointer-events-none"></div>

            <main className="relative container mx-auto px-6 pt-32 pb-24 max-w-6xl">

                {/* Header & Switcher */}
                <div className="mb-16 text-center space-y-8">
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => setMode('analyzer')}
                            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${mode === 'analyzer' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'bg-zinc-900/50 text-zinc-500 hover:text-zinc-300 border border-white/5'}`}
                        >
                            <Eye size={14} /> Analyzer
                        </button>
                        <button
                            onClick={() => setMode('forge')}
                            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${mode === 'forge' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'bg-zinc-900/50 text-zinc-500 hover:text-zinc-300 border border-white/5'}`}
                        >
                            <Hammer size={14} /> Forge
                        </button>
                    </div>

                    {mode === 'analyzer' ? (
                        <>
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none bg-gradient-to-r from-white via-white to-zinc-500 bg-clip-text text-transparent animate-in zoom-in-95 duration-500">
                                Vision <span className="text-indigo-500">Architect.</span>
                            </h2>
                            <p className="text-zinc-400 text-sm max-w-lg mx-auto leading-relaxed">
                                Transformez une capture d&apos;écran ou un croquis en code technique et architectures Mermaid instantanément.
                            </p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none bg-gradient-to-r from-white via-white to-zinc-500 bg-clip-text text-transparent animate-in zoom-in-95 duration-500">
                                Blueprint <span className="text-indigo-500">Forge.</span>
                            </h2>
                            <p className="text-zinc-400 text-sm max-w-lg mx-auto leading-relaxed font-medium">
                                Décrivez votre application. On génère la structure complète **BUN STACK**, les fichiers et le boilerplate.
                            </p>
                        </>
                    )}
                </div>

                {/* --- ANALYZER MODE --- */}
                {mode === 'analyzer' && (
                    <div className="grid gap-12 animate-in fade-in slide-in-from-bottom-5 duration-500">
                        <ImageUpload onImageSelected={handleImageAnalysis} isLoading={isLoading} />
                        {analysis && (
                            <AnalysisResult
                                mermaidCode={analysis.mermaidCode}
                                uiCode={analysis.uiCode}
                                explanation={analysis.explanation}
                            />
                        )}
                    </div>
                )}

                {/* --- FORGE MODE --- */}
                {mode === 'forge' && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-500">
                        {/* Input Area */}
                        <div className="max-w-3xl mx-auto relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                            <div className="relative bg-zinc-900/90 border border-white/10 rounded-2xl p-2 flex gap-2 backdrop-blur-xl">
                                <div className="flex-1 flex items-center px-4">
                                    <Search className="text-zinc-500 mr-4" size={20} />
                                    <input
                                        type="text"
                                        value={forgeDescription}
                                        onChange={(e) => setForgeDescription(e.target.value)}
                                        placeholder="Ex: 'Un SaaS de gestion de tâches avec API Bun et Dashboard Next.js'..."
                                        className="bg-transparent border-none outline-none text-white w-full text-lg placeholder:text-zinc-700 font-medium"
                                        onKeyDown={(e) => e.key === 'Enter' && handleForgeGeneration()}
                                    />
                                </div>
                                <button
                                    onClick={handleForgeGeneration}
                                    disabled={isLoading || !forgeDescription}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 transition-all disabled:opacity-50"
                                >
                                    {isLoading ? <Rocket className="animate-bounce" size={16} /> : <>Generate <Zap size={16} /></>}
                                </button>
                            </div>
                        </div>

                        {/* Forge Results */}
                        {forgeResult && (
                            <div className="space-y-12 pt-10">
                                {/* 1. Header & Export */}
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-10">
                                    <div className="text-center md:text-left">
                                        <h3 className="text-4xl font-black tracking-tighter mb-2">{forgeResult.projectName}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {forgeResult.stack.map((s: string) => (
                                                <span key={s} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-400">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleFullExport}
                                        className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl shadow-white/5"
                                    >
                                        <Download size={16} />
                                        Export Full Blueprint (.md)
                                    </button>
                                </div>

                                {/* 2. Tabs Switcher */}
                                <div className="flex items-center justify-center gap-8">
                                    {[
                                        { id: 'design', label: '🎨 Design Doc', icon: Sparkles },
                                        { id: 'structure', label: '📂 Structure', icon: FolderTree },
                                        { id: 'code', label: '💻 Source Code', icon: FileCode }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as any)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20' : 'text-zinc-500 hover:text-zinc-300 border border-transparent'}`}
                                        >
                                            <tab.icon size={14} />
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>

                                {/* 3. Active View */}
                                <div className="animate-in fade-in duration-700">
                                    {activeTab === 'design' && (
                                        <div className="max-w-4xl mx-auto bg-zinc-900/20 p-12 rounded-[3.5rem] border border-white/5 shadow-inner">
                                            {renderDesignDoc(forgeResult.designDoc)}
                                        </div>
                                    )}

                                    {activeTab === 'structure' && (
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                            <div className="md:col-span-3 bg-zinc-900/30 rounded-[2.5rem] border border-white/5 p-12">
                                                <div className="flex items-center gap-3 mb-8 text-indigo-400">
                                                    <FolderTree size={20} />
                                                    <span className="text-xs font-black uppercase tracking-widest">Project ASCII Tree</span>
                                                </div>
                                                <div className="font-mono text-base text-zinc-400 leading-relaxed whitespace-pre bg-black/40 p-10 rounded-3xl border border-white/5 shadow-2xl">
                                                    {forgeResult.tree}
                                                </div>
                                            </div>
                                            <div className="bg-zinc-900/50 rounded-[2.5rem] border border-white/5 p-10 flex flex-col justify-center items-center text-center">
                                                <Terminal className="text-indigo-500 mb-6" size={40} />
                                                <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">Launch Command</div>
                                                <code className="text-sm font-mono text-emerald-400 bg-black/50 px-6 py-3 rounded-xl border border-emerald-500/20 shadow-lg shadow-emerald-900/10">
                                                    {forgeResult.installCommand}
                                                </code>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'code' && (
                                        <div className="space-y-8 max-w-5xl mx-auto">
                                            <div className="flex items-center gap-3 mb-4 text-emerald-400 pl-4">
                                                <FileCode size={20} />
                                                <span className="text-xs font-black uppercase tracking-widest">Code Vault</span>
                                            </div>
                                            {forgeResult.files.map((file: any) => (
                                                <div key={file.path} className="group relative bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl transition-all hover:border-white/20">
                                                    <div className="bg-zinc-950 px-8 py-5 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-zinc-950 to-zinc-900">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                                            <span className="text-xs font-mono font-bold text-zinc-300 tracking-tight">{file.path}</span>
                                                        </div>
                                                        <button
                                                            onClick={() => copyToClipboard(file.content, file.path)}
                                                            className={`p-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-all ${copiedFile === file.path ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5' : 'text-zinc-500'}`}
                                                        >
                                                            {copiedFile === file.path ? <Check size={18} /> : <Copy size={18} />}
                                                        </button>
                                                    </div>
                                                    <div className="p-10 overflow-x-auto bg-[#0a0a0a]">
                                                        <pre className="text-sm font-mono text-zinc-400 leading-relaxed">
                                                            <code>{file.content}</code>
                                                        </pre>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                )}
            </main>

            <footer className="py-12 border-t border-white/5 text-center mt-20 bg-zinc-950/50 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-6">
                    <div className="flex items-center gap-4 text-zinc-600 text-[10px] uppercase tracking-[0.4em] font-black">
                        <span>Forge</span>
                        <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                        <span>Architecture</span>
                        <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                        <span>Engineering</span>
                    </div>
                    <p className="text-[10px] text-zinc-700 font-mono tracking-widest">BLUEPRINT FORGE ENGINE v2.0 • BUN STACK ENABLED</p>
                </div>
            </footer>
        </div>
    );
}

