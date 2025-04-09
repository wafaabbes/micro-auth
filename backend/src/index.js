require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Pool } = require('pg');
const authRoutes = require('./routes/authRoutes');

const app = express();

// PostgreSQL pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  database: process.env.DB_NAME || 'micro-auth',
  user: process.env.DB_USER || 'postgres',
  password: String(process.env.DB_PASSWORD || '123'),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000
});

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : 'https://votre-domaine.com',
  credentials: true
}));
app.use(helmet());
app.use(express.json({ limit: '10kb' }));

// Injecte le pool PostgreSQL dans chaque requête
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// Routes
app.use('/api/auth', authRoutes);

// Healthcheck
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(503).json({
      status: 'service_unavailable',
      database: 'disconnected',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Gestion d'erreurs
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err.stack);
  const response = {
    message: 'Une erreur est survenue sur le serveur',
    statusCode: err.statusCode || 500,
    ...(process.env.NODE_ENV === 'development' && {
      error: err.message,
      stack: err.stack
    })
  };
  res.status(response.statusCode).json(response);
});

module.exports = { app, pool };
