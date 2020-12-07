import { Controller, Get, UseGuards, Query, Post, Body, UsePipes } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Action } from '@app/db/models/action.model';
import { Comment } from '@app/db/models/comment.model';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/current.user.decorator';
import { UserDocument, User } from '@app/db/models/user.model';
import { toggleDto,actionListDto,getActionByUser,geFollowList } from './dto/action.dto';
import { ValidationPipe } from '../pipe/validation.pipe';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Article } from '@app/db/models/article.model';

@Controller('actions')
@ApiTags('行动')
export class ActionsController {
    constructor(
        @InjectModel(Action) private actionModel:ReturnModelType<typeof Action>,
        @InjectModel(Comment) private CommentModel:ReturnModelType<typeof Comment>,
        @InjectModel(Article) private ArticleModel:ReturnModelType<typeof Article>,
        @InjectModel(User) private UserModel:ReturnModelType<typeof User>,
    ){}

    @Get('status')
    @UsePipes(new ValidationPipe()) // 使用管道验证
    @ApiOperation({ summary:'查看行动状态' })
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()//标签这个接口需要传递token
    async getStatus(@Query() dto:toggleDto, @CurrentUser() user:UserDocument):Promise<any>{
        dto['user'] = user._id;
        const count = await this.actionModel.countDocuments(dto);
        return {
            status: count > 0
        }
    }

    @Post('toggle')
    @UsePipes(new ValidationPipe()) // 使用管道验证
    @ApiOperation({ summary:'切换行动状态' })
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()//标签这个接口需要传递token
    async toggle(@Body() dto:toggleDto, @CurrentUser() user:UserDocument):Promise<any>{
        const _dto:any = dto;
        _dto.user = user._id;
        const res = await this.getStatus(_dto,user);
        if(res.status){
            await this[dto.type+'Model'].findByIdAndUpdate(_dto.object,{$inc: {count:-1 }})
            await this.actionModel.deleteMany(_dto);
        }else {
            await this[dto.type+'Model'].findByIdAndUpdate(_dto.object,{$inc: {count:1 }})
            await this.actionModel.create(_dto);
        }
        return await this.getStatus(_dto,user)
    }

    @Post('getActionList')
    @UsePipes(new ValidationPipe()) // 使用管道验证
    @ApiOperation({ summary:'获取行动列表' })
    async getActionList(@Body() dto:actionListDto):Promise<any>{
        const { pageNo,pageSize,type,name,user } = dto;
        const skip = (pageNo-1) * pageSize;
        const list = await this.actionModel.find({type,name,user}).populate({
            path:'object',
            populate: {path: 'user',select:'nickName avatarUrl'}
        }).sort('-_id').limit(pageSize).skip(skip)
        const count = await this.actionModel.countDocuments({type,name,user})
        return {
            list,
            pagination:{
                pageNo:pageNo,
                pageSize:pageSize,
                totalPage:Math.ceil(count/pageSize),
                totalCount:count
            }
            
        }
    }

    @Get('getActionNum')
    @UsePipes(new ValidationPipe()) // 使用管道验证
    @ApiOperation({ summary:'获取行动数量' })
    async getActionNum(@Query() dto:getActionByUser):Promise<any>{
        const { type,name,user,object } = dto;
        const userCount = await this.actionModel.countDocuments({type,name,user})//如关注了多少人
        const actionCount = await this.actionModel.countDocuments({type,name,object})//如粉丝多少
        return {
            userCount,
            actionCount
        };
    }

    @Get('getFollowList')
    @UsePipes(new ValidationPipe()) // 使用管道验证
    @ApiOperation({ summary:'获取粉丝/关注列表' })
    async getFollowList(@Query() dto:geFollowList):Promise<any>{
        const { pageNo,pageSize,status,user } = dto;
        const skip = (pageNo-1) * pageSize;
        let list = [];
        let count = 0;
        if(status==1){
            list = await this.actionModel.find({type:'User',name:'follow',user}).populate({
                path:'object',
                populate: {path: 'user',select:'nickName avatarUrl'}
            }).sort('-_id').limit(pageSize*1).skip(skip);
            count = await this.actionModel.countDocuments({type:'User',name:'follow',user});
        }else if(status==2){
            list = await this.actionModel.find({type:'User',name:'follow',object:user}).populate('user','nickName avatarUrl').sort('-_id').limit(pageSize*1).skip(skip);
            count = await this.actionModel.countDocuments({type:'User',name:'follow',object:user});
        }
        return {
            list,
            pagination:{
                pageNo:pageNo,
                pageSize:pageSize,
                totalPage:Math.ceil(count/pageSize),
                totalCount:count
            }
        };
    }
}
