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
  'https://temariware-frontend-exz5.onrender.com',
  'https://temariware-frontend-omek.onrender.com'
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
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/dev', require('./routes/dev'));
app.use('/api/docs', require('./routes/docs'));
app.use('/api/test', require('./routes/test'));
app.use('/api/emergency', require('./routes/emergency'));
app.use('/api/simple', require('./routes/simple'));
app.use('/api/demo', require('./routes/demo'));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'TemariWare API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Simple ping endpoint
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// Root Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to TemariWare API',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        changePassword: 'POST /api/auth/change-password'
      },
      users: 'GET /api/users',
      jobs: 'GET /api/jobs',
      courses: 'GET /api/courses',
      wallet: 'GET /api/wallet',
      health: 'GET /health'
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
    // Skip Redis and database connections that might fail
    console.log('🚀 Starting TemariWare API server...');
    
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`\n✅ Server running on port ${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 CORS Origins: ${allowedOrigins.join(', ')}`);
      
      // Try to connect to services after server is running
      setTimeout(async () => {
        try {
          await connectRedis();
        } catch (e) {
          console.log('⚠️ Redis connection skipped');
        }
        
        try {
          await sequelize.authenticate();
          console.log('✅ Database connected');
          await sequelize.sync({ alter: true });
          console.log('✅ Database synced');
        } catch (e) {
          console.log('⚠️ Database connection failed, using mock data');
        }
      }, 1000);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful Shutdown
process.on('SIGINT', async () => {
  try {
    await disconnectRedis();
  } catch (e) {
    console.log('Redis already disconnected');
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  try {
    await disconnectRedis();
  } catch (e) {
    console.log('Redis already disconnected');
  }
  process.exit(0);
});

module.exports = app;