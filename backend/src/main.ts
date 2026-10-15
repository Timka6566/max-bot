import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';  // ← новый импорт
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('MAX Bot API')
    .setDescription('API для чат-бота и Mini App техникума')
    .setVersion('0.1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('api/docs', app, document);

  app.use(
    '/api/reference',
    apiReference({
      content: document,
      theme: 'purple', // можно выбрать: alternate, default, moon, purple, solarized
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();