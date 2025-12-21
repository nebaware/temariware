import React from 'react';
import { Education } from '../../types';

interface EducationSectionProps {
    educationHistory: Education[];
}

export const EducationSection: React.FC<EducationSectionProps> = ({ educationHistory }) => {
    if (!educationHistory || educationHistory.length === 0) {
        return null;
    }

    return (
        <div className="bg-gray-800 p-4 rounded-xl mb-6">
            <h3 className="text-lg font-bold text-white mb-4">Education</h3>
            <div className="space-y-4">
                {educationHistory.map(edu => (
                    <div key={edu.id} className="border-l-2 border-secondary pl-4">
                        <h4 className="font-bold text-white">{edu.institution}</h4>
                        <p className="text-sm text-gray-400 mb-1">{edu.degree} in {edu.fieldOfStudy}</p>
                        <p className="text-sm text-gray-400">{edu.startDate} - {edu.endDate}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
