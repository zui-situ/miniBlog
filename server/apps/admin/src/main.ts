import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpExceptionFilter } from 'libs/common/filters/http-exception.filter';
import { ResponseInterceptor } from 'libs/common/interceptor/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  //允许跨域
  app.enableCors();

  // 全局过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // 配置全局拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());
  
  app.useStaticAssets(join(__dirname,'../../../admin'),{
    prefix:'/admin'//添加前缀
  });//引入前端打包文件
  const options = new DocumentBuilder()
    .setTitle('微信小博客后台管理API')
    .setDescription('提供后台管理界面调用的服务器API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app,options)
  SwaggerModule.setup('api-docs', app, document);

  const PORT = process.env.ADMIN_PORT || 3002;
  await app.listen(PORT);
  console.log(`http://localhost:${PORT}/api-docs`)
}
bootstrap();
