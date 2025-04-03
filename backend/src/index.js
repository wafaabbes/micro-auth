require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Pool } = require('pg');
const authRoutes = require('./routes/authRoutes');

// Configuration Express
const app = express();
const PORT = process.env.PORT || 3000;

// Configuration PostgreSQL avec gestion d'erreur améliorée
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

// Test de connexion à la base de données au démarrage
const testDatabaseConnection = async () => {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Connexion à PostgreSQL établie avec succès');
    return true;
  } catch (err) {
    console.error('❌ Erreur de connexion à PostgreSQL:', err.message);
    process.exit(1); // Arrêt de l'application si la DB n'est pas accessible
  }
};

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : 'https://votre-domaine.com',
  credentials: true
}));
app.use(helmet());
app.use(express.json({ limit: '10kb' }));

// Middleware pour injecter le pool de connexions dans les requêtes
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// Routes
app.use('/api/auth', authRoutes);

// Health check amélioré avec vérification DB
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

// Gestion des erreurs centralisée
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

// Démarrage du serveur après vérification de la DB
const startServer = async () => {
  await testDatabaseConnection();
  
  app.listen(PORT, () => {
    console.log(`\n🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`🔍 Environnement: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🗄️ Base de données: ${process.env.DB_NAME}@${process.env.DB_HOST}\n`);
  });
};

startServer();

// Gestion propre des arrêts
process.on('SIGTERM', () => {
  pool.end(() => {
    console.log('Pool PostgreSQL fermé');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  pool.end(() => {
    console.log('Pool PostgreSQL fermé');
    process.exit(0);
  });
});