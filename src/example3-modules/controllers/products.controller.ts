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
import { CreateProductDto, UpdateProductDto, UpdateInventoryDto } from '../dto/product.dto';
import { ProductsListResponseDto, ProductResponseDto } from '../dto/response.dto';
import {
  ErrorResponseDto,
  ForbiddenResponseDto,
  ValidationErrorResponseDto,
} from '../../common/dto/common-response.dto';

@ApiTags('Example 3 - Module-Based')
@Controller('example3/products')
@UseGuards(AuthGuard, ModulePermissionsGuard)
@ApiBearerAuth('bearer')
export class ProductsController {
  @Get()
  @RequireModulePermissions(ModulePermission.PRODUCTS_LIST)
  @ApiOperation({ summary: 'List all products', description: 'Retrieve list of all products (requires PRODUCTS_LIST permission)' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully', type: ProductsListResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions', type: ForbiddenResponseDto })
  listProducts(@Request() req, @Query() query: any) {
    return {
      message: 'Products list',
      requestedBy: req.user.username,
      permission: ModulePermission.PRODUCTS_LIST,
      data: [
        { id: 1, name: 'Product 1', price: 29.99, stock: 100 },
        { id: 2, name: 'Product 2', price: 49.99, stock: 50 },
      ],
    };
  }

  @Get(':id')
  @RequireModulePermissions(ModulePermission.PRODUCTS_READ)
  @ApiOperation({ summary: 'Get product by ID', description: 'Retrieve a specific product by ID (requires PRODUCTS_READ permission)' })
  @ApiParam({ name: 'id', description: 'Product ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully', type: ProductResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions', type: ForbiddenResponseDto })
  getProduct(@Param('id') id: string, @Request() req) {
    return {
      message: `Product ${id} details`,
      requestedBy: req.user.username,
      permission: ModulePermission.PRODUCTS_READ,
      data: {
        id: parseInt(id),
        name: 'Product 1',
        price: 29.99,
        stock: 100,
      },
    };
  }

  @Post()
  @RequireModulePermissions(ModulePermission.PRODUCTS_CREATE)
  @ApiOperation({ summary: 'Create new product', description: 'Create a new product (requires PRODUCTS_CREATE permission)' })
  @ApiResponse({ status: 201, description: 'Product created successfully', type: ProductResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error', type: ValidationErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions', type: ForbiddenResponseDto })
  createProduct(@Body() createProductDto: CreateProductDto, @Request() req) {
    return {
      message: 'Product created',
      createdBy: req.user.username,
      permission: ModulePermission.PRODUCTS_CREATE,
      data: {
        id: Date.now(),
        ...createProductDto,
      },
    };
  }

  @Put(':id')
  @RequireModulePermissions(ModulePermission.PRODUCTS_UPDATE)
  @ApiOperation({ summary: 'Update product', description: 'Update an existing product (requires PRODUCTS_UPDATE permission)' })
  @ApiParam({ name: 'id', description: 'Product ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Product updated successfully', type: ProductResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error', type: ValidationErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions', type: ForbiddenResponseDto })
  updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req,
  ) {
    return {
      message: `Product ${id} updated`,
      updatedBy: req.user.username,
      permission: ModulePermission.PRODUCTS_UPDATE,
      data: {
        id: parseInt(id),
        ...updateProductDto,
      },
    };
  }

  @Patch(':id/inventory')
  @RequireModulePermissions(ModulePermission.PRODUCTS_MANAGE_INVENTORY)
  @ApiOperation({ summary: 'Manage product inventory', description: 'Update product inventory (requires PRODUCTS_MANAGE_INVENTORY permission)' })
  @ApiParam({ name: 'id', description: 'Product ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Product inventory updated successfully', type: ProductResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error', type: ValidationErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions', type: ForbiddenResponseDto })
  manageInventory(
    @Param('id') id: string,
    @Body() inventoryDto: UpdateInventoryDto,
    @Request() req,
  ) {
    return {
      message: `Product ${id} inventory updated`,
      updatedBy: req.user.username,
      permission: ModulePermission.PRODUCTS_MANAGE_INVENTORY,
      data: {
        id: parseInt(id),
        quantity: inventoryDto.quantity,
      },
    };
  }

  @Delete(':id')
  @RequireModulePermissions(ModulePermission.PRODUCTS_DELETE)
  @ApiOperation({ summary: 'Delete product', description: 'Delete a product (requires PRODUCTS_DELETE permission)' })
  @ApiParam({ name: 'id', description: 'Product ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions', type: ForbiddenResponseDto })
  deleteProduct(@Param('id') id: string, @Request() req) {
    return {
      message: `Product ${id} deleted`,
      deletedBy: req.user.username,
      permission: ModulePermission.PRODUCTS_DELETE,
    };
  }
}
