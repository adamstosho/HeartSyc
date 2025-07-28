const serverless = require('serverless-http');
const express = require('express');

const app = express();

// Basic middleware
app.use(express.json());

// Test endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Backend is working!',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'not set'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Test environment variables
app.get('/test', (req, res) => {
  res.status(200).json({ 
    message: 'Environment test',
    mongoUri: process.env.MONGO_URI ? 'Set' : 'Not set',
    jwtSecret: process.env.JWT_SECRET ? 'Set' : 'Not set',
    nodeEnv: process.env.NODE_ENV || 'not set'
  });
});

// Catch-all for 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl
  });
});

module.exports = serverless(app);
