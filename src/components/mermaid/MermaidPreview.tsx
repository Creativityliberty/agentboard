"use client";

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { ZoomIn, ZoomOut, RotateCcw, Download, Loader2, AlertCircle } from 'lucide-react';

interface Props {
    code: string;
    onError: (error: string) => void;
    onSuccess: () => void;
}

export const MermaidPreview: React.FC<Props> = ({ code, onError, onSuccess }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [svgContent, setSvgContent] = useState<string>('');
    const [isRendering, setIsRendering] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: 'dark',
            securityLevel: 'loose',
            fontFamily: 'Inter, system-ui, sans-serif',
            themeVariables: {
                primaryColor: '#10b981',
                primaryTextColor: '#fff',
                primaryBorderColor: '#059669',
                lineColor: '#52525b',
                secondaryColor: '#3b82f6',
                tertiaryColor: '#1e293b'
            }
        });
    }, []);

    useEffect(() => {
        let isMounted = true;
        const renderDiagram = async () => {
            if (!containerRef.current || !code.trim()) return;

            setIsRendering(true);
            setLocalError(null);
            try {
                const id = `mermaid-${Date.now()}`;
                const { svg } = await mermaid.render(id, code);

                if (isMounted) {
                    setSvgContent(svg);
                    onSuccess();
                }
            } catch (error) {
                if (isMounted) {
                    console.error("Mermaid Render Error", error);
                    const message = error instanceof Error ? error.message : "Erreur de syntaxe Mermaid.";
                    setLocalError(message);
                    onError(message);
                }
            } finally {
                if (isMounted) setIsRendering(false);
            }
        };

        const timeoutId = setTimeout(renderDiagram, 500);

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, [code, onError, onSuccess]);

    const handleDownload = () => {
        if (!svgContent) return;
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `mermaid-diagram-${Date.now()}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="h-full w-full bg-zinc-900/50 relative overflow-hidden flex flex-col backdrop-blur-sm">
            <div className="absolute top-6 right-6 z-20 flex gap-2">
                <button
                    onClick={handleDownload}
                    className="p-2.5 bg-zinc-950/50 backdrop-blur hover:bg-zinc-800 rounded-xl text-white transition-all border border-white/5 shadow-xl"
                    title="Download SVG"
                >
                    <Download size={18} />
                </button>
            </div>

            {localError && (
                <div className="absolute inset-0 z-30 flex items-center justify-center p-8 bg-zinc-950/80 backdrop-blur-sm">
                    <div className="max-w-md bg-red-500/10 border border-red-500/20 p-6 rounded-2xl flex items-start gap-4">
                        <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
                        <div>
                            <h4 className="text-red-400 font-bold text-sm uppercase tracking-wider mb-1">Erreur de rendu</h4>
                            <p className="text-xs text-red-400/80 font-mono leading-relaxed">{localError}</p>
                        </div>
                    </div>
                </div>
            )}

            <TransformWrapper
                initialScale={1}
                minScale={0.2}
                maxScale={8}
                centerOnInit={true}
            >
                {({ zoomIn, zoomOut, resetTransform }) => (
                    <>
                        <div className="absolute bottom-6 left-6 z-20 flex gap-2">
                            <button onClick={() => zoomIn()} className="p-2.5 bg-zinc-950/50 backdrop-blur hover:bg-zinc-800 rounded-xl text-white transition-all border border-white/5">
                                <ZoomIn size={18} />
                            </button>
                            <button onClick={() => zoomOut()} className="p-2.5 bg-zinc-950/50 backdrop-blur hover:bg-zinc-800 rounded-xl text-white transition-all border border-white/5">
                                <ZoomOut size={18} />
                            </button>
                            <button onClick={() => resetTransform()} className="p-2.5 bg-zinc-950/50 backdrop-blur hover:bg-zinc-800 rounded-xl text-white transition-all border border-white/5">
                                <RotateCcw size={18} />
                            </button>
                        </div>

                        <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full flex items-center justify-center">
                            <div
                                ref={containerRef}
                                className="w-full h-full flex items-center justify-center p-12 transition-opacity duration-300"
                                style={{ opacity: isRendering ? 0.5 : 1 }}
                                dangerouslySetInnerHTML={{ __html: svgContent }}
                            />
                        </TransformComponent>
                    </>
                )}
            </TransformWrapper>

            {isRendering && (
                <div className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3 py-1.5 bg-zinc-950/50 backdrop-blur rounded-lg border border-white/5">
                    <Loader2 className="w-3 h-3 text-emerald-400 animate-spin" />
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Rendering...</span>
                </div>
            )}
        </div>
    );
};
