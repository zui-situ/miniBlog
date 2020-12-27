import { Message } from '@app/db/models/message.model';
import { Body, Controller, Post, UsePipes, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { ValidationPipe } from '../pipe/validation.pipe';
import { MessageListDto } from './dto/message.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserDocument } from '@app/db/models/user.model';
import { CurrentUser } from 'libs/common/decorator/current.user.decorator';
import { MessageService } from './message.service';

@Controller('message')
@ApiTags('消息')
export class MessageController {
    constructor(
        private messageService:MessageService
    ){}

    @Post('friendList')
    @UsePipes(new ValidationPipe()) // 使用管道验证
    @ApiOperation({ summary:'好友列表' })
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()//标签这个接口需要传递token
    async friendList(@CurrentUser() user:UserDocument):Promise<any>{
        return this.messageService.friendList(user);
    }

    @Post('messageList')
    @UsePipes(new ValidationPipe()) // 使用管道验证
    @ApiOperation({ summary:'信息列表' })
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()//标签这个接口需要传递token
    async messageList(@Body() dto:MessageListDto,@CurrentUser() user:UserDocument):Promise<any>{
        return this.messageService.messageList(dto,user);
    }
}
