@echo off
echo Setting up House Rental System Backend...

echo.
echo Step 1: Installing dependencies...
call npm install

echo.
echo Step 2: Setting up database...
call npm run setup-db

echo.
echo Step 3: Starting development server...
call npm run dev