import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { Public } from '../decorators/public.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Example 2 - Permission-Based')
@Controller('example2/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto): LoginResponseDto {
    const user = this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const token = this.authService.generateToken(
      user.username,
      user.permissions,
    );

    return {
      message: 'Login successful',
      token,
      user: {
        username: user.username,
        permissions: user.permissions,
      },
    };
  }
}
