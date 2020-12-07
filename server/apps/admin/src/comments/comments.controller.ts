import { Controller, Get } from '@nestjs/common';
import { Crud } from 'nestjs-mongoose-crud';
import { Comment } from '@app/db/models/comment.model';
import { ApiTags } from '@nestjs/swagger';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';


@Crud({
    model:Comment,
    
})

@Controller('comments')
@ApiTags('评论')

export class CommentsController {
    //注入模块
    constructor(@InjectModel(Comment) private model:ReturnModelType<typeof Comment>){}
    //添加路由
    @Get('option')
    async option():Promise<any>{
        return {
            title:'评论管理',
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
                },
                { 
                    prop:'userName',
                    label:'用户名',
                    search:true,
                    regex:true,
                    searchRules: [{
                        required: false,
                        message: "请输入用户名",
                        trigger: "blur"
                    }],
                },
            ]
        }
    }
}
