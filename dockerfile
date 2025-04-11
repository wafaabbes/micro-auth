FROM node:18-alpine AS builder

WORKDIR /app

# Nettoyer le cache et installer les dépendances
COPY package.json package-lock.json ./
RUN npm cache clean --force && \
    npm install --legacy-peer-deps --ignore-scripts && \
    npm install terser

# Copie du code et build
COPY . .
RUN npm run build

# Étape de production
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]
