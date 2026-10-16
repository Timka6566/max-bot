import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ApiHeader, ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ScheduleResponseDto } from './dto/schedule-response.dto';
import { MaxAuthGuard } from '../auth/guards/max-auth.guard';
import { MaxUserId } from '../auth/decorators/max-user-id.decorator';

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

  @Get('me')
  @UseGuards(MaxAuthGuard)
  @ApiHeader({ name: 'x-max-user-id', required: true })
  @ApiOperation({ summary: 'Расписание группы текущего пользователя' })
  @ApiQuery({ name: 'weekNumber', required: false, enum: [1, 2] })
  @ApiOkResponse({ type: [ScheduleResponseDto] })
  findMe(
    @MaxUserId() maxUserId: string,
    @Query('weekNumber') weekNumber?: string,
  ) {
    const week = weekNumber ? parseInt(weekNumber, 10) : undefined;
    return this.scheduleService.findByUser(maxUserId, week);
  }


}
