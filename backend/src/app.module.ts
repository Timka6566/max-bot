import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/env.validation'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      validationOptions: {
        libraryOptions: {
          abortEarly: false,
        },
      },
    }),
    PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
