import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        'http://localhost:5173',  // Client
        'http://localhost:5174',  // Admin Dashboard
        'https://portfolio-admin-owiw.onrender.com', // Admin Dashboard Render
        process.env.FRONTEND_URL,
      ].filter(Boolean),
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('✅ User connected:', socket.id);

    // Join admin room
    socket.on('join-admin-room', () => {
      socket.join('admin-room');
      console.log('📍 Socket', socket.id, 'joined admin-room');
    });

    // Join specific user room
    socket.on('join-user-room', (userId) => {
      socket.join(`user-${userId}`);
      console.log(`Socket ${socket.id} joined user-${userId}`);
    });

    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};