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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermissions } from '../decorators/permissions.decorator';
import { Public } from '../decorators/public.decorator';
import { Permission } from '../enums/permissions.enum';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import {
  PostsListResponseDto,
  PostDetailResponseDto,
  PostResponseDto,
  DeletePostResponseDto,
  PublicPostsResponseDto,
} from '../dto/post-response.dto';
import {
  ErrorResponseDto,
  ForbiddenResponseDto,
  ValidationErrorResponseDto,
} from '../../common/dto/common-response.dto';

@ApiTags('Example 2 - Permission-Based')
@Controller('example2/posts')
@UseGuards(AuthGuard, PermissionsGuard)
@ApiBearerAuth('bearer')
export class PostsController {
  @Public()
  @Get('public')
  @ApiOperation({ summary: 'Get public posts', description: 'Retrieve public posts (no authentication required)' })
  @ApiResponse({ status: 200, description: 'Public posts retrieved successfully', type: PublicPostsResponseDto })
  getPublicPosts() {
    return {
      message: 'Public posts',
      data: [
        { id: 1, title: 'Public Post 1', content: 'Content...', status: 'published' },
        { id: 2, title: 'Public Post 2', content: 'Content...', status: 'published' },
      ],
    };
  }

  @Get()
  @RequirePermissions(Permission.READ)
  @ApiOperation({ summary: 'Get all posts', description: 'Retrieve all posts (requires READ permission)' })
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully', type: PostsListResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions', type: ForbiddenResponseDto })
  findAll(@Request() req) {
    return {
      message: 'All posts',
      requestedBy: req.user.username,
      permissions: req.user.permissions,
      data: [
        { id: 1, title: 'Post 1', status: 'published' },
        { id: 2, title: 'Post 2', status: 'draft' },
        { id: 3, title: 'Post 3', status: 'published' },
      ],
    };
  }

  @Get(':id')
  @RequirePermissions(Permission.READ)
  @ApiOperation({ summary: 'Get post by ID', description: 'Retrieve a specific post by ID (requires READ permission)' })
  @ApiParam({ name: 'id', description: 'Post ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Post retrieved successfully', type: PostDetailResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions', type: ForbiddenResponseDto })
  findOne(@Param('id') id: string, @Request() req) {
    return {
      message: `Post ${id} details`,
      requestedBy: req.user.username,
      data: {
        id: parseInt(id),
        title: 'Sample Post',
        content: 'Full content here...',
        author: 'John Doe',
        status: 'published',
        createdAt: '2024-12-01',
      },
    };
  }

  @Post()
  @RequirePermissions(Permission.CREATE)
  @ApiOperation({ summary: 'Create new post', description: 'Create a new post (requires CREATE permission)' })
  @ApiResponse({ status: 201, description: 'Post created successfully', type: PostResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error', type: ValidationErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions', type: ForbiddenResponseDto })
  create(@Body() createPostDto: CreatePostDto, @Request() req) {
    return {
      message: 'Post created',
      createdBy: req.user.username,
      data: {
        id: Date.now(),
        ...createPostDto,
        createdAt: new Date(),
      },
    };
  }

  @Put(':id')
  @RequirePermissions(Permission.UPDATE)
  @ApiOperation({ summary: 'Update post', description: 'Update an existing post (requires UPDATE permission)' })
  @ApiParam({ name: 'id', description: 'Post ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Post updated successfully', type: PostResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error', type: ValidationErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions', type: ForbiddenResponseDto })
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req,
  ) {
    return {
      message: `Post ${id} updated`,
      updatedBy: req.user.username,
      data: {
        id: parseInt(id),
        ...updatePostDto,
        updatedAt: new Date(),
      },
    };
  }

  @Delete(':id')
  @RequirePermissions(Permission.DELETE)
  @ApiOperation({ summary: 'Delete post', description: 'Delete a post (requires DELETE permission)' })
  @ApiParam({ name: 'id', description: 'Post ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully', type: DeletePostResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions', type: ForbiddenResponseDto })
  delete(@Param('id') id: string, @Request() req) {
    return {
      message: `Post ${id} deleted`,
      deletedBy: req.user.username,
    };
  }

  @Put(':id/publish')
  @RequirePermissions(Permission.UPDATE, Permission.CREATE)
  @ApiOperation({ summary: 'Publish post', description: 'Publish a post (requires UPDATE and CREATE permissions)' })
  @ApiParam({ name: 'id', description: 'Post ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Post published successfully', type: PostResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions', type: ForbiddenResponseDto })
  publish(@Param('id') id: string, @Request() req) {
    return {
      message: `Post ${id} published`,
      publishedBy: req.user.username,
      data: {
        id: parseInt(id),
        status: 'published',
        publishedAt: new Date(),
      },
    };
  }
}
