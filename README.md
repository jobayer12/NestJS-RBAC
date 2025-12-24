# Complete Guide to Role-Based Access Control in NestJS: Three Production-Ready Approaches

Role-Based Access Control (RBAC) is essential for securing modern applications. In this comprehensive guide, we'll explore three complete RBAC systems in NestJS, each suited for different use cases. We'll use metadata decorators to separate authentication from authorization, creating clean, maintainable, and production-ready code.

## Table of Contents

1. [Introduction](#introduction)
2. [Project Setup](#project-setup)
3. [Example 1: Hierarchical Role-Based System](#example-1-hierarchical-role-based-system)
4. [Example 2: Action-Based Permission System](#example-2-action-based-permission-system)
5. [Example 3: Module-Based Permission System](#example-3-module-based-permission-system)
6. [Comparison and Best Practices](#comparison-and-best-practices)
7. [Testing Guide](#testing-guide)
8. [Production Deployment](#production-deployment)

---

## Introduction

### Why Separate Authentication and Authorization?

In a secure application, **authentication** (verifying who the user is) should be separate from **authorization** (determining what the user can do). This separation provides:

- **Better security**: Each layer handles one responsibility
- **Easier testing**: Test authentication and authorization independently
- **More flexibility**: Change permission logic without affecting authentication
- **Cleaner code**: Single Responsibility Principle

### The Guard Chain Pattern

Our implementation uses a two-guard chain:

1. **Authentication Guard**: Validates the token and loads user data
2. **Authorization Guard**: Checks if the user has required permissions

This pattern ensures users are authenticated before checking permissions, preventing unauthorized access attempts.

### Three RBAC Approaches

We'll implement three different systems:

1. **Hierarchical Roles**: Admin, Manager, Super Admin - ideal for organizational structures
2. **Action Permissions**: Read, Create, Update, Delete - for granular action control
3. **Module Permissions**: `users:read`, `posts:create` - for large applications with multiple domains

---

## Project Setup

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x

### Installation

```bash
# Clone the repository
git clone https://github.com/jobayer12/NestJS-RBAC
cd NestJS-RBAC

# Install dependencies
npm install
```

### Run the Application

```bash
# Development mode with auto-reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The server will start on `http://localhost:3000`

### Access Swagger Documentation

Once the server is running, visit:

```
http://localhost:3000/api
```

You'll see a complete interactive API documentation with all endpoints, test them directly in the browser!

### Project Structure

```
src/
├── example1-roles/                  # Hierarchical role-based system
│   ├── controllers/
│   │   └── users.controller.ts
│   ├── decorators/
│   │   ├── public.decorator.ts
│   │   └── roles.decorator.ts
│   ├── dto/
│   │   ├── login.dto.ts
│   │   └── login-response.dto.ts
│   ├── enums/
│   │   └── roles.enum.ts
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── roles.guard.ts
│   ├── services/
│   │   └── jwt.service.ts
│   └── example1.module.ts
│
├── example2-permissions/            # Action-based permission system
│   ├── controllers/
│   │   ├── posts.controller.ts
│   │   └── auth.controller.ts
│   ├── decorators/
│   │   ├── public.decorator.ts
│   │   └── permissions.decorator.ts
│   ├── dto/
│   │   ├── login.dto.ts
│   │   └── login-response.dto.ts
│   ├── enums/
│   │   └── permissions.enum.ts
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── permissions.guard.ts
│   ├── services/
│   │   └── auth.service.ts
│   └── example2.module.ts
│
├── example3-modules/                # Module-based permission system
│   ├── controllers/
│   │   ├── users.controller.ts
│   │   ├── products.controller.ts
│   │   ├── orders.controller.ts
│   │   └── auth.controller.ts
│   ├── decorators/
│   │   ├── public.decorator.ts
│   │   └── module-permissions.decorator.ts
│   ├── dto/
│   │   ├── login.dto.ts
│   │   └── login-response.dto.ts
│   ├── enums/
│   │   └── module-permissions.enum.ts
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── module-permissions.guard.ts
│   ├── services/
│   │   └── auth.service.ts
│   └── example3.module.ts
│
├── app.module.ts                    # Root module
└── main.ts                          # Application entry point
```

---

## Example 1: Hierarchical Role-Based System

This example implements a traditional role hierarchy where users have roles like Read, Admin, Manager, and Super Admin. It's perfect for organizations with clear reporting structures.

### When to Use This Approach

- Corporate applications with defined job roles
- Systems with organizational hierarchies
- Applications where roles map directly to job positions
- When users typically need all permissions associated with their role

### Step 1: Define Roles Enum

```typescript
// src/example1-roles/enums/roles.enum.ts
export enum Role {
  READ = 'read',
  ADMIN = 'admin',
  MANAGER = 'manager',
  SUPER_ADMIN = 'super_admin',
}
```

### Step 2: Create Public Decorator

```typescript
// src/example1-roles/decorators/public.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

This decorator marks routes that don't require authentication.

### Step 3: Create Roles Decorator

```typescript
// src/example1-roles/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
```

This decorator specifies which roles can access an endpoint.

### Step 4: Build JWT Authentication Service

```typescript
// src/example1-roles/services/jwt.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { Role } from '../enums/roles.enum';

interface User {
  username: string;
  password: string;
  roles: Role[];
}

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: NestJwtService) {}

  // Mock database of users
  private readonly users: User[] = [
    {
      username: 'john_admin',
      password: 'password123',
      roles: [Role.ADMIN, Role.READ],
    },
    {
      username: 'jane_manager',
      password: 'password123',
      roles: [Role.MANAGER, Role.READ],
    },
    {
      username: 'super_admin',
      password: 'password123',
      roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.READ],
    },
    {
      username: 'reader',
      password: 'password123',
      roles: [Role.READ],
    },
  ];

  validateUser(username: string, password: string): User | null {
    const user = this.users.find(
      (u) => u.username === username && u.password === password,
    );
    return user || null;
  }

  generateToken(user: User): string {
    const payload = { username: user.username, roles: user.roles };
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): any {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
```

### Step 5: Build Authentication Guard

```typescript
// src/example1-roles/guards/auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { JwtAuthService } from '../services/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtAuthService: JwtAuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Authentication token not found');
    }

    try {
      // Verify and decode JWT token
      const payload = this.jwtAuthService.verifyToken(token);

      // Attach user to request object
      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token validation failed');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return undefined;
    }

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
```

### Step 6: Build Roles Guard

```typescript
// src/example1-roles/guards/roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.roles) {
      throw new ForbiddenException('User roles not found');
    }

    // Check if user has ANY of the required roles (OR logic)
    const hasRole = requiredRoles.some((role) => user.roles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}. Your roles: ${user.roles.join(', ')}`,
      );
    }

    return true;
  }
}
```

### Step 7: Create Login and User Controllers

```typescript
// src/example1-roles/controllers/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  Body,
  Param,
  Request,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Public } from '../decorators/public.decorator';
import { Role } from '../enums/roles.enum';
import { JwtAuthService } from '../services/jwt.service';
import { LoginDto } from '../dto/login.dto';

@Controller('example1/users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private jwtAuthService: JwtAuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    const user = this.jwtAuthService.validateUser(
      loginDto.username,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const token = this.jwtAuthService.generateToken(user);

    return {
      message: 'Login successful',
      token,
      user: {
        username: user.username,
        roles: user.roles,
      },
    };
  }

  @Get()
  @Roles(Role.READ, Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN)
  findAll(@Request() req) {
    return {
      message: 'List of all users',
      requestedBy: req.user.username,
      userRoles: req.user.roles,
      data: [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Manager' },
        { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'User' },
      ],
    };
  }

  @Get(':id')
  @Roles(Role.READ, Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN)
  findOne(@Param('id') id: string, @Request() req) {
    return {
      message: `User ${id} details`,
      requestedBy: req.user.username,
      data: {
        id: parseInt(id),
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Admin',
        createdAt: '2024-01-01',
        lastLogin: '2024-12-24',
      },
    };
  }

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  create(@Body() createUserDto: any, @Request() req) {
    return {
      message: 'User created successfully',
      createdBy: req.user.username,
      data: {
        id: Date.now(),
        ...createUserDto,
        createdAt: new Date(),
      },
    };
  }

  @Put(':id')
  @Roles(Role.MANAGER, Role.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: any, @Request() req) {
    return {
      message: `User ${id} updated successfully`,
      updatedBy: req.user.username,
      data: {
        id: parseInt(id),
        ...updateUserDto,
        updatedAt: new Date(),
      },
    };
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  delete(@Param('id') id: string, @Request() req) {
    return {
      message: `User ${id} deleted successfully`,
      deletedBy: req.user.username,
    };
  }

  @Get('dashboard/stats')
  @Roles(Role.ADMIN)
  getDashboard(@Request() req) {
    return {
      message: 'Admin dashboard',
      viewedBy: req.user.username,
      stats: {
        totalUsers: 150,
        activeUsers: 120,
        inactiveUsers: 30,
        newThisMonth: 15,
      },
    };
  }
}
```

### Step 8: Create Module and Configure JWT

```typescript
// src/example1-roles/example1.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from './controllers/users.controller';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthService } from './services/jwt.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'your-secret-key-change-this-in-production',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [UsersController],
  providers: [AuthGuard, RolesGuard, JwtAuthService],
})
export class Example1Module {}
```

### Testing Example 1

```bash
# Step 1: Login to get JWT token
curl -X POST http://localhost:3000/example1/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john_admin","password":"password123"}'

# Response:
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "john_admin",
    "roles": ["admin", "read"]
  }
}

# Step 2: Use the token to access protected endpoints
curl -H "Authorization: Bearer <your-token-here>" \
  http://localhost:3000/example1/users

# Step 3: Try to access admin-only endpoint with READ role (FAIL)
curl -X POST http://localhost:3000/example1/users \
  -H "Authorization: Bearer <reader-token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"New User","email":"new@example.com"}'

# Step 4: Access admin-only endpoint with ADMIN role (SUCCESS)
curl -X POST http://localhost:3000/example1/users \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"New User","email":"new@example.com"}'
```

**Available Test Users:**
- `john_admin` / `password123` - Admin + Read roles
- `jane_manager` / `password123` - Manager + Read roles
- `super_admin` / `password123` - All roles
- `reader` / `password123` - Read-only role

---

## Example 2: Action-Based Permission System

This example implements granular permissions based on specific actions: Read, Create, Update, Delete. It's ideal when you need fine-grained control over individual operations.

### When to Use This Approach

- Applications requiring precise control over actions
- Systems where users need custom permission combinations
- APIs with clearly defined CRUD operations
- When permissions don't map to organizational roles

### Step 1: Define Permissions Enum

```typescript
// src/example2-permissions/enums/permissions.enum.ts
export enum Permission {
  READ = 'read',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}
```

### Step 2: Create Permissions Decorator

```typescript
// src/example2-permissions/decorators/permissions.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { Permission } from '../enums/permissions.enum';

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
```

### Step 3: Create Authentication Service

```typescript
// src/example2-permissions/services/auth.service.ts
import { Injectable } from '@nestjs/common';
import { Permission } from '../enums/permissions.enum';

interface User {
  username: string;
  password: string;
  permissions: Permission[];
}

@Injectable()
export class AuthService {
  // Mock database of users with permissions
  private readonly users: User[] = [
    {
      username: 'reader',
      password: 'password123',
      permissions: [Permission.READ],
    },
    {
      username: 'creator',
      password: 'password123',
      permissions: [Permission.READ, Permission.CREATE],
    },
    {
      username: 'editor',
      password: 'password123',
      permissions: [Permission.READ, Permission.UPDATE],
    },
    {
      username: 'admin',
      password: 'password123',
      permissions: [
        Permission.READ,
        Permission.CREATE,
        Permission.UPDATE,
        Permission.DELETE,
      ],
    },
  ];

  // Map to store generated tokens
  private readonly tokenMap = new Map<string, { username: string; permissions: Permission[] }>();

  validateUser(username: string, password: string): User | null {
    const user = this.users.find(
      (u) => u.username === username && u.password === password,
    );
    return user || null;
  }

  generateToken(username: string, permissions: Permission[]): string {
    const token = `token-${username}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    this.tokenMap.set(token, { username, permissions });
    return token;
  }

  validateToken(token: string): { username: string; permissions: Permission[] } | null {
    // Check dynamically generated tokens
    if (this.tokenMap.has(token)) {
      return this.tokenMap.get(token);
    }

    // Fallback to predefined tokens for backward compatibility
    const predefinedTokens: Record<string, { username: string; permissions: Permission[] }> = {
      'token-read-only': {
        username: 'reader',
        permissions: [Permission.READ],
      },
      'token-creator': {
        username: 'creator',
        permissions: [Permission.READ, Permission.CREATE],
      },
      'token-editor': {
        username: 'editor',
        permissions: [Permission.READ, Permission.UPDATE],
      },
      'token-full-access': {
        username: 'admin',
        permissions: [Permission.READ, Permission.CREATE, Permission.UPDATE, Permission.DELETE],
      },
    };

    return predefinedTokens[token] || null;
  }
}
```

### Step 4: Build Permissions Guard

```typescript
// src/example2-permissions/guards/permissions.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { Permission } from '../enums/permissions.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.permissions) {
      throw new ForbiddenException('User permissions not found');
    }

    // Check if user has ALL required permissions (AND logic)
    const hasAllPermissions = requiredPermissions.every((permission) =>
      user.permissions.includes(permission),
    );

    if (!hasAllPermissions) {
      const missingPermissions = requiredPermissions.filter(
        (permission) => !user.permissions.includes(permission),
      );

      throw new ForbiddenException(
        `Access denied. Missing permissions: ${missingPermissions.join(', ')}`,
      );
    }

    return true;
  }
}
```

### Step 5: Create Controllers

```typescript
// src/example2-permissions/controllers/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { Public } from '../decorators/public.decorator';

@Controller('example2/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto): LoginResponseDto {
    const user = this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const token = this.authService.generateToken(
      user.username,
      user.permissions,
    );

    return {
      message: 'Login successful',
      token,
      user: {
        username: user.username,
        permissions: user.permissions,
      },
    };
  }
}
```

```typescript
// src/example2-permissions/controllers/posts.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  Body,
  Param,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermissions } from '../decorators/permissions.decorator';
import { Public } from '../decorators/public.decorator';
import { Permission } from '../enums/permissions.enum';

@Controller('example2/posts')
@UseGuards(AuthGuard, PermissionsGuard)
export class PostsController {
  @Public()
  @Get('public')
  getPublicPosts() {
    return {
      message: 'Public posts - No authentication required',
      data: [
        { id: 1, title: 'Public Post 1', content: 'Content...' },
        { id: 2, title: 'Public Post 2', content: 'Content...' },
      ],
    };
  }

  @Get()
  @RequirePermissions(Permission.READ)
  findAll(@Request() req) {
    return {
      message: 'All posts',
      requestedBy: req.user.username,
      permissions: req.user.permissions,
      data: [
        { id: 1, title: 'Post 1', status: 'published' },
        { id: 2, title: 'Post 2', status: 'draft' },
      ],
    };
  }

  @Post()
  @RequirePermissions(Permission.CREATE)
  create(@Body() createPostDto: any, @Request() req) {
    return {
      message: 'Post created',
      createdBy: req.user.username,
      data: {
        id: Date.now(),
        ...createPostDto,
        createdAt: new Date(),
      },
    };
  }

  @Put(':id')
  @RequirePermissions(Permission.UPDATE)
  update(@Param('id') id: string, @Body() updatePostDto: any, @Request() req) {
    return {
      message: `Post ${id} updated`,
      updatedBy: req.user.username,
      data: {
        id: parseInt(id),
        ...updatePostDto,
        updatedAt: new Date(),
      },
    };
  }

  @Delete(':id')
  @RequirePermissions(Permission.DELETE)
  delete(@Param('id') id: string, @Request() req) {
    return {
      message: `Post ${id} deleted`,
      deletedBy: req.user.username,
    };
  }

  @Put(':id/publish')
  @RequirePermissions(Permission.UPDATE, Permission.CREATE)
  publish(@Param('id') id: string, @Request() req) {
    return {
      message: `Post ${id} published (requires both UPDATE and CREATE)`,
      publishedBy: req.user.username,
      data: {
        id: parseInt(id),
        status: 'published',
        publishedAt: new Date(),
      },
    };
  }
}
```

### Testing Example 2

```bash
# Step 1: Login to get token
curl -X POST http://localhost:3000/example2/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'

# Response:
{
  "message": "Login successful",
  "token": "token-admin-1735059123456-abc123",
  "user": {
    "username": "admin",
    "permissions": ["read", "create", "update", "delete"]
  }
}

# Step 2: Access public endpoint (no auth)
curl http://localhost:3000/example2/posts/public

# Step 3: Read posts (requires READ permission)
curl -H "Authorization: Bearer <your-token>" \
  http://localhost:3000/example2/posts

# Step 4: Create post (requires CREATE permission)
curl -X POST http://localhost:3000/example2/posts \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"New Post","content":"Content here"}'

# Step 5: Publish post (requires both UPDATE AND CREATE)
curl -X PUT http://localhost:3000/example2/posts/1/publish \
  -H "Authorization: Bearer <your-token>"
```

**Available Test Users:**
- `reader` / `password123` - READ permission only
- `creator` / `password123` - READ, CREATE permissions
- `editor` / `password123` - READ, UPDATE permissions
- `admin` / `password123` - All permissions (READ, CREATE, UPDATE, DELETE)

---

## Example 3: Module-Based Permission System

This example implements module-specific permissions following the `module:action` pattern (e.g., `users:read`, `posts:create`, `products:manage_inventory`). It's perfect for large applications with multiple domains.

### When to Use This Approach

- Large enterprise applications
- Multi-domain systems
- Applications with clear module boundaries
- When different teams manage different modules
- Systems requiring detailed audit trails by module

### Step 1: Define Module Permissions Enum

```typescript
// src/example3-modules/enums/module-permissions.enum.ts
export enum ModulePermission {
  // User Module
  USERS_LIST = 'users:list',
  USERS_READ = 'users:read',
  USERS_CREATE = 'users:create',
  USERS_UPDATE = 'users:update',
  USERS_DELETE = 'users:delete',

  // Post Module
  POSTS_LIST = 'posts:list',
  POSTS_READ = 'posts:read',
  POSTS_CREATE = 'posts:create',
  POSTS_UPDATE = 'posts:update',
  POSTS_DELETE = 'posts:delete',
  POSTS_PUBLISH = 'posts:publish',

  // Product Module
  PRODUCTS_LIST = 'products:list',
  PRODUCTS_READ = 'products:read',
  PRODUCTS_CREATE = 'products:create',
  PRODUCTS_UPDATE = 'products:update',
  PRODUCTS_DELETE = 'products:delete',
  PRODUCTS_MANAGE_INVENTORY = 'products:manage_inventory',

  // Order Module
  ORDERS_LIST = 'orders:list',
  ORDERS_READ = 'orders:read',
  ORDERS_CREATE = 'orders:create',
  ORDERS_UPDATE = 'orders:update',
  ORDERS_DELETE = 'orders:delete',
  ORDERS_CANCEL = 'orders:cancel',
  ORDERS_REFUND = 'orders:refund',
}
```

### Step 2: Create Module Permissions Decorator

```typescript
// src/example3-modules/decorators/module-permissions.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { ModulePermission } from '../enums/module-permissions.enum';

export const MODULE_PERMISSIONS_KEY = 'module_permissions';
export const RequireModulePermissions = (...permissions: ModulePermission[]) =>
  SetMetadata(MODULE_PERMISSIONS_KEY, permissions);
```

### Step 3: Create Authentication Service

```typescript
// src/example3-modules/services/auth.service.ts
import { Injectable } from '@nestjs/common';
import { ModulePermission } from '../enums/module-permissions.enum';

interface User {
  username: string;
  password: string;
  role: string;
  permissions: ModulePermission[];
}

@Injectable()
export class AuthService {
  // Mock database of users with module-based permissions
  private readonly users: User[] = [
    {
      username: 'admin',
      password: 'password123',
      role: 'Administrator',
      permissions: Object.values(ModulePermission), // All permissions
    },
    {
      username: 'content_manager',
      password: 'password123',
      role: 'Content Manager',
      permissions: [
        ModulePermission.POSTS_LIST,
        ModulePermission.POSTS_READ,
        ModulePermission.POSTS_CREATE,
        ModulePermission.POSTS_UPDATE,
        ModulePermission.POSTS_DELETE,
        ModulePermission.POSTS_PUBLISH,
      ],
    },
    {
      username: 'product_manager',
      password: 'password123',
      role: 'Product Manager',
      permissions: [
        ModulePermission.PRODUCTS_LIST,
        ModulePermission.PRODUCTS_READ,
        ModulePermission.PRODUCTS_CREATE,
        ModulePermission.PRODUCTS_UPDATE,
        ModulePermission.PRODUCTS_DELETE,
        ModulePermission.PRODUCTS_MANAGE_INVENTORY,
      ],
    },
    {
      username: 'customer_service',
      password: 'password123',
      role: 'Customer Service',
      permissions: [
        ModulePermission.USERS_LIST,
        ModulePermission.USERS_READ,
        ModulePermission.USERS_UPDATE,
        ModulePermission.ORDERS_LIST,
        ModulePermission.ORDERS_READ,
        ModulePermission.ORDERS_UPDATE,
        ModulePermission.ORDERS_CANCEL,
        ModulePermission.ORDERS_REFUND,
      ],
    },
    {
      username: 'readonly',
      password: 'password123',
      role: 'Read Only User',
      permissions: [
        ModulePermission.USERS_LIST,
        ModulePermission.USERS_READ,
        ModulePermission.POSTS_LIST,
        ModulePermission.POSTS_READ,
        ModulePermission.PRODUCTS_LIST,
        ModulePermission.PRODUCTS_READ,
        ModulePermission.ORDERS_LIST,
        ModulePermission.ORDERS_READ,
      ],
    },
  ];

  private readonly tokenMap = new Map<
    string,
    { username: string; role: string; permissions: ModulePermission[] }
  >();

  validateUser(username: string, password: string): User | null {
    return this.users.find(
      (u) => u.username === username && u.password === password,
    ) || null;
  }

  generateToken(username: string, role: string, permissions: ModulePermission[]): string {
    const token = `token-${username}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    this.tokenMap.set(token, { username, role, permissions });
    return token;
  }

  validateToken(token: string) {
    if (this.tokenMap.has(token)) {
      return this.tokenMap.get(token);
    }

    // Predefined tokens for backward compatibility
    const predefinedTokens = {
      'token-admin-full': {
        username: 'admin',
        role: 'Administrator',
        permissions: Object.values(ModulePermission),
      },
      'token-product-manager': {
        username: 'product_manager',
        role: 'Product Manager',
        permissions: [
          ModulePermission.PRODUCTS_LIST,
          ModulePermission.PRODUCTS_READ,
          ModulePermission.PRODUCTS_CREATE,
          ModulePermission.PRODUCTS_UPDATE,
          ModulePermission.PRODUCTS_DELETE,
          ModulePermission.PRODUCTS_MANAGE_INVENTORY,
        ],
      },
      // ... other predefined tokens
    };

    return predefinedTokens[token] || null;
  }
}
```

### Step 4: Create Module Controllers

**Users Controller:**

```typescript
// src/example3-modules/controllers/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  Body,
  Param,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { ModulePermissionsGuard } from '../guards/module-permissions.guard';
import { RequireModulePermissions } from '../decorators/module-permissions.decorator';
import { ModulePermission } from '../enums/module-permissions.enum';

@Controller('example3/users')
@UseGuards(AuthGuard, ModulePermissionsGuard)
export class UsersController {
  @Get()
  @RequireModulePermissions(ModulePermission.USERS_LIST)
  listUsers(@Request() req) {
    return {
      message: 'Users list',
      requestedBy: req.user.username,
      permission: ModulePermission.USERS_LIST,
      data: [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      ],
    };
  }

  @Get(':id')
  @RequireModulePermissions(ModulePermission.USERS_READ)
  getUser(@Param('id') id: string, @Request() req) {
    return {
      message: `User ${id} details`,
      requestedBy: req.user.username,
      permission: ModulePermission.USERS_READ,
      data: {
        id: parseInt(id),
        name: 'John Doe',
        email: 'john@example.com',
      },
    };
  }

  @Post()
  @RequireModulePermissions(ModulePermission.USERS_CREATE)
  createUser(@Body() createUserDto: any, @Request() req) {
    return {
      message: 'User created',
      createdBy: req.user.username,
      permission: ModulePermission.USERS_CREATE,
      data: { id: Date.now(), ...createUserDto },
    };
  }

  @Put(':id')
  @RequireModulePermissions(ModulePermission.USERS_UPDATE)
  updateUser(@Param('id') id: string, @Body() updateUserDto: any, @Request() req) {
    return {
      message: `User ${id} updated`,
      updatedBy: req.user.username,
      permission: ModulePermission.USERS_UPDATE,
    };
  }

  @Delete(':id')
  @RequireModulePermissions(ModulePermission.USERS_DELETE)
  deleteUser(@Param('id') id: string, @Request() req) {
    return {
      message: `User ${id} deleted`,
      deletedBy: req.user.username,
      permission: ModulePermission.USERS_DELETE,
    };
  }
}
```

**Products Controller:**

```typescript
// src/example3-modules/controllers/products.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  UseGuards,
  Body,
  Param,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { ModulePermissionsGuard } from '../guards/module-permissions.guard';
import { RequireModulePermissions } from '../decorators/module-permissions.decorator';
import { ModulePermission } from '../enums/module-permissions.enum';

@Controller('example3/products')
@UseGuards(AuthGuard, ModulePermissionsGuard)
export class ProductsController {
  @Get()
  @RequireModulePermissions(ModulePermission.PRODUCTS_LIST)
  listProducts(@Request() req) {
    return {
      message: 'Products list',
      requestedBy: req.user.username,
      data: [
        { id: 1, name: 'Product 1', price: 29.99, stock: 100 },
        { id: 2, name: 'Product 2', price: 49.99, stock: 50 },
      ],
    };
  }

  @Patch(':id/inventory')
  @RequireModulePermissions(ModulePermission.PRODUCTS_MANAGE_INVENTORY)
  manageInventory(
    @Param('id') id: string,
    @Body() inventoryDto: { stock: number; operation: 'add' | 'subtract' },
    @Request() req,
  ) {
    return {
      message: `Product ${id} inventory updated`,
      updatedBy: req.user.username,
      permission: ModulePermission.PRODUCTS_MANAGE_INVENTORY,
      data: {
        id: parseInt(id),
        operation: inventoryDto.operation,
        quantity: inventoryDto.stock,
      },
    };
  }

  // ... other CRUD methods
}
```

**Orders Controller:**

```typescript
// src/example3-modules/controllers/orders.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  UseGuards,
  Body,
  Param,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { ModulePermissionsGuard } from '../guards/module-permissions.guard';
import { RequireModulePermissions } from '../decorators/module-permissions.decorator';
import { ModulePermission } from '../enums/module-permissions.enum';

@Controller('example3/orders')
@UseGuards(AuthGuard, ModulePermissionsGuard)
export class OrdersController {
  @Get()
  @RequireModulePermissions(ModulePermission.ORDERS_LIST)
  listOrders(@Request() req) {
    return {
      message: 'Orders list',
      requestedBy: req.user.username,
      data: [
        { id: 1, orderNumber: 'ORD-001', total: 299.99, status: 'completed' },
        { id: 2, orderNumber: 'ORD-002', total: 149.50, status: 'pending' },
      ],
    };
  }

  @Patch(':id/cancel')
  @RequireModulePermissions(ModulePermission.ORDERS_CANCEL)
  cancelOrder(@Param('id') id: string, @Request() req) {
    return {
      message: `Order ${id} cancelled`,
      cancelledBy: req.user.username,
      permission: ModulePermission.ORDERS_CANCEL,
    };
  }

  @Patch(':id/refund')
  @RequireModulePermissions(ModulePermission.ORDERS_REFUND)
  refundOrder(
    @Param('id') id: string,
    @Body() refundDto: { amount: number; reason: string },
    @Request() req,
  ) {
    return {
      message: `Order ${id} refunded`,
      refundedBy: req.user.username,
      permission: ModulePermission.ORDERS_REFUND,
      data: {
        refundAmount: refundDto.amount,
        reason: refundDto.reason,
      },
    };
  }

  // ... other methods
}
```

### Testing Example 3

```bash
# Step 1: Login as product manager
curl -X POST http://localhost:3000/example3/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"product_manager","password":"password123"}'

# Response:
{
  "message": "Login successful",
  "token": "token-product_manager-1735059123456-xyz789",
  "user": {
    "username": "product_manager",
    "role": "Product Manager",
    "permissions": [
      "products:list",
      "products:read",
      "products:create",
      "products:update",
      "products:delete",
      "products:manage_inventory"
    ]
  }
}

# Step 2: Access products (SUCCESS - has permission)
curl -H "Authorization: Bearer <your-token>" \
  http://localhost:3000/example3/products

# Step 3: Manage inventory (SUCCESS - has permission)
curl -X PATCH http://localhost:3000/example3/products/1/inventory \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"stock":50,"operation":"add"}'

# Step 4: Try to access users (FAIL - no permission)
curl -H "Authorization: Bearer <your-token>" \
  http://localhost:3000/example3/users

# Step 5: Login as customer service
curl -X POST http://localhost:3000/example3/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"customer_service","password":"password123"}'

# Step 6: Access orders and refund (SUCCESS - has permissions)
curl -H "Authorization: Bearer <customer-service-token>" \
  http://localhost:3000/example3/orders

curl -X PATCH http://localhost:3000/example3/orders/1/refund \
  -H "Authorization: Bearer <customer-service-token>" \
  -H "Content-Type: application/json" \
  -d '{"amount":99.99,"reason":"Customer request"}'
```

**Available Test Users:**
- `admin` / `password123` - All permissions across all modules
- `content_manager` / `password123` - All POSTS_* permissions
- `product_manager` / `password123` - All PRODUCTS_* permissions
- `customer_service` / `password123` - USERS_* (read/update) and ORDERS_* permissions
- `readonly` / `password123` - All LIST and READ permissions across modules

---

## Comparison and Best Practices

### Feature Comparison

| Feature | Example 1 (Roles) | Example 2 (Permissions) | Example 3 (Module-Based) |
|---------|-------------------|------------------------|--------------------------|
| **Complexity** | Low | Medium | High |
| **Flexibility** | Low | High | Very High |
| **Scalability** | Medium | Medium | High |
| **Maintenance** | Easy | Medium | Complex |
| **Best For** | Small-Medium Apps | Medium Apps | Large Enterprise |
| **Team Size** | Single Team | Small Team | Multiple Teams |
| **Audit Trail** | Basic | Detailed | Very Detailed |
| **Granularity** | Role-level | Action-level | Module:Action-level |
| **Auth Type** | JWT | Token-based | Token-based |
| **Logic Type** | OR (any role matches) | AND (all permissions required) | AND (all permissions required) |

### When to Use Each Approach

**Example 1 - Hierarchical Roles:**
- Small to medium corporate applications
- Clear organizational hierarchies
- Simple permission models
- When roles align with job titles
- Quick setup and easy to understand

**Example 2 - Action Permissions:**
- Content management systems
- Applications with clear CRUD operations
- Medium-sized applications
- When users need custom permission combinations
- E-commerce platforms

**Example 3 - Module-Based Permissions:**
- Large enterprise applications
- Multi-tenant systems
- Applications with multiple domains/modules
- Systems requiring detailed audit trails
- When different teams manage different modules
- Microservices architectures

### Best Practices

#### Security

✅ **DO:**
- Always use HTTPS in production
- Implement token expiration and refresh
- Store tokens securely (httpOnly cookies for web)
- Log all authorization failures
- Implement rate limiting
- Use strong JWT secrets (at least 256 bits)
- Validate and sanitize all inputs

❌ **DON'T:**
- Hardcode secrets in code
- Return detailed error messages that leak security info
- Skip authentication on "internal" endpoints
- Trust client-side permission checks
- Store sensitive data in JWT payload

#### Code Quality

✅ **DO:**
- Keep guards simple and focused
- Use enums for type safety
- Document permission requirements
- Write unit tests for guards
- Use dependency injection
- Follow single responsibility principle

❌ **DON'T:**
- Mix authentication and authorization logic
- Hardcode permission checks in controllers
- Duplicate guard logic
- Skip error handling

#### Performance

✅ **DO:**
- Cache user permissions
- Minimize database queries
- Use indexes on permission tables
- Implement pagination for list endpoints
- Consider Redis for session management
- Use connection pooling

❌ **DON'T:**
- Query database on every request
- Load unnecessary user data
- Skip caching strategies
- Return large datasets without pagination

#### Architecture

✅ **DO:**
- Separate concerns (auth vs authz)
- Use decorators for metadata
- Apply guards at controller level when possible
- Create reusable DTOs
- Document API with Swagger

❌ **DON'T:**
- Put business logic in guards
- Create circular dependencies
- Skip module organization
- Mix different RBAC patterns

---

## Testing Guide

### Using Swagger UI

1. Start the server: `npm run start:dev`
2. Open browser: `http://localhost:3000/api`
3. Click "Authorize" button
4. Enter a test token (e.g., `token-admin`)
5. Try different endpoints

### Using cURL

#### Example 1 - Role-Based

```bash
# Login
curl -X POST http://localhost:3000/example1/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john_admin","password":"password123"}'

# Use returned token
TOKEN="<your-jwt-token-here>"

# List users (READ role)
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/example1/users

# Create user (ADMIN role)
curl -X POST http://localhost:3000/example1/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"New User","email":"new@example.com"}'

# Delete user (SUPER_ADMIN role - will fail if not super admin)
curl -X DELETE http://localhost:3000/example1/users/1 \
  -H "Authorization: Bearer $TOKEN"
```

#### Example 2 - Permission-Based

```bash
# Login
curl -X POST http://localhost:3000/example2/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'

TOKEN="<your-token-here>"

# Public endpoint (no auth)
curl http://localhost:3000/example2/posts/public

# List posts (READ permission)
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/example2/posts

# Create post (CREATE permission)
curl -X POST http://localhost:3000/example2/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Post","content":"Content here"}'

# Publish post (requires UPDATE + CREATE)
curl -X PUT http://localhost:3000/example2/posts/1/publish \
  -H "Authorization: Bearer $TOKEN"
```

#### Example 3 - Module-Based

```bash
# Login as product manager
curl -X POST http://localhost:3000/example3/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"product_manager","password":"password123"}'

TOKEN="<your-token-here>"

# List products (products:list)
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/example3/products

# Manage inventory (products:manage_inventory)
curl -X PATCH http://localhost:3000/example3/products/1/inventory \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"stock":100,"operation":"add"}'

# Try to access users (will FAIL - no permission)
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/example3/users
```

### Error Responses

**401 - Unauthorized (Authentication Failed):**
```json
{
  "statusCode": 401,
  "message": "Authentication token not found"
}
```

**403 - Forbidden (Authorization Failed):**
```json
{
  "statusCode": 403,
  "message": "Access denied. Missing permissions: delete"
}
```

**400 - Bad Request (Validation Failed):**
```json
{
  "statusCode": 400,
  "message": ["username should not be empty", "password should not be empty"],
  "error": "Bad Request"
}
```

### Success Responses

All successful requests return structured data:

```json
{
  "message": "Operation successful",
  "requestedBy": "john_admin",
  "permission": "users:read",
  "data": { ... }
}
```

---

## Production Deployment

### Environment Variables

Create a `.env` file:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# JWT Configuration (Example 1)
JWT_SECRET=your-super-secret-key-min-256-bits
JWT_EXPIRATION=24h
```

---

## Key Takeaways

1. **Separation of Concerns**: Always separate authentication from authorization
2. **Decorator Pattern**: Use metadata decorators for clean, declarative permission checks
3. **Guard Chain**: Apply AuthGuard first, then authorization guards
4. **Type Safety**: Use enums and TypeScript for compile-time safety
5. **Scalability**: Choose the right RBAC approach for your application size
6. **Security First**: Never skip authentication, validate all inputs, log failures
7. **Testing**: Use Swagger UI for interactive testing during development
8. **Production Ready**: Add database, caching, monitoring before deploying

---

## Additional Resources

- [NestJS Official Documentation](https://docs.nestjs.com)
- [Guards Documentation](https://docs.nestjs.com/guards)
- [Custom Decorators](https://docs.nestjs.com/custom-decorators)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is MIT licensed.

---

## Support

For questions or issues:
- Open an issue on GitHub
- Check the Swagger documentation at `/api`
- Review the code examples in this repository

---

Made with ❤️ for the NestJS community

**Happy Coding!** 🚀
