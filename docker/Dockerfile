# Enhanced Dockerfile for SSPO Legal Platform with AI-powered features
FROM node:18-alpine AS builder

# Install build dependencies for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git \
    curl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with optimizations for production
RUN npm install --only=production --no-audit --no-fund

# Production stage
FROM node:18-alpine AS production

# Install runtime dependencies
RUN apk add --no-cache \
    curl \
    tini \
    dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S sspo -u 1001

# Set working directory
WORKDIR /app

# Copy dependencies from builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy application files
COPY --chown=sspo:nodejs . .

# Create necessary directories with correct permissions
RUN mkdir -p logs data documents && \
    chown -R sspo:nodejs /app

# Set memory limits for Node.js (respecting 2GB constraint)
ENV NODE_OPTIONS="--max-old-space-size=1800"

# Environment variables for production
ENV NODE_ENV=production
ENV PORT=3000
ENV API_PORT=3001
ENV MEMORY_LIMIT=2048m
ENV CPU_LIMIT=2.0

# Legal analysis configuration
ENV NATURAL_LANGUAGE=polish
ENV LEGAL_ANALYSIS_ENABLED=true
ENV LEGAL_KEYWORDS_CACHE_SIZE=1000
ENV PRECEDENT_MATCHING_THRESHOLD=0.7
ENV CONFLICT_DETECTION_ENABLED=true

# Memory optimization settings
ENV LRU_CACHE_MAX_SIZE=1000
ENV TTL_CACHE_DURATION=3600000
ENV MEMORY_CLEANUP_INTERVAL=300000

# Logging configuration
ENV LOG_LEVEL=info
ENV LOG_MAX_FILES=5
ENV LOG_MAX_SIZE=100m

# Switch to non-root user
USER sspo

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:$PORT/api/health || exit 1

# Expose ports
EXPOSE $PORT $API_PORT

# Use tini as init system for proper signal handling
ENTRYPOINT ["/sbin/tini", "--"]

# Start demo application
CMD ["sh", "-c", "node src/app-demo.js"]