import React from 'react';

interface Props {
    code: string;
    onChange: (value: string) => void;
}

export const MermaidEditor: React.FC<Props> = ({ code, onChange }) => {
    return (
        <div className="h-full w-full bg-zinc-950 flex flex-col font-mono text-sm relative overflow-hidden shadow-2xl">
            <div className="h-10 bg-zinc-900 flex items-center px-4 text-[10px] text-zinc-500 uppercase tracking-widest font-bold border-b border-white/5">
                Diagram Editor
            </div>
            <textarea
                value={code}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-full p-6 bg-transparent text-emerald-400 resize-none focus:outline-none leading-relaxed selection:bg-emerald-500/20"
                spellCheck={false}
                placeholder="Enter Mermaid code here..."
            />
        </div>
    );
};
