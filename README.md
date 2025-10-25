# Storefront Backend Project

A RESTful API for an e-commerce storefront built with Node.js, Express, TypeScript, and PostgreSQL. This project provides endpoints for managing users, products, and orders with JWT authentication.

## Database Setup and Connection

### Step 1: Start PostgreSQL

### Step 2: Create Database User

Connect to PostgreSQL as the default user.
Once in the PostgreSQL shell, create a user for the application:

```sql
CREATE USER storefront_user WITH PASSWORD 'pass123';
```

### Step 3: Create Databases

Create both development and test databases:

```sql
-- Create development database
CREATE DATABASE storefront_dev;

-- Create test database
CREATE DATABASE storefront_test;
```

### Step 4: Connect and Grant Privileges

Grant the user permissions on both databases:

```sql
-- Grant privileges on development database
\c storefront_dev
ALTER SCHEMA public OWNER TO storefront_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO storefront_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO storefront_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO storefront_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO storefront_user;
-- Grant privileges on test database
\c storefront_test
ALTER SCHEMA public OWNER TO storefront_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO storefront_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO storefront_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO storefront_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO storefront_user;
```

### Step 5: Run Migrations

Apply migrations to create database tables:

```bash
# Run all migrations
npm run migrate:up
```

## Running the Application

### Step 1: Build the TypeScript Code

Compile TypeScript to JavaScript:

```bash
npm run build
```

This creates a `dist` folder with compiled JavaScript files.

### Step 2: Start the Server

#### For Development (with auto-reload):

```bash
npm run dev
```

#### For Production:

```bash
npm start
```

### Step 3: Verify Server is Running

You should see:

```
starting app on: 0.0.0.0:3000
```

## Port Information

- Backend API: Port 3000
- PostgreSQL Database: Port 5432

## Testing

### Setup Test Database

Before running tests, ensure the test database has the proper schema:

```bash
# Set environment to test
set ENV=test

# Run migrations on test database
npm run migrate:up
```

### Run Tests

```bash
npm test
```

## Package Installation

### 1. Clone or Download the Project

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:

- **express** - Web framework
- **pg** - PostgreSQL client
- **typescript** - TypeScript compiler
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **dotenv** - Environment variables
- **db-migrate** - Database migrations
- And other required packages

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type-safe JavaScript
- **PostgreSQL** - Relational database
- **JWT (jsonwebtoken)** - Authentication
- **bcrypt** - Password hashing
- **db-migrate** - Database migrations
- **Jasmine** - Testing framework
- **dotenv** - Environment configuration

## Project Scripts

Available npm scripts:

```bash
# Development
npm run dev          # Start server with auto-reload

# Production
npm start            # Start the production server
npm run build        # Compile TypeScript to JavaScript

# Database
npm run migrate:up   # Run database migrations
npm run migrate:down # Rollback last migration
npm run migrate:reset # Reset all migrations

# Testing
npm test             # Run all tests
```

---

## Quick Start Summary

```bash
# 1. Install packages
npm install

# 2. Create databases (in psql)
CREATE USER storefront_user WITH PASSWORD 'password123';
CREATE DATABASE storefront_dev;
GRANT ALL PRIVILEGES ON DATABASE storefront_dev TO storefront_user;

# 3. Configure environment
cp .env.example .env
# Edit .env with your settings

# 4. Run migrations
npm run migrate:up

# 5. Build and start
npm run build
npm start

# Server should now be running on http://localhost:3000
```
