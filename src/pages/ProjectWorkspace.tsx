import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StoreContext } from '../contexts/StoreContext';
import { ToastContext } from '../contexts/ToastContext';
import { MOCK_CODE_FILES } from '../constants';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Task, ChatMessage } from '../types';

interface TeamMember {
    id: string;
    name: string;
    avatar: string;
    role: 'Owner' | 'Admin' | 'Member';
    isOnline: boolean;
}

import { socketService } from '../services/socket';

export const ProjectWorkspace: React.FC = () => {
    const { id } = useParams();
    const { state, dispatch } = useContext(StoreContext);
    const { addToast } = useContext(ToastContext);
    const navigate = useNavigate();
    const project = state.user?.projects.find(p => p.id === id);
    const [activeTab, setActiveTab] = useState<'board' | 'code' | 'files' | 'activity'>('board');
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showMemberModal, setShowMemberModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // Task management
    const [tasks, setTasks] = useState<Task[]>([
        { id: '1', content: 'Implement user authentication', column: 'doing', assignedTo: '1', tags: ['frontend', 'urgent'], dueDate: '2024-12-15' },
        { id: '2', content: 'Design database schema', column: 'todo', assignedTo: '2', tags: ['backend'], dueDate: '2024-12-20' },
        { id: '3', content: 'Setup CI/CD pipeline', column: 'done', assignedTo: '3', tags: ['devops'], dueDate: '2024-12-10' },
    ]);

    const [newTask, setNewTask] = useState({ title: '', assignee: '1', priority: 'medium', dueDate: '' });
    const [uploadedFiles, setUploadedFiles] = useState([
        { id: '1', name: 'design-mockups.fig', size: '2.5 MB', uploader: 'Alice K.', date: '2 hours ago' },
        { id: '2', name: 'requirements.pdf', size: '1.2 MB', uploader: 'You', date: '1 day ago' },
    ]);

    const [activities] = useState([
        { id: '1', user: 'Alice K.', action: 'completed task', target: '"Setup authentication"', time: '2 hours ago', avatar: 'https://i.pravatar.cc/150?u=2' },
        { id: '2', user: 'You', action: 'uploaded file', target: 'requirements.pdf', time: '1 day ago', avatar: state.user?.avatar || 'https://i.pravatar.cc/150?u=1' },
        { id: '3', user: 'Bob M.', action: 'joined project', target: '', time: '2 days ago', avatar: 'https://i.pravatar.cc/150?u=3' },
    ]);

    // Code Editor State
    const [code, setCode] = useState(MOCK_CODE_FILES['App.tsx']);
    const [activeFile, setActiveFile] = useState('App.tsx');

    // Mock team members (In real-world, fetch from API)
    const [teamMembers] = useState<TeamMember[]>([
        { id: state.user?.id || '1', name: 'You', avatar: state.user?.avatar || 'https://i.pravatar.cc/150?u=1', role: 'Owner', isOnline: true },
        { id: '2', name: 'Alice K.', avatar: 'https://i.pravatar.cc/150?u=2', role: 'Admin', isOnline: true },
        { id: '3', name: 'Bob M.', avatar: 'https://i.pravatar.cc/150?u=3', role: 'Member', isOnline: false },
    ]);

    React.useEffect(() => {
        if (id) {
            socketService.joinProject(id);
            socketService.onTasksUpdated((updatedTasks) => {
                setTasks(updatedTasks);
            });
            socketService.onCodeUpdated((data) => {
                if (data.file === activeFile) {
                    setCode(data.code);
                }
            });
        }
    }, [id, activeFile]);

    const syncTasks = (newTasks: Task[]) => {
        setTasks(newTasks);
        if (id) socketService.emitTaskUpdate(id, newTasks);
    };

    const handleCodeChange = (newCode: string) => {
        setCode(newCode);
        if (id) socketService.emitCodeChange(id, activeFile, newCode);
    };

    const handleAddTask = () => {
        if (!newTask.title) {
            addToast('Please enter a task title', 'error');
            return;
        }
        const task: Task = {
            id: Date.now().toString(),
            content: newTask.title,
            column: 'todo',
            assignedTo: newTask.assignee,
            tags: [newTask.priority],
            dueDate: newTask.dueDate
        };
        setTasks([...tasks, task]);
        setNewTask({ title: '', assignee: '1', priority: 'medium', dueDate: '' });
        setShowTaskModal(false);
        addToast('Task added successfully!', 'success');
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const newFile = {
                id: Date.now().toString(),
                name: file.name,
                size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                uploader: 'You',
                date: 'Just now'
            };
            setUploadedFiles([newFile, ...uploadedFiles]);
            addToast(`File "${file.name}" uploaded!`, 'success');
        }
    };

    if (!project) return <div className="p-8 text-white">Project not found</div>;

    const getTasksByColumn = (column: Task['column']) => tasks.filter(t => t.column === column);

    return (
        <div className="h-screen flex flex-col bg-[#0f172a]">
            {/* Workspace Header */}
            <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-[#1e293b]">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/work')} className="text-gray-400 hover:text-white"><i className="fas fa-arrow-left"></i></button>
                    <h2 className="font-bold text-white">{project.title}</h2>
                    <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded font-bold">WORKSPACE</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                        {teamMembers.map((m) => (
                            <div key={m.id} className="relative">
                                <Avatar src={m.avatar} size="sm" className="border-2 border-[#1e293b]" />
                                {m.isOnline && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#1e293b]"></div>}
                            </div>
                        ))}
                        <button onClick={() => setShowMemberModal(true)} className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white border-2 border-[#1e293b] hover:bg-gray-600">
                            <i className="fas fa-plus"></i>
                        </button>
                    </div>
                    <Button variant="primary" className="!py-1.5 !px-3 !text-xs"><i className="fas fa-video mr-1"></i> Meet</Button>
                </div>
            </div>

            {/* Workspace Tabs */}
            <div className="bg-[#0f172a] border-b border-white/5 px-4 flex gap-4">
                {['board', 'code', 'files', 'activity'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`py-3 text-sm font-bold border-b-2 transition-colors capitalize ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Workspace Content */}
            <div className="flex-1 overflow-hidden relative">
                {activeTab === 'board' && (
                    <div className="h-full overflow-x-auto p-6 flex gap-6">
                        {(['todo', 'doing', 'done'] as const).map(col => (
                            <div key={col} className="w-72 flex-shrink-0 flex flex-col bg-[#1e293b] rounded-xl border border-white/5 h-full max-h-[calc(100vh-180px)]">
                                <div className="p-3 border-b border-white/5 flex justify-between items-center">
                                    <h3 className="font-bold text-white text-sm capitalize">{col.replace('doing', 'In Progress')}</h3>
                                    <span className="bg-gray-700 text-gray-300 text-[10px] px-2 py-0.5 rounded-full">{getTasksByColumn(col).length}</span>
                                </div>
                                <div className="p-3 space-y-3 overflow-y-auto flex-1">
                                    {getTasksByColumn(col).map(task => {
                                        const assignee = teamMembers.find(m => m.id === task.assignedTo);
                                        return (
                                            <div key={task.id} onClick={() => setSelectedTask(task)} className="bg-[#0f172a] p-3 rounded-lg border border-white/5 hover:border-primary/50 cursor-pointer transition-colors group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex gap-1">
                                                        {task.tags?.map(tag => (
                                                            <span key={tag} className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${tag === 'urgent' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>{tag}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-white font-medium mb-3">{task.content}</p>
                                                <div className="flex justify-between items-center">
                                                    {assignee && <Avatar src={assignee.avatar} size="xs" />}
                                                    {task.dueDate && <span className="text-[10px] text-gray-500"><i className="fas fa-calendar mr-1"></i>{task.dueDate}</span>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <button onClick={() => setShowTaskModal(true)} className="w-full py-2 border border-dashed border-gray-700 rounded-lg text-gray-500 text-xs hover:text-white hover:border-gray-500 transition-colors">+ Add Task</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'code' && (
                    <div className="h-full flex">
                        <div className="w-64 bg-[#1e293b] border-r border-white/5 flex flex-col">
                            <div className="p-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Files</div>
                            <div className="flex-1 overflow-y-auto">
                                {Object.keys(MOCK_CODE_FILES).map(file => (
                                    <div key={file} onClick={() => { setActiveFile(file); setCode(MOCK_CODE_FILES[file as keyof typeof MOCK_CODE_FILES]); }} className={`px-4 py-2 flex items-center gap-2 cursor-pointer text-sm ${activeFile === file ? 'bg-primary/10 text-primary border-r-2 border-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                                        <i className={`fas ${file.endsWith('tsx') ? 'fa-react text-blue-400' : 'fa-code text-blue-300'}`}></i>
                                        {file}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col bg-[#0f172a]">
                            <div className="h-full relative font-mono text-sm">
                                <textarea value={code} onChange={(e) => setCode(e.target.value)} className="w-full h-full bg-transparent text-gray-300 p-4 outline-none resize-none leading-relaxed" spellCheck={false} />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'files' && (
                    <div className="p-6">
                        <div className="mb-4 flex justify-between items-center">
                            <h3 className="text-white font-bold">Project Files</h3>
                            <label className="cursor-pointer">
                                <Button variant="primary" className="!py-2 !px-4 !text-sm"><i className="fas fa-upload mr-2"></i>Upload File</Button>
                                <input type="file" className="hidden" onChange={handleFileUpload} />
                            </label>
                        </div>
                        <div className="bg-[#1e293b] rounded-xl border border-white/5">
                            {uploadedFiles.map(file => (
                                <div key={file.id} className="p-4 border-b border-white/5 last:border-0 flex items-center justify-between hover:bg-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                            <i className="fas fa-file text-blue-400"></i>
                                        </div>
                                        <div>
                                            <p className="text-white font-medium text-sm">{file.name}</p>
                                            <p className="text-gray-500 text-xs">{file.size} • {file.uploader} • {file.date}</p>
                                        </div>
                                    </div>
                                    <button className="text-gray-500 hover:text-white"><i className="fas fa-download"></i></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'activity' && (
                    <div className="p-6">
                        <h3 className="text-white font-bold mb-4">Project Activity</h3>
                        <div className="space-y-3">
                            {activities.map(activity => (
                                <div key={activity.id} className="flex gap-3 items-start">
                                    <Avatar src={activity.avatar} size="sm" />
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-300"><span className="text-white font-bold">{activity.user}</span> {activity.action} {activity.target && <span className="text-primary">{activity.target}</span>}</p>
                                        <p className="text-xs text-gray-500">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Add Task Modal */}
            <Modal isOpen={showTaskModal} onClose={() => setShowTaskModal(false)} title="Add New Task">
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2">Task Title</label>
                        <input value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="Enter task description" className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2">Assign To</label>
                        <select value={newTask.assignee} onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })} className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white">
                            {teamMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2">Due Date</label>
                        <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white" />
                    </div>
                    <Button onClick={handleAddTask} className="w-full">Add Task</Button>
                </div>
            </Modal>

            {/* Team Members Modal */}
            <Modal isOpen={showMemberModal} onClose={() => setShowMemberModal(false)} title="Team Members">
                <div className="space-y-3">
                    {teamMembers.map(member => (
                        <div key={member.id} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Avatar src={member.avatar} size="sm" />
                                    {member.isOnline && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-900"></div>}
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">{member.name}</p>
                                    <p className="text-xs text-gray-500">{member.role}</p>
                                </div>
                            </div>
                            {member.isOnline && <span className="text-xs text-green-400">Online</span>}
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    );
};
