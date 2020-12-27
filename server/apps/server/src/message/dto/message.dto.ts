import { ApiProperty } from "@nestjs/swagger"
import { mongoose } from "@typegoose/typegoose"
import { IsNotEmpty } from "class-validator"

export class MessageListDto {
    @IsNotEmpty({ message: '好友Id不允许为空' })
    @ApiProperty({description:'好友ID', example:'string' })
    friendId: mongoose.Types.ObjectId

    @IsNotEmpty({ message: 'date不能为空' })
    @ApiProperty()
    date: Date

    @IsNotEmpty({ message: 'pageNo不能为空' })
    @ApiProperty()
    pageNo: number
    
    @IsNotEmpty({ message: 'pageSize不能为空' })
    @ApiProperty()
    pageSize: number
}