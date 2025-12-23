import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'glass' | 'danger' | 'success' | 'neon';
    className?: string;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button' }) => {
    const baseStyle = "px-6 py-3 rounded-2xl font-bold transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:active:scale-100 disabled:opacity-50 disabled:grayscale";
    const variants = {
        primary: "bg-primary text-black shadow-[0_0_20px_rgba(20,241,149,0.3)] hover:shadow-[0_0_30px_rgba(20,241,149,0.5)]",
        secondary: "bg-secondary text-white shadow-[0_0_20px_rgba(153,69,255,0.3)] hover:shadow-[0_0_30px_rgba(153,69,255,0.5)]",
        outline: "border-2 border-white/20 text-white hover:bg-white/10",
        glass: "glass-panel text-white hover:bg-white/10",
        danger: "bg-red-500 text-white shadow-red-500/30",
        success: "bg-emerald-500 text-white shadow-emerald-500/30",
        neon: "bg-transparent border border-primary text-primary hover:bg-primary hover:text-black shadow-[0_0_10px_rgba(20,241,149,0.2)]"
    };
    return <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>{children}</button>;
};
