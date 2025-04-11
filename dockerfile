# Étape 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

# D'abord copier uniquement ce qui est nécessaire pour les dépendances
COPY package.json package-lock.json ./

# Installer toutes les dépendances
RUN npm install --legacy-peer-deps

# Puis copier le reste du code
COPY . .

# Construire l'application
RUN npm run build

# Étape 2: Image de production
FROM node:18-alpine

WORKDIR /app

# Copier uniquement le nécessaire depuis le builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Port exposé
EXPOSE 3000

# Commande de démarrage
CMD ["node", "dist/index.js"]
