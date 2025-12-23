import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional, IsEnum } from 'class-validator';

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export class CreatePostDto {
  @ApiProperty({
    description: 'Post title',
    example: 'Getting Started with NestJS',
    minLength: 5,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: 'Post content',
    example: 'NestJS is a progressive Node.js framework...',
    minLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  content: string;

  @ApiProperty({
    description: 'Post status',
    enum: PostStatus,
    example: PostStatus.DRAFT,
    required: false,
    default: PostStatus.DRAFT,
  })
  @IsEnum(PostStatus)
  @IsOptional()
  status?: PostStatus;
}
