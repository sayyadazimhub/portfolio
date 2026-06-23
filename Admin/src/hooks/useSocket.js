import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketURL = import.meta.env.VITE_PORTFOLIO_SERVER_URL || 'http://localhost:5000';
    
    console.log('🔌 Connecting to Socket.IO at:', socketURL);
    
    const newSocket = io(socketURL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log('✅ Connected to Socket.IO server, ID:', newSocket.id);
      setIsConnected(true);
      // Join admin room when connected
      console.log('📍 Joining admin-room...');
      newSocket.emit('join-admin-room');
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from Socket.IO server');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('⚠️ Socket.IO connection error:', error);
    });

    newSocket.on('error', (error) => {
      console.error('⚠️ Socket.IO error:', error);
    });

    setSocket(newSocket);

    return () => {
      console.log('🔌 Cleaning up socket connection');
      newSocket.disconnect();
    };
  }, []);

  return { socket, isConnected };
};

export default useSocket;
