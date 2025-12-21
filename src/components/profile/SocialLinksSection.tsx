import React from 'react';
import { UserProfile } from '../../types';

interface SocialLinksSectionProps {
    socialLinks: UserProfile['socialLinks'];
}

export const SocialLinksSection: React.FC<SocialLinksSectionProps> = ({ socialLinks }) => {
    if (!socialLinks) {
        return null;
    }

    const hasLinks = Object.values(socialLinks).some(link => link);

    if (!hasLinks) {
        return null;
    }

    return (
        <div className="bg-gray-800 p-4 rounded-xl mb-6">
            <h3 className="text-lg font-bold text-white mb-4">Social Links</h3>
            <div className="flex gap-4">
                {socialLinks.github && (
                    <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                        <i className="fab fa-github fa-2x"></i>
                    </a>
                )}
                {socialLinks.linkedin && (
                    <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                        <i className="fab fa-linkedin fa-2x"></i>
                    </a>
                )}
                {socialLinks.twitter && (
                    <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                        <i className="fab fa-twitter fa-2x"></i>
                    </a>
                )}
                {socialLinks.portfolio && (
                    <a href={socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                        <i className="fas fa-globe fa-2x"></i>
                    </a>
                )}
            </div>
        </div>
    );
};
