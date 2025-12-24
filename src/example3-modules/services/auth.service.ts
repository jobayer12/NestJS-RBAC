import { Injectable, UnauthorizedException } from '@nestjs/common';
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
      permissions: Object.values(ModulePermission),
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

  // Map to store generated tokens and their associated users
  private readonly tokenMap = new Map<
    string,
    { username: string; role: string; permissions: ModulePermission[] }
  >();

  validateUser(username: string, password: string): User | null {
    const user = this.users.find(
      (u) => u.username === username && u.password === password,
    );
    return user || null;
  }

  generateToken(
    username: string,
    role: string,
    permissions: ModulePermission[],
  ): string {
    // Generate a simple token (in production, use JWT or more secure method)
    const token = `token-${username}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    this.tokenMap.set(token, { username, role, permissions });
    return token;
  }

  validateToken(token: string): {
    username: string;
    role: string;
    permissions: ModulePermission[];
  } | null {
    // First check if it's a dynamically generated token
    if (this.tokenMap.has(token)) {
      return this.tokenMap.get(token);
    }

    // Fall back to the predefined tokens for backward compatibility
    const predefinedTokens: Record<
      string,
      { username: string; role: string; permissions: ModulePermission[] }
    > = {
      'token-admin-full': {
        username: 'admin',
        role: 'Administrator',
        permissions: Object.values(ModulePermission),
      },
      'token-content-manager': {
        username: 'content_manager',
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
      'token-customer-service': {
        username: 'customer_service',
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
      'token-readonly': {
        username: 'readonly',
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
    };

    return predefinedTokens[token] || null;
  }
}
