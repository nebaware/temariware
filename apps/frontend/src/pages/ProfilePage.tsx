import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../contexts/StoreContext';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { SocialLinksSection } from '../components/profile/SocialLinksSection';
import { SkillsSection } from '../components/profile/SkillsSection';
import { ExperienceSection } from '../components/profile/ExperienceSection';
import { EducationSection } from '../components/profile/EducationSection';
import { ProjectsSection } from '../components/profile/ProjectsSection';

export const ProfilePage: React.FC = () => {
    const { state } = useContext(StoreContext);
    const navigate = useNavigate();
    if (!state.user) return null;
    return (
        <div className="p-4 pb-24">
            <div className="flex flex-col items-center mb-6">
                <Avatar src={state.user.avatar} alt={state.user.name} size="xl" verified={state.user.isVerified} />
                <h2 className="text-2xl font-bold text-white mt-4">{state.user.name}</h2>
                <p className="text-gray-400">{state.user.headline}</p>
                <p className="text-sm text-gray-300 mt-2 text-center max-w-xs">{state.user.bio}</p>
                <div className="flex gap-2 mt-4">
                    <Button onClick={() => navigate('/edit-profile')} variant="outline" className="!py-2 !text-xs">Edit Profile</Button>
                    <Button onClick={() => navigate('/resume-builder')} variant="primary" className="!py-2 !text-xs">Resume Builder</Button>
                </div>
                <div className="flex gap-2 mt-2 w-full max-w-xs">
                    <Button onClick={() => navigate('/settings')} variant="outline" className="!py-2 !text-xs flex-1">
                        <i className="fas fa-cog mr-1"></i> Settings
                    </Button>
                </div>
            </div>

            <SocialLinksSection socialLinks={state.user.socialLinks} />
            <SkillsSection skills={state.user.skills} />
            <ExperienceSection experience={state.user.experience} />
            <EducationSection educationHistory={state.user.educationHistory} />
            <ProjectsSection projects={state.user.projects} />

        </div>
    );
};
