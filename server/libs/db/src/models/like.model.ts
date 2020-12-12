import { ApiProperty } from '@nestjs/swagger';
import { prop, modelOptions, Ref } from '@typegoose/typegoose'
import { User } from './user.model';
import { Comment } from './comment.model';

//为模型添加创建时间createdAt和更新时间updatedAt
@modelOptions({
    schemaOptions:{
        timestamps:true
    }
})

export class Like {
    @ApiProperty({ description:'用户ID' })
    @prop({ ref:'User' })
    user: Ref<User>

    @ApiProperty({ description:'评论ID' })
    @prop({ ref:'Comment' })
    Comment: Ref<Comment>

}