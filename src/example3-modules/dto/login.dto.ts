import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
      description: 'Username for authentication',
      example: 'reader',
      minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
      description: 'Password for authentication',
      example: 'password123',
      minLength: 6,
    })
  @IsString()
  @IsNotEmpty()
  password: string;
}
