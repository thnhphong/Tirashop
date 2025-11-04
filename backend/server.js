// server.js (with path import fixed)
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db');
const db = require('./models');
const staticFilesMiddleware = require('./middleware/staticFile');
const orderRoutes = require('./routers/orderRoutes');
const app = express();
console.log('JWT_SECRET:', process.env.JWT_SECRET);

// 1. CORS middleware should be first
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  exposedHeaders: ['Content-Disposition']
}));

staticFilesMiddleware(app);

// 2. Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Static files middleware - combine both static and CORS handling
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// 4. Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

const productRoutes = require('./routers/productRoutes');
const categoryRoutes = require('./routers/categoryRoutes');
const customerRoutes = require('./routers/customerRoutes');
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'TiraShop API is running!',
    database: 'Connected to PostgreSQL',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    await db.sequelize.authenticate();
    const categories = await db.Category.findAll();
    res.status(200).json({
      success: true,
      message: 'Database connection successful!',
      categoriesCount: categories.length,
      categories,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ 
    success: false,
    error: 'Internal server error',
    message: err.message 
  });
});

// Start server
const PORT = process.env.PORT;

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} in use. Try PORT=5000 npm start`);
      } else {
        console.error('❌ Server error:', err);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`${signal} received. Shutting down...`);
  try {
    await db.sequelize.close();
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));