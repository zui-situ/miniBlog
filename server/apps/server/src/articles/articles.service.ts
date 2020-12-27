import { Action } from '@app/db/models/action.model';
import { Article } from '@app/db/models/article.model';
import { Auth } from '@app/db/models/auth.model';
import { UserDocument } from '@app/db/models/user.model';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { articleListByUser, createDto, detailDto, pagesDto } from './dto/articles.dto';

@Injectable()
export class ArticlesService {
    constructor(
        @InjectModel(Article) private articleModel:ReturnModelType<typeof Article>,
        @InjectModel(Action) private actionModel:ReturnModelType<typeof Action>,
        @InjectModel(Auth) private authModel:ReturnModelType<typeof Auth>
    ){}
    /* 新增文章 */
    async create(dto:createDto,user:UserDocument):Promise<any>{
        const {content,imgList}:createDto = dto;
        console.log(imgList);
        const article = await this.articleModel.create({
            user:user._id,
            content,
            imgList,
            count:0,
            readNum:0,
            deleteFlag:0,
        })
        return {
            data:article
        }
    }
    /* 个人的文章列表 */
    async list(dto:pagesDto,userId?:string):Promise<any>{
        const findData = userId?{user:userId} :{};
        const { pageNo,pageSize } = dto;
        const skip = (pageNo-1) * pageSize
        const article = await this.articleModel.find(findData).populate('user','nickName avatarUrl').sort('-_id').limit(pageSize*1).skip(skip)
        const count = await this.articleModel.countDocuments(findData)
        return {
            data:{
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
    /* 通过token获取个人的文章列表 */
    async listForUser(dto:pagesDto,user:UserDocument):Promise<any>{
        return this.list(dto,user._id);
    }
    /* 文章详情 */
    async detail(dto:detailDto):Promise<any>{
        const article = await this.articleModel.findById(dto.id).populate('user','nickName avatarUrl');
        return {
            data:article
        }
    }
    /* 关注的用户文章列表 */
    async followArticleList(dto:pagesDto,user:UserDocument):Promise<any>{
        const { pageNo,pageSize } = dto;
        const skip = (pageNo-1) * pageSize
        const followList = await this.actionModel.find({user:user._id,type:'User',name:'follow'});
        const followUserList = [];
        followList.map(item=>{
            followUserList.push(item.object);
        })
        const article = await this.articleModel.find({"user":{$in:followUserList}}).populate('user','nickName avatarUrl').sort('-updatedAt').limit(pageSize*1).skip(skip)
        const count = await this.articleModel.countDocuments({"user":{$in:followUserList}})
        return {
            data:{
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
    /* 添加文章阅读次数 */
    async readNumAdd(dto:detailDto):Promise<any>{
        await this.articleModel.findByIdAndUpdate(dto.id,{$inc: {readNum:1 }})
        return {}
    }
    /* 通过ID获取个人文章列表 */
    async articleListByUser(dto:articleListByUser):Promise<any>{
        const { userId } = dto;
        return this.list(dto,userId)
    }
}
