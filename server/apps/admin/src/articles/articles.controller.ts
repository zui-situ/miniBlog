import { Controller, Get } from '@nestjs/common';
import { Crud } from 'nestjs-mongoose-crud';
import { Article } from '@app/db/models/article.model';
import { ApiTags } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';

@Crud({
    model:Article
})

@Controller('articles')
@ApiTags('文章')
export class ArticlesController {
    //注入模块
    constructor(
        @InjectModel(Article) private model:ReturnModelType<typeof Article>,
        private articlesService: ArticlesService
    ){}
    //添加路由
    @Get('option')
    async option():Promise<any>{
        return this.articlesService.option();
    }
}
