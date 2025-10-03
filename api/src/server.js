const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined'));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// API Routes (will be added)
app.get('/api/v1', (req, res) => {
  res.json({
    message: 'SSPO Regulamin Management API',
    version: '1.0.0',
    docs: '/api/v1/docs'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(status).json({
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
    status,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║   SSPO Regulamin Management API                           ║
║   Environment: ${process.env.NODE_ENV || 'development'}                                  ║
║   Port: ${PORT}                                             ║
║   Time: ${new Date().toISOString()}              ║
╚═══════════════════════════════════════════════════════════╝
  `);
  
  console.log('📝 API endpoints:');
  console.log(`   - Health: http://localhost:${PORT}/health`);
  console.log(`   - API: http://localhost:${PORT}/api/v1`);
  console.log('');
  console.log('🚀 Server is ready!');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;
