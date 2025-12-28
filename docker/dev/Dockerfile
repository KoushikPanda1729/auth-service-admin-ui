# Development Dockerfile for React + Vite App
FROM node:24.11.1-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (better layer caching)
# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Expose the development server port
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
