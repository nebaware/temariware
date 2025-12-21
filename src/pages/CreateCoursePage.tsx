import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../contexts/StoreContext';
import { ToastContext } from '../contexts/ToastContext';
import { Course, CourseModule } from '../types';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export const CreateCoursePage: React.FC = () => {
    const { state, dispatch } = useContext(StoreContext);
    const { addToast } = useContext(ToastContext);
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    // Course details
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Tech');
    const [price, setPrice] = useState('0');
    const [thumbnail, setThumbnail] = useState('');
    const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
    const [duration, setDuration] = useState('');

    // Modules
    const [modules, setModules] = useState<Partial<CourseModule>[]>([]);
    const [currentModule, setCurrentModule] = useState({ title: '', description: '', lessons: [] as any[] });
    const [showModuleForm, setShowModuleForm] = useState(false);

    // Lesson
    const [currentLesson, setCurrentLesson] = useState({ title: '', content: '', duration: '', videoUrl: '' });

    const categories = ['Tech', 'Business', 'Design', 'Marketing', 'Engineering', 'Languages'];

    const handleAddLesson = () => {
        if (!currentLesson.title) return;
        setCurrentModule({
            ...currentModule,
            lessons: [...currentModule.lessons, { ...currentLesson, id: `l-${Date.now()}` }]
        });
        setCurrentLesson({ title: '', content: '', duration: '', videoUrl: '' });
    };

    const handleAddModule = () => {
        if (!currentModule.title) return;
        setModules([...modules, { ...currentModule, id: `m-${Date.now()}` }]);
        setCurrentModule({ title: '', description: '', lessons: [] });
        setShowModuleForm(false);
        addToast('Module added successfully!', 'success');
    };

    const handlePublish = () => {
        if (!title || !description) {
            addToast('Please fill in all required fields', 'error');
            return;
        }

        const newCourse: Course = {
            id: `c-${Date.now()}`,
            instructorId: state.user?.id || 'unknown',
            instructorName: state.user?.name || 'Unknown',
            instructorAvatar: state.user?.avatar || 'https://i.pravatar.cc/150',
            title,
            description,
            price: parseFloat(price),
            category,
            thumbnail: thumbnail || 'https://placehold.co/600x400/1a1a2e/14F195?text=' + encodeURIComponent(title),
            rating: 0,
            enrolledCount: 0,
            modules: modules as CourseModule[],
            level,
            duration: duration || '4 weeks',
            createdAt: new Date().toISOString()
        };

        dispatch({ type: 'CREATE_COURSE', payload: newCourse });
        addToast('Course published successfully!', 'success');
        navigate('/gebeta');
    };

    return (
        <div className="p-4 pb-24 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => navigate('/gebeta')} className="text-white">
                    <i className="fas fa-arrow-left"></i>
                </button>
                <h2 className="text-2xl font-bold text-white">Create Course</h2>
            </div>

            {/* Progress Indicator */}
            <div className="flex gap-2 mb-6">
                {[1, 2, 3].map(s => (
                    <div key={s} className={`flex-1 h-1 rounded-full ${step >= s ? 'bg-primary' : 'bg-gray-700'}`} />
                ))}
            </div>

            {step === 1 && (
                <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                    <Card className="!p-6">
                        <h3 className="text-white font-bold mb-4">Course Details</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2">COURSE TITLE *</label>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Introduction to Web Development"
                                    className="w-full bg-black/50 border border-gray-600 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2">DESCRIPTION *</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="What will students learn in this course?"
                                    className="w-full bg-black/50 border border-gray-600 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none h-24"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2">CATEGORY</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full bg-black/50 border border-gray-600 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2">LEVEL</label>
                                    <select
                                        value={level}
                                        onChange={(e) => setLevel(e.target.value as any)}
                                        className="w-full bg-black/50 border border-gray-600 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none"
                                    >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2">PRICE (ETB)</label>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="0"
                                        className="w-full bg-black/50 border border-gray-600 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2">DURATION</label>
                                    <input
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        placeholder="e.g. 4 weeks"
                                        className="w-full bg-black/50 border border-gray-600 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2">THUMBNAIL URL (Optional)</label>
                                <input
                                    value={thumbnail}
                                    onChange={(e) => setThumbnail(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full bg-black/50 border border-gray-600 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none"
                                />
                            </div>
                        </div>
                    </Card>

                    <Button onClick={() => setStep(2)} className="w-full" disabled={!title || !description}>
                        Next: Add Modules
                    </Button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                    <Card className="!p-6">
                        <h3 className="text-white font-bold mb-4">Course Modules ({modules.length})</h3>

                        {modules.map((mod, idx) => (
                            <div key={mod.id} className="mb-3 p-3 bg-black/30 rounded-lg border border-white/10">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-white font-bold text-sm">Module {idx + 1}: {mod.title}</h4>
                                        <p className="text-xs text-gray-400 mt-1">{mod.lessons?.length || 0} lessons</p>
                                    </div>
                                    <button
                                        onClick={() => setModules(modules.filter((_, i) => i !== idx))}
                                        className="text-red-500 hover:text-red-400"
                                    >
                                        <i className="fas fa-trash text-xs"></i>
                                    </button>
                                </div>
                            </div>
                        ))}

                        {!showModuleForm ? (
                            <button
                                onClick={() => setShowModuleForm(true)}
                                className="w-full border-2 border-dashed border-gray-600 rounded-xl p-4 text-gray-400 hover:text-white hover:border-primary transition-colors"
                            >
                                <i className="fas fa-plus mr-2"></i> Add Module
                            </button>
                        ) : (
                            <div className="border border-primary/30 rounded-xl p-4 bg-primary/5 space-y-3">
                                <input
                                    value={currentModule.title}
                                    onChange={(e) => setCurrentModule({ ...currentModule, title: e.target.value })}
                                    placeholder="Module Title (e.g. Introduction to HTML)"
                                    className="w-full bg-black/50 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none"
                                />
                                <textarea
                                    value={currentModule.description}
                                    onChange={(e) => setCurrentModule({ ...currentModule, description: e.target.value })}
                                    placeholder="Module Description (Optional)"
                                    className="w-full bg-black/50 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none h-16"
                                />

                                <div className="border-t border-white/10 pt-3">
                                    <p className="text-xs font-bold text-gray-400 mb-2">LESSONS ({currentModule.lessons.length})</p>
                                    {currentModule.lessons.map((lesson, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-xs text-white bg-black/30 p-2 rounded mb-1">
                                            <span>{lesson.title}</span>
                                            <button onClick={() => setCurrentModule({ ...currentModule, lessons: currentModule.lessons.filter((_, i) => i !== idx) })} className="text-red-500">
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    ))}

                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <input
                                            value={currentLesson.title}
                                            onChange={(e) => setCurrentLesson({ ...currentLesson, title: e.target.value })}
                                            placeholder="Lesson Title"
                                            className="col-span-2 bg-black/50 border border-gray-600 rounded px-2 py-1 text-xs text-white"
                                        />
                                        <input
                                            value={currentLesson.duration}
                                            onChange={(e) => setCurrentLesson({ ...currentLesson, duration: e.target.value })}
                                            placeholder="Duration (e.g. 15min)"
                                            className="bg-black/50 border border-gray-600 rounded px-2 py-1 text-xs text-white"
                                        />
                                        <button onClick={handleAddLesson} className="bg-primary text-black rounded px-2 py-1 text-xs font-bold hover:bg-white transition-colors">
                                            Add Lesson
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <button onClick={() => setShowModuleForm(false)} className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 text-xs hover:bg-gray-600">
                                        Cancel
                                    </button>
                                    <button onClick={handleAddModule} disabled={!currentModule.title} className="flex-1 bg-primary text-black rounded-lg px-4 py-2 text-xs font-bold hover:bg-white disabled:opacity-50">
                                        Save Module
                                    </button>
                                </div>
                            </div>
                        )}
                    </Card>

                    <div className="flex gap-3">
                        <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                            Back
                        </Button>
                        <Button onClick={() => setStep(3)} className="flex-1">
                            Next: Review
                        </Button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                    <Card className="!p-6">
                        <h3 className="text-white font-bold mb-4">Review & Publish</h3>

                        <div className="space-y-4">
                            <div className="bg-black/30 p-4 rounded-lg">
                                <img src={thumbnail || `https://placehold.co/600x400/1a1a2e/14F195?text=${encodeURIComponent(title)}`} alt={title} className="w-full h-32 object-cover rounded-lg mb-3" />
                                <h4 className="text-white font-bold text-lg">{title}</h4>
                                <p className="text-gray-400 text-sm mt-1">{description}</p>

                                <div className="flex gap-4 mt-3 text-xs text-gray-400">
                                    <span><i className="fas fa-tag mr-1"></i> {category}</span>
                                    <span><i className="fas fa-signal mr-1"></i> {level}</span>
                                    <span><i className="fas fa-clock mr-1"></i> {duration || '4 weeks'}</span>
                                    {parseFloat(price) > 0 && <span><i className="fas fa-money-bill mr-1"></i> {price} ETB</span>}
                                </div>
                            </div>

                            <div className="bg-black/30 p-4 rounded-lg">
                                <h5 className="text-white font-bold text-sm mb-2">Curriculum</h5>
                                <p className="text-gray-400 text-xs mb-3">{modules.length} modules, {modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0)} lessons</p>
                                {modules.map((mod, idx) => (
                                    <div key={mod.id} className="mb-2 last:mb-0">
                                        <div className="flex items-start gap-2 text-sm">
                                            <i className="fas fa-folder text-primary mt-0.5"></i>
                                            <div>
                                                <p className="text-white font-bold">{mod.title}</p>
                                                <p className="text-xs text-gray-500">{mod.lessons?.length || 0} lessons</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <div className="flex gap-3">
                        <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                            Back
                        </Button>
                        <Button onClick={handlePublish} className="flex-1">
                            <i className="fas fa-rocket mr-2"></i> Publish Course
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
