import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ModulePermission } from '../enums/module-permissions.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
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
      const user = await this.validateToken(token);

      if (!user) {
        throw new UnauthorizedException('Invalid authentication token');
      }

      request.user = user;
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

  private async validateToken(token: string): Promise<any> {
    const users = new Map([
      [
        'token-admin-full',
        {
          id: '1',
          username: 'admin',
          email: 'admin@example.com',
          permissions: Object.values(ModulePermission),
        },
      ],
      [
        'token-content-manager',
        {
          id: '2',
          username: 'content_manager',
          email: 'content@example.com',
          permissions: [
            ModulePermission.POSTS_LIST,
            ModulePermission.POSTS_READ,
            ModulePermission.POSTS_CREATE,
            ModulePermission.POSTS_UPDATE,
            ModulePermission.POSTS_PUBLISH,
          ],
        },
      ],
      [
        'token-product-manager',
        {
          id: '3',
          username: 'product_manager',
          email: 'products@example.com',
          permissions: [
            ModulePermission.PRODUCTS_LIST,
            ModulePermission.PRODUCTS_READ,
            ModulePermission.PRODUCTS_CREATE,
            ModulePermission.PRODUCTS_UPDATE,
            ModulePermission.PRODUCTS_MANAGE_INVENTORY,
          ],
        },
      ],
      [
        'token-customer-service',
        {
          id: '4',
          username: 'customer_service',
          email: 'support@example.com',
          permissions: [
            ModulePermission.USERS_LIST,
            ModulePermission.USERS_READ,
            ModulePermission.ORDERS_LIST,
            ModulePermission.ORDERS_READ,
            ModulePermission.ORDERS_UPDATE,
            ModulePermission.ORDERS_CANCEL,
            ModulePermission.ORDERS_REFUND,
          ],
        },
      ],
      [
        'token-readonly',
        {
          id: '5',
          username: 'readonly',
          email: 'readonly@example.com',
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
      ],
    ]);

    return users.get(token) || null;
  }
}
