const { app } = require('./index');
const db = require('./config/database');

const PORT = process.env.PORT || 3000;
let server;

const startServer = async () => {
  try {
    await db.testConnection();
    
    server = app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`🔍 Environnement: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️ Base de données: ${process.env.DB_NAME || 'micro-auth'}@${process.env.DB_HOST || 'localhost'}`);
    });

    return server;
  } catch (err) {
    console.error('Échec du démarrage du serveur:', err);
    await db.closePool();
    process.exit(1);
  }
};

const closeServer = async () => {
  if (server) {
    await new Promise(resolve => server.close(resolve));
  }
  await db.closePool();
};

module.exports = {
  app,
  startServer,
  closeServer
};

// Gestion des arrêts
['SIGTERM', 'SIGINT'].forEach(signal => {
  process.on(signal, async () => {
    await closeServer();
    process.exit(0);
  });
});

if (require.main === module) {
  startServer();
}