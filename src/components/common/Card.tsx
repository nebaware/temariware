import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, style }) => (
    <motion.div whileHover={onClick ? { scale: 1.02 } : {}} onClick={onClick} className={`glass-card p-5 rounded-3xl ${onClick ? 'cursor-pointer' : ''} ${className}`} style={style}>{children}</motion.div>
);
