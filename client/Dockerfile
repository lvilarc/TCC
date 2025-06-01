# Stage 1: build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: runtime
FROM node:20-alpine

WORKDIR /app

# Copia só as dependências de produção
COPY package*.json ./
RUN npm install --production

# Copia o build do Next.js e public assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "run", "start"]
