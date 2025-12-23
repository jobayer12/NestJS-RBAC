import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
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
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { ModulePermissionsGuard } from '../guards/module-permissions.guard';
import { RequireModulePermissions } from '../decorators/module-permissions.decorator';
import { ModulePermission } from '../enums/module-permissions.enum';
import { CreateUserDto, UpdateUserDto, QueryParamsDto } from '../dto/user.dto';
import {
  UsersListResponseDto,
  UserDetailResponseDto,
  UserResponseDto,
  DeleteUserResponseDto,
} from '../dto/response.dto';
import {
  ErrorResponseDto,
  ForbiddenResponseDto,
  ValidationErrorResponseDto,
} from '../../common/dto/common-response.dto';

@ApiTags('Example 3 - Module-Based')
@Controller('example3/users')
@UseGuards(AuthGuard, ModulePermissionsGuard)
@ApiBearerAuth('bearer')
export class UsersController {
  @Get()
  @RequireModulePermissions(ModulePermission.USERS_LIST)
  @ApiOperation({ summary: 'List all users', description: 'Retrieve paginated list of users (requires USERS_LIST permission)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully', type: UsersListResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions', type: ForbiddenResponseDto })
  listUsers(@Request() req, @Query() query: QueryParamsDto) {
    return {
      message: 'Users list',
      requestedBy: req.user.username,
      permission: ModulePermission.USERS_LIST,
      pagination: {
        page: query.page || 1,
        limit: query.limit || 10,
        total: 100,
      },
      data: [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
      ],
    };
  }

  @Get(':id')
  @RequireModulePermissions(ModulePermission.USERS_READ)
  @ApiOperation({ summary: 'Get user by ID', description: 'Retrieve a specific user by ID (requires USERS_READ permission)' })
  @ApiParam({ name: 'id', description: 'User ID', example: '1' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully', type: UserDetailResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions', type: ForbiddenResponseDto })
  getUser(@Param('id') id: string, @Request() req) {
    return {
      message: `User ${id} details`,
      requestedBy: req.user.username,
      permission: ModulePermission.USERS_READ,
      data: {
        id: parseInt(id),
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Admin',
        createdAt: '2024-01-01',
      },
    };
  }

  @Post()
  @RequireModulePermissions(ModulePermission.USERS_CREATE)
  @ApiOperation({ summary: 'Create new user', description: 'Create a new user (requires USERS_CREATE permission)' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error', type: ValidationErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions', type: ForbiddenResponseDto })
  createUser(@Body() createUserDto: CreateUserDto, @Request() req) {
    return {
      message: 'User created',
      createdBy: req.user.username,
      permission: ModulePermission.USERS_CREATE,
      data: {
        id: Date.now(),
        ...createUserDto,
      },
    };
  }

  @Put(':id')
  @RequireModulePermissions(ModulePermission.USERS_UPDATE)
  @ApiOperation({ summary: 'Update user', description: 'Update an existing user (requires USERS_UPDATE permission)' })
  @ApiParam({ name: 'id', description: 'User ID', example: '1' })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error', type: ValidationErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions', type: ForbiddenResponseDto })
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    return {
      message: `User ${id} updated`,
      updatedBy: req.user.username,
      permission: ModulePermission.USERS_UPDATE,
      data: {
        id: parseInt(id),
        ...updateUserDto,
      },
    };
  }

  @Delete(':id')
  @RequireModulePermissions(ModulePermission.USERS_DELETE)
  @ApiOperation({ summary: 'Delete user', description: 'Delete a user (requires USERS_DELETE permission)' })
  @ApiParam({ name: 'id', description: 'User ID', example: '1' })
  @ApiResponse({ status: 200, description: 'User deleted successfully', type: DeleteUserResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions', type: ForbiddenResponseDto })
  deleteUser(@Param('id') id: string, @Request() req) {
    return {
      message: `User ${id} deleted`,
      deletedBy: req.user.username,
      permission: ModulePermission.USERS_DELETE,
    };
  }
}
