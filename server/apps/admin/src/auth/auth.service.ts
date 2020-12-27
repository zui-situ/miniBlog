import { Auth } from '@app/db/models/auth.model';
import { User, UserDocument } from '@app/db/models/user.model';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private jwtService:JwtService,
        @InjectModel(User) private userModel:ReturnModelType<typeof User>,
        @InjectModel(Auth) private authModel:ReturnModelType<typeof Auth>
    ){}

    async login(dto:LoginDto,user:UserDocument):Promise<any>{
        return {
            msg:'登录成功',
            data:{
                token: this.jwtService.sign(String(user._id)),
                user: user,
            },
            code:'OK'
        }
    }
}
