# Visualify AI Backend

A backend project for Visualify AI application built with NestJS, PostgreSQL, and Redis.

## 📋 System Requirements

- Node.js (version 18 or higher)
- npm or yarn
- Docker and Docker Compose (for quick setup)
- PostgreSQL (if running without Docker)
- Redis (if running without Docker)


### Step 1: Clone the project
```bash
git clone <repository-url>
cd visualifyai-backend
```

### Step 2: Configure environment variables
```bash
# Copy the sample .env file
cp .env .env.local
```

### Step 3: Run with Docker Compose
```bash
# Navigate to docker dev directory
cd docker/dev

# Run all services (API, PostgreSQL, Redis)
docker-compose up -d

# Or run and view logs
docker-compose up
```

### Step 4: Verify
- API will run at: http://localhost:4300
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### Useful Docker commands
```bash
# View API logs
docker-compose logs -f api

# Check container status
docker-compose ps

# Stop all services
docker-compose down

# Stop and remove volumes (data)
docker-compose down -v

# Rebuild and restart
docker-compose up --build
```
