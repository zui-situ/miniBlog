import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagesService {
    async option():Promise<any>{
        return {
            code:'OK',
            data:{
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
}
