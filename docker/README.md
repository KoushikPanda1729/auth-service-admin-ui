# Docker Setup Guide

This project includes Docker configurations for both development and production environments, organized in separate folders.

## Folder Structure

```
docker/
├── dev/
│   ├── Dockerfile              # Development Dockerfile
│   ├── docker-compose.yml      # Development compose file
│   └── .env.example           # Example dev environment variables
├── prod/
│   ├── Dockerfile              # Production Dockerfile
│   ├── docker-compose.yml      # Production compose file
│   ├── nginx.conf             # Nginx configuration
│   └── .env.example           # Example prod environment variables
└── README.md                   # This file
```

## Development Environment

### Using Docker Compose (Recommended)

Navigate to the project root and run:

```bash
# Start development server with hot-reloading
docker-compose -f docker/dev/docker-compose.yml up

# Run in detached mode
docker-compose -f docker/dev/docker-compose.yml up -d

# View logs
docker-compose -f docker/dev/docker-compose.yml logs -f

# Stop the container
docker-compose -f docker/dev/docker-compose.yml down

# Rebuild and start
docker-compose -f docker/dev/docker-compose.yml up --build
```

### Using Docker Commands Directly

From the project root:

```bash
# Build the development image
docker build -f docker/dev/Dockerfile -t admin-ui:dev .

# Run the development container with hot-reload
docker run -p 3000:3000 \
  -v $(pwd):/app \
  -v /app/node_modules \
  --name admin-ui-dev \
  admin-ui:dev

# Run in detached mode
docker run -d -p 3000:3000 \
  -v $(pwd):/app \
  -v /app/node_modules \
  --name admin-ui-dev \
  admin-ui:dev
```

Access the app at: **http://localhost:3000**

### Development Features

- Hot-reloading enabled (changes reflect immediately)
- Source code mounted as volume
- Node modules isolated in anonymous volume
- Port 3000 exposed

## Production Environment

### Using Docker Compose (Recommended)

Navigate to the project root and run:

```bash
# Build and start production server
docker-compose -f docker/prod/docker-compose.yml up

# Run in detached mode
docker-compose -f docker/prod/docker-compose.yml up -d

# View logs
docker-compose -f docker/prod/docker-compose.yml logs -f

# Stop the container
docker-compose -f docker/prod/docker-compose.yml down

# Rebuild and start
docker-compose -f docker/prod/docker-compose.yml up --build
```

### Using Docker Commands Directly

From the project root:

```bash
# Build the production image
docker build -f docker/prod/Dockerfile -t admin-ui:prod .

# Run the production container
docker run -p 8080:80 --name admin-ui-prod admin-ui:prod

# Run in detached mode
docker run -d -p 8080:80 --name admin-ui-prod admin-ui:prod
```

Access the app at: **http://localhost:8080**

### Production Architecture

The production build uses a multi-stage Docker build:

1. **Builder Stage**:
   - Uses Node 24.11.1 Alpine
   - Installs dependencies
   - Builds the React app with Vite
   - Generates optimized static files

2. **Production Stage**:
   - Uses Nginx Alpine (lightweight)
   - Copies built files from builder
   - Serves static files
   - Includes SPA routing support
   - Includes security headers
   - Enables Gzip compression
   - Caches static assets

**Benefits:**

- Drastically reduced final image size (~25MB vs ~500MB)
- Only production dependencies included
- Fast serving with Nginx
- Production-optimized configuration

## Environment Variables

### Development

1. Copy the example file:

   ```bash
   cp docker/dev/.env.example docker/dev/.env
   ```

2. Edit `docker/dev/.env` with your values

3. Run with env file:
   ```bash
   docker-compose -f docker/dev/docker-compose.yml --env-file docker/dev/.env up
   ```

### Production

1. Copy the example file:

   ```bash
   cp docker/prod/.env.example docker/prod/.env
   ```

2. Edit `docker/prod/.env` with your values

3. Run with env file:
   ```bash
   docker-compose -f docker/prod/docker-compose.yml --env-file docker/prod/.env up
   ```

## Custom Nginx Configuration

The production setup includes a pre-configured `nginx.conf` with:

- SPA routing (all routes redirect to index.html)
- API proxy to backend (adjust the URL in nginx.conf)
- Security headers
- Gzip compression
- Static asset caching

To use the custom nginx.conf, uncomment this line in `docker/prod/Dockerfile`:

```dockerfile
COPY docker/prod/nginx.conf /etc/nginx/conf.d/default.conf
```

Edit `docker/prod/nginx.conf` to customize settings like:

- Backend API URL
- Cache policies
- Security headers
- Compression settings

## Useful Commands

### Container Management

```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# View logs (development)
docker logs admin-ui-dev
docker logs -f admin-ui-dev  # Follow logs

# View logs (production)
docker logs admin-ui-prod
docker logs -f admin-ui-prod  # Follow logs

# Execute commands inside container
docker exec -it admin-ui-dev sh
docker exec -it admin-ui-prod sh

# Stop containers
docker stop admin-ui-dev admin-ui-prod

# Remove containers
docker rm admin-ui-dev admin-ui-prod

# Force remove running containers
docker rm -f admin-ui-dev admin-ui-prod
```

### Image Management

```bash
# List images
docker images

# Remove images
docker rmi admin-ui:dev admin-ui:prod

# Remove unused images
docker image prune

# Remove all unused images
docker image prune -a
```

### System Cleanup

```bash
# Remove all stopped containers
docker container prune

# Remove all unused networks
docker network prune

# Remove all unused volumes
docker volume prune

# Remove everything unused (containers, networks, images, volumes)
docker system prune -a --volumes
```

## Troubleshooting

### Port Already in Use

**Problem:** Error: "port is already allocated"

**Solution:**

```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
docker run -p 3001:3000 admin-ui:dev
```

### Permission Issues (Linux)

**Problem:** Permission denied errors

**Solution:**

```bash
# Add your user to docker group
sudo usermod -aG docker $USER

# Re-login or run
newgrp docker

# Or run with sudo
sudo docker-compose -f docker/dev/docker-compose.yml up
```

### Hot-Reload Not Working (Development)

**Problem:** Changes not reflecting in browser

**Solution:**

1. Ensure volumes are mounted correctly:

   ```bash
   -v $(pwd):/app -v /app/node_modules
   ```

2. Check if Vite dev server is running with `--host 0.0.0.0`

3. Clear browser cache and hard reload (Cmd/Ctrl + Shift + R)

4. Restart the container:
   ```bash
   docker-compose -f docker/dev/docker-compose.yml restart
   ```

### Build Failures

**Problem:** Build fails with cache issues

**Solution:**

```bash
# Clear Docker build cache
docker builder prune

# Rebuild without cache (development)
docker-compose -f docker/dev/docker-compose.yml build --no-cache

# Rebuild without cache (production)
docker-compose -f docker/prod/docker-compose.yml build --no-cache
```

### Network Issues

**Problem:** Cannot connect to API or backend

**Solution:**

1. Check the API URL in your environment variables
2. Update the proxy settings in `docker/prod/nginx.conf`
3. Ensure backend service is running and accessible
4. Check Docker network configuration:
   ```bash
   docker network ls
   docker network inspect app-network
   ```

### Large Image Size

**Problem:** Production image is too large

**Solution:**

1. Ensure you're using the multi-stage build (prod Dockerfile)
2. Check if unnecessary files are being copied (update .dockerignore)
3. Verify node_modules is in .dockerignore
4. Clean up Docker build cache:
   ```bash
   docker builder prune -a
   ```

## Quick Reference

| Environment | Command                                               | URL                   |
| ----------- | ----------------------------------------------------- | --------------------- |
| Development | `docker-compose -f docker/dev/docker-compose.yml up`  | http://localhost:3000 |
| Production  | `docker-compose -f docker/prod/docker-compose.yml up` | http://localhost:8080 |

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Vite Documentation](https://vitejs.dev/)
