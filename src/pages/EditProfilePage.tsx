import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../contexts/StoreContext';
import { ToastContext } from '../contexts/ToastContext';
import { api } from '../services/api';
import { generateBioImprovement } from '../services/geminiService';
import { Experience, Education, Project, Skill } from '../types';
import { Button } from '../components/common/Button';

export const EditProfilePage: React.FC = () => {
    const { state, dispatch } = useContext(StoreContext);
    const { addToast } = useContext(ToastContext);
    const navigate = useNavigate();

    if (!state.user) {
        navigate('/login');
        return null;
    }

    const [activeTab, setActiveTab] = useState<'basic' | 'skills' | 'experience' | 'education' | 'projects' | 'socials'>('basic');
    const [formData, setFormData] = useState({ ...state.user });
    const [loading, setLoading] = useState(false);
    const [loadingAI, setLoadingAI] = useState(false);
    
    const [newExp, setNewExp] = useState<Partial<Experience>>({});
    const [newEdu, setNewEdu] = useState<Partial<Education>>({});
    const [newSkill, setNewSkill] = useState<Partial<Skill>>({});
    const [newProject, setNewProject] = useState<Partial<Project>>({});


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, [name]: value } }));
    };

    const handleImproveBio = async () => {
        setLoadingAI(true);
        const improved = await generateBioImprovement(formData.bio || '', formData.skills?.map(s => s.name) || []);
        setFormData(prev => ({...prev, bio: improved}));
        setLoadingAI(false);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({...prev, avatar: reader.result as string}));
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSave = async () => {
        setLoading(true);
        try {
            const updatedUser = await api.user.updateProfile(formData);
            dispatch({ type: 'UPDATE_PROFILE', payload: updatedUser });
            addToast("Profile updated successfully!", "success");
            navigate('/profile');
        } catch (error) {
            addToast("Failed to update profile.", "error");
        } finally {
            setLoading(false);
        }
    };
    
    const addItem = <T extends {}>(item: Partial<T>, type: 'skills' | 'experience' | 'educationHistory' | 'projects') => {
        if (Object.keys(item).length === 0) return;
        const fullItem = { ...item, id: `${type}-${Date.now()}` };
        setFormData(prev => ({ ...prev, [type]: [...(prev[type] || []), fullItem] }));
    };

    const removeItem = (id: string, type: 'skills' | 'experience' | 'educationHistory' | 'projects') => {
        setFormData(prev => ({ ...prev, [type]: prev[type]?.filter((item: any) => item.id !== id) }));
    };

    return (
        <div className="p-6 max-w-lg mx-auto pb-32">
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"><i className="fas fa-arrow-left"></i></button>
                <h2 className="text-xl font-bold text-white">Edit Profile</h2>
            </div>
            <div className="flex bg-[#1e293b] p-1 rounded-xl mb-6 overflow-x-auto no-scrollbar">
                {['basic', 'skills', 'experience', 'education', 'projects', 'socials'].map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap ${activeTab === tab ? 'bg-primary text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>{tab}</button>
                ))}
            </div>

            {activeTab === 'basic' && (
                <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                    <div className="flex flex-col items-center mb-4">
                        <div className="relative w-24 h-24 mb-2">
                            <img src={formData.avatar} alt="Profile" className="w-full h-full rounded-full object-cover border-2 border-primary" />
                            <label className="absolute bottom-0 right-0 bg-primary text-black p-2 rounded-full cursor-pointer hover:bg-white transition-colors">
                                <i className="fas fa-camera text-xs"></i>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-400 text-xs font-bold mb-2">Name</label>
                        <input name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-black/50 border border-gray-600 rounded-xl p-3 text-sm text-white focus:border-primary outline-none" />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-xs font-bold mb-2">Headline</label>
                        <input name="headline" value={formData.headline} onChange={handleInputChange} className="w-full bg-black/50 border border-gray-600 rounded-xl p-3 text-sm text-white focus:border-primary outline-none" />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-xs font-bold mb-2">Bio</label>
                        <textarea name="bio" value={formData.bio} onChange={handleInputChange} className="w-full h-32 bg-black/50 border border-gray-600 rounded-xl p-3 text-sm text-white focus:border-primary outline-none" />
                        <button onClick={handleImproveBio} disabled={loadingAI} className="mt-2 text-xs text-secondary font-bold flex items-center gap-1"><i className={`fas fa-magic ${loadingAI ? 'fa-spin' : ''}`}></i> Improve with AI</button>
                    </div>
                </div>
            )}
            
            {activeTab === 'skills' && (
                <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                     <div className="space-y-3">
                        {formData.skills?.map(skill => (
                            <div key={skill.id} className="bg-[#1e293b] p-3 rounded-xl border border-white/10 flex justify-between items-center">
                                <p className="text-sm text-white">{skill.name} - <span className="text-gray-400">{skill.level}</span></p>
                                <button onClick={() => removeItem(skill.id, 'skills')} className="text-red-500 hover:text-red-400"><i className="fas fa-trash"></i></button>
                            </div>
                        ))}
                    </div>
                    <div className="bg-[#1e293b] p-4 rounded-xl border border-white/10 space-y-3">
                        <h4 className="text-white text-sm font-bold">Add Skill</h4>
                        <input value={newSkill.name || ''} onChange={e => setNewSkill({ ...newSkill, name: e.target.value })} placeholder="Skill Name (e.g. React)" className="w-full bg-black/50 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white" />
                        <input value={newSkill.level || ''} onChange={e => setNewSkill({ ...newSkill, level: e.target.value })} placeholder="Proficiency (e.g. Expert)" className="w-full bg-black/50 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white" />
                        <Button onClick={() => { addItem(newSkill, 'skills'); setNewSkill({}); }} variant="neon" className="w-full !py-2 !text-xs">Add Skill</Button>
                    </div>
                </div>
            )}
            
            {activeTab === 'projects' && (
                <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                    <div className="space-y-3">
                        {formData.projects?.map(proj => (
                            <div key={proj.id} className="bg-[#1e293b] p-3 rounded-xl border border-white/10 flex justify-between items-center">
                                <div>
                                    <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                                    <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs text-secondary hover:underline">{proj.link}</a>
                                </div>
                                <button onClick={() => removeItem(proj.id, 'projects')} className="text-red-500 hover:text-red-400"><i className="fas fa-trash"></i></button>
                            </div>
                        ))}
                    </div>
                    <div className="bg-[#1e293b] p-4 rounded-xl border border-white/10 space-y-3">
                        <h4 className="text-white text-sm font-bold">Add Project</h4>
                        <input value={newProject.title || ''} onChange={e => setNewProject({ ...newProject, title: e.target.value })} placeholder="Project Title" className="w-full bg-black/50 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white" />
                        <input value={newProject.link || ''} onChange={e => setNewProject({ ...newProject, link: e.target.value })} placeholder="Project Link" className="w-full bg-black/50 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white" />
                        <textarea value={newProject.description || ''} onChange={e => setNewProject({ ...newProject, description: e.target.value })} placeholder="Description" className="w-full bg-black/50 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white h-20" />
                        <Button onClick={() => { addItem(newProject, 'projects'); setNewProject({}); }} variant="neon" className="w-full !py-2 !text-xs">Add Project</Button>
                    </div>
                </div>
            )}
            
            {activeTab === 'socials' && (
                 <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                    <h4 className="text-white text-sm font-bold">Social Links</h4>
                    <div>
                        <label className="block text-gray-400 text-xs font-bold mb-2">GitHub</label>
                        <input name="github" value={formData.socialLinks?.github || ''} onChange={handleSocialChange} className="w-full bg-black/50 border border-gray-600 rounded-xl p-3 text-sm text-white focus:border-primary outline-none" />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-xs font-bold mb-2">LinkedIn</label>
                        <input name="linkedin" value={formData.socialLinks?.linkedin || ''} onChange={handleSocialChange} className="w-full bg-black/50 border border-gray-600 rounded-xl p-3 text-sm text-white focus:border-primary outline-none" />
                    </div>
                 </div>
            )}

            {activeTab === 'experience' && (
                <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                    <div className="space-y-3">
                        {formData.experience?.map(exp => (
                            <div key={exp.id} className="bg-[#1e293b] p-3 rounded-xl border border-white/10">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="text-sm font-bold text-white">{exp.role} at {exp.company}</h4>
                                        <p className="text-xs text-gray-400">{exp.duration}</p>
                                    </div>
                                    <button onClick={() => removeItem(exp.id, 'experience')} className="text-red-500 hover:text-red-400"><i className="fas fa-trash"></i></button>
                                </div>
                                <p className="text-sm text-gray-300 mt-2">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                    <div className="bg-[#1e293b] p-4 rounded-xl border border-white/10 space-y-3">
                        <h4 className="text-white text-sm font-bold">Add Experience</h4>
                        <input value={newExp.company || ''} onChange={e => setNewExp({ ...newExp, company: e.target.value })} placeholder="Company" className="w-full bg-black/50 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white" />
                        <input value={newExp.role || ''} onChange={e => setNewExp({ ...newExp, role: e.target.value })} placeholder="Role" className="w-full bg-black/50 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white" />
                        <input value={newExp.duration || ''} onChange={e => setNewExp({ ...newExp, duration: e.target.value })} placeholder="Duration (e.g. 2022 - Present)" className="w-full bg-black/50 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white" />
                        <textarea value={newExp.description || ''} onChange={e => setNewExp({ ...newExp, description: e.target.value })} placeholder="Description" className="w-full bg-black/50 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white h-20" />
                        <Button onClick={() => { addItem(newExp, 'experience'); setNewExp({}); }} variant="neon" className="w-full !py-2 !text-xs">Add Experience</Button>
                    </div>
                </div>
            )}

            {activeTab === 'education' && (
                <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                    <div className="space-y-3">
                        {formData.educationHistory?.map(edu => (
                            <div key={edu.id} className="bg-[#1e293b] p-3 rounded-xl border border-white/10">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="text-sm font-bold text-white">{edu.institution}</h4>
                                        <p className="text-xs text-gray-400">{edu.degree} in {edu.fieldOfStudy} ({edu.startDate} - {edu.endDate})</p>
                                    </div>
                                    <button onClick={() => removeItem(edu.id, 'educationHistory')} className="text-red-500 hover:text-red-400"><i className="fas fa-trash"></i></button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-[#1e293b] p-4 rounded-xl border border-white/10 space-y-3">
                        <h4 className="text-white text-sm font-bold">Add Education</h4>
                        <input value={newEdu.institution || ''} onChange={e => setNewEdu({ ...newEdu, institution: e.target.value })} placeholder="Institution" className="w-full bg-black/50 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white" />
                        <input value={newEdu.degree || ''} onChange={e => setNewEdu({ ...newEdu, degree: e.target.value })} placeholder="Degree" className="w-full bg-black/50 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white" />
                        <input value={newEdu.fieldOfStudy || ''} onChange={e => setNewEdu({ ...newEdu, fieldOfStudy: e.target.value })} placeholder="Field of Study" className="w-full bg-black/50 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white" />
                        <div className="flex gap-2">
                            <input value={newEdu.startDate || ''} onChange={e => setNewEdu({ ...newEdu, startDate: e.target.value })} placeholder="Start Date" className="w-full bg-black/50 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white" />
                            <input value={newEdu.endDate || ''} onChange={e => setNewEdu({ ...newEdu, endDate: e.target.value })} placeholder="End Date" className="w-full bg-black/50 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white" />
                        </div>
                        <Button onClick={() => { addItem(newEdu, 'educationHistory'); setNewEdu({}); }} variant="neon" className="w-full !py-2 !text-xs">Add Education</Button>
                    </div>
                </div>
            )}


            <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/50 backdrop-blur-xl border-t border-white/10 max-w-lg mx-auto">
                <Button onClick={handleSave} className="w-full" disabled={loading}>
                    {loading ? 'Saving...' : 'Save All Changes'}
                </Button>
            </div>
        </div>
    );
};
