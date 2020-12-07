//自定义装饰器
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express';

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext)=>{
    const req:Request = ctx.switchToHttp().getRequest();
    return req.user
})
