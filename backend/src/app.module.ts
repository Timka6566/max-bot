import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { GroupsModule } from './groups/groups.module';
import { ScheduleModule } from './schedule/schedule.module';
import { AuthModule } from './auth/auth.module';
import { appConfig } from './configs/app.config';

@Module({
  imports: [
    appConfig,
    PrismaModule,
    GroupsModule,
    ScheduleModule,
    AuthModule],
  controllers: [AppController],
})
export class AppModule { }
