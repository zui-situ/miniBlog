import { Controller, Post, Body, Get, UseGuards,HttpService, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { GetAppIdDto } from './dto/getAppId.dto';
import { detailDto } from './dto/auth.dto';
import { InjectModel } from 'nestjs-typegoose';
import { User,UserDocument } from '@app/db/models/user.model';
import { Auth } from '@app/db/models/auth.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { CurrentUser } from './current.user.decorator';
import { AxiosResponse } from 'axios';

@Controller('auth')
@ApiTags('授权')

export class AuthController {
    
    constructor(
        private jwtService:JwtService,
        private readonly http: HttpService,
        @InjectModel(User) private userModel:ReturnModelType<typeof User>,
        @InjectModel(Auth) private authModel:ReturnModelType<typeof Auth>
    ){}

    @Post('register')
    @ApiOperation({ summary:'注册' })
    async register(@Body() dto:RegisterDto):Promise<UserDocument>{
        const { username,password }:{ username:string,password:string } = dto;
        const user = await this.userModel.create({
            username,
            password
        })
        return user;
    }

    @Post('login')
    @ApiOperation({ summary:'登录' })
    @UseGuards(AuthGuard('local'))
    async login(@Body() dto:LoginDto, @CurrentUser() user:UserDocument):Promise<any>{
        return {
            token: this.jwtService.sign(String(user._id))
        }
    }

    @Get('user')
    @ApiOperation({ summary:'获取用户信息' })
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()//标签这个接口需要传递token
    async user(@CurrentUser() user:UserDocument):Promise<User>{
        return user;
    }

    @Get('userInfoByUserId')
    @ApiOperation({ summary:'通过userId获取用户信息' })
    async userInfoByUserId(@Query() dto:detailDto):Promise<User>{
        const user = await this.userModel.findById(dto.id)
        return user;
    }

    @Post('wxSaveUserByOpenId')
    @ApiOperation({ summary:'通过openid保存用户信息' })
    async wxSaveUserByOpenId(@Body() dto:GetAppIdDto):Promise<any>{
        const response:AxiosResponse = await this.http.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${dto.appId}&secret=${process.env.APP_SECRET}&js_code=${dto.code}&grant_type=authorization_code`).toPromise();
        const { openid }:{openid:string} = response.data;
        const authData:any = await this.authModel.findOne({openid});
        if(authData){
            const user = await this.userModel.findByIdAndUpdate(authData.user,{nickName:dto.nickName,avatarUrl:dto.avatarUrl})
            return {
                openid,
                token : this.jwtService.sign(String(authData.user)),
                user:user._id,
                nickName:user.nickName,
                avatarUrl:user.avatarUrl
            };
        }else{
            //不存在对应的用户，则创建用户并返回用户信息
            const user = await this.userModel.create({
                username:dto.nickName,
                nickName:dto.nickName,
                avatarUrl:dto.avatarUrl,
                count:0,
                backgroundImage:'',
                utograph:''
            });
            await this.authModel.create({
                user:user._id,
                openid,
                nickName:dto.nickName,
                avatarUrl:dto.avatarUrl
            })
            return {
                openid,
                token:this.jwtService.sign(String(user._id)),
                user:user._id,
                nickName:user.nickName,
                avatarUrl:user.avatarUrl
            }
        }
    }
}
