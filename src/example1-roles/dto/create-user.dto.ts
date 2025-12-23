import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { Role } from '../enums/roles.enum';

export class CreateUserDto {
  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User role',
    enum: Role,
    example: Role.ADMIN,
  })
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;

  @ApiProperty({
    description: 'User password',
    example: 'securePassword123',
    required: false,
  })
  @IsString()
  @IsOptional()
  password?: string;
}
