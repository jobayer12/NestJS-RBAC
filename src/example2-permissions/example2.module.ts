import { Module } from '@nestjs/common';
import { PostsController } from './controllers/posts.controller';
import { AuthController } from './controllers/auth.controller';
import { AuthGuard } from './guards/auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { AuthService } from './services/auth.service';

@Module({
  controllers: [PostsController, AuthController],
  providers: [AuthGuard, PermissionsGuard, AuthService],
})
export class Example2Module {}
