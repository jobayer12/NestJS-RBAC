import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { ProductsController } from './controllers/products.controller';
import { OrdersController } from './controllers/orders.controller';
import { AuthController } from './controllers/auth.controller';
import { AuthGuard } from './guards/auth.guard';
import { ModulePermissionsGuard } from './guards/module-permissions.guard';
import { AuthService } from './services/auth.service';

@Module({
  controllers: [UsersController, ProductsController, OrdersController, AuthController],
  providers: [AuthGuard, ModulePermissionsGuard, AuthService],
})
export class Example3Module {}
