import { Controller, Get } from '@nestjs/common';
import { Crud } from 'nestjs-mongoose-crud';
import { Comment } from '@app/db/models/comment.model';
import { ApiTags } from '@nestjs/swagger';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { CommentsService } from './comments.service';


@Crud({
    model:Comment,
    
})

@Controller('comments')
@ApiTags('评论')

export class CommentsController {
    //注入模块
    constructor(
        @InjectModel(Comment) private model:ReturnModelType<typeof Comment>,
        private commentsService: CommentsService
    ){}
    //添加路由
    @Get('option')
    async option():Promise<any>{
        return this.commentsService.option()
    }
}
