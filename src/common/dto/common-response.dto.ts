import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: 401 })
  statusCode: number;

  @ApiProperty({ example: 'Unauthorized' })
  message: string;

  @ApiProperty({ example: 'Authentication token is required' })
  error: string;
}

export class ForbiddenResponseDto {
  @ApiProperty({ example: 403 })
  statusCode: number;

  @ApiProperty({ example: 'Forbidden' })
  message: string;

  @ApiProperty({ example: 'Insufficient permissions' })
  error: string;
}

export class ValidationErrorResponseDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({
    example: ['username must be at least 3 characters', 'password must be at least 6 characters'],
    isArray: true,
  })
  message: string[];

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}
