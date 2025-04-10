const { app } = require('./index');
const db = require('./config/database');

const PORT = process.env.PORT || 3000;
let server;

const startServer = async () => {
  let retryAttempts = 3; // Nombre de tentatives pour se reconnecter à la base de données
  while (retryAttempts > 0) {
    try {
      await db.testConnection(); // Tester la connexion à la base de données
      server = app.listen(PORT, () => {
        console.log(`🚀 Serveur démarré sur le port ${PORT}`);
        console.log(`🔍 Environnement: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🗄️ Base de données: ${process.env.DB_NAME || 'micro-auth'}@${process.env.DB_HOST || 'localhost'}`);
      });
      return server; // Si tout va bien, démarrer le serveur
    } catch (err) {
      console.error(`Erreur de connexion à la base de données. Tentatives restantes: ${retryAttempts}`, err);
      retryAttempts--; // Décrémenter les tentatives restantes
      if (retryAttempts <= 0) {
        console.error('Échec final du démarrage du serveur. Arrêt du processus.');
        await db.closePool(); // Fermer la connexion à la base de données
        process.exit(1); // Arrêter le processus en cas d'échec final
      }
      await new Promise(resolve => setTimeout(resolve, 5000)); // Attendre 5 secondes avant de réessayer
    }
  }
};

const closeServer = async () => {
  if (server) {
    await new Promise(resolve => server.close(resolve)); // Fermer proprement le serveur
  }
  await db.closePool(); // Fermer la connexion à la base de données
};

// Gestion des arrêts
['SIGTERM', 'SIGINT'].forEach(signal => {
  process.on(signal, async () => {
    await closeServer(); // Fermer proprement le serveur et la base de données lors de l'arrêt
    process.exit(0); // Terminer le processus
  });
});

module.exports = {
  app,
  startServer,
  closeServer
};

if (require.main === module) {
  startServer(); // Démarrer le serveur si ce fichier est exécuté directement
}
