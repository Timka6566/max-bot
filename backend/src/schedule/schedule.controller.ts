import { Controller, Get, Param, Query } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ScheduleResponseDto } from './dto/schedule-response.dto';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) { }

  @Get('group/:groupId')
  @ApiOperation({ summary: 'Расписание группы' })
  @ApiQuery({ name: 'weekNumber', required: false, enum: [1, 2] })
  @ApiOkResponse({ type: [ScheduleResponseDto] })
  findByGroup(
    @Param('groupId') groupId: string,
    @Query('weekNumber') weekNumber?: string,
  ) {
    const week = weekNumber ? parseInt(weekNumber, 10) : undefined
    return this.scheduleService.findByGroup(groupId, week)
  }
}
