import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber } from "class-validator"

export class createDto {
    @IsNotEmpty({ message: '内容不能为空' })
    @ApiProperty()
    content: string
    @ApiProperty()
    imgList: string[]
}

export class pagesDto {
    @IsNotEmpty({ message: 'pageNo不能为空' })
    @ApiProperty()
    pageNo: number
    @IsNotEmpty({ message: 'pageSize不能为空' })
    @ApiProperty()
    pageSize: number
}

export class detailDto {
    @IsNotEmpty({ message: '_id不能为空' })
    @ApiProperty()
    id: string
}

export class articleListByUser extends pagesDto{
    @IsNotEmpty({ message: '_id不能为空' })
    @ApiProperty()
    userId: string
}