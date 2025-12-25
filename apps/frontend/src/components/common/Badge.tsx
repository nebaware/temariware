import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    color?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, color = 'bg-primary/20 text-primary border border-primary/20' }) => (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${color}`}>{children}</span>
);
