import { ApiProperty } from '@nestjs/swagger';
import { prop, modelOptions, Ref, DocumentType } from '@typegoose/typegoose'
import { User } from './user.model';

export type ArticleDocument = DocumentType<Article>

//为模型添加创建时间createdAt和更新时间updatedAt
@modelOptions({
    schemaOptions:{
        timestamps:true
    }
})

export class Article {
    @ApiProperty({ description:'用户ID' })
    @prop({ ref:'User' })
    user: Ref<User>

    @ApiProperty({ description:'内容', example:'content' })
    @prop()
    content: string

    @ApiProperty({ description:'图片'})
    @prop()
    imgList: Array<string>

    @ApiProperty({ description:'收藏数' })
    @prop()
    count?: number;

    @ApiProperty({ description:'浏览数' })
    @prop()
    readNum?: number;
    
    @ApiProperty({ description:'删除标记'})
    @prop()
    deleteFlag: number
}