import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MaxAuthGuard } from '../auth/guards/max-auth.guard';
import { UserResponseDto } from './dto/user-response.dto';
import { MaxUserId } from '../auth/decorators/max-user-id.decorator';
import { BindGroupDto } from './dto/bind-group.dto';
import { UpsertMeDto } from './dto/upsert-me.dto';

@ApiTags('user')
@ApiHeader({ name: 'x-max-user-id', required: true })
@UseGuards(MaxAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('me')
  @HttpCode(200)
  @ApiOperation({ summary: 'Получить или создать текущего пользователя' })
  @ApiOkResponse({ type: UserResponseDto })
  upsertMe(
    @MaxUserId() maxUserId: string,
    @Body() dto: UpsertMeDto = {},
  ) {
    return this.userService.upsertMe(maxUserId, dto);
  }

  @Post('bind-group')
  @HttpCode(200)
  @ApiOperation({ summary: 'Привязать пользователя к группе' })
  @ApiOkResponse({ type: UserResponseDto })
  bindGroup(@MaxUserId() maxUserId: string, @Body() dto: BindGroupDto) {
    return this.userService.bindGroup(maxUserId, dto);
  }
}