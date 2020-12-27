import { Controller, Get } from '@nestjs/common';
import { Crud } from 'nestjs-mongoose-crud';
import { Message } from '@app/db/models/message.model';
import { ApiTags } from '@nestjs/swagger';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { MessagesService } from './messages.service';


@Crud({
    model:Message,
    routes:{        //关闭或开启对应的接口
        create:false,
        update:false,
    }
})

@Controller('messages')
@ApiTags('消息')

export class MessagesController {
    //注入模块
    constructor(
        @InjectModel(Message) private model:ReturnModelType<typeof Message>,
        private messagesService:MessagesService
    ){}
    //添加路由
    @Get('option')
    async option():Promise<any>{
        return this.messagesService.option();
    }
}
