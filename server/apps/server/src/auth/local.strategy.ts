//本地策略
import { Strategy,IStrategyOptions } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { User } from '@app/db/models/user.model';
import { BadRequestException } from '@nestjs/common';
import { compareSync } from 'bcryptjs';

export class LocalStrategy extends PassportStrategy(Strategy,'local') { 
    constructor(@InjectModel(User) private userModel: ReturnModelType<typeof User>){
        super({
            usernameField:"username",
            passwordField:"password"
        } as IStrategyOptions)
    }

    async validate(username: string, password: string):Promise<any>{
        const user = await this.userModel.findOne({username}).select('+password');
        if(!user){
            throw new BadRequestException('用户名不正确')
        }

        if(!compareSync(password,user.password)){
            throw new BadRequestException('密码不正确')
        }
        return user
    }
}