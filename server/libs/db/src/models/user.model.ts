import { ApiProperty } from '@nestjs/swagger';
import { prop, modelOptions,DocumentType } from '@typegoose/typegoose'
import { hashSync } from 'bcryptjs';

export type UserDocument = DocumentType<User>

//为模型添加创建时间createdAt和更新时间updatedAt
@modelOptions({
    schemaOptions:{
        timestamps:true
    }
})

export class User {
    @ApiProperty({ description:'用户名', example:'username',required: false })
    @prop({required: false})
    username: string;

    @ApiProperty({ description:'微信名'})
    @prop()
    nickName?: string;

    @ApiProperty({ description:'微信头像'})
    @prop()
    avatarUrl?: string;

    @ApiProperty({ description:'密码',required: false})
    @prop({
        required: false,
        select: false,  //表示常规请求不展示这个值
        get(val){
            return val
        },
        set(val){//表示返回改造后的新值保存到数据库
            return val ? hashSync(val) :val
        }
    })
    password?: string;

    @ApiProperty({ description:'关注数' })
    @prop()
    count?: number;

    @ApiProperty({ description:'背景图' })
    @prop()
    backgroundImage?: string;

    @ApiProperty({ description:'个性签名' })
    @prop()
    utograph?: string;
}