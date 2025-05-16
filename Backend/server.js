import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import jwt from 'jsonwebtoken';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import automationRoutes from './routes/automationRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { authenticateToken } from './middleware/auth.js';
import { setupDueDateAutomations } from './services/automationService.js';
import { initSocketServer } from './websocket/socketServer.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Create HTTP server
const server = http.createServer(app);

// Initialize socket server
initSocketServer(server);

// Enhanced database connection with retry logic
const connectDB = async () => {
  const MAX_RETRIES = 5;
  let retries = 0;
  let connected = false;
  
  while (retries < MAX_RETRIES && !connected) {
    try {
      console.log(`MongoDB connection attempt ${retries + 1}...`);
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB');
      connected = true;
    } catch (err) {
      console.error('MongoDB connection error:', err);
      retries++;
      
      if (retries < MAX_RETRIES) {
        console.log(`Retrying in ${retries * 2} seconds...`);
        await new Promise(resolve => setTimeout(resolve, retries * 2000));
      }
    }
  }
  
  if (!connected) {
    console.error(`Failed to connect to MongoDB after ${MAX_RETRIES} attempts`);
    process.exit(1);
  }
  
  return mongoose.connection;
};

// Call connectDB before setting up routes
connectDB().then(() => {
  // Routes setup
  
  // Auth routes - Generate token for testing
  app.post('/api/auth/token', (req, res) => {
    const { uid, email, name } = req.body;
    
    if (!uid || !email) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    try {
      const token = jwt.sign(
        { uid, email, name }, 
        process.env.JWT_SECRET, 
        { expiresIn: '7d' }
      );
      
      console.log('Token generated for:', email);
      res.json({ token });
    } catch (error) {
      console.error('Token generation error:', error);
      res.status(500).json({ message: 'Error generating token' });
    }
  });

  // Routes
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
  });

  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/tasks', taskRoutes);
  app.use('/api/automations', automationRoutes);
  app.use('/api/comments', commentRoutes);

  // Test authentication route
  app.get('/api/auth/test', authenticateToken, (req, res) => {
    res.json({ message: 'Authentication successful', user: req.user });
  });

  // Add a test endpoint for user creation
  app.post('/api/test/create-user', async (req, res) => {
    try {
      const { uid, email, name } = req.body;
      
      if (!uid || !email) {
        return res.status(400).json({ message: 'UID and email are required' });
      }
      
      const User = mongoose.model('User');
      const user = new User({
        uid,
        email,
        name: name || email.split('@')[0]
      });
      
      await user.save();
      
      res.status(201).json({
        message: 'Test user created successfully',
        user: {
          uid: user.uid,
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      console.error('Error creating test user:', error);
      res.status(500).json({ message: 'Error creating test user', error: error.toString() });
    }
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      message: err.message || 'Something went wrong on the server',
      error: process.env.NODE_ENV === 'production' ? {} : err
    });
  });

  // Start server
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
    
    // Set up the automation scheduler
    setupDueDateAutomations();
  });
}).catch(err => {
  console.error('Failed to start server due to database connection issues:', err);
});
