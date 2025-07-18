const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const matchRoutes = require('./routes/match');
const chatRoutes = require('./routes/chat');
const adminRoutes = require('./routes/admin');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "https://heartsync-0boj.onrender.com",
  credentials: true
}));

app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error Handler
app.use(errorHandler);

module.exports = app; 