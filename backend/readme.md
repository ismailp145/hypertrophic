# Hypertrophic Backend

A Node.js/Express backend API for the Hypertrophic fitness application, built with TypeScript, Drizzle ORM, and PostgreSQL.

## Prerequisites

Before setting up this project, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher)
- **Git**

## Project Structure

```text
project-root/
│
├── src/
│   ├── config/         # Environment settings, DB config, API keys
│   ├── controllers/    # Handle API requests and responses
│   ├── middleware/     # Auth, logging, error handling, validation
│   ├── models/ ORM/ODM # Database models
│   ├── routes/         # API route definitions
│   ├── services/       # Business logic, external APIs
│   ├── validators/     # Input validation schemas
│   ├── utils/          # Helper functions/utilities
│   └── jobs/           # Background jobs, cron tasks
│
├── tests/              # Unit and integration tests
│   ├── unit/           # Unit tests
│   ├── integration/    # Integration tests
│   └── e2e/            # End-to-end tests
│
├── logs/               # Application logs
├── public/             # Static assets (if needed)
├── .env                # Environment variables
├── .env.example        # Environment variables template
├── app.js              # Express app configuration
├── server.js           # Server entry point
└── package.json
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/hypertrophic-fitness/hypertrophic.git
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Configure the following environment variables in your `.env` file:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/hypertrophic_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# AWS Configuration (if using AWS services)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1

# Logging Configuration
LOG_LEVEL=info
```

### 4. Database Setup

#### Option A: Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a new database:
   ```sql
   CREATE DATABASE hypertrophic_db;
   ```
3. Update the `DATABASE_URL` in your `.env` file with your local database credentials

#### Option B: Cloud Database (Recommended for production)

Use a cloud database service like:
- **Supabase** (PostgreSQL)
- **Railway** (PostgreSQL)
- **PlanetScale** (MySQL)
- **AWS RDS** (PostgreSQL)

Update the `DATABASE_URL` in your `.env` file with the cloud database connection string.

### 5. Database Migration

Run the database migrations to create the necessary tables:

```bash
npm run db:generate
npm run db:migrate
```

## Running the Application

### Development Mode

```bash
npm run dev
```

This will start the development server with hot reloading at `http://localhost:8080`

### Production Mode

```bash
npm run build
npm start
```

## Available Scripts

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm test` - Run tests
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio for database management

## API Endpoints

The API is available at `/api/v1/` and includes:

- **User Routes**: `/api/v1/users`
- **Workout Routes**: `/api/v1/workouts`
- **Health Check**: `/` (returns "Hypertrophic is running!")

## Development

### Code Structure

- **Controllers** (`src/controllers/`): Handle HTTP requests and responses
- **Routes** (`src/routes/`): Define API endpoints
- **Services** (`src/services/`): Business logic and external API integrations
- **Models** (`src/models/`): Database models and schemas
- **Middleware** (`src/middleware/`): Authentication, error handling, and validation
- **Utils** (`src/utils/`): Helper functions and utilities

### Adding New Features

1. Create controllers in `src/controllers/`
2. Define routes in `src/routes/`
3. Add business logic in `src/services/`
4. Create database models in `src/models/`
5. Add validation schemas in `src/validators/`

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Deployment

### Environment Variables for Production

Make sure to set the following environment variables in your production environment:

- `NODE_ENV=production`
- `DATABASE_URL` (production database URL)
- `JWT_SECRET` (strong secret key)
- `PORT` (production port)

### Deployment Platforms

This application can be deployed on:
- **Railway**
- **Heroku**
- **Vercel**
- **AWS EC2**
- **DigitalOcean App Platform**

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify your `DATABASE_URL` is correct
   - Ensure PostgreSQL is running
   - Check firewall settings

2. **Port Already in Use**
   - Change the `PORT` in your `.env` file
   - Kill the process using the current port

3. **JWT Errors**
   - Ensure `JWT_SECRET` is set in your environment
   - Verify the secret is consistent across deployments

### Getting Help

If you encounter issues:
1. Check the logs in the `logs/` directory
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check the database connection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the ISC License.
