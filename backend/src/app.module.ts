import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/env.validation'
import { GroupsModule } from './groups/groups.module';
import { ScheduleModule } from './schedule/schedule.module';

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
    PrismaModule,
    GroupsModule,
    ScheduleModule],
  controllers: [AppController],
})
export class AppModule { }
