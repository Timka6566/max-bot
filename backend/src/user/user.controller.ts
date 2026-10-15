import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MaxAuthGuard } from '../auth/guards/max-auth.guard';
import { UserResponseDto } from './dto/user-response.dto';
import { MaxUserId } from '../auth/decorators/max-user-id.decorator';
import { BindGroupDto } from './dto/bind-group.dto';

@ApiTags('user')
@ApiHeader({ name: 'x-max-user-id', required: true })
@UseGuards(MaxAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('me')
  @ApiOperation({ summary: 'Получить или создать текущего пользователя' })
  @ApiOkResponse({ type: UserResponseDto })
  upsertMe(@MaxUserId() maxUserId: string) {
    return this.userService.upsertMe(maxUserId);
  }

  @Post('bind-group')
  @ApiOperation({ summary: 'Привязать пользователя к группе' })
  @ApiOkResponse({ type: UserResponseDto })
  bindGroup(@MaxUserId() maxUserId: string, @Body() dto: BindGroupDto) {
    return this.userService.bindGroup(maxUserId, dto);
  }
}
