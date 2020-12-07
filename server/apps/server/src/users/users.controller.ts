import { Controller, Post, UseGuards, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { User, UserDocument } from '@app/db/models/user.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { modifyUserDto } from './dto/user.dto';
import { CurrentUser } from '../auth/current.user.decorator';


@Controller('users')
@ApiTags('用户')
export class UsersController {
    constructor(
        @InjectModel(User) private userModel:ReturnModelType<typeof User>
    ){}


    @Post('modifyUserInfo')
    @UsePipes(new ValidationPipe()) // 使用管道验证
    @ApiOperation({ summary:'修改用户信息' })
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()//标签这个接口需要传递token
    async login(@Body() dto:modifyUserDto, @CurrentUser() user:UserDocument):Promise<any>{
        const userInfo = await this.userModel.updateOne(
            {_id:user._id},
            {
                $set:{
                    nickName:dto.nickName,
                    utograph:dto.utograph,
                    backgroundImage:dto.backgroundImage
                }
            }
        )
        return {
            userInfo
        }
    }
    
}
