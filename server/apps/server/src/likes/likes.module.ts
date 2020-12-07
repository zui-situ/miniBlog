import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';

@Module({
  controllers: [LikesController]
})
export class LikesModule {}
