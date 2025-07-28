const serverless = require('serverless-http');
const connectDB = require('../config/db');
const app = require('../app');

// Connect to database
connectDB().catch(console.error);

// Export the serverless function
module.exports = serverless(app);
