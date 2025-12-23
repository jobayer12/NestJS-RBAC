import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Permission } from '../enums/permissions.enum';

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
        'token-read-only',
        {
          id: '1',
          username: 'reader',
          email: 'reader@example.com',
          permissions: [Permission.READ],
        },
      ],
      [
        'token-creator',
        {
          id: '2',
          username: 'creator',
          email: 'creator@example.com',
          permissions: [Permission.READ, Permission.CREATE],
        },
      ],
      [
        'token-editor',
        {
          id: '3',
          username: 'editor',
          email: 'editor@example.com',
          permissions: [Permission.READ, Permission.UPDATE],
        },
      ],
      [
        'token-full-access',
        {
          id: '4',
          username: 'admin',
          email: 'admin@example.com',
          permissions: [
            Permission.READ,
            Permission.CREATE,
            Permission.UPDATE,
            Permission.DELETE,
          ],
        },
      ],
    ]);

    return users.get(token) || null;
  }
}
