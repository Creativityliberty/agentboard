import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="relative">
        <div className="w-12 h-12 bg-indigo-500/20 rounded-full blur-xl absolute animate-pulse" />
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin relative" />
      </div>
      <p className="text-sm text-zinc-400 font-medium animate-pulse">Configuration du Vortex en cours...</p>
    </div>
  );
};
