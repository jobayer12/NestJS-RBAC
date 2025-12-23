import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '../enums/permissions.enum';
import { PostStatus } from './create-post.dto';

export class PostData {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Getting Started with NestJS' })
  title: string;

  @ApiProperty({ example: 'NestJS is a progressive Node.js framework...', required: false })
  content?: string;

  @ApiProperty({ example: PostStatus.PUBLISHED, enum: PostStatus })
  status: PostStatus;

  @ApiProperty({ example: 'John Doe', required: false })
  author?: string;

  @ApiProperty({ example: '2024-12-01', required: false })
  createdAt?: string;

  @ApiProperty({ example: '2024-12-24T10:30:00Z', required: false })
  updatedAt?: Date;

  @ApiProperty({ example: '2024-12-24T10:30:00Z', required: false })
  publishedAt?: Date;
}

export class PostsListResponseDto {
  @ApiProperty({ example: 'All posts' })
  message: string;

  @ApiProperty({ example: 'admin' })
  requestedBy: string;

  @ApiProperty({
    example: [Permission.READ, Permission.CREATE],
    enum: Permission,
    isArray: true
  })
  permissions: Permission[];

  @ApiProperty({ type: [PostData] })
  data: PostData[];
}

export class PostDetailResponseDto {
  @ApiProperty({ example: 'Post 1 details' })
  message: string;

  @ApiProperty({ example: 'admin', required: false })
  requestedBy?: string;

  @ApiProperty({ type: PostData })
  data: PostData;
}

export class PostResponseDto {
  @ApiProperty({ example: 'Post created' })
  message: string;

  @ApiProperty({ example: 'admin', required: false })
  createdBy?: string;

  @ApiProperty({ example: 'admin', required: false })
  updatedBy?: string;

  @ApiProperty({ example: 'admin', required: false })
  deletedBy?: string;

  @ApiProperty({ example: 'admin', required: false })
  publishedBy?: string;

  @ApiProperty({ type: PostData })
  data: PostData;
}

export class DeletePostResponseDto {
  @ApiProperty({ example: 'Post 1 deleted' })
  message: string;

  @ApiProperty({ example: 'admin' })
  deletedBy: string;
}

export class PublicPostsResponseDto {
  @ApiProperty({ example: 'Public posts' })
  message: string;

  @ApiProperty({ type: [PostData] })
  data: PostData[];
}
