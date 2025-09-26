# SSPO Regulamin Platform v3.0 - Production
FROM node:18-alpine

# Metadata
LABEL maintainer="SSPO Team"
LABEL version="3.0.0"
LABEL description="Interactive platform for SSPO legal system with collaborative governance"

# Install system dependencies
RUN apk add --no-cache curl git

# Ustaw zmienne środowiskowe
ENV NODE_ENV=production
ENV PORT=3000

# Stwórz katalog aplikacji
WORKDIR /app

    # Skopiuj package.json i zainstaluj zależności
    COPY package*.json ./
    RUN npm install --omit=dev && npm cache clean --force

# Skopiuj kod aplikacji
COPY . .

# Utwórz katalog na dane
RUN mkdir -p /app/data && chown -R node:node /app

# Przełącz na użytkownika node (bezpieczeństwo)
USER node

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/analytics || exit 1

# Uruchom aplikację
CMD ["node", "app.js"]
