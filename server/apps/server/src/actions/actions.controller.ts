import { Controller, Get, UseGuards, Query, Post, Body, UsePipes } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserDocument } from '@app/db/models/user.model';
import { toggleDto,actionListDto,getActionByUser,geFollowList } from './dto/action.dto';
import { ValidationPipe } from '../pipe/validation.pipe';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ActionsService } from './actions.service';
import { CurrentUser } from 'libs/common/decorator/current.user.decorator';

@Controller('actions')
@ApiTags('行动')
export class ActionsController {
    constructor(
        private actionsService: ActionsService
    ){}

    @Get('status')
    @UsePipes(new ValidationPipe()) // 使用管道验证
    @ApiOperation({ summary:'查看行动状态' })
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()//标签这个接口需要传递token
    async getStatus(@Query() dto:toggleDto, @CurrentUser() user:UserDocument):Promise<any>{
        return this.actionsService.getStatus(dto,user);
    }

    @Post('toggle')
    @UsePipes(new ValidationPipe()) // 使用管道验证
    @ApiOperation({ summary:'切换行动状态' })
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()//标签这个接口需要传递token
    async toggle(@Body() dto:toggleDto, @CurrentUser() user:UserDocument):Promise<any>{
        return this.actionsService.toggle(dto,user);
    }

    @Post('getActionList')
    @UsePipes(new ValidationPipe()) // 使用管道验证
    @ApiOperation({ summary:'获取行动列表' })
    async getActionList(@Body() dto:actionListDto):Promise<any>{
        return this.actionsService.getActionList(dto);
    }

    @Get('getActionNum')
    @UsePipes(new ValidationPipe()) // 使用管道验证
    @ApiOperation({ summary:'获取行动数量' })
    async getActionNum(@Query() dto:getActionByUser):Promise<any>{
        return this.actionsService.getActionNum(dto);
    }

    @Get('getFollowList')
    @UsePipes(new ValidationPipe()) // 使用管道验证
    @ApiOperation({ summary:'获取粉丝/关注列表' })
    async getFollowList(@Query() dto:geFollowList):Promise<any>{
        return this.actionsService.getFollowList(dto);
    }
}
