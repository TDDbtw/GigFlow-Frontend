import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-gray-800 border-b border-gray-700 shadow-lg sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 hover:scale-105 transition-transform">
                    GigFlow
                </Link>

                {/* Links */}
                <div className="flex items-center space-x-6">
                    <Link to="/" className="text-gray-300 hover:text-white transition-colors">Find Gigs</Link>

                    {user ? (
                        <>
                            <span className="text-gray-400 hidden md:block">Welcome, {user.name}</span>
                            <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
                            <button
                                onClick={logout}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link>
                            <Link
                                to="/register"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-transform transform hover:-translate-y-0.5 shadow-lg shadow-blue-500/20"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
