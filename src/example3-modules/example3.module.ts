import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { ProductsController } from './controllers/products.controller';
import { OrdersController } from './controllers/orders.controller';
import { AuthGuard } from './guards/auth.guard';
import { ModulePermissionsGuard } from './guards/module-permissions.guard';

@Module({
  controllers: [UsersController, ProductsController, OrdersController],
  providers: [AuthGuard, ModulePermissionsGuard],
})
export class Example3Module {}
