import { SetMetadata } from '@nestjs/common';
import { ModulePermission } from '../enums/module-permissions.enum';

export const MODULE_PERMISSIONS_KEY = 'module_permissions';
export const RequireModulePermissions = (...permissions: ModulePermission[]) =>
  SetMetadata(MODULE_PERMISSIONS_KEY, permissions);
