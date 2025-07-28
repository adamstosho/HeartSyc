const serverless = require('serverless-http');
const connectDB = require('../config/db');
const app = require('../app');

// Connect to database
connectDB().catch(console.error);

// Add a health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'not set'
  });
});

// Add a test endpoint
app.get('/test', (req, res) => {
  res.status(200).json({ 
    message: 'Backend is working!',
    mongoUri: process.env.MONGO_URI ? 'Set' : 'Not set',
    jwtSecret: process.env.JWT_SECRET ? 'Set' : 'Not set'
  });
});

module.exports = serverless(app);
