# Backend Server Setup Guide

This guide will walk you through setting up and running the Hypertrophic backend server step by step.

## Prerequisites

Before starting, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Docker** (for PostgreSQL)
- **Git**

## Step-by-Step Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Express.js framework
- Drizzle ORM for database management
- PostgreSQL driver
- JWT authentication
- Rate limiting
- Logging utilities

### 3. Set Up PostgreSQL with Docker

This section follows the [official Drizzle PostgreSQL local setup guide](https://orm.drizzle.team/docs/guides/postgresql-local-setup).

#### Step 1: Pull the PostgreSQL Image

Pull the latest PostgreSQL image from Docker Hub:

```bash
docker pull postgres
```

Alternatively, you can pull a specific version:

```bash
docker pull postgres:15
```

Verify the image was downloaded:
```bash
docker images
```

#### Step 2: Start a PostgreSQL Container

Start a new PostgreSQL container with the following command:

```bash
docker run --name hypertrophic-postgres \
  -e POSTGRES_PASSWORD=hypertrophic_password \
  -e POSTGRES_USER=hypertrophic_user \
  -e POSTGRES_DB=hypertrophic_db \
  -d -p 5432:5432 postgres
```

**Command breakdown:**
- `--name hypertrophic-postgres` - Assigns the container name
- `-e POSTGRES_PASSWORD=` - Sets the database password
- `-e POSTGRES_USER=` - Sets the database user (defaults to `postgres` if empty)
- `-e POSTGRES_DB=` - Sets the database name (defaults to `POSTGRES_USER` if empty)
- `-d` - Runs the container in detached mode (background)
- `-p 5432:5432` - Maps port 5432 on the container to port 5432 on your host machine

#### Step 3: Verify Container Status

Check if the container is running:

```bash
docker ps
```

You should see output similar to:
```
CONTAINER ID   IMAGE      COMMAND                  CREATED         STATUS         PORTS                    NAMES
df957c58a6a3   postgres   "docker-entrypoint.s…"   4 seconds ago   Up 3 seconds   0.0.0.0:5432->5432/tcp   hypertrophic-postgres
```

#### Step 4: Configure Database URL

Based on the [Drizzle PostgreSQL connection guide](https://orm.drizzle.team/docs/get-started/postgresql-new), your database URL format should be:

```
postgresql://<user>:<password>@<host>:<port>/<database>
```

For the container we just created, the URL will be:

```
postgresql://hypertrophic_user:hypertrophic_password@localhost:5432/hypertrophic_db
```

**Note:** If you didn't specify `POSTGRES_USER`, the default user is `postgres`, so your URL would be:
```
postgresql://postgres:hypertrophic_password@localhost:5432/hypertrophic_db
```

### 4. Environment Configuration

Create a `.env` file in the backend directory:

```bash
# Copy from example if available
cp .env.example .env
```

Or create a new `.env` file with the following content:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://hypertrophic_user:hypertrophic_password@localhost:5432/hypertrophic_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRES_IN=24h

# AWS Configuration (if using AWS services)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1

# Logging Configuration
LOG_LEVEL=info
```

**Important**: Replace `your_super_secret_jwt_key_here_make_it_long_and_random` with a strong, random secret key.

#### Generate JWT Secret Key

You can use the included script to generate a secure JWT secret key:

```bash
node scripts/jwtKeyGenerator.js
```

This will output a 64-character hexadecimal string that you can use as your `JWT_SECRET`.

#### Generate Test JWT Token (Optional)

After setting up your JWT_SECRET, you can generate a test token to verify your authentication setup:

```bash
npm run token
```

This script will:
- Generate a test JWT token using your configured `JWT_SECRET`
- Show example cURL commands for testing protected endpoints
- Display the decoded token payload for verification

### 5. Database Setup with Drizzle

#### Generate Database Schema
```bash
npm run db:generate
```

This command will:
- Read your schema from `src/db/schema.ts`
- Generate SQL migration files in the `drizzle/` directory
- Create the initial migration if no migrations exist

#### Run Database Migrations
```bash
npm run db:migrate
```

This will:
- Execute all pending migrations
- Create the database tables based on your schema
- Update the migration history

#### Verify Database Setup (Optional)
```bash
npm run db:studio
```

This opens Drizzle Studio in your browser where you can:
- View your database structure
- Browse and edit data
- Execute SQL queries
- Monitor database performance

### 6. Start the Server

#### Development Mode (Recommended for development)
```bash
npm run dev
```

This starts the server with:
- Hot reloading enabled
- TypeScript compilation on the fly
- Server running on `http://localhost:8080`

#### Production Mode
```bash
npm run build
npm start
```

### 7. Verify the Setup

Once the server is running, you should see:
- Server startup logs in the console
- No database connection errors
- Server listening on the specified port

Test the server by visiting:
- `http://localhost:8080/` - Should return "Hypertrophic is running!"
- Check the console for any error messages

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reloading |
| `npm run build` | Build the application for production |
| `npm start` | Start the production server |
| `npm run db:generate` | Generate database migrations |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Drizzle Studio for database management |
| `npm run token` | Generate a JWT token for testing |

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed
- Ensure PostgreSQL container is running: `docker ps`
- Check if port 5432 is available: `lsof -i :5432`
- Verify DATABASE_URL in `.env` file
- Restart PostgreSQL container if needed

#### 2. Port Already in Use
- Change PORT in `.env` file
- Kill process using the port: `lsof -ti:8080 | xargs kill -9`

#### 3. Dependencies Installation Failed
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

#### 4. Migration Errors
- Check if database exists and is accessible
- Verify schema file syntax
- Check migration files in `drizzle/` directory

### Useful Docker Commands

```bash
# View running containers
docker ps

# View container logs
docker logs hypertrophic-postgres

# Stop PostgreSQL container
docker stop hypertrophic-postgres

# Start PostgreSQL container
docker start hypertrophic-postgres

# Remove PostgreSQL container
docker rm hypertrophic-postgres

# View container details
docker inspect hypertrophic-postgres
```

## Next Steps

After successful setup:
1. Test the API endpoints
2. Set up your frontend to connect to the backend
3. Configure authentication
4. Add your first users and workouts

## Support

If you encounter issues:
1. Check the logs in the `logs/` directory
2. Verify all environment variables are set correctly
3. Ensure Docker containers are running
4. Check the database connection status

The server should now be running successfully at `http://localhost:8080`! 