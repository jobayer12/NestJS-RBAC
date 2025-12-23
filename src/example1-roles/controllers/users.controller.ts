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
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Public } from '../decorators/public.decorator';
import { Role } from '../enums/roles.enum';
import { LoginDto } from '../dto/login.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import {
  LoginResponseDto,
  UsersListResponseDto,
  UserResponseDto,
  DeleteUserResponseDto,
  DashboardResponseDto,
} from '../dto/user-response.dto';
import {
  ErrorResponseDto,
  ForbiddenResponseDto,
  ValidationErrorResponseDto,
} from '../../common/dto/common-response.dto';
import { JwtAuthService } from '../services/jwt.service';

@ApiTags('Example 1 - Role-Based')
@Controller('example1/users')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth('bearer')
export class UsersController {
  constructor(private jwtAuthService: JwtAuthService) {}
  @Public()
  @Post('login')
  @ApiOperation({ summary: 'User login', description: 'Authenticate user and get access token' })
  @ApiResponse({ status: 200, description: 'Login successful', type: LoginResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error', type: ValidationErrorResponseDto })
  async login(@Body() loginDto: LoginDto) {
    // Validate user credentials
    const user = await this.jwtAuthService.validateUser(
      loginDto.username,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const token = this.jwtAuthService.generateToken(user);

    return {
      message: 'Login successful',
      token,
      user: {
        username: user.username,
        roles: user.roles,
      },
    };
  }

  @Get()
  @Roles(Role.READ, Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all users', description: 'Retrieve list of all users (requires READ, ADMIN, MANAGER, or SUPER_ADMIN role)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully', type: UsersListResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions', type: ForbiddenResponseDto })
  findAll(@Request() req) {
    return {
      message: 'List of all users',
      requestedBy: req.user.username,
      userRoles: req.user.roles,
      data: [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'Admin',
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'Manager',
        },
        {
          id: 3,
          name: 'Bob Wilson',
          email: 'bob@example.com',
          role: 'User',
        },
      ],
    };
  }

  @Get(':id')
  @Roles(Role.READ, Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get user by ID', description: 'Retrieve a specific user by ID (requires READ, ADMIN, MANAGER, or SUPER_ADMIN role)' })
  @ApiParam({ name: 'id', description: 'User ID', example: '1' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions', type: ForbiddenResponseDto })
  findOne(@Param('id') id: string, @Request() req) {
    return {
      message: `User ${id} details`,
      requestedBy: req.user.username,
      data: {
        id: parseInt(id),
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Admin',
        createdAt: '2024-01-01',
        lastLogin: '2024-12-24',
      },
    };
  }

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create new user', description: 'Create a new user (requires ADMIN or SUPER_ADMIN role)' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error', type: ValidationErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions', type: ForbiddenResponseDto })
  create(@Body() createUserDto: CreateUserDto, @Request() req) {
    return {
      message: 'User created successfully',
      createdBy: req.user.username,
      data: {
        id: Date.now(),
        ...createUserDto,
        createdAt: new Date(),
      },
    };
  }

  @Put(':id')
  @Roles(Role.MANAGER, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update user', description: 'Update an existing user (requires MANAGER or SUPER_ADMIN role)' })
  @ApiParam({ name: 'id', description: 'User ID', example: '1' })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error', type: ValidationErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions', type: ForbiddenResponseDto })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    return {
      message: `User ${id} updated successfully`,
      updatedBy: req.user.username,
      data: {
        id: parseInt(id),
        ...updateUserDto,
        updatedAt: new Date(),
      },
    };
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete user', description: 'Delete a user (requires SUPER_ADMIN role)' })
  @ApiParam({ name: 'id', description: 'User ID', example: '1' })
  @ApiResponse({ status: 200, description: 'User deleted successfully', type: DeleteUserResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions', type: ForbiddenResponseDto })
  delete(@Param('id') id: string, @Request() req) {
    return {
      message: `User ${id} deleted successfully`,
      deletedBy: req.user.username,
    };
  }

  @Get('dashboard/stats')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get dashboard stats', description: 'Retrieve admin dashboard statistics (requires ADMIN role)' })
  @ApiResponse({ status: 200, description: 'Dashboard stats retrieved successfully', type: DashboardResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions', type: ForbiddenResponseDto })
  getDashboard(@Request() req) {
    return {
      message: 'Admin dashboard',
      viewedBy: req.user.username,
      stats: {
        totalUsers: 150,
        activeUsers: 120,
        inactiveUsers: 30,
        newThisMonth: 15,
      },
    };
  }
}
