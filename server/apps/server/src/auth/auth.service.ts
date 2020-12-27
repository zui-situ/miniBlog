import { Auth } from '@app/db/models/auth.model';
import { User, UserDocument } from '@app/db/models/user.model';
import { HttpService, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { DetailDto } from './dto/auth.dto';
import { GetAppIdDto } from './dto/getAppId.dto';

@Injectable()
export class AuthService {
    constructor(
        private jwtService:JwtService,
        private readonly http: HttpService,
        @InjectModel(User) private userModel:ReturnModelType<typeof User>,
        @InjectModel(Auth) private authModel:ReturnModelType<typeof Auth>
    ){}
    /* 注册 */
    async register(dto:RegisterDto):Promise<any>{
        const { username,password }:{ username:string,password:string } = dto;
        const user = await this.userModel.create({
            username,
            password,
            deleteFlag:0,
            jurisdiction:0
        })
        return {
            data:user
        }
    }
    /* 登录 */
    async login(dto:LoginDto,user:UserDocument):Promise<any>{
        return {
            data:{
                token: this.jwtService.sign(String(user._id))
            }
        }
    }
    /* 获取用户信心 */
    async user(user:UserDocument):Promise<any>{
        return {
            data:user
        }
    }
    /* 通过userId获取用户信息 */
    async userInfoByUserId(dto:DetailDto):Promise<any>{
        const user = await this.userModel.findById(dto.id)
        return {
            data:user
        }
    }
    /* 通过openid保存用户信息 */
    async wxSaveUserByOpenId(dto:GetAppIdDto):Promise<any>{
        const response:any = await this.http.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${dto.appId}&secret=${process.env.APP_SECRET}&js_code=${dto.code}&grant_type=authorization_code`).toPromise();
        const { openid }:{openid:string} = response.data;
        const authData:any = await this.authModel.findOne({openid});
        if(authData){
            const user = await this.userModel.findByIdAndUpdate(authData.user,{nickName:dto.nickName,avatarUrl:dto.avatarUrl})
            return {
                data:{
                    openid,
                    token : this.jwtService.sign(String(authData.user)),
                    user:user._id,
                    nickName:user.nickName,
                    avatarUrl:user.avatarUrl
                }
            };
        }else{
            //不存在对应的用户，则创建用户并返回用户信息
            const user = await this.userModel.create({
                username:dto.nickName,
                nickName:dto.nickName,
                avatarUrl:dto.avatarUrl,
                count:0,
                backgroundImage:'',
                utograph:'',
                jurisdiction:0,
                deleteFlag:0,
            });
            await this.authModel.create({
                user:user._id,
                openid,
                nickName:dto.nickName,
                avatarUrl:dto.avatarUrl,
                deleteFlag:0,
            })
            return {
                data:{
                    openid,
                    token:this.jwtService.sign(String(user._id)),
                    user:user._id,
                    nickName:user.nickName,
                    avatarUrl:user.avatarUrl
                }
            }
        }
    }
}
