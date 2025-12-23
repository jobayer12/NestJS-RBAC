import { ApiProperty } from '@nestjs/swagger';
import { ModulePermission } from '../enums/module-permissions.enum';

export class PaginationDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 100 })
  total: number;
}

export class UserData {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ example: 'Admin' })
  role: string;

  @ApiProperty({ example: '2024-01-01', required: false })
  createdAt?: string;
}

export class ProductData {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Laptop' })
  name: string;

  @ApiProperty({ example: 999.99 })
  price: number;

  @ApiProperty({ example: 50 })
  stock: number;

  @ApiProperty({ example: '2024-01-01', required: false })
  createdAt?: string;
}

export class OrderData {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Jane Smith' })
  customerName: string;

  @ApiProperty({ example: 'Laptop' })
  product: string;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ example: 1999.98 })
  totalAmount: number;

  @ApiProperty({ example: 'pending' })
  status: string;

  @ApiProperty({ example: '2024-12-24', required: false })
  orderDate?: string;
}

export class UsersListResponseDto {
  @ApiProperty({ example: 'Users list' })
  message: string;

  @ApiProperty({ example: 'admin' })
  requestedBy: string;

  @ApiProperty({ example: ModulePermission.USERS_LIST, enum: ModulePermission })
  permission: ModulePermission;

  @ApiProperty({ type: PaginationDto })
  pagination: PaginationDto;

  @ApiProperty({ type: [UserData] })
  data: UserData[];
}

export class UserDetailResponseDto {
  @ApiProperty({ example: 'User 1 details' })
  message: string;

  @ApiProperty({ example: 'admin' })
  requestedBy: string;

  @ApiProperty({ example: ModulePermission.USERS_READ, enum: ModulePermission })
  permission: ModulePermission;

  @ApiProperty({ type: UserData })
  data: UserData;
}

export class UserResponseDto {
  @ApiProperty({ example: 'User created' })
  message: string;

  @ApiProperty({ example: 'admin', required: false })
  createdBy?: string;

  @ApiProperty({ example: 'admin', required: false })
  updatedBy?: string;

  @ApiProperty({ example: ModulePermission.USERS_CREATE, enum: ModulePermission })
  permission: ModulePermission;

  @ApiProperty({ type: UserData })
  data: UserData;
}

export class DeleteUserResponseDto {
  @ApiProperty({ example: 'User 1 deleted' })
  message: string;

  @ApiProperty({ example: 'admin' })
  deletedBy: string;

  @ApiProperty({ example: ModulePermission.USERS_DELETE, enum: ModulePermission })
  permission: ModulePermission;
}

export class ProductsListResponseDto {
  @ApiProperty({ example: 'Products list' })
  message: string;

  @ApiProperty({ example: 'admin' })
  requestedBy: string;

  @ApiProperty({ example: ModulePermission.PRODUCTS_LIST, enum: ModulePermission })
  permission: ModulePermission;

  @ApiProperty({ type: [ProductData] })
  data: ProductData[];
}

export class ProductResponseDto {
  @ApiProperty({ example: 'Product created' })
  message: string;

  @ApiProperty({ example: 'admin', required: false })
  createdBy?: string;

  @ApiProperty({ example: 'admin', required: false })
  updatedBy?: string;

  @ApiProperty({ example: ModulePermission.PRODUCTS_CREATE, enum: ModulePermission })
  permission: ModulePermission;

  @ApiProperty({ type: ProductData })
  data: ProductData;
}

export class OrdersListResponseDto {
  @ApiProperty({ example: 'Orders list' })
  message: string;

  @ApiProperty({ example: 'admin' })
  requestedBy: string;

  @ApiProperty({ example: ModulePermission.ORDERS_LIST, enum: ModulePermission })
  permission: ModulePermission;

  @ApiProperty({ type: [OrderData] })
  data: OrderData[];
}

export class OrderResponseDto {
  @ApiProperty({ example: 'Order created' })
  message: string;

  @ApiProperty({ example: 'admin', required: false })
  createdBy?: string;

  @ApiProperty({ example: 'admin', required: false })
  processedBy?: string;

  @ApiProperty({ example: ModulePermission.ORDERS_CREATE, enum: ModulePermission })
  permission: ModulePermission;

  @ApiProperty({ type: OrderData })
  data: OrderData;
}
