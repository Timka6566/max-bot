import { Controller, Get, Param, ParseUUIDPipe, Query, UseGuards } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ScheduleResponseDto } from './dto/schedule-response.dto';
import { ScheduleQueryDto } from './dto/schedule-query.dto';
import { MaxAuthGuard } from '../auth/guards/max-auth.guard';
import { MaxUserId } from '../auth/decorators/max-user-id.decorator';

@ApiTags('schedule')
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) { }

  @Get('group/:groupId')
  @ApiOperation({ summary: 'Расписание группы' })
  @ApiOkResponse({ type: [ScheduleResponseDto] })
  findByGroup(
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
    @Query() query: ScheduleQueryDto,
  ) {
    return this.scheduleService.findByGroup(groupId, query.weekNumber);
  }

  @Get('me')
  @UseGuards(MaxAuthGuard)
  @ApiHeader({ name: 'x-max-user-id', required: true })
  @ApiOperation({ summary: 'Расписание группы текущего пользователя' })
  @ApiOkResponse({ type: [ScheduleResponseDto] })
  findMe(
    @MaxUserId() maxUserId: string,
    @Query() query: ScheduleQueryDto,
  ) {
    return this.scheduleService.findByUser(maxUserId, query.weekNumber);
  }
}