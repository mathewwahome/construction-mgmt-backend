import app from './app';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/database';
import { connectRedis } from './config/redis';

const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST']
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  // Task update events
  socket.on('task:update', (data) => {
    io.emit('task:updated', data);
  });
});

// Start server
const startServer = async () => {
  try {
    // Connect to databases
    await connectDB();
    await connectRedis();

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export { io };