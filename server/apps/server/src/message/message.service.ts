import { Message } from '@app/db/models/message.model';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { UserDocument } from '@app/db/models/user.model';
import { MessageListDto } from './dto/message.dto';

@Injectable()
export class MessageService {
    constructor(
        @InjectModel(Message) private messageModel:ReturnModelType<typeof Message>,
    ){}
    /* 好友列表 */
    async friendList(user:UserDocument):Promise<any>{
        const list = await this.messageModel.aggregate([
            {
                $match:{
                    userId:user._id,
                    status:{ $ne:3 }
                }
            },
            {
                $group: {
                    _id: "$friendId",
                    createdAt: { $last: "$createdAt" },
                    lastMessage: { $last: "$content" }
                }
            },
            {
                $lookup:{
                    from:'users',
                    localField:'_id',
                    foreignField:'_id',
                    as:'friendInfo'
                }
            },
            {
                $sort:{createdAt:-1}
            }
        ])
        return {
            data:list
        };
    }
    /* 信息列表 */
    async messageList(dto:MessageListDto,user:UserDocument):Promise<any>{
        const { pageNo,pageSize,friendId,date } = dto;
        const skip = (pageNo-1) * pageSize
        const list = await this.messageModel.find({userId:user._id,friendId,createdAt:{$lte:date}}).sort({createdAt:-1}).limit(pageSize*1).skip(skip);
        const count = await this.messageModel.countDocuments({userId:user._id,friendId})
        return {
            data:{
                list,
                pagination:{
                    pageNo:pageNo,
                    pageSize:pageSize,
                    totalPage:Math.ceil(count/pageSize),
                    totalCount:count
                }
            }
        }
    }
}
