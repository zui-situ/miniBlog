import { Controller, Get } from '@nestjs/common';
import { Crud } from 'nestjs-mongoose-crud';
import { Action } from '@app/db/models/action.model';
import { ApiTags } from '@nestjs/swagger';
import { ActionsService } from './actions.service';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';


@Crud({
    model:Action
})

@ApiTags('动作')
@Controller('actions')
export class ActionsController {
    //注入模块
    constructor(
        @InjectModel(Action) private model:ReturnModelType<typeof Action>,
        private actionsService: ActionsService
    ){}
    //添加路由
    @Get('option')
    async option():Promise<any>{
        return this.actionsService.option();
    }
}
