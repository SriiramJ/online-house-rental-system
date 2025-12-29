#!/bin/bash

echo "Testing backend API endpoints..."

# Test if backend is running
echo "1. Testing if backend is running on port 3001..."
curl -s http://localhost:3001/api/test || echo "Backend not running on port 3001"

# Test auth endpoint
echo "2. Testing auth endpoint..."
curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}' || echo "Auth endpoint not accessible"

echo "Done testing."