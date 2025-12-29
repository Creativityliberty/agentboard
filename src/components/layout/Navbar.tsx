"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Sparkles,
    PenTool,
    Eye,
    Network,
    Swords,
    Users,
    MessageSquare,
    LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/', label: 'Chat', icon: MessageSquare },
    { href: '/vortex', label: 'Vortex', icon: Sparkles },
    { href: '/mermaid', label: 'Mermaid', icon: PenTool },
    { href: '/blueprint', label: 'Blueprint', icon: Eye },
    { href: '/semantic', label: 'Semantic', icon: Network },
    { href: '/arena', label: 'Arena', icon: Swords },
    { href: '/crew', label: 'Crew', icon: Users },
];

export const Navbar = () => {
    const pathname = usePathname();

    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-fit">
            <div className="flex items-center gap-1 p-2 bg-zinc-950/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-3xl">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300",
                                isActive
                                    ? "bg-white text-zinc-950 shadow-xl shadow-white/10 scale-105"
                                    : "text-zinc-500 hover:text-white hover:bg-white/5 active:scale-95"
                            )}
                        >
                            <Icon size={14} className={isActive ? "animate-pulse" : ""} />
                            <span className="hidden md:block uppercase tracking-widest">{item.label}</span>
                            {isActive && (
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-zinc-950 rounded-full" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};
