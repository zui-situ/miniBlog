import { Controller, Post, UseGuards, Body, UsePipes, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InjectModel } from 'nestjs-typegoose';
import { Article } from '@app/db/models/article.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { AuthGuard } from '@nestjs/passport';
import { createDto, pagesDto,detailDto,articleListByUser } from './dto/articles.dto';
import { UserDocument } from '@app/db/models/user.model';
import { CurrentUser } from '../auth/current.user.decorator';
import { Auth } from '@app/db/models/auth.model';
import { ValidationPipe } from '../pipe/validation.pipe';
import { Action } from '@app/db/models/action.model';

@Controller('articles')
@ApiTags('文章')
export class ArticlesController {
    constructor(
        @InjectModel(Article) private articleModel:ReturnModelType<typeof Article>,
        @InjectModel(Action) private actionModel:ReturnModelType<typeof Action>,
        @InjectModel(Auth) private authModel:ReturnModelType<typeof Auth>
    ){}

    @Post('create')
    @ApiOperation({ summary:'新增文章' })
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()//标签这个接口需要传递token
    async create(@Body() dto:createDto, @CurrentUser() user:UserDocument):Promise<any>{
        const {content,imgList}:createDto = dto;
        console.log(imgList);
        const article = await this.articleModel.create({
            user:user._id,
            content,
            imgList,
            count:0,
            readNum:0
        })
        return article
    }

    @Post('listForUser')
    @UsePipes(new ValidationPipe()) // 使用管道验证
    @ApiOperation({ summary:'个人的文章列表' })
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()//标签这个接口需要传递token
    async listForUser(@Body() dto:pagesDto,@CurrentUser() user:UserDocument):Promise<any>{
        const { pageNo,pageSize } = dto;
        const skip = (pageNo-1) * pageSize
        const article = await this.articleModel.find({
            user:user._id
        }).populate('user','nickName avatarUrl').sort('-_id').limit(pageSize).skip(skip)
        const count = await this.articleModel.countDocuments({user:user._id})
        return {
            list:article,
            pagination:{
                pageNo:pageNo,
                pageSize:pageSize,
                totalPage:Math.ceil(count/pageSize),
                totalCount:count
            }
            
        }
    }

    @Post('list')
    @UsePipes(new ValidationPipe()) // 使用管道验证
    @ApiOperation({ summary:'个人的文章列表' })
    async list(@Body() dto:pagesDto):Promise<any>{
        const { pageNo,pageSize } = dto;
        const skip = (pageNo-1) * pageSize
        const article = await this.articleModel.find().populate('user','nickName avatarUrl').sort('-_id').limit(pageSize).skip(skip)
        const count = await this.articleModel.countDocuments()
        return {
            list:article,
            pagination:{
                pageNo:pageNo,
                pageSize:pageSize,
                totalPage:Math.ceil(count/pageSize),
                totalCount:count
            }
            
        }
    }

    @Get('detail')
    @UsePipes(new ValidationPipe()) // 使用管道验证
    @ApiOperation({ summary:'文章详情' })
    async detail(@Query() dto:detailDto):Promise<any>{
        const article = await this.articleModel.findById(dto.id).populate('user','nickName avatarUrl');
        return article
    }

    @Get('followArticleList')
    @UsePipes(new ValidationPipe()) // 使用管道验证
    @ApiOperation({ summary:'关注的用户文章列表' })
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()//标签这个接口需要传递token
    async followArticleList(@Query() dto:pagesDto,@CurrentUser() user:UserDocument):Promise<any>{
        const { pageNo,pageSize } = dto;
        const skip = (pageNo-1) * pageSize
        const followList = await this.actionModel.find({user:user._id,type:'User',name:'follow'});
        const followUserList = [];
        followList.map(item=>{
            followUserList.push(item.object);
        })
        const article = await this.articleModel.find({"user":{$in:followUserList}}).populate('user','nickName avatarUrl').sort('-updatedAt').limit(pageSize*1).skip(skip)
        const count = await this.articleModel.countDocuments({"user":{$in:followUserList}})
        return{
            list:article,
            pagination:{
                pageNo:pageNo,
                pageSize:pageSize,
                totalPage:Math.ceil(count/pageSize),
                totalCount:count
            }
        }
    }

    @Get('readNumAdd')
    @UsePipes(new ValidationPipe()) // 使用管道验证
    @ApiOperation({ summary:'添加文章阅读次数' })
    async readNumAdd(@Query() dto:detailDto):Promise<any>{
        await this.articleModel.findByIdAndUpdate(dto.id,{$inc: {readNum:1 }})
        return {}
    }
    
    @Get('articleListByUser')
    @UsePipes(new ValidationPipe()) // 使用管道验证
    @ApiOperation({ summary:'个人的文章列表' })
    async articleListByUser(@Query() dto:articleListByUser):Promise<any>{
        const { pageNo,pageSize,userId } = dto;
        const skip = (pageNo-1) * pageSize
        const article = await this.articleModel.find({user:userId}).populate('user','nickName avatarUrl').sort('-_id').limit(pageSize*1).skip(skip)
        const count = await this.articleModel.countDocuments({user:userId})
        return {
            list:article,
            pagination:{
                pageNo:pageNo,
                pageSize:pageSize,
                totalPage:Math.ceil(count/pageSize),
                totalCount:count
            }
            
        }
    }
}
