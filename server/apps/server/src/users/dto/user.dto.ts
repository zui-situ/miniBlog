import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"

export class modifyUserDto {
    @IsNotEmpty({ message: '用户昵称不能为空' })
    @ApiProperty({description:'用户昵称', example:'string' })
    nickName: string

    @ApiProperty({description:'用户签名', example:'string' })
    utograph?: string

    @ApiProperty({description:'背景图', example:'string' })
    backgroundImage?: string
}