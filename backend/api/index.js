const serverless = require('serverless-http');
const connectDB = require('../config/db');
const app = require('../app');

connectDB(); 

module.exports = serverless(app);
