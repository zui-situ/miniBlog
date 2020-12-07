import { ApiProperty } from "@nestjs/swagger"

export class GetAppIdDto {
    @ApiProperty()
    appId: string
    @ApiProperty()
    code: string
    @ApiProperty()
    nickName: string
    @ApiProperty()
    avatarUrl: string
}