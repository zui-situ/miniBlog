import { Controller, Get } from '@nestjs/common';
import { Crud } from 'nestjs-mongoose-crud';
import { Action } from '@app/db/models/action.model';
import { ApiTags } from '@nestjs/swagger';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';


@Crud({
    model:Action
})

@ApiTags('动作')
@Controller('actions')
export class ActionsController {
    //注入模块
    constructor(@InjectModel(Action) private model:ReturnModelType<typeof Action>){}
    //添加路由
    @Get('option')
    async option():Promise<any>{
        return {
            title:'动作管理',
            addBtn:false,
            editBtn:false,
            translate:false,//标记上则不返回待$符号的参数
            viewBtn:true,
            column:[
                { 
                    prop:'type',
                    label:'模块名称',
                    search:false,
                    regex:true,
                    searchRules: [{
                        required: false,
                        message: "请输入内容",
                        trigger: "blur"
                    }],
                },
                { 
                    prop:'name',
                    label:'动作名称',
                },
                { 
                    prop:'object',
                    label:'动作对象ID',
                },
                { 
                    prop:'user',
                    label:'用户ID',
                }
            ]
        }
    }
}
