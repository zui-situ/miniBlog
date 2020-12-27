import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { Response } from 'express';
import { map } from 'rxjs/operators';
import { RCode } from '../constant/rcode';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): import('rxjs').Observable<any> | Promise<import('rxjs').Observable<any>> {
        return next.handle().pipe(
            map(content => {
                content.msg = content.msg || '请求成功';
                content.code = content.code || RCode.OK;
                return content
            }),
        );
    }
}