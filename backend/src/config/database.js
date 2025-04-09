const { Pool } = require('pg');

// Configuration du pool de connexions
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'micro-auth',
  password: process.env.DB_PASSWORD || '123',
  port: process.env.DB_PORT || 5432,
  // Ajoutez ces configurations pour une meilleure gestion du pool
  min: 0,
  idleTimeoutMillis: 1000,
  connectionTimeoutMillis: 1000,
});

// Test de connexion async/await
const testConnection = async () => {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT NOW()');
    console.log('✅ Connexion à PostgreSQL établie avec succès');
    return true;
  } catch (err) {
    console.error('❌ Erreur de connexion à PostgreSQL:', err.message);
    throw err;
  } finally {
    client.release();
  }
};

// Fonction pour fermer proprement le pool
const closePool = async () => {
  try {
    await pool.end();
    console.log('Pool PostgreSQL fermé avec succès');
    return true;
  } catch (err) {
    console.error('Erreur lors de la fermeture du pool:', err);
    throw err;
  }
};

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  testConnection,
  closePool
};