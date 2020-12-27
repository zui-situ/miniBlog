import { Article } from '@app/db/models/article.model';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

@Injectable()
export class ArticlesService {
    //注入模块
    constructor(@InjectModel(Article) private model:ReturnModelType<typeof Article>){}

    async option():Promise<any>{
        return {
            data:{
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
            },
            code:'OK'
        }
    }
}
