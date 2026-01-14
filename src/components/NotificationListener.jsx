import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const socket = io('http://localhost:5000', {
    autoConnect: false,
    withCredentials: true
});

const NotificationListener = () => {
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            socket.connect();
            socket.emit('join', user._id);

            socket.on('notification:hired', (data) => {
                toast.success(data.message, {
                    position: "top-right",
                    autoClose: 5000,
                    theme: "dark",
                });
                // Optional: Play sound
                const audio = new Audio('/notification.mp3'); // If exists
                audio.play().catch(() => { });
            });

            return () => {
                socket.off('notification:hired');
                socket.disconnect();
            };
        }
    }, [user]);

    return <ToastContainer />;
};

export default NotificationListener;
