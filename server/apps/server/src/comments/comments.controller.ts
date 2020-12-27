import { Controller, Post, Body, UsePipes, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, } from '@nestjs/swagger';
import { ValidationPipe } from '../pipe/validation.pipe';
import { createDto, getDto, pagesDto } from './dto/comment.dto';
import { CommentsService } from './comments.service';

@Controller('comments')
@ApiTags('评论')
export class CommentsController {
    constructor(
        private commentsService:CommentsService
    ){}

    @Post('create')
    @UsePipes(new ValidationPipe()) // 使用管道验证
    @ApiOperation({ summary:'新建评论' })
    async create(@Body() dto:createDto):Promise<any>{
        return this.commentsService.create(dto);
    }

    @Get('get')
    @UsePipes(new ValidationPipe()) // 使用管道验证
    @ApiOperation({ summary:'获取评论' })
    async get(@Query() dto:getDto,@Query() pageDto:pagesDto):Promise<any>{
        return this.commentsService.get(dto,pageDto);
    }

    @Get('getCommentNum')
    @UsePipes(new ValidationPipe()) // 使用管道验证
    @ApiOperation({ summary:'获取评论数量' })
    async getCommentNum(@Query() dto:getDto):Promise<any>{
        return this.commentsService.getCommentNum(dto);
    }
}
