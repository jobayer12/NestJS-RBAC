# NestJS RBAC Complete Implementation

A comprehensive, production-ready implementation of Role-Based Access Control (RBAC) in NestJS with three different approaches.

## 🚀 Features

- **Three Complete RBAC Implementations**
  - Example 1: Hierarchical Role-Based System (Admin, Manager, Super Admin)
  - Example 2: Action-Based Permission System (Read, Create, Update, Delete)
  - Example 3: Module-Based Permission System (users:read, posts:create, etc.)

- **Production-Ready Code**
  - Separation of authentication and authorization
  - Type-safe decorators and enums
  - Comprehensive error handling
  - Clean architecture following SOLID principles

- **Ready to Run**
  - No database required for testing
  - Mock token authentication
  - Comprehensive test examples

## 📋 Prerequisites

- Node.js >= 18.x
- npm >= 9.x

## 🛠️ Installation

```bash
# Install dependencies
npm install
```

## 🎯 Quick Start

### Run the Server

```bash
# Development mode
npm run start

# Watch mode (auto-reload)
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The server will start on `http://localhost:3000`

You'll see a comprehensive startup message with all available endpoints and test tokens.

## 📚 Examples Overview

### Example 1: Role-Based System (Hierarchical)

Perfect for organizational hierarchies with roles like Admin, Manager, Super Admin.

**Base URL:** `/example1`

**Test Tokens:**
- `token-admin` - Admin + Read roles
- `token-manager` - Manager + Read roles
- `token-superadmin` - All roles
- `token-read` - Read-only role

**Endpoints:**
```
POST   /example1/users/login          # Public - No auth required
GET    /example1/users                # Requires: READ role
GET    /example1/users/:id            # Requires: READ role
POST   /example1/users                # Requires: ADMIN role
PUT    /example1/users/:id            # Requires: MANAGER role
DELETE /example1/users/:id            # Requires: SUPER_ADMIN role
GET    /example1/users/dashboard/stats # Requires: ADMIN role
```

**Test Commands:**
```bash
# Login (public)
curl -X POST http://localhost:3000/example1/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

# List users (READ role)
curl -H "Authorization: Bearer token-read" \
  http://localhost:3000/example1/users

# Create user (ADMIN role - SUCCESS)
curl -X POST http://localhost:3000/example1/users \
  -H "Authorization: Bearer token-admin" \
  -H "Content-Type: application/json" \
  -d '{"name":"New User","email":"new@example.com"}'

# Create user (READ role - FAIL)
curl -X POST http://localhost:3000/example1/users \
  -H "Authorization: Bearer token-read" \
  -H "Content-Type: application/json" \
  -d '{"name":"New User","email":"new@example.com"}'

# Delete user (SUPER_ADMIN role)
curl -X DELETE http://localhost:3000/example1/users/1 \
  -H "Authorization: Bearer token-superadmin"
```

---

### Example 2: Permission-Based System (Action-Based)

Granular control with specific action permissions: Read, Create, Update, Delete.

**Base URL:** `/example2`

**Test Tokens:**
- `token-read-only` - Read permission only
- `token-creator` - Read + Create
- `token-editor` - Read + Update
- `token-full-access` - All permissions

**Endpoints:**
```
GET    /example2/posts/public         # Public - No auth required
GET    /example2/posts                # Requires: READ permission
GET    /example2/posts/:id            # Requires: READ permission
POST   /example2/posts                # Requires: CREATE permission
PUT    /example2/posts/:id            # Requires: UPDATE permission
DELETE /example2/posts/:id            # Requires: DELETE permission
PUT    /example2/posts/:id/publish    # Requires: UPDATE + CREATE permissions
```

**Test Commands:**
```bash
# Public posts (no auth)
curl http://localhost:3000/example2/posts/public

# List posts (READ permission)
curl -H "Authorization: Bearer token-read-only" \
  http://localhost:3000/example2/posts

# Create post (CREATE permission - SUCCESS)
curl -X POST http://localhost:3000/example2/posts \
  -H "Authorization: Bearer token-creator" \
  -H "Content-Type: application/json" \
  -d '{"title":"New Post","content":"Content here"}'

# Create post (READ only - FAIL)
curl -X POST http://localhost:3000/example2/posts \
  -H "Authorization: Bearer token-read-only" \
  -H "Content-Type: application/json" \
  -d '{"title":"New Post","content":"Content"}'

# Update post (UPDATE permission)
curl -X PUT http://localhost:3000/example2/posts/1 \
  -H "Authorization: Bearer token-editor" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Post"}'

# Delete post (DELETE permission)
curl -X DELETE http://localhost:3000/example2/posts/1 \
  -H "Authorization: Bearer token-full-access"
```

---

### Example 3: Module-Based System (Enterprise)

Enterprise-scale with module-specific permissions (users:read, posts:create, products:manage_inventory, etc.)

**Base URL:** `/example3`

**Test Tokens:**
- `token-admin-full` - All permissions
- `token-content-manager` - Posts management (list, read, create, update, publish)
- `token-product-manager` - Products management (list, read, create, update, inventory)
- `token-customer-service` - Orders + Users read (list, read, update, cancel, refund)
- `token-readonly` - All modules (read-only)

**Endpoints:**

**Users Module:**
```
GET    /example3/users                # Requires: users:list
GET    /example3/users/:id            # Requires: users:read
POST   /example3/users                # Requires: users:create
PUT    /example3/users/:id            # Requires: users:update
DELETE /example3/users/:id            # Requires: users:delete
```

**Products Module:**
```
GET    /example3/products             # Requires: products:list
GET    /example3/products/:id         # Requires: products:read
POST   /example3/products             # Requires: products:create
PUT    /example3/products/:id         # Requires: products:update
PATCH  /example3/products/:id/inventory # Requires: products:manage_inventory
DELETE /example3/products/:id         # Requires: products:delete
```

**Orders Module:**
```
GET    /example3/orders               # Requires: orders:list
GET    /example3/orders/:id           # Requires: orders:read
POST   /example3/orders               # Requires: orders:create
PUT    /example3/orders/:id           # Requires: orders:update
PATCH  /example3/orders/:id/cancel    # Requires: orders:cancel
PATCH  /example3/orders/:id/refund    # Requires: orders:refund
DELETE /example3/orders/:id           # Requires: orders:delete
```

**Test Commands:**
```bash
# Admin user (full access)
curl -H "Authorization: Bearer token-admin-full" \
  http://localhost:3000/example3/users

# Content Manager (posts only)
curl -H "Authorization: Bearer token-content-manager" \
  http://localhost:3000/example3/posts

# Product Manager (products + inventory)
curl -H "Authorization: Bearer token-product-manager" \
  http://localhost:3000/example3/products

curl -X PATCH http://localhost:3000/example3/products/1/inventory \
  -H "Authorization: Bearer token-product-manager" \
  -H "Content-Type: application/json" \
  -d '{"stock":50,"operation":"add"}'

# Customer Service (orders + users read)
curl -H "Authorization: Bearer token-customer-service" \
  http://localhost:3000/example3/orders

curl -X PATCH http://localhost:3000/example3/orders/1/refund \
  -H "Authorization: Bearer token-customer-service" \
  -H "Content-Type: application/json" \
  -d '{"amount":99.99,"reason":"Customer request"}'

# Read-only user
curl -H "Authorization: Bearer token-readonly" \
  http://localhost:3000/example3/products
```

## 🏗️ Project Structure

```
src/
├── example1-roles/                  # Hierarchical role-based system
│   ├── controllers/
│   │   └── users.controller.ts
│   ├── decorators/
│   │   ├── public.decorator.ts
│   │   └── roles.decorator.ts
│   ├── enums/
│   │   └── roles.enum.ts
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── roles.guard.ts
│   └── example1.module.ts
│
├── example2-permissions/            # Action-based permission system
│   ├── controllers/
│   │   └── posts.controller.ts
│   ├── decorators/
│   │   ├── public.decorator.ts
│   │   └── permissions.decorator.ts
│   ├── enums/
│   │   └── permissions.enum.ts
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── permissions.guard.ts
│   └── example2.module.ts
│
├── example3-modules/                # Module-based permission system
│   ├── controllers/
│   │   ├── users.controller.ts
│   │   ├── products.controller.ts
│   │   └── orders.controller.ts
│   ├── decorators/
│   │   ├── public.decorator.ts
│   │   └── module-permissions.decorator.ts
│   ├── enums/
│   │   └── module-permissions.enum.ts
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── module-permissions.guard.ts
│   └── example3.module.ts
│
├── app.module.ts                    # Root module
└── main.ts                          # Application entry point
```

## 🔒 How It Works

### Guard Chain Architecture

All three examples use a two-guard chain pattern:

1. **Authentication Guard** - Validates token and loads user data
2. **Authorization Guard** - Checks if user has required roles/permissions

```typescript
@Controller('endpoint')
@UseGuards(AuthGuard, RolesGuard) // or PermissionsGuard, ModulePermissionsGuard
export class MyController {
  @Get()
  @Roles(Role.ADMIN) // or @RequirePermissions(), @RequireModulePermissions()
  getData() {
    return { data: 'protected data' };
  }
}
```

### Creating Custom Endpoints

**Example 1 - Role-Based:**
```typescript
@Get('admin-only')
@Roles(Role.ADMIN)
getAdminData(@Request() req) {
  return { 
    message: 'Admin data',
    user: req.user.username 
  };
}
```

**Example 2 - Permission-Based:**
```typescript
@Post('create')
@RequirePermissions(Permission.CREATE)
createItem(@Body() dto: any, @Request() req) {
  return { 
    message: 'Item created',
    createdBy: req.user.username 
  };
}
```

**Example 3 - Module-Based:**
```typescript
@Get('sensitive')
@RequireModulePermissions(ModulePermission.USERS_READ)
getSensitiveData(@Request() req) {
  return { 
    message: 'Sensitive data',
    requestedBy: req.user.username 
  };
}
```

## 🧪 Testing

### Error Responses

When a request fails authorization, you'll receive detailed error messages:

**Missing Token:**
```json
{
  "statusCode": 401,
  "message": "Authentication token not found"
}
```

**Invalid Token:**
```json
{
  "statusCode": 401,
  "message": "Invalid authentication token"
}
```

**Insufficient Permissions:**
```json
{
  "statusCode": 403,
  "message": "Access denied. Required roles: admin. Your roles: read"
}
```

### Success Responses

All successful requests return detailed information:

```json
{
  "message": "Operation successful",
  "requestedBy": "username",
  "permission": "users:read",
  "data": { ... }
}
```

## 🎓 Learning Resources

### Key Concepts

1. **Decorators** - Metadata attached to classes/methods
2. **Guards** - NestJS components that determine request execution
3. **Reflector** - Reads metadata from decorators
4. **ExecutionContext** - Provides request details to guards

### Best Practices

✅ **DO:**
- Always apply AuthGuard before authorization guards
- Use enums for type safety
- Log authorization failures for security monitoring
- Keep guards focused and single-purpose
- Document permission requirements

❌ **DON'T:**
- Hardcode permission checks in controllers
- Skip authentication guard
- Return detailed error messages that leak security info
- Mix authentication and authorization logic

## 🔧 Customization

### Adding New Roles/Permissions

**Example 1 (Roles):**
```typescript
// In roles.enum.ts
export enum Role {
  READ = 'read',
  ADMIN = 'admin',
  MANAGER = 'manager',
  SUPER_ADMIN = 'super_admin',
  EDITOR = 'editor', // New role
}
```

**Example 2 (Permissions):**
```typescript
// In permissions.enum.ts
export enum Permission {
  READ = 'read',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  APPROVE = 'approve', // New permission
}
```

**Example 3 (Module Permissions):**
```typescript
// In module-permissions.enum.ts
export enum ModulePermission {
  // ... existing permissions
  REPORTS_GENERATE = 'reports:generate', // New permission
}
```

### Integrating Real Authentication

Replace the mock token validation in `auth.guard.ts`:

```typescript
private async validateToken(token: string): Promise<any> {
  // Replace with real implementation:
  // 1. Verify JWT signature
  const decoded = await this.jwtService.verify(token);
  
  // 2. Query database for user
  const user = await this.userService.findById(decoded.sub);
  
  // 3. Load user roles/permissions
  const permissions = await this.permissionService.getUserPermissions(user.id);
  
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    permissions: permissions,
  };
}
```

## 📖 Additional Documentation

- [NestJS Official Documentation](https://docs.nestjs.com)
- [Guards Documentation](https://docs.nestjs.com/guards)
- [Custom Decorators](https://docs.nestjs.com/custom-decorators)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is MIT licensed.

## 💡 Use Cases

### Example 1 Best For:
- Small to medium corporate applications
- Clear organizational hierarchies
- Simple permission models

### Example 2 Best For:
- Content management systems
- Applications with clear CRUD operations
- Medium-sized applications

### Example 3 Best For:
- Large enterprise applications
- Multi-tenant systems
- Applications with multiple domains/modules
- Systems requiring detailed audit trails

## 🎯 Next Steps

1. **Database Integration**: Add PostgreSQL/MongoDB for user storage
2. **JWT Implementation**: Replace mock tokens with real JWT
3. **Caching**: Add Redis for permission caching
4. **Audit Logging**: Track all authorization attempts
5. **Rate Limiting**: Prevent abuse
6. **API Documentation**: Add Swagger/OpenAPI
7. **Unit Tests**: Add comprehensive test coverage
8. **E2E Tests**: Add end-to-end testing

## 📧 Support

For questions or issues, please open an issue on GitHub.

---

Made with ❤️ for the NestJS community
