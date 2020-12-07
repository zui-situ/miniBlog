// 好友消息
import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"
import { mongoose } from "@typegoose/typegoose"

export class FriendMessageDto {
    @IsNotEmpty({ message: '消息类型' })
    @ApiProperty({description:'消息类型', example:'string' })
    messageType: number

    @ApiProperty({description:'消息内容', example:'string' })
    content: string

    @ApiProperty({description:'接收者ID', example:'string' })
    receiverId: mongoose.Types.ObjectId

    @ApiProperty({description:'发送者ID', example:'string' })
    senderId:  mongoose.Types.ObjectId
    
}

export class joinFriendDto {
    @ApiProperty({description:'用户ID', example:'string' })
    userId:string

    @ApiProperty({description:'好友ID', example:'string' })
    friendId:string
}