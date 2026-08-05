# Docker & Development Environment

This document defines the containerization strategy and the development environment setup to ensure "it works on my
machine" consistency across the entire team.

## 1. Environment Architecture

We use a single-container approach managed by **Docker Compose**. The frontend is a client-side application, and
containerization allows us to manage the development server in a unified way.

### Container Breakdown

| Service        | Image / Base     | Role                                                                      |
| :------------- | :--------------- | :------------------------------------------------------------------------ |
| **`frontend`** | `node:24-alpine` | Runs the Vite/React development server with Hot Module Replacement (HMR). |

## 2. Docker Compose Configuration

The `docker-compose.yml` file is the source of truth for the local development orchestration.

### `docker-compose.yml`

```yaml
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: cargo-auction
    ports:
      - '5173:5173' # Vite default port
    volumes:
      - ./:/app
      - /app/node_modules # Prevents local node_modules from overwriting container modules
    environment:
      - NODE_ENV=development
      - VITE_API_URL=/api/v1 # MSW intercepts on this path
    networks:
      - cargo-auction-network

networks:
  cargo-auction-network:
    driver: bridge
```

## 3. Dockerfile Strategy

### Development (`Dockerfile`)

Optimized for speed and developer experience.

- Uses `node:24-alpine` for a small footprint.
- Implements **Bind Mounts** for real-time code updates (HMR).
- Sets `WORKDIR /app`.
- Installs dependencies via `npm install` during build.

```dockerfile
FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
```

## 4. Development Workflow with Docker

### 4.1. Starting the Environment

To start the development environment, developers only need to run:

```bash
docker-compose up
```

The application will be accessible at `http://localhost:5173`.

### 4.2. Adding New Dependencies

If a new package is added to `package.json`, the container needs to be rebuilt or the dependencies re-installed inside
the container:

```bash
# Option A: Rebuild the container
docker-compose up --build

# Option B: Run install inside the running container
docker-compose exec frontend npm install <package-name>
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

1.  **Consistency:** No developer should run `npm install` directly on their host OS. All commands should ideally be
    executed via `docker-compose exec`.
2.  **Version Locking:** The Node.js version is locked in the `Dockerfile` to prevent "version drift" between team
    members.
3.  **Environment Variables:** Sensitive credentials must never be committed. Use `.env` files which are added to
    `.gitignore`, and provide a `.env.example` for the team.
