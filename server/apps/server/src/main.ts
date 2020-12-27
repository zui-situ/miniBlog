import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'libs/common/filters/http-exception.filter';
import { ResponseInterceptor } from 'libs/common/interceptor/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //允许跨域
  app.enableCors();

  // 全局过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // 配置全局拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());
  
  const options = new DocumentBuilder()
    .setTitle('微信小博客小程序API')
    .setDescription('提供小程序界面调用的服务器API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app,options)
  SwaggerModule.setup('api-docs', app, document);

  const PORT = process.env.SERVER_PORT || 3001;
  await app.listen(PORT);
  console.log(`http://localhost:${PORT}/api-docs`)
}
bootstrap();
