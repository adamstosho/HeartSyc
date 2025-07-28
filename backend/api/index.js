const serverless = require('serverless-http');
const connectDB = require('../config/db');
const app = require('../app');

// Connect to database with error handling
const initDB = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection failed:', error.message);
    // Don't throw error, let the app continue without DB
  }
};

// Initialize database
initDB();

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
    message: 'Environment test',
    mongoUri: process.env.MONGO_URI ? 'Set' : 'Not set',
    jwtSecret: process.env.JWT_SECRET ? 'Set' : 'Not set',
    nodeEnv: process.env.NODE_ENV || 'not set'
  });
});

// Export the serverless handler
module.exports = serverless(app);
