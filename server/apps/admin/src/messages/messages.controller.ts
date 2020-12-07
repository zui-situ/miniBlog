import { Controller, Get } from '@nestjs/common';
import { Crud } from 'nestjs-mongoose-crud';
import { Message } from '@app/db/models/message.model';
import { ApiTags } from '@nestjs/swagger';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';


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
    constructor(@InjectModel(Message) private model:ReturnModelType<typeof Message>){}
    //添加路由
    @Get('option')
    async option():Promise<any>{
        return {
            title:'消息管理',
            addBtn:false,
            editBtn:false,
            translate:false,//标记上则不返回待$符号的参数
            viewBtn:true,
            column:[
                { 
                    prop:'content',
                    label:'内容',
                    search:true,
                    regex:true,
                    searchRules: [{
                        required: false,
                        message: "请输入内容",
                        trigger: "blur"
                    }],
                }
            ]
        }
    }
}
