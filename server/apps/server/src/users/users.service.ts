import { User, UserDocument } from '@app/db/models/user.model';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { modifyUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User) private userModel:ReturnModelType<typeof User>
    ){}
    /* 修改用户信息 */
    async login(dto:modifyUserDto,user:UserDocument):Promise<any>{
        const userInfo = await this.userModel.updateOne(
            {_id:user._id},
            {
                $set:{
                    nickName:dto.nickName,
                    utograph:dto.utograph,
                    backgroundImage:dto.backgroundImage
                }
            }
        )
        return {
            data:userInfo
        }
    }
}
