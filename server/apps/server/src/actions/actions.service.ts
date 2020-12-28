import { Action } from '@app/db/models/action.model';
import { Article } from '@app/db/models/article.model';
import { User, UserDocument } from '@app/db/models/user.model';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { Comment } from '@app/db/models/comment.model';
import { actionListDto, geFollowList, getActionByUser, toggleDto } from './dto/action.dto';

@Injectable()
export class ActionsService {
    constructor(
        @InjectModel(Action) private actionModel:ReturnModelType<typeof Action>,
        @InjectModel(Comment) private CommentModel:ReturnModelType<typeof Comment>,
        @InjectModel(Article) private ArticleModel:ReturnModelType<typeof Article>,
        @InjectModel(User) private UserModel:ReturnModelType<typeof User>,
    ){}
    /* 查看行动状态 */
    async getStatus(dto:toggleDto,user:UserDocument):Promise<any>{
        const _dto:any = dto;
        _dto.user = user._id;
        const count = await this.actionModel.countDocuments(_dto);
        return {
            data:{
                status:count > 0
            }
        }
    }
    /* 切换行动状态 */
    async toggle(dto:toggleDto,user:UserDocument):Promise<any>{
        const _dto:any = dto;
        _dto.user = user._id;
        const res = await this.getStatus(_dto,user);
        if(res.data.status){
            await this[dto.type+'Model'].findByIdAndUpdate(_dto.object,{$inc: {count:-1 }})
            await this.actionModel.deleteMany(_dto);
        }else {
            await this[dto.type+'Model'].findByIdAndUpdate(_dto.object,{$inc: {count:1 }})
            await this.actionModel.create(_dto);
        }
        return await this.getStatus(_dto,user)
    }
    /* 获取行动列表 */
    async getActionList(dto:actionListDto):Promise<any>{
        const { pageNo,pageSize,type,name,user } = dto;
        const skip = (pageNo-1) * pageSize;
        const list = await this.actionModel.find({type,name,user}).populate({
            path:'object',
            populate: {path: 'user',select:'nickName avatarUrl'}
        }).sort('-_id').limit(pageSize).skip(skip)
        const count = await this.actionModel.countDocuments({type,name,user})
        return {
            data:{
                list,
                pagination:{
                    pageNo:pageNo,
                    pageSize:pageSize,
                    totalPage:Math.ceil(count/pageSize),
                    totalCount:count
                }
            }
        }
    }
    /* 获取行动数量 */
    async getActionNum(dto:getActionByUser):Promise<any>{
        const { type,name,user,object } = dto;
        const userCount = await this.actionModel.countDocuments({type,name,user})//如关注了多少人
        const actionCount = await this.actionModel.countDocuments({type,name,object})//如粉丝多少
        return {
            data:{
                userCount,
                actionCount
            }
        };
    }
    /* 获取粉丝/关注列表 */
    async getFollowList(dto:geFollowList):Promise<any>{
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
            data:{
                list,
                pagination:{
                    pageNo:pageNo,
                    pageSize:pageSize,
                    totalPage:Math.ceil(count/pageSize),
                    totalCount:count
                }
            }
        };
    }
}
