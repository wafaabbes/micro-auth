# Étape 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers de configuration
COPY package.json package-lock.json ./

# Installer les dépendances (y compris Vite)
RUN npm install --omit=dev

# Copier tout le reste du projet
COPY . .

# Construire le projet avec Vite
RUN npm run build && \
    rm -rf src .gitignore .dockerignore *.md

# Étape 2: Créer l'image finale
FROM node:18-alpine

WORKDIR /app

# Copier les fichiers de build de l'étape précédente
COPY --from=builder /app /app

# Démarrer l'application
CMD ["npm", "start"]

EXPOSE 3000/tcp
CMD ["node", "dist/index.js"]
