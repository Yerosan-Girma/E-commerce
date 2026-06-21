#!/bin/bash

# Authentication Test Script
# Base URL
BASE_URL="http://localhost:5000/api"

echo "=========================================="
echo "AUTHENTICATION TESTS"
echo "=========================================="
echo ""

# Test 1: Register user
echo "Test 1: Register user"
echo "Expected: User created with token"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"testuser@example.com","password":"password123","role":"customer"}')
echo "$REGISTER_RESPONSE" | jq .
echo ""

# Extract token from register response
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.data.token')
echo "Token: $TOKEN"
echo ""

# Test 2: Login user
echo "Test 2: Login user"
echo "Expected: Token returned"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"password123"}')
echo "$LOGIN_RESPONSE" | jq .
echo ""

# Extract token from login response
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token')
echo "Token: $TOKEN"
echo ""

# Test 3: Access protected route without token
echo "Test 3: Access protected route without token"
echo "Expected: 401 Unauthorized"
PROTECTED_NO_TOKEN=$(curl -s -X GET "$BASE_URL/test/profile")
echo "$PROTECTED_NO_TOKEN" | jq .
echo ""

# Test 4: Access protected route with valid token
echo "Test 4: Access protected route with valid token"
echo "Expected: User data returned"
PROTECTED_WITH_TOKEN=$(curl -s -X GET "$BASE_URL/test/profile" \
  -H "Authorization: Bearer $TOKEN")
echo "$PROTECTED_WITH_TOKEN" | jq .
echo ""

# Test 5: Access admin route with customer token
echo "Test 5: Access admin route with customer token"
echo "Expected: 403 Forbidden"
ADMIN_CUSTOMER_TOKEN=$(curl -s -X GET "$BASE_URL/test/admin" \
  -H "Authorization: Bearer $TOKEN")
echo "$ADMIN_CUSTOMER_TOKEN" | jq .
echo ""

# Register an admin user for testing
echo "Registering admin user for testing..."
ADMIN_REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin User","email":"admin@example.com","password":"admin123","role":"admin"}')
echo "$ADMIN_REGISTER_RESPONSE" | jq .
echo ""

# Login as admin
echo "Login as admin..."
ADMIN_LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}')
echo "$ADMIN_LOGIN_RESPONSE" | jq .
echo ""

# Extract admin token
ADMIN_TOKEN=$(echo "$ADMIN_LOGIN_RESPONSE" | jq -r '.data.token')
echo "Admin Token: $ADMIN_TOKEN"
echo ""

# Test 6: Access admin route with admin token
echo "Test 6: Access admin route with admin token"
echo "Expected: Success"
ADMIN_WITH_ADMIN_TOKEN=$(curl -s -X GET "$BASE_URL/test/admin" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
echo "$ADMIN_WITH_ADMIN_TOKEN" | jq .
echo ""

# Test 7: Invalid token
echo "Test 7: Invalid token"
echo "Expected: 401 Unauthorized"
INVALID_TOKEN_RESPONSE=$(curl -s -X GET "$BASE_URL/test/profile" \
  -H "Authorization: Bearer invalid_token_here")
echo "$INVALID_TOKEN_RESPONSE" | jq .
echo ""

echo "=========================================="
echo "TESTS COMPLETED"
echo "=========================================="
