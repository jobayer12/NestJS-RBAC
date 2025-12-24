import { Injectable, UnauthorizedException } from '@nestjs/common';
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

  // Map to store generated tokens and their associated users
  private readonly tokenMap = new Map<string, { username: string; permissions: Permission[] }>();

  validateUser(username: string, password: string): User | null {
    const user = this.users.find(
      (u) => u.username === username && u.password === password,
    );
    return user || null;
  }

  generateToken(username: string, permissions: Permission[]): string {
    // Generate a simple token (in production, use JWT or more secure method)
    const token = `token-${username}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    this.tokenMap.set(token, { username, permissions });
    return token;
  }

  validateToken(token: string): { username: string; permissions: Permission[] } | null {
    // First check if it's a dynamically generated token
    if (this.tokenMap.has(token)) {
      return this.tokenMap.get(token);
    }

    // Fall back to the predefined tokens for backward compatibility
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
