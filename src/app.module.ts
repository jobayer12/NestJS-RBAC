import { Module } from '@nestjs/common';
import { Example1Module } from './example1-roles/example1.module';
import { Example2Module } from './example2-permissions/example2.module';
import { Example3Module } from './example3-modules/example3.module';

@Module({
  imports: [Example1Module, Example2Module, Example3Module],
})
export class AppModule {}
