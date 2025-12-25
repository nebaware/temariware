import React from 'react';
import { Project } from '../../types';

interface ProjectsSectionProps {
    projects: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
    if (!projects || projects.length === 0) {
        return null;
    }

    return (
        <div className="bg-gray-800 p-4 rounded-xl mb-6">
            <h3 className="text-lg font-bold text-white mb-4">Projects</h3>
            <div className="space-y-4">
                {projects.map(project => (
                    <div key={project.id} className="bg-gray-700 p-3 rounded-lg">
                        <h4 className="font-bold text-white">{project.title}</h4>
                        <p className="text-sm text-gray-300 mb-2">{project.description}</p>
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-sm text-secondary hover:underline">
                            View Project <i className="fas fa-external-link-alt ml-1"></i>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};
