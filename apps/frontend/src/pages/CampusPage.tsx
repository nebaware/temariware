import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../contexts/StoreContext';
import { ToastContext } from '../contexts/ToastContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Avatar } from '../components/common/Avatar';
import { Modal } from '../components/common/Modal';

interface CampusCommunity {
    id: string;
    name: string;
    university: string;
    type: 'Department' | 'Study Group' | 'Club' | 'Class';
    members: number;
    description: string;
    icon: string;
    isJoined: boolean;
}

interface Post {
    id: string;
    author: string;
    avatar: string;
    content: string;
    communityName: string;
    timestamp: string;
    likes: number;
    comments: number;
}

interface MarketplaceItem {
    id: string;
    title: string;
    price: number;
    category: 'Books' | 'Tools' | 'Electronics' | 'Other';
    image: string;
    seller: string;
}

export const CampusPage: React.FC = () => {
    const { state } = useContext(StoreContext);
    const { addToast } = useContext(ToastContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'my-communities' | 'discover' | 'feed' | 'marketplace'>('feed');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newPost, setNewPost] = useState('');

    const [communities] = useState<CampusCommunity[]>([
        { id: '1', name: 'CS Department - AAU', university: 'Addis Ababa University', type: 'Department', members: 450, description: 'Computer Science students discussion and resources', icon: 'fa-code', isJoined: true },
        { id: '2', name: 'Data Structures Study Group', university: 'Addis Ababa University', type: 'Study Group', members: 85, description: 'Weekly DSA practice and peer learning', icon: 'fa-book', isJoined: true },
        { id: '3', name: 'AAU Chess Club', university: 'Addis Ababa University', type: 'Club', members: 120, description: 'Chess enthusiasts and tournament updates', icon: 'fa-chess', isJoined: false },
        { id: '4', name: 'Software Engineering 2024', university: 'Addis Ababa University', type: 'Class', members: 60, description: 'SE course materials and group projects', icon: 'fa-laptop-code', isJoined: true },
    ]);

    const [marketplaceItems] = useState<MarketplaceItem[]>([
        { id: '1', title: 'Data Structures Textbook', price: 350, category: 'Books', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', seller: 'Abebe K.' },
        { id: '2', title: 'Engineering Calculator', price: 1200, category: 'Tools', image: 'https://images.unsplash.com/photo-1574607383476-f517f260d30b?w=400', seller: 'Sara T.' },
        { id: '3', title: 'Wireless Mouse', price: 400, category: 'Electronics', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', seller: 'Dawit M.' },
    ]);

    const [posts] = useState<Post[]>([
        { id: '1', author: 'Kidus A.', avatar: 'https://i.pravatar.cc/150?u=kidus', content: 'Anyone up for a DSA practice session this weekend? DM me!', communityName: 'Data Structures Study Group', timestamp: '2 hours ago', likes: 15, comments: 5 },
        { id: '2', author: 'Meron T.', avatar: 'https://i.pravatar.cc/150?u=meron', content: 'Project 3 submission deadline extended to Friday. Check the portal!', communityName: 'Software Engineering 2024', timestamp: '4 hours ago', likes: 32, comments: 8 },
        { id: '3', author: 'Dagim S.', avatar: 'https://i.pravatar.cc/150?u=dagim', content: 'Looking for teammates for the hackathon next month. Need backend dev!', communityName: 'CS Department - AAU', timestamp: '1 day ago', likes: 24, comments: 12 },
    ]);

    const myCommunities = communities.filter(c => c.isJoined);

    const handleJoin = (community: CampusCommunity) => {
        addToast(`Joined "${community.name}"!`, 'success');
    };

    const handlePost = () => {
        if (!newPost.trim()) {
            addToast('Please write something', 'error');
            return;
        }
        addToast('Post published!', 'success');
        setNewPost('');
        setShowCreateModal(false);
    };

    const handleBuyItem = (item: MarketplaceItem) => {
        addToast(`Order request sent to ${item.seller} for ${item.title}!`, 'success');
    };

    return (
        <div className="min-h-screen bg-black pb-24">
            {/* Header */}
            <div className="p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-b border-white/10">
                <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white mb-4">
                    <i className="fas fa-arrow-left mr-2"></i> Back
                </button>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Campus Communities</h1>
                        <p className="text-gray-400">Connect with your university</p>
                    </div>
                    <Button onClick={() => setShowCreateModal(true)} variant="primary" className="!py-2 !px-4">
                        <i className="fas fa-plus mr-2"></i> {activeTab === 'marketplace' ? 'Sell' : 'Post'}
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="p-6 grid grid-cols-3 gap-3">
                <Card className="!p-3 text-center">
                    <p className="text-2xl font-bold text-white">{myCommunities.length}</p>
                    <p className="text-xs text-gray-400">Joined</p>
                </Card>
                <Card className="!p-3 text-center">
                    <p className="text-2xl font-bold text-primary">{communities.length}</p>
                    <p className="text-xs text-gray-400">Available</p>
                </Card>
                <Card className="!p-3 text-center">
                    <p className="text-2xl font-bold text-blue-400">{posts.length}</p>
                    <p className="text-xs text-gray-400">Recent Posts</p>
                </Card>
            </div>

            {/* Tabs */}
            <div className="px-6 flex gap-4 border-b border-white/10 overflow-x-auto whitespace-nowrap scrollbar-hide">
                {['feed', 'my-communities', 'discover', 'marketplace'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`pb-3 text-sm font-bold border-b-2 transition-colors capitalize ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}
                    >
                        {tab.replace('-', ' ')}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
                {activeTab === 'feed' && (
                    <>
                        {posts.map(post => (
                            <Card key={post.id} className="!p-5">
                                <div className="flex items-start gap-3 mb-3">
                                    <Avatar src={post.avatar} size="sm" />
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="text-white font-bold text-sm">{post.author}</h4>
                                                <p className="text-xs text-gray-400">{post.communityName} • {post.timestamp}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-300 mt-2">{post.content}</p>
                                        <div className="flex gap-4 mt-3">
                                            <button className="text-xs text-gray-400 hover:text-primary">
                                                <i className="fas fa-heart mr-1"></i> {post.likes}
                                            </button>
                                            <button className="text-xs text-gray-400 hover:text-primary">
                                                <i className="fas fa-comment mr-1"></i> {post.comments}
                                            </button>
                                            <button className="text-xs text-gray-400 hover:text-primary">
                                                <i className="fas fa-share mr-1"></i> Share
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </>
                )}

                {activeTab === 'my-communities' && (
                    <>
                        {myCommunities.map(community => (
                            <Card key={community.id} className="!p-5">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                                        <i className={`fas ${community.icon} text-primary text-xl`}></i>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-bold">{community.name}</h4>
                                        <p className="text-xs text-gray-400 mb-2">{community.university}</p>
                                        <div className="flex gap-2">
                                            <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold">{community.type}</span>
                                            <span className="text-xs text-gray-500"><i className="fas fa-users mr-1"></i>{community.members} members</span>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="!py-1 !px-3 !text-xs">View</Button>
                                </div>
                            </Card>
                        ))}
                    </>
                )}

                {activeTab === 'discover' && (
                    <>
                        {communities.filter(c => !c.isJoined).map(community => (
                            <Card key={community.id} className="!p-5">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                                        <i className={`fas ${community.icon} text-primary text-xl`}></i>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-bold">{community.name}</h4>
                                        <p className="text-xs text-gray-400 mb-1">{community.university}</p>
                                        <p className="text-xs text-gray-500 mb-2">{community.description}</p>
                                        <div className="flex gap-2">
                                            <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold">{community.type}</span>
                                            <span className="text-xs text-gray-500"><i className="fas fa-users mr-1"></i>{community.members} members</span>
                                        </div>
                                    </div>
                                    <Button onClick={() => handleJoin(community)} variant="primary" className="!py-2 !px-3 !text-xs">
                                        <i className="fas fa-plus mr-1"></i> Join
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </>
                )}

                {activeTab === 'marketplace' && (
                    <div className="grid grid-cols-2 gap-3">
                        {marketplaceItems.map(item => (
                            <Card key={item.id} className="!p-0 overflow-hidden flex flex-col">
                                <img src={item.image} alt={item.title} className="w-full h-24 object-cover" />
                                <div className="p-3 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="text-white font-bold text-xs truncate">{item.title}</h4>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mb-2">By {item.seller}</p>
                                    <div className="mt-auto flex justify-between items-center">
                                        <span className="text-primary font-bold text-xs">{item.price} ETB</span>
                                        <Button onClick={() => handleBuyItem(item)} variant="outline" className="!py-1 !px-2 !text-[10px]">Buy</Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>


            {/* Create Post Modal */}
            <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Post">
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2">Community</label>
                        <select className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white">
                            {myCommunities.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2">What's on your mind?</label>
                        <textarea
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            className="w-full h-32 bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white resize-none"
                            placeholder="Share something with your community..."
                        />
                    </div>
                    <Button onClick={handlePost} className="w-full">
                        <i className="fas fa-paper-plane mr-2"></i> Post
                    </Button>
                </div>
            </Modal>
        </div>
    );
};
