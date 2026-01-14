import { Link } from 'react-router-dom';

const GigCard = ({ gig }) => {
    return (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all shadow-lg hover:shadow-blue-500/10 group">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{gig.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${gig.status === 'open'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-gray-600/20 text-gray-400 border border-gray-600/20'
                    }`}>
                    {gig.status.toUpperCase()}
                </span>
            </div>

            <p className="text-gray-400 mb-6 line-clamp-3 text-sm h-14">
                {gig.description}
            </p>

            <div className="flex items-center justify-between mt-auto">
                <div className="text-white font-medium">
                    Budget: <span className="text-green-400">${gig.budget}</span>
                </div>

                <Link
                    to={`/gigs/${gig._id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                    View Details
                </Link>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-500">
                Posted by {gig.owner?.name || 'Unknown'} • {new Date(gig.createdAt).toLocaleDateString()}
            </div>
        </div>
    );
};

export default GigCard;
