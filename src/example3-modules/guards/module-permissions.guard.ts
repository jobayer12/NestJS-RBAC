import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MODULE_PERMISSIONS_KEY } from '../decorators/module-permissions.decorator';
import { ModulePermission } from '../enums/module-permissions.enum';

@Injectable()
export class ModulePermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<
      ModulePermission[]
    >(MODULE_PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.permissions) {
      throw new ForbiddenException('User permissions not found');
    }

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
