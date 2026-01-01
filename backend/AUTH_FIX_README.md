# Authentication Fix Instructions

## Issues Resolved:
1. Database connection failures
2. Missing field validation
3. Better error handling
4. Improved logging

## Quick Start:

### Option 1: Automated Setup (Windows)
```bash
cd backend
start.bat
```

### Option 2: Manual Setup
```bash
cd backend

# Install dependencies
npm install

# Setup database (ensure MySQL is running)
npm run setup-db

# Start server
npm run dev
```

## Database Requirements:
- MySQL server running on localhost:3306
- User: root with password as configured in .env
- Database will be created automatically

## Testing:
```bash
# Test authentication endpoints
npm run test-auth
```

## Environment Variables (.env):
```
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=house_rental_db
DB_PORT=3306
PORT=3001
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
```

## Common Issues:

### 1. MySQL Access Denied
- Ensure MySQL is running
- Check username/password in .env
- Try connecting without password: `DB_PASSWORD=`

### 2. Database Not Found
- Run `npm run setup-db` to create database and tables

### 3. 400 Bad Request
- Check request payload in DevTools Network tab
- Ensure Content-Type: application/json header
- Verify all required fields: name, email, password, role

## API Endpoints:

### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "password123",
  "role": "TENANT"
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```