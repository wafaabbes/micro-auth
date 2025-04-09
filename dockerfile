# Étape de build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build && \
    rm -rf src .gitignore .dockerignore *.md

# Étape d'exécution
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json .

RUN addgroup --system appgroup && \
    adduser --system --ingroup appgroup appuser && \
    chown -R appuser:appgroup /app
USER appuser

HEALTHCHECK --interval=30s --timeout=3s \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if(r.statusCode !== 200) throw new Error()})"

EXPOSE 3000/tcp
CMD ["node", "dist/index.js"]