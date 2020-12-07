import { ApiProperty } from '@nestjs/swagger';
import { prop, modelOptions,DocumentType,Ref } from '@typegoose/typegoose'
import { User } from './user.model';

export type AuthDocument = DocumentType<Auth>

//为模型添加创建时间createdAt和更新时间updatedAt
@modelOptions({
    schemaOptions:{
        timestamps:true
    }
})

export class Auth {
    @ApiProperty({ description:'用户名ID'})
    @prop({ ref:'User' })
    user: Ref<User>

    @ApiProperty({ description:'openId'})
    @prop()
    openid: string

    @ApiProperty({ description:'微信名'})
    @prop()
    nickName: string

    @ApiProperty({ description:'微信头像'})
    @prop()
    avatarUrl: string
}