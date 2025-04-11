# Étape de construction
FROM node:18-alpine AS builder

WORKDIR /app

# D'abord copier uniquement les fichiers de dépendances
COPY package.json package-lock.json ./

# Nettoyer le cache et installer les dépendances
RUN npm cache clean --force && \
    npm install --legacy-peer-deps --prefer-offline

# Copier le reste du code et builder
COPY . .
RUN npm run build

# Étape de production (image finale légère)
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]
