# Backend Setup Instructions

## Environment Configuration

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Update `.env` with your MySQL credentials:**
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=YOUR_MYSQL_PASSWORD
   DB_NAME=uday_rental_db
   DB_PORT=3306
   JWT_SECRET=your_unique_jwt_secret
   ```

## Database Setup

1. **Create MySQL database:**
   ```sql
   CREATE DATABASE uday_rental_db;
   ```

2. **Run database schema:**
   ```bash
   mysql -u root -p uday_rental_db < database/schema.sql
   ```

3. **Load sample data (optional):**
   ```bash
   mysql -u root -p uday_rental_db < database/sample_data.sql
   ```

## Run the Backend

```bash
npm install
npm run dev
```

The server will start on `http://localhost:3001`