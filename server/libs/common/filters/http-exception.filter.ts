import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
    catch(exception: HttpException, host: ArgumentsHost):Promise<any> {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        console.log(exception)
        const exceptionRes:any = exception.getResponse();
        let message = exceptionRes.message;
        const error = exceptionRes.error
        if(status === 401) {
            message = '请先登录'
        }
        response.status(200).json({
            code: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            error,
            msg: message,
        });
        return;
    }
}