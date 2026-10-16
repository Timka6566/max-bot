import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpsertMeDto {
    @ApiPropertyOptional({ example: 'Тимофей' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    firstName?: string;

    @ApiPropertyOptional({ example: 'timka' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    username?: string;
}