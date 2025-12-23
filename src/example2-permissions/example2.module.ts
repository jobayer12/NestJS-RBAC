import { Module } from '@nestjs/common';
import { PostsController } from './controllers/posts.controller';
import { AuthGuard } from './guards/auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';

@Module({
  controllers: [PostsController],
  providers: [AuthGuard, PermissionsGuard],
})
export class Example2Module {}
