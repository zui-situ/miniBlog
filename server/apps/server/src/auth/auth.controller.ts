import { Controller, Post, Body, Get, UseGuards,HttpService, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { GetAppIdDto } from './dto/getAppId.dto';
import { DetailDto } from './dto/auth.dto';
import { UserDocument } from '@app/db/models/user.model';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from 'libs/common/decorator/current.user.decorator';

@Controller('auth')
@ApiTags('授权')

export class AuthController {
    constructor(
        private authService:AuthService
    ){}

    @Post('register')
    @ApiOperation({ summary:'注册' })
    async register(@Body() dto:RegisterDto):Promise<any>{
        return this.authService.register(dto);
    }

    @Post('login')
    @ApiOperation({ summary:'登录' })
    @UseGuards(AuthGuard('local'))
    async login(@Body() dto:LoginDto, @CurrentUser() user:UserDocument):Promise<any>{
        return this.authService.login(dto,user);
    }

    @Get('user')
    @ApiOperation({ summary:'获取用户信息' })
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()//标签这个接口需要传递token
    async user(@CurrentUser() user:UserDocument):Promise<any>{
        return this.authService.user(user);
    }

    @Get('userInfoByUserId')
    @ApiOperation({ summary:'通过userId获取用户信息' })
    async userInfoByUserId(@Query() dto:DetailDto):Promise<any>{
        return this.authService.userInfoByUserId(dto);
    }

    @Post('wxSaveUserByOpenId')
    @ApiOperation({ summary:'通过openid保存用户信息' })
    async wxSaveUserByOpenId(@Body() dto:GetAppIdDto):Promise<any>{
        return this.authService.wxSaveUserByOpenId(dto);
    }
}
