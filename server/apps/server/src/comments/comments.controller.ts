import { Controller, Post, Body, UsePipes, Get, Query, UseGuards } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { Comment } from '@app/db/models/comment.model';
import { InjectModel } from 'nestjs-typegoose';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ValidationPipe } from '../pipe/validation.pipe';
import { createDto, getDto, pagesDto } from './dto/comment.dto';
import { Action } from '@app/db/models/action.model';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/current.user.decorator';
import { UserDocument } from '@app/db/models/user.model';

@Controller('comments')
@ApiTags('评论')
export class CommentsController {
    constructor(
        @InjectModel(Comment) private commentModel:ReturnModelType<typeof Comment>,
        @InjectModel(Action) private actionModel:ReturnModelType<typeof Action>,
    ){}

    @Post('create')
    @UsePipes(new ValidationPipe()) // 使用管道验证
    @ApiOperation({ summary:'新建评论' })
    async create(@Body() dto:createDto):Promise<any>{
        dto['count'] = 0;
        const res = await this.commentModel.create(dto)
        return res;
    }

    @Get('get')
    @UsePipes(new ValidationPipe()) // 使用管道验证
    @ApiOperation({ summary:'获取评论' })
    async get(@Query() dto:getDto,@Query() pageDto:pagesDto):Promise<any>{
        const { pageNo,pageSize } = pageDto;
        const [ comment,count ] = await Promise.all([
            this.commentModel.find({article:dto.id}).
            populate('user','nickName avatarUrl').
            sort('-_id').limit(pageSize*1).skip((pageNo-1) * pageSize),
            this.commentModel.countDocuments()
        ])
        return {
            list:comment,
            pagination:{
                pageNo:Number(pageNo),
                pageSize:Number(pageSize),
                totalPage:Math.ceil(count/pageSize),
                totalCount:count
            }
        }
    }

    @Get('getCommentNum')
    @UsePipes(new ValidationPipe()) // 使用管道验证
    @ApiOperation({ summary:'获取评论数量' })
    async getCommentNum(@Query() dto:getDto):Promise<any>{
        const count = await this.commentModel.countDocuments({article:dto.id})
        return count;
    }
}
