import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const getSocketUrl = () =>
  import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api', '')
    : 'http://localhost:5000';

const NotificationListener = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Don't do anything if no user
    if (!user?._id) return;

    // Create fresh socket instance (recommended in most cases)
    const socket = io(getSocketUrl(), {
      withCredentials: true,
      autoConnect: false,               // we control connect manually
      transports: ['websocket', 'polling'], // websocket first is usually better
      reconnection: true,
      reconnectionAttempts: 5,
    });

    socket.connect();
    socket.emit('join', user._id);

    socket.on('notification:hired', (data) => {
      toast.success(data.message ?? 'You have been hired!', {
        position: 'top-right',
        autoClose: 5000,
        theme: 'dark',
      });

      // Optional sound (add check if you really want this)
      const audio = new Audio('/sounds/notification.mp3');
      audio.play().catch((e) => console.log('Audio play failed:', e));
    });

    // Cleanup
    return () => {
      socket.off('notification:hired');
      // If your server supports leaving rooms:
      // socket.emit('leave', user._id);
      socket.disconnect();
      socket.close(); // extra safety
    };
  }, [user?._id]); // ← only re-run when user ID actually changes

  return <ToastContainer limit={3} />;
};

export default NotificationListener;
