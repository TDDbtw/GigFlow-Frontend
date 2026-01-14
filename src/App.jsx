import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostGig from './pages/PostGig';
import GigDetail from './pages/GigDetail';
import Dashboard from './pages/Dashboard';
import NotificationListener from './components/NotificationListener';

// Auth Wrapper
const AuthCheck = ({ children }) => {
    const { checkUser, loading } = useAuth();

    useEffect(() => {
        checkUser();
    }, []);

    if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
    return children;
};

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <AuthCheck>
                <NotificationListener />
                <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
                    <Navbar />
                    <main className="container mx-auto px-4 py-8">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/gigs/:id" element={<GigDetail />} />
                            <Route path="/create-gig" element={<PrivateRoute><PostGig /></PrivateRoute>} />
                            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                        </Routes>
                    </main>
                </div>
            </AuthCheck>
        </Router>
    );
}

export default App;
