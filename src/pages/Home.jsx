import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import GigCard from '../components/GigCard';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const [gigs, setGigs] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchGigs = async (query = '') => {
        try {
            const { data } = await api.get(`/gigs?search=${query}`);
            setGigs(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGigs();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchGigs(search);
    };

    return (
        <div>
            {/* Hero / Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                        Find Your Next Gig
                    </h1>
                    <p className="text-gray-400">Discover projects or post your own.</p>
                </div>

                {user && (
                    <Link
                        to="/create-gig"
                        className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg shadow-blue-500/25 transition-transform hover:-translate-y-0.5"
                    >
                        + Post a Gig
                    </Link>
                )}
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-10 max-w-2xl">
                <div className="relative">
                    <input
                        type="text"
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none pl-12"
                        placeholder="Search for projects..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <svg className="w-6 h-6 text-gray-500 absolute left-4 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <button type="submit" className="absolute right-2 top-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                        Search
                    </button>
                </div>
            </form>

            {/* Feed */}
            {loading ? (
                <div className="text-center text-gray-500 mt-20">Loading gigs...</div>
            ) : gigs.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">No gigs found. Try adjusting your search.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gigs.map((gig) => (
                        <GigCard key={gig._id} gig={gig} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
