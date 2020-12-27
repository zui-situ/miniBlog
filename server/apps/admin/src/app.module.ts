import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DbModule } from '@app/db';
import { ArticlesController } from './articles/articles.controller';
import { ArticlesModule } from './articles/articles.module';
import { MulterModule } from '@nestjs/platform-express';
import MAO = require('multer-aliyun-oss');
import { CommonModule } from 'libs/common/src';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { CommentsModule } from './comments/comments.module';
import { MessagesModule } from './messages/messages.module';
import { ActionsModule } from './actions/actions.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'libs/common/strategy/local.strategy';
import { AuthModule } from './auth/auth.module';
import { ArticlesService } from './articles/articles.service';


@Module({
  imports: [
    CommonModule,
    PassportModule,
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
    UsersModule, 
    ArticlesModule, CommentsModule, MessagesModule, ActionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
