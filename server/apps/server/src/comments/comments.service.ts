import { Action } from '@app/db/models/action.model';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { Comment } from '@app/db/models/comment.model';
import { createDto, getDto, pagesDto } from './dto/comment.dto';

@Injectable()
export class CommentsService {
    constructor(
        @InjectModel(Comment) private commentModel:ReturnModelType<typeof Comment>,
        @InjectModel(Action) private actionModel:ReturnModelType<typeof Action>,
    ){}
    /* 新建评论 */
    async create(dto:createDto):Promise<any>{
        const _dto:any = dto
        _dto.count = 0;
        _dto.deleteFlag = 0;
        const res = await this.commentModel.create(dto)
        return {
            data:res
        };
    }
    /* 获取评论 */
    async get(dto:getDto,pageDto:pagesDto):Promise<any>{
        const { pageNo,pageSize } = pageDto;
        const [ comment,count ] = await Promise.all([
            this.commentModel.find({article:dto.id}).
            populate('user','nickName avatarUrl').
            sort('-_id').limit(pageSize*1).skip((pageNo-1) * pageSize),
            this.commentModel.countDocuments()
        ])
        return {
            data:{
                list:comment,
                pagination:{
                    pageNo:Number(pageNo),
                    pageSize:Number(pageSize),
                    totalPage:Math.ceil(count/pageSize),
                    totalCount:count
                }
            }
        }
    }
    /* 获取评论数量 */
    async getCommentNum(dto:getDto):Promise<any>{
        const count = await this.commentModel.countDocuments({article:dto.id})
        return {
            data:count
        };
    }
}
