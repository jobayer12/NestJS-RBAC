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
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { ModulePermissionsGuard } from '../guards/module-permissions.guard';
import { RequireModulePermissions } from '../decorators/module-permissions.decorator';
import { ModulePermission } from '../enums/module-permissions.enum';
import { CreateOrderDto, UpdateOrderDto, RefundDto } from '../dto/order.dto';
import { OrdersListResponseDto, OrderResponseDto } from '../dto/response.dto';
import {
  ErrorResponseDto,
  ForbiddenResponseDto,
  ValidationErrorResponseDto,
} from '../../common/dto/common-response.dto';

@ApiTags('Example 3 - Module-Based')
@Controller('example3/orders')
@UseGuards(AuthGuard, ModulePermissionsGuard)
@ApiBearerAuth('bearer')
export class OrdersController {
  @Get()
  @RequireModulePermissions(ModulePermission.ORDERS_LIST)
  @ApiOperation({ summary: 'List all orders', description: 'Retrieve list of all orders (requires ORDERS_LIST permission)' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully', type: OrdersListResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions', type: ForbiddenResponseDto })
  listOrders(@Request() req, @Query() query: any) {
    return {
      message: 'Orders list',
      requestedBy: req.user.username,
      permission: ModulePermission.ORDERS_LIST,
      data: [
        {
          id: 1,
          customerName: 'John Doe',
          product: 'Laptop',
          quantity: 2,
          totalAmount: 1999.98,
          status: 'completed',
        },
        {
          id: 2,
          customerName: 'Jane Smith',
          product: 'Mouse',
          quantity: 1,
          totalAmount: 49.99,
          status: 'pending'
        },
      ],
    };
  }

  @Get(':id')
  @RequireModulePermissions(ModulePermission.ORDERS_READ)
  @ApiOperation({ summary: 'Get order by ID', description: 'Retrieve a specific order by ID (requires ORDERS_READ permission)' })
  @ApiParam({ name: 'id', description: 'Order ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully', type: OrderResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions', type: ForbiddenResponseDto })
  getOrder(@Param('id') id: string, @Request() req) {
    return {
      message: `Order ${id} details`,
      requestedBy: req.user.username,
      permission: ModulePermission.ORDERS_READ,
      data: {
        id: parseInt(id),
        customerName: 'John Doe',
        product: 'Laptop',
        quantity: 2,
        totalAmount: 1999.98,
        status: 'completed',
      },
    };
  }

  @Post()
  @RequireModulePermissions(ModulePermission.ORDERS_CREATE)
  @ApiOperation({ summary: 'Create new order', description: 'Create a new order (requires ORDERS_CREATE permission)' })
  @ApiResponse({ status: 201, description: 'Order created successfully', type: OrderResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error', type: ValidationErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions', type: ForbiddenResponseDto })
  createOrder(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return {
      message: 'Order created',
      createdBy: req.user.username,
      permission: ModulePermission.ORDERS_CREATE,
      data: {
        id: Date.now(),
        ...createOrderDto,
        status: 'pending',
      },
    };
  }

  @Put(':id')
  @RequireModulePermissions(ModulePermission.ORDERS_UPDATE)
  @ApiOperation({ summary: 'Update order', description: 'Update an existing order (requires ORDERS_UPDATE permission)' })
  @ApiParam({ name: 'id', description: 'Order ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Order updated successfully', type: OrderResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error', type: ValidationErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions', type: ForbiddenResponseDto })
  updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Request() req,
  ) {
    return {
      message: `Order ${id} updated`,
      updatedBy: req.user.username,
      permission: ModulePermission.ORDERS_UPDATE,
      data: {
        id: parseInt(id),
        ...updateOrderDto,
      },
    };
  }

  @Patch(':id/cancel')
  @RequireModulePermissions(ModulePermission.ORDERS_CANCEL)
  @ApiOperation({ summary: 'Cancel order', description: 'Cancel an order (requires ORDERS_CANCEL permission)' })
  @ApiParam({ name: 'id', description: 'Order ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Order cancelled successfully', type: OrderResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions', type: ForbiddenResponseDto })
  cancelOrder(@Param('id') id: string, @Request() req) {
    return {
      message: `Order ${id} cancelled`,
      cancelledBy: req.user.username,
      permission: ModulePermission.ORDERS_CANCEL,
      data: {
        id: parseInt(id),
        status: 'cancelled',
      },
    };
  }

  @Patch(':id/refund')
  @RequireModulePermissions(ModulePermission.ORDERS_REFUND)
  @ApiOperation({ summary: 'Refund order', description: 'Process order refund (requires ORDERS_REFUND permission)' })
  @ApiParam({ name: 'id', description: 'Order ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Order refunded successfully', type: OrderResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error', type: ValidationErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions', type: ForbiddenResponseDto })
  refundOrder(
    @Param('id') id: string,
    @Body() refundDto: RefundDto,
    @Request() req,
  ) {
    return {
      message: `Order ${id} refunded`,
      refundedBy: req.user.username,
      permission: ModulePermission.ORDERS_REFUND,
      data: {
        id: parseInt(id),
        refundAmount: refundDto.amount,
        refundReason: refundDto.reason,
      },
    };
  }

  @Delete(':id')
  @RequireModulePermissions(ModulePermission.ORDERS_DELETE)
  @ApiOperation({ summary: 'Delete order', description: 'Delete an order (requires ORDERS_DELETE permission)' })
  @ApiParam({ name: 'id', description: 'Order ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Order deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions', type: ForbiddenResponseDto })
  deleteOrder(@Param('id') id: string, @Request() req) {
    return {
      message: `Order ${id} deleted`,
      deletedBy: req.user.username,
      permission: ModulePermission.ORDERS_DELETE,
    };
  }
}
