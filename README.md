
# IdentityNexus - Service d'Authentification

## Structure du Projet

### Frontend (React + TypeScript)
- Interface utilisateur pour l'inscription, la connexion et la gestion des profils
- Gestion de l'état d'authentification avec Context API
- Communication avec l'API backend via Fetch

### Backend (Node.js + Express)
- API RESTful pour l'authentification et la gestion des utilisateurs
- Génération et validation de tokens JWT
- Middleware de vérification d'authentification et autorisation

### Base de données (PostgreSQL)
- Stockage sécurisé des informations utilisateurs
- Gestion des rôles et permissions

## Implémentation Backend (code de référence)

### Structure des dossiers

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js       # Configuration de la connexion PostgreSQL
│   │   └── jwt.js            # Configuration JWT (secret, expiration)
│   ├── controllers/
│   │   └── authController.js # Logique d'authentification
│   ├── middlewares/
│   │   ├── auth.js           # Middleware de vérification du token
│   │   └── roles.js          # Middleware de vérification des rôles
│   ├── models/
│   │   └── userModel.js      # Modèle utilisateur pour la base de données
│   ├── routes/
│   │   └── authRoutes.js     # Routes d'authentification
│   ├── utils/
│   │   └── password.js       # Utilitaires pour hachage de mot de passe
│   └── index.js              # Point d'entrée de l'application
├── .env                      # Variables d'environnement
└── package.json              # Dépendances
```

### Schéma de base de données (PostgreSQL)

```sql
-- Création de la table users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table refresh_tokens
CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Exemples d'APIs

1. **Inscription**
   - Route: `POST /api/auth/register`
   - Payload: `{ name, email, password }`
   - Réponse: `{ success, message, user: { id, name, email, role } }`

2. **Connexion**
   - Route: `POST /api/auth/login`
   - Payload: `{ email, password }`
   - Réponse: `{ success, accessToken, refreshToken, user: { id, name, email, role } }`

3. **Rafraîchissement du token**
   - Route: `POST /api/auth/refresh-token`
   - Payload: `{ refreshToken }`
   - Réponse: `{ success, accessToken, refreshToken }`

4. **Déconnexion**
   - Route: `POST /api/auth/logout`
   - Payload: `{ refreshToken }`
   - Réponse: `{ success, message }`

5. **Profil utilisateur**
   - Route: `GET /api/auth/profile`
   - Header: `Authorization: Bearer {access_token}`
   - Réponse: `{ success, user: { id, name, email, role } }`

## Implémentation technique

### Principales dépendances backend
- express: Framework web
- pg/pg-pool: Client PostgreSQL
- bcrypt: Hachage de mots de passe
- jsonwebtoken: Génération et vérification de JWT
- cors: Middleware pour gérer le CORS
- dotenv: Chargement des variables d'environnement
- helmet: Sécurité des en-têtes HTTP

### Sécurité
- Hachage des mots de passe avec bcrypt
- Protection contre les injections SQL avec des requêtes paramétrées
- Utilisation de HTTP-only cookies pour les refreshTokens
- Validation des données d'entrée
- Rate limiting pour prévenir les attaques par force brute
- Protection CSRF

## Installation et démarrage

### Prérequis
- Node.js (v14+)
- PostgreSQL (v12+)

### Installation du backend
```bash
cd backend
npm install
```

### Configuration de l'environnement
Créer un fichier `.env` à la racine du dossier backend:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=identity_nexus
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret
JWT_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=7d

PORT=3000
NODE_ENV=development
```

### Démarrage
```bash
npm run dev  # Mode développement
npm start    # Mode production
```

### Installation du frontend
```bash
cd frontend
npm install
npm start
```

## Déploiement en production
Pour un déploiement en production, considérez:
- Utilisation de HTTPS
- Mise en place d'un proxy inverse (Nginx)
- Configuration d'un serveur PostgreSQL dédié
- Utilisation de PM2 pour la gestion des processus Node.js
- Stratégies de mise à l'échelle (conteneurisation avec Docker)
