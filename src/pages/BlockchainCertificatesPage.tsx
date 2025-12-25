import React, { useState, useContext } from 'react';
import { StoreContext } from '../contexts/StoreContext';
import { ToastContext } from '../contexts/ToastContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

interface Certificate {
    id: string;
    title: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
    blockchainHash: string;
    verificationUrl: string;
    skills: string[];
    type: 'course' | 'skill' | 'achievement' | 'degree';
    status: 'verified' | 'pending' | 'expired';
    metadata: {
        grade?: string;
        hours?: number;
        level?: string;
    };
}

interface VerificationResult {
    isValid: boolean;
    certificate?: Certificate;
    message: string;
}

export const BlockchainCertificatesPage: React.FC = () => {
    const { state } = useContext(StoreContext);
    const { addToast } = useContext(ToastContext);
    const [activeTab, setActiveTab] = useState<'my-certificates' | 'verify' | 'issue' | 'marketplace'>('my-certificates');
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
    const [verificationHash, setVerificationHash] = useState('');
    const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
    const [showCertificateModal, setShowCertificateModal] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    const mockCertificates: Certificate[] = [
        {
            id: '1',
            title: 'React Developer Certification',
            issuer: 'TemariWare Academy',
            issueDate: '2024-01-15',
            blockchainHash: '0x1a2b3c4d5e6f7890abcdef1234567890',
            verificationUrl: 'https://temariware.onrender.com/verify/cert/1',
            skills: ['React', 'JavaScript', 'Frontend Development'],
            type: 'course',
            status: 'verified',
            metadata: {
                grade: 'A+',
                hours: 40,
                level: 'Intermediate'
            }
        },
        {
            id: '2',
            title: 'AI/ML Fundamentals',
            issuer: 'Ethiopian AI Institute',
            issueDate: '2024-02-20',
            blockchainHash: '0x9876543210fedcba0987654321abcdef',
            verificationUrl: 'https://temariware.onrender.com/verify/cert/2',
            skills: ['Machine Learning', 'Python', 'Data Science'],
            type: 'skill',
            status: 'verified',
            metadata: {
                grade: 'B+',
                hours: 60,
                level: 'Beginner'
            }
        },
        {
            id: '3',
            title: 'Hackathon Winner 2024',
            issuer: 'Addis Ababa Tech Hub',
            issueDate: '2024-03-10',
            blockchainHash: '0xabcdef1234567890fedcba0987654321',
            verificationUrl: 'https://temariware.onrender.com/verify/cert/3',
            skills: ['Innovation', 'Problem Solving', 'Teamwork'],
            type: 'achievement',
            status: 'verified',
            metadata: {
                level: 'Advanced'
            }
        }
    ];

    React.useEffect(() => {
        setCertificates(mockCertificates);
    }, []);

    const handleVerifyCertificate = async () => {
        if (!verificationHash.trim()) {
            addToast('Please enter a blockchain hash', 'error');
            return;
        }

        setIsVerifying(true);
        
        // Simulate blockchain verification
        setTimeout(() => {
            const foundCert = mockCertificates.find(cert => 
                cert.blockchainHash.toLowerCase() === verificationHash.toLowerCase()
            );

            if (foundCert) {
                setVerificationResult({
                    isValid: true,
                    certificate: foundCert,
                    message: 'Certificate verified successfully on blockchain'
                });
            } else {
                setVerificationResult({
                    isValid: false,
                    message: 'Certificate not found or invalid hash'
                });
            }
            
            setIsVerifying(false);
        }, 2000);
    };

    const handleShareCertificate = (certificate: Certificate) => {
        const shareUrl = certificate.verificationUrl;
        navigator.clipboard.writeText(shareUrl);
        addToast('Certificate verification URL copied to clipboard', 'success');
    };

    const handleDownloadCertificate = (certificate: Certificate) => {
        addToast('Downloading certificate as PDF...', 'info');
        // Simulate download
        setTimeout(() => {
            addToast('Certificate downloaded successfully!', 'success');
        }, 1500);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'verified': return 'bg-green-500/20 text-green-400';
            case 'pending': return 'bg-yellow-500/20 text-yellow-400';
            case 'expired': return 'bg-red-500/20 text-red-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'course': return '📚';
            case 'skill': return '🎯';
            case 'achievement': return '🏆';
            case 'degree': return '🎓';
            default: return '📜';
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 pb-24">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold mb-2">Blockchain Certificates</h1>
                    <p className="text-gray-400">Secure, verifiable digital credentials on blockchain</p>
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-800 p-1 rounded-lg mb-6 overflow-x-auto">
                    {[
                        { key: 'my-certificates', label: 'My Certificates', icon: '📜' },
                        { key: 'verify', label: 'Verify', icon: '🔍' },
                        { key: 'issue', label: 'Issue', icon: '✍️' },
                        { key: 'marketplace', label: 'Marketplace', icon: '🏪' }
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as any)}
                            className={`flex-1 py-2 px-3 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
                                activeTab === tab.key ? 'bg-primary text-black' : 'text-gray-400'
                            }`}
                        >
                            <span className="mr-1">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* My Certificates Tab */}
                {activeTab === 'my-certificates' && (
                    <div className="space-y-6">
                        <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/30">
                            <div className="flex items-center gap-4">
                                <div className="text-3xl">🔐</div>
                                <div>
                                    <h3 className="font-bold">Blockchain Secured</h3>
                                    <p className="text-sm text-gray-300">
                                        All certificates are immutably stored on blockchain for lifetime verification
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {certificates.map(certificate => (
                                <Card key={certificate.id} className="hover:border-primary/50 transition-all cursor-pointer"
                                      onClick={() => {
                                          setSelectedCertificate(certificate);
                                          setShowCertificateModal(true);
                                      }}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="text-2xl">{getTypeIcon(certificate.type)}</div>
                                            <div>
                                                <h3 className="font-bold text-sm">{certificate.title}</h3>
                                                <p className="text-xs text-gray-400">{certificate.issuer}</p>
                                            </div>
                                        </div>
                                        <Badge color={getStatusColor(certificate.status)}>
                                            {certificate.status}
                                        </Badge>
                                    </div>

                                    <div className="mb-3">
                                        <div className="flex flex-wrap gap-1">
                                            {certificate.skills.slice(0, 3).map(skill => (
                                                <span key={skill} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                                                    {skill}
                                                </span>
                                            ))}
                                            {certificate.skills.length > 3 && (
                                                <span className="text-xs text-gray-400">+{certificate.skills.length - 3} more</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center text-xs text-gray-400">
                                        <span>Issued: {new Date(certificate.issueDate).toLocaleDateString()}</span>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleShareCertificate(certificate);
                                                }}
                                                className="text-blue-400 hover:text-blue-300"
                                            >
                                                <i className="fas fa-share"></i>
                                            </button>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDownloadCertificate(certificate);
                                                }}
                                                className="text-green-400 hover:text-green-300"
                                            >
                                                <i className="fas fa-download"></i>
                                            </button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {certificates.length === 0 && (
                            <Card className="text-center py-12">
                                <div className="text-4xl mb-4">📜</div>
                                <h3 className="font-bold mb-2">No Certificates Yet</h3>
                                <p className="text-gray-400">Complete courses and earn achievements to get certificates</p>
                            </Card>
                        )}
                    </div>
                )}

                {/* Verify Tab */}
                {activeTab === 'verify' && (
                    <div className="space-y-6">
                        <Card>
                            <h3 className="font-bold mb-4">Verify Certificate</h3>
                            <p className="text-sm text-gray-400 mb-4">
                                Enter the blockchain hash to verify certificate authenticity
                            </p>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">
                                        Blockchain Hash
                                    </label>
                                    <input
                                        value={verificationHash}
                                        onChange={(e) => setVerificationHash(e.target.value)}
                                        placeholder="0x1a2b3c4d5e6f7890abcdef1234567890"
                                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-primary outline-none font-mono text-sm"
                                    />
                                </div>
                                
                                <Button
                                    onClick={handleVerifyCertificate}
                                    disabled={isVerifying}
                                    className="w-full"
                                >
                                    {isVerifying ? (
                                        <>
                                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                            Verifying on Blockchain...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-search mr-2"></i>
                                            Verify Certificate
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Card>

                        {verificationResult && (
                            <Card className={`border-2 ${verificationResult.isValid ? 'border-green-500/50 bg-green-900/20' : 'border-red-500/50 bg-red-900/20'}`}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`text-3xl ${verificationResult.isValid ? 'text-green-400' : 'text-red-400'}`}>
                                        {verificationResult.isValid ? '✅' : '❌'}
                                    </div>
                                    <div>
                                        <h3 className={`font-bold ${verificationResult.isValid ? 'text-green-400' : 'text-red-400'}`}>
                                            {verificationResult.isValid ? 'Certificate Verified' : 'Verification Failed'}
                                        </h3>
                                        <p className="text-sm text-gray-300">{verificationResult.message}</p>
                                    </div>
                                </div>

                                {verificationResult.certificate && (
                                    <div className="bg-black/30 p-4 rounded-lg">
                                        <h4 className="font-bold mb-2">{verificationResult.certificate.title}</h4>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-400">Issuer</p>
                                                <p className="font-bold">{verificationResult.certificate.issuer}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Issue Date</p>
                                                <p className="font-bold">{new Date(verificationResult.certificate.issueDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        )}
                    </div>
                )}

                {/* Issue Tab */}
                {activeTab === 'issue' && (
                    <div className="space-y-6">
                        <Card>
                            <h3 className="font-bold mb-4">Issue New Certificate</h3>
                            <p className="text-sm text-gray-400 mb-4">
                                Create and issue blockchain-secured certificates
                            </p>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">
                                        Certificate Title
                                    </label>
                                    <input
                                        placeholder="e.g., React Developer Certification"
                                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">
                                        Recipient Email
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="recipient@example.com"
                                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">
                                        Skills Certified
                                    </label>
                                    <input
                                        placeholder="React, JavaScript, Frontend Development"
                                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                                    />
                                </div>
                                
                                <Button
                                    onClick={() => addToast('Certificate issued and recorded on blockchain!', 'success')}
                                    className="w-full"
                                >
                                    <i className="fas fa-certificate mr-2"></i>
                                    Issue Certificate
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Marketplace Tab */}
                {activeTab === 'marketplace' && (
                    <div className="space-y-6">
                        <Card>
                            <h3 className="font-bold mb-4">Certificate Marketplace</h3>
                            <p className="text-sm text-gray-400 mb-4">
                                Discover and earn industry-recognized certificates
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { title: 'AWS Cloud Practitioner', price: '2,500 ETB', duration: '40 hours' },
                                    { title: 'Google Analytics Certified', price: '1,800 ETB', duration: '25 hours' },
                                    { title: 'Microsoft Azure Fundamentals', price: '3,000 ETB', duration: '50 hours' },
                                    { title: 'Ethereum Developer', price: '4,500 ETB', duration: '80 hours' }
                                ].map((cert, index) => (
                                    <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-600 hover:border-primary/50 transition-all">
                                        <h4 className="font-bold mb-2">{cert.title}</h4>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-400">{cert.duration}</span>
                                            <span className="text-primary font-bold">{cert.price}</span>
                                        </div>
                                        <Button variant="outline" className="w-full mt-3 !py-1 !text-xs">
                                            Enroll Now
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}

                {/* Certificate Detail Modal */}
                <Modal
                    isOpen={showCertificateModal}
                    onClose={() => setShowCertificateModal(false)}
                    title="Certificate Details"
                >
                    {selectedCertificate && (
                        <div className="space-y-4">
                            <div className="text-center">
                                <div className="text-4xl mb-2">{getTypeIcon(selectedCertificate.type)}</div>
                                <h3 className="font-bold text-lg">{selectedCertificate.title}</h3>
                                <p className="text-gray-400">{selectedCertificate.issuer}</p>
                            </div>
                            
                            <div className="bg-gray-800 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">Blockchain Information</h4>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="text-gray-400">Hash: </span>
                                        <span className="font-mono text-xs break-all">{selectedCertificate.blockchainHash}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Verification URL: </span>
                                        <span className="text-blue-400 text-xs break-all">{selectedCertificate.verificationUrl}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="font-bold mb-2">Skills Certified</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedCertificate.skills.map(skill => (
                                        <span key={skill} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="flex gap-3 pt-4">
                                <Button
                                    onClick={() => handleShareCertificate(selectedCertificate)}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    <i className="fas fa-share mr-2"></i>Share
                                </Button>
                                <Button
                                    onClick={() => handleDownloadCertificate(selectedCertificate)}
                                    className="flex-1"
                                >
                                    <i className="fas fa-download mr-2"></i>Download
                                </Button>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
};