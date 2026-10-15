import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Проверка работоспособности сервера' })
  @ApiOkResponse({ schema: { example: { status: 'ok', timestamp: '2026-10-15T10:00:00.000Z' } } })
  check() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}