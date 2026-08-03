# Docker & Development Environment

This document defines the containerization strategy and the development environment setup to ensure "it works on my machine" consistency across the entire team.

## 1. Environment Architecture

We use a multi-container approach managed by **Docker Compose**. Even though the frontend is a client-side application, containerization allows us to manage the development server, mock servers, and potentially a local database or proxy in a unified way.

### Container Breakdown
| Service | Image / Base | Role |
| :--- | :--- | :--- |
| **`frontend`** | `node:24-alpine` | Runs the Vite/React development server with Hot Module Replacement (HMR). |
| **`msw-server`** | `node:24-alpine` | An optional standalone container to run **MSW** as a mock server if required for advanced integration testing. |

## 2. Docker Compose Configuration

The `docker-compose.yml` file is the source of truth for the local development orchestration.

### `docker-compose.yml` (Template)
```yaml
version: '3.8'

services:
  frontend:
    build:
      context:.
      dockerfile: Dockerfile
    container_name: cargo-auction-app
    ports:
      - "5173:5173"  # Vite default port
    volumes:
      - ./:/app
      - /app/node_modules # Prevents local node_modules from overwriting container modules
    environment:
      - NODE_ENV=development
      - VITE_API_URL=http://localhost:5173/api # Proxying to MSW/Vite
    networks:
      - cargo-auction-network

networks:
  cargo-auction-network:
    driver: bridge
```

## 3. Dockerfile Strategies

### 3.1. Development (`Dockerfile.dev`)
Optimized for speed and developer experience.
- Uses `node:20-alpine` for a small footprint.
- Implements **Bind Mounts** for real-time code updates (HMR).
- Sets `WORKDIR /app`.
- Installs dependencies via `npm install` during build or via an entrypoint script.

### 3.2. Production (`Dockerfile.prod`)
A multi-stage build to minimize the final image size and security surface area.
1.  **Stage 1: Build** → Runs `npm run build` (generates static assets).
2.  **Stage 2: Serve** → Uses **Nginx** to serve the static files from the `/dist` folder.

**Example Production Flow:**
```dockerfile
# Stage 1: Build
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY..
RUN npm run build

# Stage 2: Production
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Copy custom nginx config for SPA routing (handles React Router fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf 
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 4. Development Workflow with Docker

### 4.1. Starting the Environment
To start the development environment, developers only need to run:
```bash
docker-compose up
```
The application will be accessible at `http://localhost:5173`.

### 4.2. Adding New Dependencies
If a new package is added to `package.json`, the container needs to be rebuilt or the dependencies re-installed inside the container:
```bash
# Option A: Rebuild the container
docker-compose up --build

# Option B: Run install inside the running container
docker-compose exec frontend-dev npm install <package-name>
```

## 5. `.dockerignore`

To prevent bloated images and conflicts, we exclude unnecessary files from the build context:
```text
node_modules
dist
build
.git
.env
.env.local
npm-debug.log
Dockerfile*
docker-compose*
README.md
```

## 6. Summary of Environment Rules

1.  **Consistency:** No developer should run `npm install` directly on their host OS. All commands should ideally be executed via `docker-compose exec`.
2.  **Version Locking:** The Node.js version is locked in the `Dockerfile` to prevent "version drift" between team members.
3.  **Environment Variables:** Sensitive credentials must never be committed. Use `.env` files which are added to `.gitignore`, and provide a `.env.example` for the team.
