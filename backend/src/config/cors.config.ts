import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';

export function buildCorsOptions(config: ConfigService): CorsOptions {
  const raw = config.get<string>('CORS_ORIGINS', '*');
  const origins = raw === '*' ? true : raw.split(',').map((s) => s.trim());

  return {
    origin: origins,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-max-user-id',
      'x-max-init-data',
    ],
  };
}