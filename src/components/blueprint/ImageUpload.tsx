"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Copy } from 'lucide-react';

interface Props {
    onImageSelected: (base64: string) => void;
    isLoading: boolean;
}

export const ImageUpload: React.FC<Props> = ({ onImageSelected, isLoading }) => {
    const [preview, setPreview] = useState<string | null>(null);

    const handleFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert("Veuillez choisir une image.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setPreview(base64);
            onImageSelected(base64);
        };
        reader.readAsDataURL(file);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const onPaste = useCallback((e: ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                if (file) handleFile(file);
                break;
            }
        }
    }, []);

    useEffect(() => {
        window.addEventListener('paste', onPaste);
        return () => window.removeEventListener('paste', onPaste);
    }, [onPaste]);

    return (
        <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className={`relative group h-[300px] border-2 border-dashed transition-all duration-300 rounded-[2rem] overflow-hidden flex flex-col items-center justify-center bg-zinc-900/40 backdrop-blur-md ${preview ? 'border-indigo-500/50' : 'border-white/10 hover:border-indigo-500/30'
                }`}
        >
            {preview ? (
                <div className="relative w-full h-full p-4">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-contain rounded-xl"
                    />
                    <button
                        onClick={() => { setPreview(null); onImageSelected(''); }}
                        className="absolute top-6 right-6 p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white shadow-xl backdrop-blur-md transition-all scale-0 group-hover:scale-100"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <label className="cursor-pointer flex flex-col items-center gap-4 text-zinc-500 transition-all hover:text-indigo-400">
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                        disabled={isLoading}
                    />
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/5 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all">
                        <Upload className={`w-8 h-8 ${isLoading ? 'animate-bounce' : ''}`} />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-bold text-zinc-300">Glissez ou collez une image</p>
                        <p className="text-[10px] uppercase tracking-widest font-medium opacity-50 mt-1">Capture, Croquis ou UI</p>
                    </div>
                </label>
            )}

            {isLoading && (
                <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center z-20">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                            <ImageIcon className="absolute inset-0 m-auto w-5 h-5 text-indigo-400 animate-pulse" />
                        </div>
                        <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">Analyse Multimodale...</p>
                    </div>
                </div>
            )}
        </div>
    );
};
