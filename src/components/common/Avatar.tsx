import React, { useContext } from 'react';
import { DataSaverContext } from '../../contexts/DataSaverContext';

interface AvatarProps {
    src: string;
    alt: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    verified?: boolean;
    className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'md', verified, className = '' }) => {
    const { dataSaver } = useContext(DataSaverContext);
    const sizeClasses = { sm: 'w-10 h-10', md: 'w-14 h-14', lg: 'w-24 h-24', xl: 'w-32 h-32' };
    return (
        <div className={`relative ${sizeClasses[size]} ${className}`}>
            {dataSaver ? (
                <div className={`w-full h-full rounded-full bg-gradient-to-br from-primary to-blue-900 flex items-center justify-center text-black font-bold border-2 border-white/20 ${size === 'lg' || size === 'xl' ? 'text-2xl' : 'text-sm'}`}>{alt.charAt(0)}</div>
            ) : (
                <img src={src} alt={alt} className="w-full h-full rounded-full object-cover border-2 border-white/20 shadow-lg" />
            )}
            {verified && <div className="absolute bottom-0 right-0 bg-blue-500 text-white w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border-2 border-black text-[10px] shadow-sm"><i className="fas fa-check"></i></div>}
        </div>
    );
};
