import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserDocument } from '@app/db/models/user.model';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'libs/common/decorator/current.user.decorator';


@Controller('auth')
@ApiTags('用户')
export class AuthController {
    constructor(
        private authService: AuthService
    ){}

    @Post('login')
    @ApiOperation({ summary:'登录' })
    @UseGuards(AuthGuard('local'))
    async login(@Body() dto:LoginDto, @CurrentUser() user: UserDocument):Promise<any>{
        return this.authService.login(dto,user);
    }

    
}
