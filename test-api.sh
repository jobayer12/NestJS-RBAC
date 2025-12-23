#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000"

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}Testing NestJS RBAC Implementation${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# Example 1: Role-Based Tests
echo -e "${YELLOW}📝 EXAMPLE 1: ROLE-BASED SYSTEM${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

echo -e "${GREEN}✅ Test 1: Public Login Endpoint${NC}"
curl -X POST $BASE_URL/example1/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}' \
  -s | jq '.'
echo ""

echo -e "${GREEN}✅ Test 2: List Users (READ role)${NC}"
curl -X GET $BASE_URL/example1/users \
  -H "Authorization: Bearer token-read" \
  -s | jq '.'
echo ""

echo -e "${GREEN}✅ Test 3: Create User (ADMIN role - SUCCESS)${NC}"
curl -X POST $BASE_URL/example1/users \
  -H "Authorization: Bearer token-admin" \
  -H "Content-Type: application/json" \
  -d '{"name":"New User","email":"new@example.com"}' \
  -s | jq '.'
echo ""

echo -e "${RED}❌ Test 4: Create User (READ role - SHOULD FAIL)${NC}"
curl -X POST $BASE_URL/example1/users \
  -H "Authorization: Bearer token-read" \
  -H "Content-Type: application/json" \
  -d '{"name":"New User","email":"new@example.com"}' \
  -s | jq '.'
echo ""

# Example 2: Permission-Based Tests
echo ""
echo -e "${YELLOW}📝 EXAMPLE 2: PERMISSION-BASED SYSTEM${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

echo -e "${GREEN}✅ Test 5: Public Posts${NC}"
curl -X GET $BASE_URL/example2/posts/public \
  -s | jq '.'
echo ""

echo -e "${GREEN}✅ Test 6: List Posts (READ permission)${NC}"
curl -X GET $BASE_URL/example2/posts \
  -H "Authorization: Bearer token-read-only" \
  -s | jq '.'
echo ""

echo -e "${GREEN}✅ Test 7: Create Post (CREATE permission - SUCCESS)${NC}"
curl -X POST $BASE_URL/example2/posts \
  -H "Authorization: Bearer token-creator" \
  -H "Content-Type: application/json" \
  -d '{"title":"New Post","content":"Content here"}' \
  -s | jq '.'
echo ""

echo -e "${RED}❌ Test 8: Create Post (READ only - SHOULD FAIL)${NC}"
curl -X POST $BASE_URL/example2/posts \
  -H "Authorization: Bearer token-read-only" \
  -H "Content-Type: application/json" \
  -d '{"title":"New Post","content":"Content"}' \
  -s | jq '.'
echo ""

# Example 3: Module-Based Tests
echo ""
echo -e "${YELLOW}📝 EXAMPLE 3: MODULE-BASED SYSTEM${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

echo -e "${GREEN}✅ Test 9: List Users (users:list)${NC}"
curl -X GET $BASE_URL/example3/users \
  -H "Authorization: Bearer token-customer-service" \
  -s | jq '.'
echo ""

echo -e "${GREEN}✅ Test 10: List Products (products:list)${NC}"
curl -X GET $BASE_URL/example3/products \
  -H "Authorization: Bearer token-product-manager" \
  -s | jq '.'
echo ""

echo -e "${GREEN}✅ Test 11: Manage Inventory (products:manage_inventory)${NC}"
curl -X PATCH $BASE_URL/example3/products/1/inventory \
  -H "Authorization: Bearer token-product-manager" \
  -H "Content-Type: application/json" \
  -d '{"stock":50,"operation":"add"}' \
  -s | jq '.'
echo ""

echo -e "${GREEN}✅ Test 12: Refund Order (orders:refund)${NC}"
curl -X PATCH $BASE_URL/example3/orders/1/refund \
  -H "Authorization: Bearer token-customer-service" \
  -H "Content-Type: application/json" \
  -d '{"amount":99.99,"reason":"Customer request"}' \
  -s | jq '.'
echo ""

echo -e "${RED}❌ Test 13: Create Product (customer service - SHOULD FAIL)${NC}"
curl -X POST $BASE_URL/example3/products \
  -H "Authorization: Bearer token-customer-service" \
  -H "Content-Type: application/json" \
  -d '{"name":"New Product","price":29.99}' \
  -s | jq '.'
echo ""

echo -e "${BLUE}=========================================${NC}"
echo -e "${GREEN}Testing Complete!${NC}"
echo -e "${BLUE}=========================================${NC}"
