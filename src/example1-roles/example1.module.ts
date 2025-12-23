import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from './controllers/users.controller';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthService } from './services/jwt.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'your-secret-key-change-this-in-production', // In production, use environment variables
      signOptions: {
        expiresIn: '24h', // Token expires in 24 hours
      },
    }),
  ],
  controllers: [UsersController],
  providers: [AuthGuard, RolesGuard, JwtAuthService],
})
export class Example1Module {}
