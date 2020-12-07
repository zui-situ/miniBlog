import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"
import { mongoose } from "@typegoose/typegoose"
export class createDto {
    @IsNotEmpty({ message: '评论Id不允许为空' })
    @ApiProperty({description:'评论ID', example:'string' })
    comment: mongoose.Types.ObjectId

    @ApiProperty({description:'用户ID', example:'string' })
    user: mongoose.Types.ObjectId
}

export class getDto {
    @IsNotEmpty({ message: '_id不能为空' })
    @ApiProperty()
    id: string
}
