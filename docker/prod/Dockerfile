# Production Dockerfile for React + Vite App
# Multi-stage build for optimized production image

# Stage 1: Build the application
FROM node:24.11.1-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production server with Node (simple static server)
FROM node:24.11.1-alpine AS production

# Install serve globally for serving static files
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Expose port 3000
EXPOSE 3000

# Serve the built files with SPA support
CMD ["serve", "-s", "dist", "-l", "3000"]
