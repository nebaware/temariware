import React from 'react';
import { Skill } from '../../types';

interface SkillsSectionProps {
    skills: Skill[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
    if (!skills || skills.length === 0) {
        return null;
    }

    return (
        <div className="bg-gray-800 p-4 rounded-xl mb-6">
            <h3 className="text-lg font-bold text-white mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                    <div key={skill.id} className="bg-gray-700 text-white text-sm font-semibold px-3 py-1 rounded-full">
                        {skill.name} - <span className="font-normal">{skill.level}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
