import { Controller, Get } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { GroupResponseDto } from './dto/GroupResponseDto.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) { }

  @Get()
  @ApiOkResponse({ type: [GroupResponseDto] })
  findAll() {
    return this.groupsService.findAll()
  }
}
