import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let io;

export const initSocketServer = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  });

  // Socket authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.user.email);
    
    // Join user to their personal room
    socket.join(`user:${socket.user.uid}`);
    
    // Handle project room subscription
    socket.on('join-project', (projectId) => {
      socket.join(`project:${projectId}`);
      console.log(`${socket.user.email} joined project ${projectId}`);
    });
    
    socket.on('leave-project', (projectId) => {
      socket.leave(`project:${projectId}`);
      console.log(`${socket.user.email} left project ${projectId}`);
    });
    
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.user.email);
    });
  });
  
  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};
