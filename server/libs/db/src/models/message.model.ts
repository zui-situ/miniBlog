import { ApiProperty } from '@nestjs/swagger';
import { prop, modelOptions, Ref } from '@typegoose/typegoose'
import { User } from './user.model';

//为模型添加创建时间createdAt和更新时间updatedAt
@modelOptions({
    schemaOptions:{
        timestamps:true
    }
})

export class Message {
    @ApiProperty({ description:'发送者id，非真实发送者id' })
    @prop({ ref:'User' })
    userId?: Ref<User>

    @ApiProperty({ description:'接受者id，非真实接受者id' })
    @prop({ ref:'User' })
    friendId?: Ref<User>;

    @ApiProperty({ description:'发送者id，真实的发送者id' })
    @prop({ ref:'User' })
    senderId?: Ref<User>;

    @ApiProperty({ description:'接受者id，真实的接受者id' })
    @prop({ ref:'User' })
    receiverId?: Ref<User>;

    @ApiProperty({ description:'信息内容' })
    @prop()
    content: string;

    @ApiProperty({ description:'消息类型,1：普通消息 2：系统消息，区分消息列表，可以发送不同类型的消息内容' })
    @prop()
    messageType: number;

    @ApiProperty({ description:'消息状态 1：未读 2：已读 3：删除，标记不同消息状态，可以实现统计未读消息数，逻辑删除用户恢复等' })
    @prop()
    status?: number;

    @ApiProperty({ description:'删除标记'})
    @prop()
    deleteFlag: number
}