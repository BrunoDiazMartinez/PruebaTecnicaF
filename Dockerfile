# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Build de producción
RUN npm run build

# Stage 2: Serve
FROM node:20-alpine

WORKDIR /app

# Instalar servidor HTTP
RUN npm install -g serve

# Copiar archivos compilados desde el stage de build
COPY --from=build /app/dist/Frontend/browser ./browser

# Exponer puerto
EXPOSE 4200

# Servir la aplicación (Railway usa la variable PORT)
CMD ["sh", "-c", "serve -s browser -l ${PORT:-4200}"]
