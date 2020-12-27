import { Action } from '@app/db/models/action.model';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

@Injectable()
export class ActionsService {

    async option():Promise<any>{
        return {
            code:'OK',
            data:{
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
                ],
            }
        }

    }
}
