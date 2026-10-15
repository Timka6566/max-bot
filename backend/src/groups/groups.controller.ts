import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { GroupResponseDto } from './dto/GroupResponseDto.dto';

@ApiTags('groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) { }

  @Get()
  @ApiQuery({ name: 'search', required: false, description: 'Поиск по названию группы или специальности' })
  @ApiOkResponse({ type: [GroupResponseDto] })
  findAll(@Query('search') search?: string) {
    return this.groupsService.findAll(search);
  }
}