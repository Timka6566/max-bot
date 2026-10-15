import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator'

export class BindGroupDto {
    @ApiProperty({ example: '5b1c...uuid', description: 'ID группы' })
    @IsUUID()
    groupId: string;
}