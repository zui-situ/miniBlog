import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from 'nestjs-mongoose-crud';
import { User } from '@app/db/models/user.model';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';

//添加增删改查方法
@Crud({
    model:User
})

@Controller('users')
@ApiTags('用户')
export class UsersController {
    //注入模块
    constructor(@InjectModel(User) private model:ReturnModelType<typeof User>){}
    //添加路由
    @Get('option')
    async option():Promise<any>{
        return {
            title:'用户管理',
            addBtn:false,
            column:[
                { prop:'username',label:'用户名' }
            ]
        }
    }
}
