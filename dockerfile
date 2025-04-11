# Étape 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers de configuration
COPY package.json package-lock.json ./

# Installer TOUTES les dépendances (y compris devDependencies pour la construction)
RUN npm install

# Copier tout le reste du projet
COPY . .

# Construire le projet avec Vite
RUN npm run build && \
    rm -rf src .gitignore .dockerignore *.md node_modules

# Étape 2: Créer l'image finale
FROM node:18-alpine

WORKDIR /app

# Copier uniquement ce qui est nécessaire depuis le builder
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/
COPY --from=builder /app/package-lock.json /app/

# Installer uniquement les dépendances de production
RUN npm install --omit=dev

# Démarrer l'application
EXPOSE 3000
CMD ["node", "dist/index.js"]
