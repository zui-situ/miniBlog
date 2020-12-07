import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"
import { mongoose } from "@typegoose/typegoose"
export class createDto {
    @IsNotEmpty({ message: '评论内容不允许为空' })
    @ApiProperty()
    content: string
    
    @IsNotEmpty({ message: '文章Id不允许为空' })
    @ApiProperty({description:'文章ID', example:'string' })
    article: mongoose.Types.ObjectId

    @ApiProperty({description:'userID', example:'string',required: false })
    user?: mongoose.Types.ObjectId
}

export class getDto {
    @IsNotEmpty({ message: '_id不能为空' })
    @ApiProperty()
    id: string
}

export class pagesDto {
    @IsNotEmpty({ message: 'pageNo不能为空' })
    @ApiProperty()
    pageNo: number
    @IsNotEmpty({ message: 'pageSize不能为空' })
    @ApiProperty()
    pageSize: number
}