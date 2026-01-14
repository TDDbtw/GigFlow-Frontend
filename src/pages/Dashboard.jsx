import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('gigs');
    const [myGigs, setMyGigs] = useState([]);
    const [myBids, setMyBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    // For Editing
    const [isEditing, setIsEditing] = useState(null); // ID of gig being edited
    const [editForm, setEditForm] = useState({ title: '', description: '', budget: '' });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [gigsRes, bidsRes] = await Promise.all([
                api.get('/gigs/my'),
                api.get('/bids/my')
            ]);
            setMyGigs(gigsRes.data);
            setMyBids(bidsRes.data);
        } catch (error) {
            toast.error('Failed to load dashboard data');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteGig = async (id) => {
        if (!window.confirm('Are you sure you want to delete this gig?')) return;
        try {
            await api.delete(`/gigs/${id}`);
            setMyGigs(myGigs.filter(g => g._id !== id));
            toast.success('Gig deleted successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete gig');
        }
    };

    const handleEditClick = (gig) => {
        setIsEditing(gig._id);
        setEditForm({ title: gig.title, description: gig.description, budget: gig.budget });
    };

    const handleUpdateGig = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.patch(`/gigs/${isEditing}`, editForm);
            setMyGigs(myGigs.map(g => g._id === isEditing ? data : g));
            setIsEditing(null);
            toast.success('Gig updated successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update gig');
        }
    };

    if (loading) return <div className="text-center text-gray-500 mt-20">Loading dashboard...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-white">My Dashboard</h1>

            {/* Tabs */}
            <div className="flex space-x-6 mb-8 border-b border-gray-700">
                <button
                    onClick={() => setActiveTab('gigs')}
                    className={`pb-3 px-2 text-lg font-medium transition-colors ${activeTab === 'gigs' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
                >
                    My Gigs ({myGigs.length})
                </button>
                <button
                    onClick={() => setActiveTab('applications')}
                    className={`pb-3 px-2 text-lg font-medium transition-colors ${activeTab === 'applications' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
                >
                    My Applications ({myBids.length})
                </button>
            </div>

            {/* Content */}
            <div className="min-h-[400px]">
                {activeTab === 'gigs' && (
                    <div className="grid gap-6">
                        {myGigs.length === 0 ? <p className="text-gray-500">You haven't posted any gigs yet.</p> : (
                            myGigs.map(gig => (
                                <div key={gig._id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                                    {isEditing === gig._id ? (
                                        <form onSubmit={handleUpdateGig} className="space-y-4">
                                            <input
                                                type="text"
                                                value={editForm.title}
                                                onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                                                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white"
                                            />
                                            <textarea
                                                value={editForm.description}
                                                onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white"
                                                rows="3"
                                            />
                                            <input
                                                type="number"
                                                value={editForm.budget}
                                                onChange={e => setEditForm({ ...editForm, budget: e.target.value })}
                                                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white"
                                            />
                                            <div className="flex gap-2">
                                                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
                                                <button type="button" onClick={() => setIsEditing(null)} className="bg-gray-600 text-white px-4 py-2 rounded">Cancel</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <>
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-xl font-bold text-white mb-2">{gig.title}</h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${gig.status === 'open' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                    {gig.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 mb-4 line-clamp-2">{gig.description}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-green-400 font-bold">${gig.budget}</span>
                                                <div className="flex gap-3">
                                                    <Link to={`/gigs/${gig._id}`} className="text-blue-400 hover:text-blue-300">View Details</Link>
                                                    {gig.status === 'open' && (
                                                        <>
                                                            <button onClick={() => handleEditClick(gig)} className="text-yellow-400 hover:text-yellow-300">Edit</button>
                                                            <button onClick={() => handleDeleteGig(gig._id)} className="text-red-400 hover:text-red-300">Delete</button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'applications' && (
                    <div className="grid gap-6">
                        {myBids.length === 0 ? <p className="text-gray-500">You haven't bid on any gigs yet.</p> : (
                            myBids.map(bid => (
                                <div key={bid._id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1">
                                            Application for: <Link to={`/gigs/${bid.gig?._id}`} className="text-blue-400 hover:underline">{bid.gig?.title || 'Unknown Gig'}</Link>
                                        </h3>
                                        <p className="text-gray-400 text-sm">Gig Status: {bid.gig?.status.toUpperCase()}</p>
                                        <p className="text-gray-400 text-sm mt-2">Your Pitch: "{bid.message}"</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="mb-2 text-xl font-bold text-green-400">${bid.price}</div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${bid.status === 'hired' ? 'bg-green-500/20 text-green-400 border border-green-500' :
                                                bid.status === 'rejected' ? 'bg-red-500/20 text-red-500' : 'bg-gray-600/20 text-gray-400'
                                            }`}>
                                            {bid.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
