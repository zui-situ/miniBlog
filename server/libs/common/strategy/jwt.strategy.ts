//jwt策略
import { Strategy,StrategyOptions,ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { User } from '@app/db/models/user.model';

export class JwtStrategy extends PassportStrategy(Strategy,'jwt') { 
    constructor(@InjectModel(User) private userModel: ReturnModelType<typeof User>){
        super({
            // 这里没有intellisense可以用，下面这一段是说
            // 要从header取得bearer token
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            // 这里的key就是要跟create token时的key一样
            secretOrKey:process.env.SECRET
        } as StrategyOptions)
    }

    async validate(id:string):Promise<any>{
        return await this.userModel.findById(id)
    }
}