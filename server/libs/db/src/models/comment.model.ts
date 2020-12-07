import { ApiProperty } from '@nestjs/swagger';
import { prop, modelOptions, Ref, DocumentType } from '@typegoose/typegoose'
import { User } from './user.model';
import { Article } from './article.model';



//为模型添加创建时间createdAt和更新时间updatedAt
@modelOptions({
    schemaOptions:{
        timestamps:true
    }
})

export class Comment {
    @ApiProperty({ description:'用户' })
    @prop({ ref:'User' })
    user?: Ref<User>

    @ApiProperty({ description:'文章' })
    @prop({ ref:'Article' })
    article: Ref<Article>

    @ApiProperty({ description:'内容', example:'content' })
    @prop()
    content: string
    
    @ApiProperty({ description:'点赞数' })
    @prop()
    count?: number;
}