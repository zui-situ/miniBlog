import { Controller, Post, UseGuards, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { User, UserDocument } from '@app/db/models/user.model';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { modifyUserDto } from './dto/user.dto';
import { CurrentUser } from 'libs/common/decorator/current.user.decorator';
import { UsersService } from './users.service';


@Controller('users')
@ApiTags('用户')
export class UsersController {
    constructor(
        private usersService:UsersService
    ){}

    @Post('modifyUserInfo')
    @UsePipes(new ValidationPipe()) // 使用管道验证
    @ApiOperation({ summary:'修改用户信息' })
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()//标签这个接口需要传递token
    async login(@Body() dto:modifyUserDto, @CurrentUser() user:UserDocument):Promise<any>{
        return this.usersService.login(dto,user);
    }
    
}
