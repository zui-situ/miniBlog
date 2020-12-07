import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from 'libs/common/src';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from './auth/auth.module';
import { ArticlesModule } from './articles/articles.module';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { ActionsModule } from './actions/actions.module';
import { WebsocketModule } from './websocket/websocket.module';
import { MessageModule } from './message/message.module';
import MAO = require('multer-aliyun-oss');

@Module({
  imports: [
    CommonModule,
    //异步加载OSS配置
    MulterModule.registerAsync({
      useFactory(){
        return{
          storage: MAO({
            config: {
              region: process.env.OSS_REGION,
              accessKeyId:  process.env.OSS_ACCESS_KEY_ID,
              accessKeySecret:  process.env.OSS_ACCESS_KEY_SECRET,
              bucket:  process.env.OSS_BUCKET
            }
          })
        }
      }
    }),
    AuthModule,
    ArticlesModule,
    UsersModule,
    CommentsModule,
    LikesModule,
    ActionsModule,
    WebsocketModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
