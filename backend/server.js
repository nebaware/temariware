require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const { sequelize } = require('./config/db');
require('./models'); // Register models for sync
const { connectRedis, disconnectRedis } = require('./config/redis');
const { apiLimiter, authLimiter } = require('./middleware/rateLimit');

const http = require('http');
const initSocket = require('./utils/socket');

// Initialize Express
const app = express();
const mpesaService = require('./utils/mpesaService');
mpesaService.init();
const server = http.createServer(app);
const io = initSocket(server);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiLimiter); // Apply general rate limiting

// CORS Configuration
const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [
  'http://localhost:3000', 
  'http://localhost:5173', 
  'http://localhost:5174',
  'https://temariware-frontend.onrender.com'
];
// Ensure Render Frontend URL is allowed
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/wallet', require('./routes/wallet'));
app.use('/api/ekub', require('./routes/ekub'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/subscription', require('./routes/subscription'));

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Root Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to TemariWare API',
    version: '1.0.0',
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register'
      },
      users: 'GET /api/users'
    }
  });
});

const path = require('path');

// ... (other imports)

// Static File Serving (Production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));

  app.get('*', (req, res) => {
    // Exclude API routes from wildcard match to verify 404s correctly
    if (req.url.startsWith('/api')) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Cannot ${req.method} ${req.originalUrl}`
      });
    }
    res.sendFile(path.resolve(__dirname, '../', 'dist', 'index.html'));
  });
} else {
  // 404 Handler for API in Dev
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `Cannot ${req.method} ${req.originalUrl}`
    });
  });
}

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
  });
});

// Start Server
const startServer = async () => {
  try {
    await connectRedis();
    await sequelize.authenticate();
    console.log('✅ Database connected');
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced');

    server.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Allowed Origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful Shutdown
process.on('SIGINT', async () => {
  await disconnectRedis();
  process.exit(0);
});

module.exports = app;