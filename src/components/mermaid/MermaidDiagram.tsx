"use client";

import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
    chart: string;
    className?: string;
}

mermaid.initialize({
    startOnLoad: true,
    theme: 'dark',
    securityLevel: 'loose',
    themeVariables: {
        primaryColor: '#4f46e5',
        primaryTextColor: '#fff',
        primaryBorderColor: '#818cf8',
        lineColor: '#6366f1',
        secondaryColor: '#18181b',
        tertiaryColor: '#09090b',
    }
});

export function MermaidDiagram({ chart, className }: MermaidDiagramProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current && chart) {
            try {
                ref.current.removeAttribute("data-processed");
                mermaid.contentLoaded();
            } catch (err) {
                console.error("Mermaid parsing error:", err);
            }
        }
    }, [chart]);

    return (
        <div key={chart} className={`mermaid ${className}`} ref={ref}>
            {chart}
        </div>
    );
}
