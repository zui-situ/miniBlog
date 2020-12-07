import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"

export class detailDto {
    @IsNotEmpty({ message: '_id不能为空' })
    @ApiProperty()
    id: string
}