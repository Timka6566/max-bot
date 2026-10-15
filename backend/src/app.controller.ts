import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MaxUserId } from './auth/decorators/max-user-id.decorator';
import { MaxAuthGuard } from './auth/guards/max-auth.guard';

@ApiTags('health')
@Controller('health')
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Проверка работоспособности сервера' })
  @ApiOkResponse({ schema: { example: { status: 'ok', timestamp: '2026-10-15T10:00:00.000Z' } } })
  check() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('whoami')
  @UseGuards(MaxAuthGuard)
  @ApiHeader({ name: 'x-max-user-id', required: true })
  whoami(@MaxUserId() maxUserId: string) {
    return { maxUserId }
  }
}