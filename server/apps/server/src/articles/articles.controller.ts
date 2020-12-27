import { Controller, Post, UseGuards, Body, UsePipes, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { createDto, pagesDto,detailDto,articleListByUser } from './dto/articles.dto';
import { UserDocument } from '@app/db/models/user.model';
import { ValidationPipe } from '../pipe/validation.pipe';
import { ArticlesService } from './articles.service';
import { CurrentUser } from 'libs/common/decorator/current.user.decorator';

@Controller('articles')
@ApiTags('文章')
export class ArticlesController {
    constructor(
        private articlesService:ArticlesService
    ){}

    @Post('create')
    @ApiOperation({ summary:'新增文章' })
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()//标签这个接口需要传递token
    async create(@Body() dto:createDto, @CurrentUser() user:UserDocument):Promise<any>{
        return this.articlesService.create(dto,user);
    }

    @Post('listForUser')
    @UsePipes(new ValidationPipe()) // 使用管道验证
    @ApiOperation({ summary:'个人的文章列表' })
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()//标签这个接口需要传递token
    async listForUser(@Body() dto:pagesDto,@CurrentUser() user:UserDocument):Promise<any>{
        return this.articlesService.listForUser(dto,user);
    }

    @Post('list')
    @UsePipes(new ValidationPipe()) // 使用管道验证
    @ApiOperation({ summary:'个人的文章列表' })
    async list(@Body() dto:pagesDto):Promise<any>{
        return this.articlesService.list(dto);
    }

    @Get('detail')
    @UsePipes(new ValidationPipe()) // 使用管道验证
    @ApiOperation({ summary:'文章详情' })
    async detail(@Query() dto:detailDto):Promise<any>{
        return this.articlesService.detail(dto);
    }

    @Get('followArticleList')
    @UsePipes(new ValidationPipe()) // 使用管道验证
    @ApiOperation({ summary:'关注的用户文章列表' })
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()//标签这个接口需要传递token
    async followArticleList(@Query() dto:pagesDto,@CurrentUser() user:UserDocument):Promise<any>{
        return this.articlesService.followArticleList(dto,user);
    }

    @Get('readNumAdd')
    @UsePipes(new ValidationPipe()) // 使用管道验证
    @ApiOperation({ summary:'添加文章阅读次数' })
    async readNumAdd(@Query() dto:detailDto):Promise<any>{
        return this.articlesService.readNumAdd(dto);
    }
    
    @Get('articleListByUser')
    @UsePipes(new ValidationPipe()) // 使用管道验证
    @ApiOperation({ summary:'个人的文章列表' })
    async articleListByUser(@Query() dto:articleListByUser):Promise<any>{
        return this.articlesService.articleListByUser(dto);
    }
}
