import { Controller, Post, Body, Get } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';


@Controller('auth')
@ApiTags('用户')
export class AuthController {
    @Post('register')
    @ApiOperation({ summary:'注册' })
    async register(@Body() dto:RegisterDto):Promise<RegisterDto>{
        return dto
    }

    @Post('login')
    @ApiOperation({ summary:'登录' })
    async login(@Body() dto:RegisterDto):Promise<RegisterDto>{
        return dto
    }

    @Get('user')
    @ApiOperation({ summary:'获取用户信息' })
    async user():Promise<any>{
        return;
    }
}
