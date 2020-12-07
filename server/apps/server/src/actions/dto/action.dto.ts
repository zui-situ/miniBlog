import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"
import { mongoose } from "@typegoose/typegoose"

export class common {
    @IsNotEmpty({ message: '活动类型不能为空' })
    @ApiProperty({description:'活动类型:User,Article,Comment', example:'string' })
    type: string
    
    @IsNotEmpty({ message: '动作名称不允许为空' })
    @ApiProperty({description:'动作名称:follow关注,collection收藏,upVote点赞', example:'string' })
    name: string
}

export class pagesDto extends common {
    @IsNotEmpty({ message: 'pageNo不能为空' })
    @ApiProperty({description:'页数', example:1 })
    pageNo: number

    @IsNotEmpty({ message: 'pageSize不能为空' })
    @ApiProperty({description:'每页的数量', example:10 })
    pageSize: number
}

export class toggleDto extends common {
    @IsNotEmpty({ message: '对应的模块ID不允许为空' })
    @ApiProperty({description:'模块ID', example:'string' })
    object: mongoose.Types.ObjectId    
}

export class actionListDto extends pagesDto {
    @IsNotEmpty({ message: '用户ID不允许为空' })
    @ApiProperty({description:'用户ID', example:'string' })
    user: mongoose.Types.ObjectId
}

export class getActionByUser extends common {
    @IsNotEmpty({ message: '用户ID不允许为空' })
    @ApiProperty({description:'用户ID', example:'string' })
    user: mongoose.Types.ObjectId

    @IsNotEmpty({ message: '对应的模块ID不允许为空' })
    @ApiProperty({description:'模块ID', example:'string' })
    object: mongoose.Types.ObjectId 
}

export class geFollowList {
    @IsNotEmpty({ message: 'pageNo不能为空' })
    @ApiProperty({description:'页数', example:1 })
    pageNo: number

    @IsNotEmpty({ message: 'pageSize不能为空' })
    @ApiProperty({description:'每页的数量', example:10 })
    pageSize: number

    @IsNotEmpty({ message: '用户ID不允许为空' })
    @ApiProperty({description:'用户ID', example:'string' })
    user: mongoose.Types.ObjectId

    @IsNotEmpty({ message: 'status' })
    @ApiProperty({description:'1为关注数，2为粉丝数' })
    status: number
}
