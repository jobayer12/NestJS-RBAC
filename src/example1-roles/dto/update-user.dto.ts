import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { Role } from '../enums/roles.enum';

export class UpdateUserDto {
  @ApiProperty({
    description: 'User full name',
    example: 'John Doe Updated',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.updated@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'User role',
    enum: Role,
    example: Role.MANAGER,
    required: false,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
