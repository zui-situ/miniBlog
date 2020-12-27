import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { Comment } from '@app/db/models/comment.model';

@Injectable()
export class CommentsService {
    //注入模块
    constructor(@InjectModel(Comment) private model:ReturnModelType<typeof Comment>){}
    
    async option():Promise<any>{
        return {
            code:'OK',
            data:{
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
}
