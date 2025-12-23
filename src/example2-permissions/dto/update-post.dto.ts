import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, MaxLength, IsEnum } from 'class-validator';
import { PostStatus } from './create-post.dto';

export class UpdatePostDto {
  @ApiProperty({
    description: 'Post title',
    example: 'Updated NestJS Guide',
    minLength: 5,
    maxLength: 200,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(200)
  title?: string;

  @ApiProperty({
    description: 'Post content',
    example: 'Updated content about NestJS...',
    minLength: 10,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(10)
  content?: string;

  @ApiProperty({
    description: 'Post status',
    enum: PostStatus,
    example: PostStatus.PUBLISHED,
    required: false,
  })
  @IsEnum(PostStatus)
  @IsOptional()
  status?: PostStatus;
}
