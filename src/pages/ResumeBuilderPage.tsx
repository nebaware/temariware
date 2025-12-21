import React, { useState, useContext } from 'react';
import { StoreContext } from '../contexts/StoreContext';
import { generateResume } from '../services/geminiService';
import { Button } from '../components/common/Button';

export const ResumeBuilderPage: React.FC = () => {
    const { state } = useContext(StoreContext);
    const [resume, setResume] = useState('');
    const [loading, setLoading] = useState(false);
    const [template, setTemplate] = useState<'modern' | 'classic' | 'minimal'>('modern');

    const handleGenerate = async () => {
        if (!state.user) return;
        setLoading(true);
        const res = await generateResume(state.user);
        setResume(res);
        setLoading(false);
    }

    const handlePrint = () => {
        window.print();
    }

    const handleDownload = () => {
        const blob = new Blob([resume], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${state.user?.name.replace(/\s/g, '_')}_Resume.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="p-4 pb-24 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">AI Resume Builder</h2>
                {resume && (
                    <div className="flex gap-2">
                        <button onClick={handlePrint} className="text-xs bg-blue-500/20 text-blue-400 px-3 py-2 rounded-lg hover:bg-blue-500/30 transition-colors">
                            <i className="fas fa-print mr-1"></i> Print PDF
                        </button>
                        <button onClick={handleDownload} className="text-xs bg-green-500/20 text-green-400 px-3 py-2 rounded-lg hover:bg-green-500/30 transition-colors">
                            <i className="fas fa-download mr-1"></i> Download
                        </button>
                    </div>
                )}
            </div>

            {!resume ? (
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 p-6 rounded-2xl border border-white/10">
                        <i className="fas fa-file-alt text-4xl text-white/80 mb-3 block"></i>
                        <h3 className="text-white font-bold text-lg mb-2">AI-Powered Resume</h3>
                        <p className="text-gray-300 text-sm mb-4">Generate a professional resume based on your profile, skills, and experience.</p>

                        <div className="mb-4">
                            <label className="block text-xs font-bold text-gray-400 mb-2">SELECT TEMPLATE</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['modern', 'classic', 'minimal'] as const).map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setTemplate(t)}
                                        className={`p-3 rounded-xl border-2 transition-all ${template === t ? 'border-primary bg-primary/10' : 'border-gray-700 bg-black/20'}`}
                                    >
                                        <div className="text-xs font-bold text-white capitalize">{t}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button onClick={handleGenerate} disabled={loading} className="w-full">
                            {loading ? <><i className="fas fa-circle-notch fa-spin mr-2"></i> Generating...</> : <><i className="fas fa-magic mr-2"></i> Generate Resume</>}
                        </Button>
                    </div>

                    <div className="bg-[#1e293b] p-4 rounded-xl border border-white/10">
                        <h4 className="text-white font-bold text-sm mb-3">What's Included:</h4>
                        <ul className="space-y-2 text-xs text-gray-300">
                            <li className="flex items-start gap-2"><i className="fas fa-check text-primary mt-0.5"></i> Professional Summary</li>
                            <li className="flex items-start gap-2"><i className="fas fa-check text-primary mt-0.5"></i> Education & Qualifications</li>
                            <li className="flex items-start gap-2"><i className="fas fa-check text-primary mt-0.5"></i> Technical Skills</li>
                            <li className="flex items-start gap-2"><i className="fas fa-check text-primary mt-0.5"></i> Projects & Experience</li>
                            <li className="flex items-start gap-2"><i className="fas fa-check text-primary mt-0.5"></i> Optimized for Ethiopian Job Market</li>
                        </ul>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="bg-white text-black p-12 rounded-xl shadow-2xl print:shadow-none min-h-[1000px] w-full max-w-[210mm] mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
                        <div
                            className="resume-content text-sm leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: resume }}
                        />
                    </div>
                    <Button onClick={() => setResume('')} variant="outline" className="w-full">
                        <i className="fas fa-redo mr-2"></i> Generate New Resume
                    </Button>
                </div>
            )}

            <style>{`
                .resume-content h2 { font-size: 24px; border-bottom: 2px solid #333; padding-bottom: 5px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; color: #000; }
                .resume-content h3 { font-size: 16px; font-weight: bold; margin-top: 20px; margin-bottom: 8px; text-transform: uppercase; color: #444; border-bottom: 1px solid #eee; padding-bottom: 3px; }
                .resume-content p { margin-bottom: 8px; font-size: 14px; }
                .resume-content ul { list-style-type: disc; padding-left: 20px; margin-bottom: 10px; }
                .resume-content li { margin-bottom: 4px; }
                .resume-header { text-align: center; margin-bottom: 20px; }
                .resume-header h2 { border: none; margin-bottom: 5px; font-size: 28px; color: #000; }
                
                @media print {
                    @page { margin: 0; size: auto; }
                    body { background: white; }
                    body * { visibility: hidden; }
                    .print\\:shadow-none, .print\\:shadow-none * { visibility: visible; }
                    .print\\:shadow-none { 
                        position: absolute; 
                        left: 0; 
                        top: 0; 
                        width: 100%; 
                        margin: 0; 
                        padding: 2cm !important; 
                        box-shadow: none !important; 
                        min-height: 100vh;
                    }
                }
            `}</style>
        </div>
    );
};
