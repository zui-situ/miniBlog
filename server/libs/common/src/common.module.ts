import { Module, Global, CacheModule } from '@nestjs/common';
import { CommonService } from './common.service';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from '@app/db';
import { JwtModule } from '@nestjs/jwt'


//标记为全局引用模块
@Global()

@Module({
  imports:[
    //设置配置项
    ConfigModule.forRoot({
      isGlobal:true
    }),
    CacheModule.registerAsync({
      useFactory(){
        return{
          ttl:5, //秒
          max:10, //缓存中最大和最小数量
        }
      }
    }),
    JwtModule.registerAsync({
      useFactory(){
        return {
          secret:process.env.SECRET
        }
      }
    }),
    DbModule
  ],
  providers: [CommonService],
  exports: [CommonService,JwtModule],
})
export class CommonModule {}
