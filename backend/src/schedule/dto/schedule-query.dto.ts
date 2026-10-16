import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional } from 'class-validator';

export class ScheduleQueryDto {
  @ApiPropertyOptional({ enum: [1, 2], description: 'Номер недели' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsIn([1, 2])
  weekNumber?: number;
}