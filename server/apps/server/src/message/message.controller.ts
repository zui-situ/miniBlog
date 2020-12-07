import { Message } from '@app/db/models/message.model';
import { Body, Controller, Post, UsePipes, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { ValidationPipe } from '../pipe/validation.pipe';
import { messageListDto } from './dto/message.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/current.user.decorator';
import { UserDocument } from '@app/db/models/user.model';
import { query } from 'express';

@Controller('message')
@ApiTags('消息')
export class MessageController {
    constructor(
        @InjectModel(Message) private messageModel:ReturnModelType<typeof Message>,
    ){}

    @Post('friendList')
    @UsePipes(new ValidationPipe()) // 使用管道验证
    @ApiOperation({ summary:'信息列表' })
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()//标签这个接口需要传递token
    async friendList(@CurrentUser() user:UserDocument):Promise<any>{
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
        return list;
    }

    @Post('messageList')
    @UsePipes(new ValidationPipe()) // 使用管道验证
    @ApiOperation({ summary:'信息列表' })
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()//标签这个接口需要传递token
    async messageList(@Body() dto:messageListDto,@CurrentUser() user:UserDocument):Promise<any>{
        const { pageNo,pageSize,friendId,date } = dto;
        const skip = (pageNo-1) * pageSize
        const list = await this.messageModel.find({userId:user._id,friendId,createdAt:{$lte:date}}).sort({createdAt:-1}).limit(pageSize*1).skip(skip);
        const count = await this.messageModel.countDocuments({userId:user._id,friendId})
        return {
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
