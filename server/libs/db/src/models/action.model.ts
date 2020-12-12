import { ApiProperty } from '@nestjs/swagger';
import { prop, modelOptions, Ref } from '@typegoose/typegoose'
import { User } from './user.model';
import { Article } from './article.model';
import { Comment } from './comment.model';

//为模型添加创建时间createdAt和更新时间updatedAt
@modelOptions({
    schemaOptions:{
        timestamps:true
    }
})

export class Action {
    @ApiProperty({ description:'用户' })
    @prop({ ref:'User' })
    user: Ref<User>

    @ApiProperty({ description:'动作对应的模块名称' })
    @prop({ enum: ['User', 'Article','Comment'] })
    type: string;

    @ApiProperty({ description:'对应的模块' })
    @prop({ refPath:'type' })
    object: Ref<User|Article|Comment>;

    @ApiProperty({ description:'动作名称' })
    @prop({ enum: ['follow','collection','upVote'] })
    name: string;
}