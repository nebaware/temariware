import React from 'react';
import { Experience } from '../../types';

interface ExperienceSectionProps {
    experience: Experience[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experience }) => {
    if (!experience || experience.length === 0) {
        return null;
    }

    return (
        <div className="bg-gray-800 p-4 rounded-xl mb-6">
            <h3 className="text-lg font-bold text-white mb-4">Experience</h3>
            <div className="space-y-4">
                {experience.map(exp => (
                    <div key={exp.id} className="border-l-2 border-primary pl-4">
                        <h4 className="font-bold text-white">{exp.role} at {exp.company}</h4>
                        <p className="text-sm text-gray-400 mb-1">{exp.duration}</p>
                        <p className="text-sm text-gray-300">{exp.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
