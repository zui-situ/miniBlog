import { Controller, Get } from '@nestjs/common';
import { Crud } from 'nestjs-mongoose-crud';
import { Article } from '@app/db/models/article.model';
import { ApiTags } from '@nestjs/swagger';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';

@Crud({
    model:Article
})

@Controller('articles')
@ApiTags('文章')
export class ArticlesController {
    //注入模块
    constructor(@InjectModel(Article) private model:ReturnModelType<typeof Article>){}
    //添加路由
    @Get('option')
    async option():Promise<any>{
        return {
            title:'文章管理',
            addBtn:false,
            editBtn:false,
            translate:false,//标记上则不返回待$符号的参数
            viewBtn:true,
            column:[
                {   prop:'imgList',
                    label:'图片',
                    dataType: 'string',
                    type: 'img' 
                },
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
            ]
        }
    }
}
