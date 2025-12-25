import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, style }) => (
    <div onClick={onClick} className={`glass-card p-5 rounded-3xl transition-transform hover:scale-105 ${onClick ? 'cursor-pointer' : ''} ${className}`} style={style}>{children}</div>
);
