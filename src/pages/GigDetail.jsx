import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const GigDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [gig, setGig] = useState(null);
    const [bids, setBids] = useState([]);
    const [myBid, setMyBid] = useState(null);
    const [bidMessage, setBidMessage] = useState('');
    const [bidPrice, setBidPrice] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGigAndBids = async () => {
            try {
                const { data } = await api.get(`/gigs/${id}`);
                setGig(data);

                if (user) {
                    if (data.owner._id === user._id) {
                        // If owner, get all bids
                        const bidsRes = await api.get(`/bids/${id}`);
                        setBids(bidsRes.data);
                    } else {
                        // If freelancer, check if I have a bid
                        const myBidRes = await api.get(`/bids/${id}/my`);
                        setMyBid(myBidRes.data);
                    }
                }
            } catch (err) {
                toast.error('Failed to load gig details');
            } finally {
                setLoading(false);
            }
        };
        fetchGigAndBids();
    }, [id, user]);

    const handlePlaceBid = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/bids', {
                gigId: id,
                message: bidMessage,
                price: bidPrice
            });
            toast.success('Bid placed successfully!');
            setMyBid(data); // Show the bid immediately
            setBidMessage('');
            setBidPrice('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to place bid');
        }
    };

    const handleHire = async (bidId) => {
        if (!window.confirm('Are you sure you want to hire this freelancer?')) return;

        try {
            const { data } = await api.patch(`/bids/${bidId}/hire`);
            setGig(data.gig);
            setBids(bids.map(bid => {
                if (bid._id === bidId) return { ...bid, status: 'hired' };
                return { ...bid, status: 'rejected' };
            }));
            toast.success('Freelancer hired successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Hiring failed');
        }
    };

    if (loading) return <div className="text-center text-white mt-10">Loading...</div>;
    if (!gig) return <div className="text-center text-red-500 mt-10">Gig not found</div>;

    const isOwner = user && gig.owner._id === user._id;
    const isAssigned = gig.status === 'assigned';

    return (
        <div className="max-w-4xl mx-auto text-white">
            {/* Gig Header */}
            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-xl mb-8">
                <div className="flex justify-between items-start mb-4">
                    <h1 className="text-3xl font-bold">{gig.title}</h1>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${isAssigned ? 'bg-blue-600' : 'bg-green-600'
                        }`}>
                        {gig.status.toUpperCase()}
                    </span>
                </div>

                <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                    {gig.description}
                </p>

                <div className="flex border-t border-gray-700 pt-6 justify-between items-center text-gray-400">
                    <div>Budget: <span className="text-green-400 text-xl font-bold">${gig.budget}</span></div>
                    <div>Posted by: {gig.owner.name}</div>
                </div>
            </div>

            {/* Logic Split: Owner vs Freelancer */}
            {isOwner ? (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">
                        Received Bids ({bids.length})
                    </h2>
                    {bids.length === 0 ? (
                        <p className="text-gray-500">No bids yet.</p>
                    ) : (
                        bids.map(bid => (
                            <div key={bid._id} className={`bg-gray-800 p-6 rounded-xl border ${bid.status === 'hired' ? 'border-green-500' : 'border-gray-700'
                                } flex justify-between items-center`}>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-bold text-lg">{bid.freelancer.name}</h3>
                                        <span className="bg-gray-700 text-xs px-2 py-1 rounded">{bid.status}</span>
                                    </div>
                                    <p className="text-gray-300 mb-2">"{bid.message}"</p>
                                    <div className="text-green-400 font-bold">Bid: ${bid.price}</div>
                                </div>

                                {gig.status === 'open' && bid.status === 'pending' && (
                                    <button
                                        onClick={() => handleHire(bid._id)}
                                        className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg"
                                    >
                                        Hire
                                    </button>
                                )}

                                {bid.status === 'hired' && (
                                    <div className="ml-4 text-green-500 font-bold border border-green-500 px-4 py-2 rounded-lg">
                                        Winner
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            ) : (
                /* Freelancer View */
                <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-xl">
                    {/* Check if user already bid */}
                    {myBid ? (
                        <div>
                            <h2 className="text-2xl font-bold mb-6 text-green-400">Your Bid</h2>
                            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="text-xl font-bold text-white">Bid Price: <span className="text-green-400">${myBid.price}</span></div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${myBid.status === 'hired' ? 'bg-green-500/20 text-green-400 border border-green-500' :
                                            myBid.status === 'rejected' ? 'bg-red-500/20 text-red-500' : 'bg-gray-600/20 text-gray-400'
                                        }`}>
                                        {myBid.status.toUpperCase()}
                                    </span>
                                </div>
                                <p className="text-gray-300">"{myBid.message}"</p>
                                <p className="text-gray-500 text-xs mt-4">Submitted on {new Date(myBid.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold mb-6">Place a Bid</h2>
                            {isAssigned ? (
                                <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-500 p-4 rounded-lg">
                                    This gig has already been assigned to another freelancer.
                                </div>
                            ) : (
                                <form onSubmit={handlePlaceBid} className="space-y-4">
                                    <div>
                                        <label className="block text-gray-400 mb-1">Your Pitch</label>
                                        <textarea
                                            required
                                            rows="4"
                                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            placeholder="Why are you the best fit?"
                                            value={bidMessage}
                                            onChange={(e) => setBidMessage(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 mb-1">Your Price ($)</label>
                                        <input
                                            type="number"
                                            required
                                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            value={bidPrice}
                                            onChange={(e) => setBidPrice(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-green-500/20"
                                    >
                                        Submit Bid
                                    </button>
                                </form>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default GigDetail;
